import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';
import './App.css';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const REGISTRY_ID = import.meta.env.VITE_REGISTRY_ID;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface TrustProfile {
  id: string;
  owner: string;
  username: string;
  trust_score: number;
  total_interactions: number;
  positive_interactions: number;
  badges: string[];
  created_at: number;
}

function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState<TrustProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [calculatingAI, setCalculatingAI] = useState(false);

  // Fetch user profile
  useEffect(() => {
    if (account?.address) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [account?.address]);

  const fetchUserProfile = async () => {
    if (!account?.address) return;
    
    setLoadingProfile(true);
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${PACKAGE_ID}::trust_system::TrustProfile`
        },
        options: {
          showContent: true,
          showType: true,
        }
      });

      if (objects.data.length > 0) {
        const profileData = objects.data[0].data?.content as any;
        if (profileData?.fields) {
          setUserProfile({
            id: profileData.fields.id.id,
            owner: profileData.fields.owner,
            username: profileData.fields.username,
            trust_score: parseInt(profileData.fields.trust_score),
            total_interactions: parseInt(profileData.fields.total_interactions),
            positive_interactions: parseInt(profileData.fields.positive_interactions),
            badges: profileData.fields.badges || [],
            created_at: parseInt(profileData.fields.created_at),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const createProfile = async () => {
    if (!username.trim()) {
      setMessage('Please enter a username');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::trust_system::create_profile`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.pure.string(username),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Profile created:', result);
            setMessage('✅ Profile created successfully!');
            setUsername('');
            setTimeout(() => fetchUserProfile(), 2000);
          },
          onError: (error) => {
            console.error('Error:', error);
            setMessage('❌ Error creating profile');
          },
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
      setMessage('❌ Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateAITrustScore = async () => {
    if (!userProfile) return;
    
    setCalculatingAI(true);
    setMessage('🤖 AI analyzing your on-chain activity...');
    
    try {
      // Prepare data for AI analysis
      const profileData = {
        username: userProfile.username,
        current_trust_score: userProfile.trust_score,
        total_interactions: userProfile.total_interactions,
        positive_interactions: userProfile.positive_interactions,
        badges_earned: userProfile.badges.length,
        account_age_epochs: userProfile.created_at,
        positive_ratio: userProfile.total_interactions > 0 
          ? (userProfile.positive_interactions / userProfile.total_interactions * 100).toFixed(2)
          : 0
      };

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a blockchain trust score analyst. Analyze user on-chain activity and provide a trust score from 0-100 with brief reasoning. Consider interaction history, positive ratio, badges, and account age.'
            },
            {
              role: 'user',
              content: `Analyze this user profile and provide a trust score (0-100) with reasoning:\n${JSON.stringify(profileData, null, 2)}\n\nProvide response in format: "Score: X\nReasoning: [brief explanation]"`
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse AI response
      const scoreMatch = aiResponse.match(/Score:\s*(\d+)/i);
      const reasoningMatch = aiResponse.match(/Reasoning:\s*(.+)/is);
      
      const calculatedScore = scoreMatch ? parseInt(scoreMatch[1]) : userProfile.trust_score;
      const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'AI analysis complete';
      
      setAiScore(calculatedScore);
      setMessage(`✅ AI Trust Score: ${calculatedScore}/100\n${reasoning}`);
      
      // Optionally update on-chain score
      if (calculatedScore !== userProfile.trust_score) {
        await updateTrustScore(calculatedScore);
      }
    } catch (error) {
      console.error('Error calculating AI score:', error);
      // Fallback to simple calculation if API fails
      const baseScore = userProfile.trust_score;
      const interactionRatio = userProfile.total_interactions > 0 
        ? (userProfile.positive_interactions / userProfile.total_interactions) * 100 
        : 50;
      const badgeBonus = userProfile.badges.length * 5;
      
      const fallbackScore = Math.min(100, Math.round((baseScore + interactionRatio + badgeBonus) / 3));
      setAiScore(fallbackScore);
      setMessage(`✅ Trust Score calculated: ${fallbackScore}/100 (Fallback mode)`);
    } finally {
      setCalculatingAI(false);
    }
  };

  const updateTrustScore = async (newScore: number) => {
    if (!userProfile) return;

    setLoading(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::trust_system::update_trust_score`,
        arguments: [
          tx.object(userProfile.id),
          tx.pure.u64(newScore),
          tx.pure.bool(newScore > userProfile.trust_score),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setMessage('✅ Trust score updated on-chain!');
            setTimeout(() => fetchUserProfile(), 2000);
          },
          onError: (error) => {
            console.error('Error:', error);
            setMessage('❌ Error updating score');
          },
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
      setMessage('❌ Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const issueBadge = async (badgeName: string, badgeType: string) => {
    if (!userProfile) return;

    setLoading(true);
    setMessage('🏆 Issuing badge...');

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::trust_system::issue_badge`,
        arguments: [
          tx.object(userProfile.id),
          tx.pure.string(badgeName),
          tx.pure.string(badgeType),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setMessage(`✅ Badge "${badgeName}" issued successfully!`);
            setTimeout(() => fetchUserProfile(), 2000);
          },
          onError: (error) => {
            console.error('Error:', error);
            setMessage('❌ Error issuing badge');
          },
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
      setMessage('❌ Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Building';
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="bg-gradient"></div>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🔗</span>
          <span className="logo-text">TrustChain</span>
        </div>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Decentralized Identity & <span className="gradient-text">Reputation System</span>
          </h1>
          <p className="hero-subtitle">
            Build trust in Web3 with AI-powered reputation scoring and verifiable on-chain credentials
          </p>
        </div>

        {account ? (
          <div className="dashboard">
            {!userProfile && !loadingProfile && (
              <div className="glass-card">
                <h2 className="card-title">Create Your Trust Profile</h2>
                <p className="card-description">
                  Start building your on-chain reputation with AI-driven trust analysis
                </p>
                
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    disabled={loading}
                  />
                  <button
                    onClick={createProfile}
                    disabled={loading || !username.trim()}
                    className="btn-primary"
                  >
                    {loading ? 'Creating...' : 'Create Profile'}
                  </button>
                </div>

                {message && (
                  <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
              </div>
            )}

            {loadingProfile && (
              <div className="glass-card centered">
                <div className="loading-spinner"></div>
                <p>Loading your profile...</p>
              </div>
            )}

            {userProfile && (
              <>
                <div className="profile-card glass-card">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      {userProfile.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                      <h2>{userProfile.username}</h2>
                      <p className="profile-address">{userProfile.owner.slice(0, 6)}...{userProfile.owner.slice(-4)}</p>
                    </div>
                  </div>

                  <div className="trust-score-display">
                    <div className="score-circle" style={{ borderColor: getTrustScoreColor(userProfile.trust_score) }}>
                      <div className="score-value">{userProfile.trust_score}</div>
                      <div className="score-label">{getTrustScoreLabel(userProfile.trust_score)}</div>
                    </div>
                    <button 
                      onClick={calculateAITrustScore} 
                      disabled={calculatingAI || loading}
                      className="btn-ai"
                    >
                      {calculatingAI ? '🤖 Analyzing...' : '🤖 AI Analysis'}
                    </button>
                  </div>

                  {aiScore !== null && aiScore !== userProfile.trust_score && (
                    <div className="ai-score-result">
                      <p>AI Recommended Score: <strong>{aiScore}/100</strong></p>
                    </div>
                  )}

                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">{userProfile.total_interactions}</div>
                      <div className="stat-label">Total Interactions</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{userProfile.positive_interactions}</div>
                      <div className="stat-label">Positive</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{userProfile.badges.length}</div>
                      <div className="stat-label">Badges</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {userProfile.total_interactions > 0 
                          ? Math.round((userProfile.positive_interactions / userProfile.total_interactions) * 100)
                          : 0}%
                      </div>
                      <div className="stat-label">Success Rate</div>
                    </div>
                  </div>

                  {message && (
                    <div className={`message ${message.includes('✅') ? 'success' : message.includes('🤖') ? 'info' : 'error'}`}>
                      {message}
                    </div>
                  )}
                </div>

                <div className="badges-section glass-card">
                  <h3>🏆 Achievement Badges</h3>
                  {userProfile.badges.length > 0 ? (
                    <div className="badges-grid">
                      {userProfile.badges.map((badge, index) => (
                        <div key={index} className="badge-item">
                          <span className="badge-icon">🏅</span>
                          <span className="badge-name">{badge}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-badges">No badges earned yet. Keep building your reputation!</p>
                  )}
                  
                  <div className="badge-actions">
                    <button 
                      onClick={() => issueBadge('Early Adopter', 'achievement')}
                      disabled={loading}
                      className="btn-secondary"
                    >
                      Claim Early Adopter Badge
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Dynamic Trust Score</h3>
                <p>AI analyzes your on-chain activity to generate real-time trust scores</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>NFT Badges</h3>
                <p>Earn verifiable achievement badges as portable credentials</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Transparent & Immutable</h3>
                <p>All reputation data stored securely on OneChain blockchain</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="connect-prompt">
            <div className="glass-card centered">
              <div className="connect-icon">🔐</div>
              <h2>Connect Your Wallet</h2>
              <p>Connect your OneChain wallet to start building your trust profile</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built on OneChain • Powered by AI</p>
      </footer>
    </div>
  );
}

export default App;
