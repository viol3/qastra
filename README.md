# Starcade - Stellar Wallet

A modern, secure Stellar wallet built with TypeScript, supporting browser extensions and mobile platforms.

## Features

- 🌟 Built on Stellar Network using official TypeScript Wallet SDK
- 🔐 Secure key management and transaction signing
- 🌐 Cross-browser extension support (Chrome, Firefox, Edge, Brave)
- 📱 Mobile-ready architecture (iOS/Android coming soon)
- 💼 Multi-account support
- 🔄 Asset management and transfers

## Project Structure

```
starcade/
├── packages/
│   ├── core/           # Shared wallet logic and Stellar SDK integration
│   └── extension/      # Browser extension package
└── package.json        # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Development

```bash
# Run all packages in development mode
npm run dev

# Build all packages
npm run build
```

### Browser Extension

See [packages/extension/README.md](packages/extension/README.md) for extension-specific instructions.

## Technology Stack

- **Stellar SDK**: @stellar/typescript-wallet-sdk
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Framework**: React (in extension)

## License

MIT
