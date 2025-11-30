# Qastra - Stellar Wallet

**Transactions in QR** - A modern Stellar wallet extension that revolutionizes crypto payments through instant QR code scanning.

## Overview

Qastra is a minimalist Stellar wallet that makes cryptocurrency payments effortless. Point your camera at a Qastra QR code and watch as payment details auto-populate, eliminating manual address entry and reducing errors. With seamless multi-account management, real-time balance tracking, and one-tap network switching between testnet and mainnet, Qastra delivers a frictionless payment experience.

## Features

- 🔍 **QR Code Payments**: Scan QR codes to instantly populate payment details
- 🌟 **Stellar Network**: Built on Stellar using official TypeScript Wallet SDK
- 🔐 **Secure Key Management**: Safe storage and transaction signing
- 🌐 **Cross-Browser Support**: Works on Chrome, Firefox, Edge, and Brave
- 📱 **Mobile-Ready Architecture**: iOS/Android support coming soon
- 💼 **Multi-Account Management**: Manage multiple Stellar accounts with ease
- 🔄 **Network Switching**: Toggle between Testnet and Mainnet instantly
- 🎨 **Modern Design**: Clean red and white minimalist interface

## QR Code Payment Format

Qastra uses a simple QR code format for payment requests:

```
qastra###transfer###[RECIPIENT_ADDRESS]###[AMOUNT]###[MEMO]
```

### Example QR Code Content

```
qastra###transfer###GABU3XPBWQFNFV63QW52G6VOU7QZ2P3NN6C7V4WKQYSQPYXERSASMQRG###125###payment-for-services
```

### Try It Out

1. Visit [QR Code Generator](https://www.qr-code-generator.com/)
2. Select "Text" as the QR code type
3. Paste the example format with your details:
   ```
   qastra###transfer###YOUR_STELLAR_ADDRESS###AMOUNT###MEMO
   ```
4. Generate and scan with Qastra!

**Note**: The wallet also supports the legacy `starcade###transfer###` format for backward compatibility.

## Project Structure

```
qastra/
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

- **Stellar SDK**: @stellar/stellar-sdk, @stellar/typescript-wallet-sdk
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5
- **UI Framework**: React 18
- **QR Scanner**: html5-qrcode
- **Extension**: Manifest V3, Chrome Storage API, Side Panel API

## How It Works

1. **Create/Import Account**: Generate a new Stellar keypair or import an existing one
2. **Scan QR Code**: Use the built-in camera scanner to read payment QR codes
3. **Auto-Fill Payment**: Qastra automatically populates recipient address, amount, and memo
4. **Confirm & Send**: Review the details and send your XLM payment
5. **Track Transactions**: View transaction hashes and check on Stellar Expert

## License

MIT
