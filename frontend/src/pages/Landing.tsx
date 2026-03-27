import { useNavigate } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@onelabs/dapp-kit';
import { useEffect } from 'react';
import '../styles/Landing.css';

function Landing() {
  const navigate = useNavigate();
  const account = useCurrentAccount();

  useEffect(() => {
    if (account) {
      navigate('/app');
    }
  }, [account, navigate]);

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🔗</span>
            <span className="logo-text">TrustChain</span>
          </div>
          <div className="nav-actions">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#about" className="nav-link">About</a>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Powered by AI & OneChain
          </div>
          <h1 className="hero-title">
            Build Trust in the
            <span className="gradient-text"> Decentralized World</span>
          </h1>
          <p className="hero-description">
            TrustChain combines blockchain transparency with AI-powered analysis to create 
            a dynamic reputation system for Web3. Earn verifiable credentials, build your 
            on-chain identity, and establish trust across decentralized applications.
          </p>
          <div className="hero-cta">
            <ConnectButton />
            <a href="#how-it-works" className="btn-secondary">
              Learn More
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">100%</div>
              <div className="stat-label">On-Chain</div>
            </div>
            <div className="stat">
              <div className="stat-value">AI</div>
              <div className="stat-label">Powered</div>
            </div>
            <div className="stat">
              <div className="stat-value">NFT</div>
              <div className="stat-label">Badges</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="card-icon">🎯</div>
            <div className="card-title">Trust Score: 95</div>
            <div className="card-subtitle">Excellent Rating</div>
          </div>
          <div className="visual-card card-2">
            <div className="card-icon">🏆</div>
            <div className="card-title">5 Badges</div>
            <div className="card-subtitle">Achievements Earned</div>
          </div>
          <div className="visual-card card-3">
            <div className="card-icon">🤖</div>
            <div className="card-title">AI Analysis</div>
            <div className="card-subtitle">Real-time Scoring</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why TrustChain?</h2>
            <p className="section-subtitle">
              A comprehensive reputation system designed for the decentralized future
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🤖</div>
              </div>
              <h3 className="feature-title">AI-Powered Analysis</h3>
              <p className="feature-description">
                Advanced AI algorithms analyze your on-chain behavior, interactions, and 
                contributions to generate dynamic trust scores that reflect your true reputation.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🔒</div>
              </div>
              <h3 className="feature-title">Blockchain Security</h3>
              <p className="feature-description">
                All reputation data is stored immutably on OneChain, ensuring transparency, 
                verifiability, and resistance to manipulation or fraud.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🏆</div>
              </div>
              <h3 className="feature-title">NFT Credentials</h3>
              <p className="feature-description">
                Earn achievement badges as NFTs that serve as portable, verifiable credentials 
                across the entire Web3 ecosystem.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📊</div>
              </div>
              <h3 className="feature-title">Real-Time Updates</h3>
              <p className="feature-description">
                Your trust score updates dynamically based on your latest activities, providing 
                an accurate, up-to-date reflection of your reputation.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌐</div>
              </div>
              <h3 className="feature-title">Cross-Platform Identity</h3>
              <p className="feature-description">
                Build a unified reputation that follows you across different dApps and platforms 
                in the decentralized ecosystem.
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⚡</div>
              </div>
              <h3 className="feature-title">Instant Verification</h3>
              <p className="feature-description">
                Anyone can instantly verify your credentials and trust score on-chain, 
                enabling trustless interactions and collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Four simple steps to build your decentralized reputation
            </p>
          </div>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">01</div>
              <h3 className="step-title">Connect Wallet</h3>
              <p className="step-description">
                Connect your OneChain wallet to get started. Your wallet address becomes 
                your unique identity on TrustChain.
              </p>
            </div>
            <div className="step-item">
              <div className="step-number">02</div>
              <h3 className="step-title">Create Profile</h3>
              <p className="step-description">
                Set up your trust profile with a username. Your profile is stored on-chain 
                and starts with a base trust score.
              </p>
            </div>
            <div className="step-item">
              <div className="step-number">03</div>
              <h3 className="step-title">Build Reputation</h3>
              <p className="step-description">
                Engage in positive interactions, complete tasks, and contribute to the 
                ecosystem to improve your trust score.
              </p>
            </div>
            <div className="step-item">
              <div className="step-number">04</div>
              <h3 className="step-title">Earn Badges</h3>
              <p className="step-description">
                Unlock achievement badges as NFTs that showcase your accomplishments and 
                expertise in the Web3 space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Build Your Reputation?</h2>
          <p className="cta-description">
            Join TrustChain today and start establishing your decentralized identity
          </p>
          <ConnectButton />
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🔗</span>
              <span className="logo-text">TrustChain</span>
            </div>
            <p className="footer-tagline">
              Building trust in the decentralized world
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#about">About</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="https://docs.onelabs.cc" target="_blank" rel="noopener noreferrer">Documentation</a>
              <a href="https://onescan.cc/testnet" target="_blank" rel="noopener noreferrer">Explorer</a>
              <a href="https://github.com/sambitsargam/TrustChain" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <div className="footer-column">
              <h4>Network</h4>
              <a href="https://onelabs.cc" target="_blank" rel="noopener noreferrer">OneChain</a>
              <a href="https://discord.gg/onechain" target="_blank" rel="noopener noreferrer">Community</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 TrustChain. Built on OneChain • Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
