# Starcade Development Guide

## Project Overview

Starcade is a multi-platform Stellar wallet built with TypeScript, supporting browser extensions and (future) mobile applications.

## Architecture

### Monorepo Structure

```
starcade/
├── packages/
│   ├── core/           # Platform-agnostic wallet logic
│   └── extension/      # Browser extension (Chrome, Firefox, Edge, Brave)
├── docs/               # Documentation
└── package.json        # Workspace configuration
```

### Core Package (@starcade/core)

Platform-agnostic TypeScript library containing:

- **StellarWallet**: Main wallet class for blockchain interactions
- **AccountManager**: Account management and state
- **TransactionManager**: Transaction building and validation
- **WalletStorage**: Abstract storage interface
- **Types**: Shared TypeScript interfaces

**Key Features:**
- Generate/import Stellar keypairs
- Query account balances
- Send payments (XLM and custom assets)
- Transaction history
- Testnet support with Friendbot funding

### Extension Package (@starcade/extension)

Browser extension built with:
- **React**: UI framework
- **Vite**: Build tool
- **Manifest V3**: Modern extension API
- **Chrome Storage API**: Encrypted key storage

**Components:**
- `popup.html`: Main extension popup (360x600px)
- `background.ts`: Service worker for blockchain operations
- `App.tsx`: React application

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone and navigate to project
cd starcade

# Install all dependencies
npm install

# Build core package
cd packages/core
npm run build

# Build extension
cd ../extension
npm run build
```

### Development

```bash
# Watch mode for core package
cd packages/core
npm run dev

# Watch mode for extension (separate terminal)
cd packages/extension
npm run dev
```

### Loading Extension in Browser

1. Build: `npm run build` (in extension folder)
2. Open Chrome/Edge/Brave
3. Go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select `packages/extension/dist` folder

## Development Workflow

### Adding New Features

1. **Core Logic First**: Implement in `@starcade/core`
2. **Test Independently**: Core package is framework-agnostic
3. **UI Integration**: Add UI in extension or mobile app
4. **Storage Adaptation**: Implement platform-specific storage

### Code Organization

```typescript
// Core package exports
import { 
  StellarWallet, 
  NetworkType, 
  AccountManager,
  TransactionManager 
} from '@starcade/core';

// Extension uses core
const wallet = new StellarWallet({ network: NetworkType.TESTNET });
```

### Security Best Practices

1. **Never log private keys**
2. **Use encrypted storage** for sensitive data
3. **Validate all user inputs** before transactions
4. **Use HTTPS** for all API calls
5. **Implement proper CSP** in extension manifest

## Building for Production

```bash
# Build all packages
npm run build

# Extension will be in packages/extension/dist
# Ready to upload to Chrome Web Store
```

## Testing

```bash
# Test on Stellar testnet first
# Use Friendbot for funding test accounts
# URL: https://friendbot.stellar.org

# Verify transactions on:
# Testnet Explorer: https://stellar.expert/explorer/testnet
```

## Common Tasks

### Create New Account

```typescript
const wallet = new StellarWallet({ network: NetworkType.TESTNET });
const { publicKey, secretKey } = wallet.generateKeypair();

// Fund on testnet
await wallet.fundTestnetAccount(publicKey);
```

### Send Payment

```typescript
await wallet.sendPayment(secretKey, {
  destination: 'GXXXXX...',
  amount: '10.5',
  memo: 'Payment for services'
});
```

### Query Balance

```typescript
const details = await wallet.getAccountDetails(publicKey);
console.log(details.balances);
```

## Troubleshooting

### Extension Not Loading
- Clear build: `npm run clean && npm run build`
- Check browser console for errors
- Verify manifest.json syntax

### Transaction Failures
- Ensure account is funded (min 1 XLM reserve)
- Verify network (testnet vs mainnet)
- Check destination address format
- Confirm sufficient balance

### Build Errors
- Delete node_modules: `rm -rf node_modules`
- Clear npm cache: `npm cache clean --force`
- Reinstall: `npm install`

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Stellar SDK](https://github.com/stellar/js-stellar-sdk)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Horizon API](https://horizon.stellar.org/)

## Future Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] Hardware wallet support (Ledger)
- [ ] Multi-signature accounts
- [ ] DEX integration
- [ ] NFT support
- [ ] Advanced transaction types
- [ ] Account recovery mechanisms
