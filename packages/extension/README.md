# @starcade/extension

Browser extension for Starcade Stellar wallet, compatible with Chrome, Firefox, Edge, and Brave.

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

## Features

- Create and manage Stellar accounts
- Send and receive XLM and other assets
- View transaction history
- Testnet and Mainnet support
- Secure key storage using browser's encrypted storage

## Architecture

- **Popup UI**: React-based interface (360x600px)
- **Background Worker**: Service worker for blockchain interactions
- **Storage**: Chrome storage API for wallet state and encrypted keys
- **Core**: Shared @starcade/core package for Stellar operations
