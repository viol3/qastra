# @qastra/extension

<p align="center">
  <img src="public/icons/icon.png" alt="Qastra Logo" width="96" height="96">
</p>

<h3 align="center">Transactions in QR</h3>

Browser extension for Qastra - the QR-powered Stellar wallet. Compatible with Chrome, Firefox, Edge, and Brave.

## Features

### 🔍 Transactions in QR - Core Innovation
- **QR Code Scanner**: Built-in camera scanner with multi-camera support
- **Instant Payment Recognition**: Automatically parse and validate payment QR codes
- **Auto-Fill Forms**: Recipient address, amount, and memo populated instantly
- **Pay Mode Indicator**: Visual distinction between manual sends and QR payments
- **Format Support**: Compatible with both `qastra###` and legacy `starcade###` formats

### 💳 Wallet Management
- **Multi-Account Support**: Create and manage multiple Stellar accounts
- **Account Naming**: Rename accounts with inline editing
- **Active Account System**: Quick switching between accounts
- **Balance Display**: Real-time XLM balance for each account

### 💸 Payments & Transactions
- **Send XLM**: Quick and secure payments with transaction tracking
- **Transaction Status Modal**: Beautiful loading, success, and error states
- **Stellar Expert Integration**: Direct links to view transactions on explorer
- **Transaction Hash Display**: Copy and verify transaction details

### 🌐 Network & Testing
- **Network Switching**: Toggle between Testnet and Mainnet instantly
- **Testnet Faucet**: One-click funding for testnet accounts (☄ meteor button)
- **Real-time Balance Updates**: Manual refresh with visual feedback

### 🎨 User Experience
- **Modern UI**: Clean red (#dc2626) and white (#ffffff) minimalist design
- **Outfit Font**: Professional, rounded geometric typeface
- **Side Panel Support**: Persistent right-side panel for quick access
- **Responsive Design**: Optimized 360x600px popup interface
- **Secure Storage**: Encrypted key storage using Chrome Storage API

## Development

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Build for production
npm run build
```

## Loading the Extension

### Chrome/Edge/Brave

1. Build the extension: `npm run build`
2. Open browser and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

### Firefox

1. Build the extension: `npm run build`
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select any file in the `dist` folder

## QR Code Payment Format

To create a payment request QR code, use this format:

```
qastra###transfer###[RECIPIENT_ADDRESS]###[AMOUNT]###[MEMO]
```

### Example

```
qastra###transfer###GABU3XPBWQFNFV63QW52G6VOU7QZ2P3NN6C7V4WKQYSQPYXERSASMQRG###125###payment-for-services
```

Generate QR codes using [QR Code Generator](https://www.qr-code-generator.com/) or any QR code library.

**Format breakdown:**
- `qastra` or `starcade`: App identifier (both supported)
- `transfer`: Transaction type
- Recipient Stellar address (G... format)
- Amount in XLM (e.g., 125)
- Memo (optional, can be empty)

## Architecture

- **Popup UI**: React 18 with Vite build system (360x600px)
- **Background Worker**: Service worker (Manifest V3) for persistence
- **Storage**: Chrome Storage API for wallet state and encrypted keys
- **Core**: Shared @qastra/core package for Stellar blockchain operations
- **QR Scanner**: html5-qrcode library with multi-camera support
- **Styling**: Outfit font family, red (#dc2626) and white (#ffffff) theme

## Key Components

### Main App (`src/popup/App.tsx`)
- Account management and creation
- Balance loading and display
- QR code scanner integration
- Transaction sending with status modal
- Network switching (Testnet/Mainnet)

### Background Service (`src/background.ts`)
- Extension lifecycle management
- Side panel behavior configuration
- Message passing between popup and background

### Styles (`src/popup/styles.css`)
- Modern minimalist design
- Responsive layout
- Outfit font with multiple weights
- Red and white color scheme

## Building

The build process:
1. TypeScript compilation (`tsc`)
2. Background worker build (`build-background.js`)
3. Vite bundling for popup
4. File copying (manifest, icons)

Output: `dist/` folder ready for browser loading
