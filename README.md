# 🔗 TrustChain - Decentralized Identity & Reputation System

TrustChain is a decentralized identity and reputation system built on OneChain that integrates artificial intelligence to enhance trust evaluation in Web3 ecosystems.

## Features

- **Dynamic Trust Scores**: AI analyzes on-chain activity to generate real-time trust scores
- **NFT Badges**: Earn verifiable achievement badges as portable credentials
- **Transparent & Immutable**: All reputation data stored securely on OneChain blockchain
- **AI-Driven Analysis**: Behavioral signals and contribution quality assessment

## Project Structure

```
TrustChain/
├── contracts/          # Move smart contracts
│   ├── Move.toml
│   └── sources/
│       └── trustchain.move
└── frontend/           # React TypeScript frontend
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   └── main.tsx
    └── .env
```

## Prerequisites

- Rust (stable)
- Node.js 18+
- OneChain CLI installed
- OneChain wallet with testnet ONE tokens

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

### 3. Run Frontend (Already Configured)

The frontend is already configured with the deployed contract addresses.

```bash
cd TrustChain/frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

### 4. (Optional) Deploy Your Own Instance

If you want to deploy your own instance:

```bash
cd TrustChain/contracts
one move build
one client publish --gas-budget 50000000 .
```

Then update `frontend/.env` with your Package ID and Registry ID.

## Usage

1. Connect your OneChain wallet
2. Create your trust profile with a username
3. Interact with the platform to build reputation
4. Earn NFT badges for achievements
5. View your dynamic trust score

## Smart Contract Functions

- `create_profile`: Create a new trust profile
- `update_trust_score`: Update trust score (AI-driven)
- `issue_badge`: Issue NFT badge to a profile
- `get_trust_score`: View trust score
- `get_total_interactions`: Get interaction count

## Technology Stack

- **Blockchain**: OneChain (Move language)
- **Frontend**: React + TypeScript + Vite
- **Styling**: Custom CSS with glassmorphism effects
- **Wallet Integration**: @onelabs/dapp-kit

## License

MIT License
