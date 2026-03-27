import { useNavigate } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@onelabs/dapp-kit';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

function Landing() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const connectButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Navigate to app when wallet is connected and user clicked a button
  useEffect(() => {
    if (account && shouldNavigate) {
      navigate('/app');
      setShouldNavigate(false);
    }
  }, [account, shouldNavigate, navigate]);

  const handleGetStarted = () => {
    if (account) {
      navigate('/app');
    } else {
      setShouldNavigate(true);
      // Trigger wallet connection by clicking the connect button
      setTimeout(() => {
        const connectBtn = connectButtonRef.current?.querySelector('button');
        if (connectBtn) {
          connectBtn.click();
        }
      }, 100);
    }
  };

  const features = [
    { icon: '🔐', title: 'Decentralized Identity', description: 'Build your on-chain reputation with cryptographic verification.' },
    { icon: '🤖', title: 'AI Trust Scoring', description: 'Advanced AI analyzes your activity for real-time trust evaluation.' },
    { icon: '🏆', title: 'NFT Badges', description: 'Earn verifiable achievement badges as portable credentials.' },
    { icon: '👥', title: 'Endorsements', description: 'Community members can endorse each other to boost trust scores.' },
    { icon: '📊', title: 'Analytics', description: 'Track your trust score trends and reputation metrics.' },
    { icon: '🌐', title: 'Global Network', description: 'Connect with trusted members across the ecosystem.' },
  ];

  const steps = [
    { number: '01', title: 'Create Profile', description: 'Register your identity', icon: '👤' },
    { number: '02', title: 'Build Trust', description: 'Engage with community', icon: '💬' },
    { number: '03', title: 'Get Endorsed', description: 'Receive endorsements', icon: '👍' },
    { number: '04', title: 'Earn Badges', description: 'Unlock achievements', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
          transition={{ type: 'spring', damping: 30 }}
        />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => navigate('/')}>
            <span className="text-3xl">🔗</span>
            <span className="text-xl font-bold text-gradient-purple">TrustChain</span>
          </motion.div>
          <div className="flex items-center gap-6">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/explore')} className="text-sm text-gray-300 hover:text-white transition-colors">Explore</motion.button>
            <div ref={connectButtonRef}>
              <ConnectButton />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 z-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8">
              <span className="text-2xl">🤖</span>
              <span className="text-sm font-medium">AI-Powered Trust System</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight px-4">
              Build Your <br /><span className="text-gradient-purple">On-Chain Reputation</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
              Decentralized identity and reputation system powered by AI. Build trust, earn badges, and connect with verified community members.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-20">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' }} whileTap={{ scale: 0.95 }} onClick={handleGetStarted} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-base flex items-center justify-center gap-2">
                Get Started <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/leaderboard')} className="w-full sm:w-auto px-8 py-4 glass rounded-xl font-semibold text-base hover:bg-white/10 transition-colors">View Leaderboard</motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto px-4">
              {[{ value: '5K+', label: 'Trusted Members' }, { value: '15K+', label: 'Endorsements' }, { value: '99%', label: 'AI Accuracy' }].map((stat, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }} className="glass rounded-2xl p-6">
                  <div className="text-4xl font-bold text-gradient-purple mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-6 z-0">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why <span className="text-gradient-purple">TrustChain</span>?</h2>
            <p className="text-base sm:text-lg text-gray-400">The future of decentralized reputation</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -10 }} className="glass rounded-2xl p-8 cursor-pointer group">
                <motion.div className="text-5xl mb-4" whileHover={{ scale: 1.2, rotate: 10 }}>{feature.icon}</motion.div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-gradient-purple transition-all">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-6 z-0">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-base sm:text-lg text-gray-400">Four simple steps to build your reputation</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} whileHover={{ scale: 1.05 }} className="glass rounded-2xl p-8 relative">
                <div className="text-6xl font-bold text-white/10 absolute top-4 right-4">{step.number}</div>
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 z-0">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass rounded-3xl p-8 sm:p-12 glow-purple text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Build Trust?</h2>
            <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto">Join thousands of verified members on TrustChain</p>
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(139, 92, 246, 0.6)' }} whileTap={{ scale: 0.95 }} onClick={handleGetStarted} className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold text-lg">Launch App →</motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-6 z-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🔗</span>
                <span className="text-xl font-bold text-gradient-purple">TrustChain</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Building trust on OneChain</p>
            </div>
            {[{ title: 'Product', links: ['Features', 'Pricing', 'Security'] }, { title: 'Resources', links: ['Docs', 'API', 'Support'] }, { title: 'Company', links: ['About', 'Blog', 'Contact'] }].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4 text-base">{col.title}</h4>
                {col.links.map((link, j) => (<div key={j} className="text-gray-400 text-sm mb-3 hover:text-white cursor-pointer transition-colors">{link}</div>))}
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm">© 2026 TrustChain. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
              <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
