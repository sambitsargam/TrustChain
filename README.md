# 🔗 TrustChain - Decentralized Identity & Reputation System

TrustChain is a comprehensive decentralized identity and reputation platform built on OneChain that integrates artificial intelligence to enhance trust evaluation in Web3 ecosystems. Build your on-chain reputation, connect with trusted community members, and track your trust metrics with advanced analytics.

## ✨ Key Features

### 🎯 Core Features
- **Dynamic Trust Scores**: AI-powered analysis of on-chain activity for real-time trust evaluation
- **NFT Badge System**: Earn verifiable achievement badges as portable credentials
- **Endorsement System**: Community members can endorse each other to boost trust scores
- **Transparent & Immutable**: All reputation data stored securely on OneChain blockchain
- **AI-Driven Insights**: OpenAI GPT-4 integration for intelligent trust score analysis

### 🌐 Platform Features

#### 📊 Dashboard
- Personal profile overview with trust score visualization
- Real-time statistics (interactions, success rate, badges)
- AI-powered trust score calculation and recommendations
- Badge collection showcase
- Activity timeline

#### 🔍 Explore
- Browse all community profiles with advanced search
- Filter by: All, Top Rated, Newest
- Community statistics dashboard
- Interactive profile cards with trust indicators
- One-click profile viewing

#### 🏆 Leaderboard
- Competitive ranking system with podium display
- Top 3 users with special recognition
- Comprehensive leaderboard table
- Filter by timeframe (All Time, Month, Week)
- Color-coded trust score badges

#### 👤 Profile View
- Detailed user profiles with banner design
- Comprehensive trust metrics and statistics
- Endorsement functionality (+5 trust score)
- Badge collection display
- Profile information panel
- Success rate analytics

#### 💬 Messages
- Direct messaging between community members
- Dual-pane chat interface
- Conversation search and filtering
- Trust score indicators for contacts
- Unread message tracking
- Real-time message timestamps

#### 🔔 Notifications
- Comprehensive notification center
- Multiple notification types:
  - Endorsements received
  - Badges earned
  - New messages
  - Profile views
  - System updates
- Smart filtering (All, Unread, by Type)
- Quick action buttons
- Mark as read functionality

#### 📊 Analytics Dashboard
- Trust score trend visualization (8-week history)
- Interaction breakdown charts
- Weekly activity patterns
- Key performance metrics
- AI-powered insights and recommendations
- Timeframe selection (Week, Month, All Time)

## 🎨 Design Highlights

- **Modern Dark Theme**: Professional dark mode with purple/blue gradients
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Responsive Layout**: Seamless experience on desktop, tablet, and mobile
- **Color-Coded Trust Scores**:
  - 🟢 Green (80-100): Excellent
  - 🔵 Blue (60-79): Good
  - 🟡 Yellow (40-59): Fair
  - 🔴 Red (0-39): Building
- **Interactive Charts**: SVG-based visualizations with gradients
- **Glassmorphism Effects**: Modern UI with depth and transparency

## 📁 Project Structure

```
TrustChain/
├── contracts/                    # Move smart contracts
│   ├── Move.toml
│   ├── Move.lock
│   └── sources/
│       └── trustchain.move      # Main contract
├── frontend/                     # React TypeScript frontend
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── Landing.tsx      # Landing page
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── Explore.tsx      # Browse profiles
│   │   │   ├── Leaderboard.tsx  # Rankings
│   │   │   ├── ProfileView.tsx  # User profiles
│   │   │   ├── Messages.tsx     # Chat system
│   │   │   ├── Notifications.tsx # Notifications
│   │   │   └── Analytics.tsx    # Analytics dashboard
│   │   ├── styles/              # CSS modules
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── .env                     # Environment variables
│   └── package.json
├── FEATURES.md                   # Detailed features documentation
└── README.md
```

## 📋 Prerequisites

- Rust (stable)
- Node.js 18+
- OneChain CLI installed
- OneChain wallet with testnet ONE tokens
- OpenAI API key (for AI features)

## 🚀 Deployment Status

✅ **DEPLOYED TO ONECHAIN TESTNET**

