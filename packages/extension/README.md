# @qastra/extension

Browser extension for Qastra - the QR-powered Stellar wallet. Compatible with Chrome, Firefox, Edge, and Brave.

## Features

- 🔍 **QR Code Scanner**: Built-in camera scanner for instant payment QR codes
- 💳 **Multi-Account Management**: Create and manage multiple Stellar accounts
- 💸 **Send XLM**: Quick and easy payments with transaction tracking
- 🌐 **Network Switching**: Toggle between Testnet and Mainnet
- ⚡ **Testnet Faucet**: One-click funding for testnet accounts
- 🎨 **Modern UI**: Clean red and white minimalist design with Outfit font
- 🔐 **Secure Storage**: Encrypted key storage using Chrome Storage API
- 📱 **Side Panel Support**: Persistent right-side panel for quick access

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
