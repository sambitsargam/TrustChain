import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@onelabs/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import './App.css';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const REGISTRY_ID = import.meta.env.VITE_REGISTRY_ID;

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
    try {
      // TODO: Integrate with OpenAI API
      // For now, simulate AI calculation based on on-chain data
      const baseScore = userProfile.trust_score;
      const interactionRatio = userProfile.total_interactions > 0 
        ? (userProfile.positive_interactions / userProfile.total_interactions) * 100 
        : 50;
      const badgeBonus = userProfile.badges.length * 5;
      
      const calculatedScore = Math.min(100, Math.round((baseScore + interactionRatio + badgeBonus) / 3));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiScore(calculatedScore);
      setMessage('✅ AI Trust Score calculated!');
    } catch (error) {
      console.error('Error calculating AI score:', error);
      setMessage('❌ Error calculating AI score');
    } finally {
      setCalculatingAI(false);
    }
  };

  const updateTrustScore = async (newScore: number) => {
    if (!userProfile) return;

    setLoading(true);
    setMessage('');

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
            setMessage('✅ Trust score updated!');
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