- **Package ID:** `0x0dc730053338d7082f58c0a0e351c1e96f1681398a6fd2d4af68f890cb228fb6`
- **Registry ID:** `0xa01e504aeb0c04b762cc298be677b9ac1682e43a16ae34463869e4f13bef66fd`
- **Transaction:** `HiHCS8EwTULKfpVw59BGrHfBcgE1GP6yWtsBggX9TRWd`
- **Explorer:** [View on OneScan](https://onescan.cc/testnet/object/0x0dc730053338d7082f58c0a0e351c1e96f1681398a6fd2d4af68f890cb228fb6)
- **Network:** OneChain Testnet
- **Deployment Date:** March 27, 2026

## Installation & Setup

### 1. Install OneChain CLI

```bash
git clone https://github.com/one-chain-labs/onechain.git
cd onechain
cargo install --path crates/one --locked --features tracing
```

### 2. Configure OneChain Testnet

```bash
one client new-env --alias testnet --rpc https://rpc-testnet.onelabs.cc:443
one client switch --env testnet
one client new-address ed25519
one client faucet
```

### 3. Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
cd TrustChain/frontend
cp .env.example .env
```

Update `.env` with your values:
```env
VITE_PACKAGE_ID=0x0dc730053338d7082f58c0a0e351c1e96f1681398a6fd2d4af68f890cb228fb6
VITE_REGISTRY_ID=0xa01e504aeb0c04b762cc298be677b9ac1682e43a16ae34463869e4f13bef66fd
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run Frontend

The frontend is already configured with the deployed contract addresses.

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

### 5. (Optional) Deploy Your Own Instance

If you want to deploy your own instance:

```bash
cd TrustChain/contracts
one move build
one client publish --gas-budget 50000000 .
```

Then update `frontend/.env` with your Package ID and Registry ID.

## 🎮 Usage Guide

### Getting Started
1. **Connect Wallet**: Click "Launch App" and connect your OneChain wallet
2. **Create Profile**: Enter a username to create your trust profile
3. **Build Reputation**: Interact with the community to increase your trust score
4. **Earn Badges**: Complete achievements to earn NFT badges
5. **Get Endorsed**: Ask trusted members to endorse you (+5 trust score)

### Platform Navigation
- **Dashboard**: View your profile overview and statistics
- **Explore**: Discover and search community members
- **Leaderboard**: See top-ranked users and your position
- **Messages**: Chat with other community members
- **Notifications**: Stay updated on endorsements, badges, and activities
- **Analytics**: Track your trust score trends and insights
- **Profile**: View detailed profiles and endorse users

### AI Features
- Click "AI Analysis" on your dashboard to get AI-powered trust score evaluation
- Receive personalized recommendations based on your activity
- View insights and suggestions in the Analytics dashboard

## Smart Contract Functions

- `create_profile`: Create a new trust profile
- `update_trust_score`: Update trust score (AI-driven)
- `issue_badge`: Issue NFT badge to a profile
- `get_trust_score`: View trust score
- `get_total_interactions`: Get interaction count

## 🛠️ Technology Stack

### Blockchain
- **OneChain**: Layer 1 blockchain platform
- **Move Language**: Smart contract development
- **@onelabs/dapp-kit**: Wallet integration and blockchain interaction
- **@onelabs/sui**: Transaction management

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router**: Multi-page navigation

### AI Integration
- **OpenAI GPT-4**: Trust score analysis and recommendations
- **Real-time Analysis**: On-chain activity evaluation

### Design
- **Custom CSS**: Modern dark theme with gradients
- **SVG Charts**: Interactive data visualizations
- **Responsive Design**: Mobile-first approach
- **Glassmorphism**: Modern UI effects

## 📊 Smart Contract Architecture

### Core Structs
- **TrustProfile**: User identity with trust metrics
- **TrustBadge**: NFT achievement badges
- **TrustRegistry**: Global profile registry

### Events
- **ProfileCreated**: New profile registration
- **TrustScoreUpdated**: Score changes
- **BadgeIssued**: Badge awards

## 🚀 Future Enhancements

- Real blockchain integration for messaging
- End-to-end encrypted communications
- Group chat functionality
- Push notifications
- Advanced analytics with more chart types
- Export analytics reports
- Profile customization options
- Reputation history timeline
- Social features (follow/unfollow)
- Community challenges and gamification
- Multi-chain support

## 📸 Screenshots

Visit the live demo to see TrustChain in action!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🔗 Links

- **GitHub**: [TrustChain Repository](https://github.com/sambitsargam/TrustChain)
- **OneChain**: [Official Website](https://onelabs.cc)
- **Documentation**: See [FEATURES.md](./FEATURES.md) for detailed feature documentation

## 👨‍💻 Developer

Built with ❤️ for the OneChain ecosystem

---

**Note**: This project uses dummy data for messaging and notifications features. These are ready for blockchain integration in future updates.
