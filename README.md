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

## Installation & Deployment

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

### 3. Build & Deploy Contract

```bash
cd TrustChain/contracts
one move build
one client publish --gas-budget 50000000 .
```

Save the Package ID and Registry ID from the output.

### 4. Configure Frontend

Update `frontend/.env`:
```
VITE_PACKAGE_ID=0x<your_package_id>
VITE_REGISTRY_ID=0x<your_registry_id>
```

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

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
