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
      setTimeout(() => {
        const connectBtn = connectButtonRef.current?.querySelector('button');
        if (connectBtn) {
          connectBtn.click();
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x - 200,
            y: mousePosition.y - 200,
          }}
          transition={{ type: 'spring', damping: 30 }}
        />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/10"
      >
        <div className="w-full px-8 lg:px-16 xl:px-24 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <span className="text-3xl">🔗</span>
            <span className="text-xl font-bold text-gradient-purple">TrustChain</span>
          </motion.div>
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Explore
            </motion.button>
            <div ref={connectButtonRef}>
              <ConnectButton />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 lg:px-16 xl:px-24 z-0">
        <div className="w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full mb-6"
            >
              <span className="text-xl">🤖</span>
              <span className="text-xs font-medium">AI-Powered Trust System</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Build Your
              <br />
              <span className="text-gradient-purple">On-Chain Reputation</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Decentralized identity and reputation system powered by AI. Build trust, earn badges, and connect with verified community members.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-base flex items-center gap-2"
              >
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/leaderboard')}
                className="px-6 py-3 glass rounded-xl font-semibold text-base hover:bg-white/10 transition-colors"
              >
                View Leaderboard
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto"
            >
              <div className="glass rounded-2xl p-5">
                <div className="text-3xl font-bold text-gradient-purple mb-1">5K+</div>
                <div className="text-xs text-gray-400">Trusted Members</div>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="text-3xl font-bold text-gradient-purple mb-1">15K+</div>
                <div className="text-xs text-gray-400">Endorsements</div>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="text-3xl font-bold text-gradient-purple mb-1">99%</div>
                <div className="text-xs text-gray-400">AI Accuracy</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative py-20 px-8 lg:px-16 xl:px-24 z-0">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-3">
              Powerful <span className="text-gradient-purple">Dashboard</span>
            </h2>
            <p className="text-lg text-gray-400">Manage your reputation from one place</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-6 glow-purple"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5">
                <div className="text-3xl mb-3">⭐</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-1">
                  856
                </div>
                <div className="text-sm text-gray-400">Trust Score</div>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="text-3xl mb-3">🏆</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-1">
                  24
                </div>
                <div className="text-sm text-gray-400">Badges Earned</div>
              </div>
              <div className="glass rounded-2xl p-5">
                <div className="text-3xl mb-3">👥</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-1">
                  142
                </div>
                <div className="text-sm text-gray-400">Endorsements</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 px-8 lg:px-16 xl:px-24 z-0">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-3">
              Why Choose <span className="text-gradient-purple">TrustChain</span>?
            </h2>
            <p className="text-lg text-gray-400">The future of decentralized reputation</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-6 cursor-pointer"
            >
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-xl font-bold mb-2">Decentralized Identity</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Build your on-chain reputation with cryptographic verification.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-6 cursor-pointer"
            >
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Trust Scoring</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Advanced AI analyzes your activity for real-time trust evaluation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-6 cursor-pointer"
            >
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">NFT Badges</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Earn verifiable achievement badges as portable credentials.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-6 cursor-pointer"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-bold mb-2">Endorsements</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Community members can endorse each other to boost trust scores.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-6 cursor-pointer"
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Track your trust score trends and reputation metrics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-6 cursor-pointer"
            >
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="text-xl font-bold mb-2">Global Network</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Connect with trusted members across the ecosystem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-8 lg:px-16 xl:px-24 z-0">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-lg text-gray-400">Four simple steps to build your reputation</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-5">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 relative"
            >
              <div className="text-5xl font-bold text-white/10 absolute top-3 right-3">01</div>
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg font-bold mb-2">Create Profile</h3>
              <p className="text-sm text-gray-400">Register your identity</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 relative"
            >
              <div className="text-5xl font-bold text-white/10 absolute top-3 right-3">02</div>
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-lg font-bold mb-2">Build Trust</h3>
              <p className="text-sm text-gray-400">Engage with community</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 relative"
            >
              <div className="text-5xl font-bold text-white/10 absolute top-3 right-3">03</div>
              <div className="text-4xl mb-3">👍</div>
              <h3 className="text-lg font-bold mb-2">Get Endorsed</h3>
              <p className="text-sm text-gray-400">Receive endorsements</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-2xl p-6 relative"
            >
              <div className="text-5xl font-bold text-white/10 absolute top-3 right-3">04</div>
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-bold mb-2">Earn Badges</h3>
              <p className="text-sm text-gray-400">Unlock achievements</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-8 lg:px-16 xl:px-24 z-0">
        <div className="w-full max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 glow-purple"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Build Trust?</h2>
            <p className="text-lg text-gray-400 mb-8">
              Join thousands of verified members on TrustChain
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(139, 92, 246, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold text-lg"
            >
              Launch Application →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-10 px-8 lg:px-16 xl:px-24 z-0">
        <div className="w-full">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔗</span>
                <span className="text-lg font-bold text-gradient-purple">TrustChain</span>
              </div>
              <p className="text-gray-400 text-xs">Building trust on OneChain blockchain</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">Features</div>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">Pricing</div>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">Security</div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">Documentation</div>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">API</div>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">Support</div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">About</div>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">Blog</div>
              <div className="text-gray-400 text-xs mb-2 hover:text-white cursor-pointer transition-colors">Contact</div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs">© 2026 TrustChain. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-gray-400">
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
