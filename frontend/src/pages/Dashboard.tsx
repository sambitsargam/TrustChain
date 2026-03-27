import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';
import '../styles/Dashboard.css';

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

function Dashboard() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity'>('overview');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState<TrustProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [calculatingAI, setCalculatingAI] = useState(false);
  const [aiReasoning, setAiReasoning] = useState('');

  useEffect(() => {
    if (!account) {
      navigate('/');
    } else {
      fetchUserProfile();
    }
  }, [account, navigate]);

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
          onSuccess: () => {
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
              content: 'You are a blockchain trust score analyst. Analyze user on-chain activity and provide a trust score from 0-100 with brief reasoning.'
            },
            {
              role: 'user',
              content: `Analyze this profile:\n${JSON.stringify(profileData, null, 2)}\n\nProvide: "Score: X\nReasoning: [explanation]"`
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      const scoreMatch = aiResponse.match(/Score:\s*(\d+)/i);
      const reasoningMatch = aiResponse.match(/Reasoning:\s*(.+)/is);
      
      const calculatedScore = scoreMatch ? parseInt(scoreMatch[1]) : userProfile.trust_score;
      const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'AI analysis complete';
      
      setAiScore(calculatedScore);
      setAiReasoning(reasoning);
      setMessage(`✅ AI Analysis Complete`);
      
      if (calculatedScore !== userProfile.trust_score) {
        await updateTrustScore(calculatedScore);
      }
    } catch (error) {
      console.error('Error:', error);
      const fallbackScore = Math.min(100, Math.round(
        (userProfile.trust_score + 
        (userProfile.total_interactions > 0 ? (userProfile.positive_interactions / userProfile.total_interactions) * 100 : 50) + 
        userProfile.badges.length * 5) / 3
      ));
      setAiScore(fallbackScore);
      setAiReasoning('Calculated using on-chain metrics');
      setMessage(`✅ Score calculated: ${fallbackScore}/100`);
    } finally {
      setCalculatingAI(false);
    }
  };

  const updateTrustScore = async (newScore: number) => {
    if (!userProfile) return;

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
            setTimeout(() => fetchUserProfile(), 2000);
          },
          onError: (error) => console.error('Error:', error),
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
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
            setMessage(`✅ Badge "${badgeName}" issued!`);
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
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Building';
  };

  if (loadingProfile) {
    return (
      <div className="dashboard">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🔗</span>
            <span className="logo-text">TrustChain</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            <span className="nav-icon">🏆</span>
            <span className="nav-label">Badges</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Activity</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/')}>
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'badges' && 'Badges'}
              {activeTab === 'activity' && 'Activity'}
            </h1>
          </div>
          <div className="header-right">
            <ConnectButton />
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {!userProfile ? (
            <div className="create-profile-section">
              <div className="create-profile-card">
                <div className="card-icon-large">👤</div>
                <h2>Create Your Trust Profile</h2>
                <p>Get started by creating your on-chain identity</p>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="profile-input"
                  />
                  <button
                    onClick={createProfile}
                    disabled={loading || !username.trim()}
                    className="btn-create"
                  >
                    {loading ? 'Creating...' : 'Create Profile'}
                  </button>
                </div>
                {message && (
                  <div className={`alert ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  {/* Profile Card */}
                  <div className="profile-summary-card">
                    <div className="profile-header-section">
                      <div className="profile-avatar-large">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="profile-info-section">
                        <h2 className="profile-username">{userProfile.username}</h2>
                        <p className="profile-address">
                          {userProfile.owner.slice(0, 8)}...{userProfile.owner.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Card */}
                  <div className="trust-score-card">
                    <div className="card-header">
                      <h3>Trust Score</h3>
                      <button 
                        onClick={calculateAITrustScore}
                        disabled={calculatingAI || loading}
                        className="btn-ai-small"
                      >
                        {calculatingAI ? '🤖 Analyzing...' : '🤖 AI Analysis'}
                      </button>
                    </div>
                    <div className="score-display">
                      <div className="score-circle-large" style={{ borderColor: getTrustScoreColor(userProfile.trust_score) }}>
                        <div className="score-number">{userProfile.trust_score}</div>
                        <div className="score-max">/100</div>
                      </div>
                      <div className="score-info">
                        <div className="score-label-large">{getTrustScoreLabel(userProfile.trust_score)}</div>
                        {aiScore !== null && aiScore !== userProfile.trust_score && (
                          <div className="ai-recommendation">
                            <p>AI Recommended: <strong>{aiScore}/100</strong></p>
                          </div>
                        )}
                        {aiReasoning && (
                          <p className="ai-reasoning">{aiReasoning}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="stats-cards">
                    <div className="stat-card">
                      <div className="stat-icon">💬</div>
                      <div className="stat-content">
                        <div className="stat-value">{userProfile.total_interactions}</div>
                        <div className="stat-label">Total Interactions</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <div className="stat-value">{userProfile.positive_interactions}</div>
                        <div className="stat-label">Positive</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🏆</div>
                      <div className="stat-content">
                        <div className="stat-value">{userProfile.badges.length}</div>
                        <div className="stat-label">Badges Earned</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📊</div>
                      <div className="stat-content">
                        <div className="stat-value">
                          {userProfile.total_interactions > 0 
                            ? Math.round((userProfile.positive_interactions / userProfile.total_interactions) * 100)
                            : 0}%
                        </div>
                        <div className="stat-label">Success Rate</div>
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className={`alert ${message.includes('✅') ? 'success' : message.includes('🤖') ? 'info' : 'error'}`}>
                      {message}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'badges' && (
                <div className="badges-tab">
                  <div className="badges-header">
                    <h2>Achievement Badges</h2>
                    <p>Earn NFT badges to showcase your accomplishments</p>
                  </div>
                  {userProfile.badges.length > 0 ? (
                    <div className="badges-collection">
                      {userProfile.badges.map((badge, index) => (
                        <div key={index} className="badge-card">
                          <div className="badge-icon-large">🏅</div>
                          <h3 className="badge-title">{badge}</h3>
                          <p className="badge-type">Achievement</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🏆</div>
                      <h3>No Badges Yet</h3>
                      <p>Start earning badges by building your reputation</p>
                    </div>
                  )}
                  <div className="badge-claim-section">
                    <button 
                      onClick={() => issueBadge('Early Adopter', 'achievement')}
                      disabled={loading}
                      className="btn-claim"
                    >
                      Claim Early Adopter Badge
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="activity-tab">
                  <div className="activity-header">
                    <h2>Recent Activity</h2>
                    <p>Track your on-chain interactions</p>
                  </div>
                  <div className="empty-state">
                    <div className="empty-icon">📈</div>
                    <h3>No Activity Yet</h3>
                    <p>Your interactions will appear here</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
