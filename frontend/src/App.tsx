import { useState } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@onelabs/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import './App.css';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const REGISTRY_ID = import.meta.env.VITE_REGISTRY_ID;

function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
