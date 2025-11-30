# Qastra - Stellar Wallet

<p align="center">
  <img src="packages/extension/public/icons/icon.png" alt="Qastra Logo" width="128" height="128">
</p>

<h1 align="center">Qastra</h1>
<h3 align="center">Transactions in QR</h3>

<p align="center">
  A modern Stellar wallet extension that revolutionizes crypto payments through instant QR code scanning.
</p>

---

## Overview

Qastra makes cryptocurrency payments as simple as scanning a QR code. No more copying addresses, no more typos, no more mistakes. Just point, scan, and pay. Built on the Stellar network with a clean, minimalist design, Qastra delivers the promise of **Transactions in QR** - where every payment is just one scan away.

## Features

### 🔍 Transactions in QR - The Core Experience
- **Instant Payment Scanning**: Point your camera at any Qastra QR code and payment details auto-populate
- **Zero Manual Entry**: Recipient address, amount, and memo filled automatically
- **Error-Free Payments**: Eliminate typos and wrong addresses
- **Pay Mode**: Dedicated payment flow when initiated via QR scan

### 💡 Powered by Stellar
- 🌟 **Stellar Network**: Built using official TypeScript Wallet SDK
- ⚡ **Fast Transactions**: Near-instant settlement on Stellar
- 💰 **Low Fees**: Minimal transaction costs
- 🌐 **Global Reach**: Send XLM anywhere in the world

### 🎨 Modern & Minimalist
- 🔐 **Secure Key Management**: Safe storage and transaction signing
- 💼 **Multi-Account Support**: Manage multiple Stellar accounts with ease
- 🔄 **Network Switching**: Toggle between Testnet and Mainnet instantly
- 🎯 **Clean Interface**: Red and white minimalist design with Outfit font
- 📱 **Mobile-Ready**: Architecture ready for iOS/Android

### 🌐 Cross-Platform
- ✅ **Chrome, Firefox, Edge, Brave**: Works on all major browsers
- 📦 **Side Panel Support**: Persistent right-side panel for quick access
- 🔌 **Extension Ready**: Install and use in seconds

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
