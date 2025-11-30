# Starcade Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd starcade
npm install
```

### Step 2: Build the Core Package

```bash
cd packages/core
npm run build
```

### Step 3: Build the Extension

```bash
cd ../extension
npm run build
```

### Step 4: Load Extension in Browser

1. Open Chrome (or Edge/Brave)
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Navigate to `packages/extension/dist` and select it

### Step 5: Create Your First Wallet

1. Click the Starcade extension icon
2. Select **Testnet** (for development)
3. Click **Create New Wallet**
4. Your account will be automatically funded with test XLM!

## 🛠️ Development Mode

### Watch Mode for Hot Reload

Terminal 1 - Core package:
```bash
cd packages/core
npm run dev
```

Terminal 2 - Extension:
```bash
cd packages/extension
npm run dev
```

After code changes, click the reload button in `chrome://extensions/` to see updates.

## 📱 Viewing Your Wallet

### Testnet Explorer

View your account on Stellar Expert:
```
https://stellar.expert/explorer/testnet/account/YOUR_PUBLIC_KEY
```

### Get Free Test XLM

The extension automatically funds testnet accounts, or use Friendbot directly:
```
https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY
```

## 🔑 Basic Operations

### Create Account

```typescript
import { StellarWallet, NetworkType } from '@starcade/core';

const wallet = new StellarWallet({ network: NetworkType.TESTNET });
const { publicKey, secretKey } = wallet.generateKeypair();

// Fund on testnet
await wallet.fundTestnetAccount(publicKey);
```

### Check Balance

```typescript
const details = await wallet.getAccountDetails(publicKey);
console.log(details.balances);
```

### Send Payment

```typescript
const result = await wallet.sendPayment(secretKey, {
  destination: 'GDESTINATION...',
  amount: '10',
  memo: 'Test payment'
});

console.log('Transaction hash:', result.hash);
```

## 📂 Project Structure

```
starcade/
├── packages/
│   ├── core/              # Stellar wallet logic
│   │   ├── src/
│   │   │   ├── wallet.ts      # Main wallet class
│   │   │   ├── account.ts     # Account management
│   │   │   ├── transaction.ts # Transaction handling
│   │   │   └── storage.ts     # Storage abstraction
│   │   └── package.json
│   │
│   └── extension/         # Browser extension
│       ├── src/
│       │   ├── popup/         # React UI
│       │   └── background.ts  # Service worker
│       ├── manifest.json
│       └── package.json
│
└── docs/                  # Documentation
```

## 🎨 Customization

### Change Network

In extension popup, toggle between Testnet and Mainnet.

**Warning**: Always test on Testnet first!

### Modify UI

Edit `packages/extension/src/popup/App.tsx` and `styles.css`

### Add Features

1. Add logic to `@starcade/core`
2. Build core: `npm run build`
3. Use in extension
4. Rebuild extension

## 🐛 Troubleshooting

### Extension Not Loading

```bash
# Clean build
cd packages/extension
npm run clean
npm run build
```

### Build Errors

```bash
# From project root
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Transaction Fails

- Check if account is funded (minimum 1 XLM reserve required)
- Verify you're on correct network (testnet vs mainnet)
- Ensure destination address is valid (starts with 'G', 56 characters)

### Can't See Updates

- Reload extension in `chrome://extensions/`
- Hard refresh popup (Ctrl+Shift+R)
- Check browser console for errors

## 📚 Next Steps

1. **Read the Docs**: Check `docs/DEVELOPMENT.md` for detailed guide
2. **Security**: Review `docs/SECURITY.md` before mainnet use
3. **Mobile**: See `docs/MOBILE.md` for future mobile app plans
4. **Stellar Docs**: https://developers.stellar.org/

## 💡 Tips

- **Always backup** your secret keys securely
- **Test on Testnet** before using mainnet
- **Keep small amounts** in hot wallets
- **Review transactions** carefully before signing
- **Use hardware wallets** for large amounts (future feature)

## 🤝 Need Help?

- Check existing issues
- Review Stellar documentation
- Test on Stellar testnet first
- Verify your code with examples

## 🎯 Common Use Cases

### Check If Account Exists

```typescript
try {
  await wallet.getAccountDetails(publicKey);
  console.log('Account exists');
} catch (error) {
  console.log('Account not found or not funded');
}
```

### Send Custom Asset

```typescript
await wallet.sendPayment(secretKey, {
  destination: 'GDEST...',
  amount: '100',
  assetCode: 'USDC',
  assetIssuer: 'GISSUER...'
});
```

### View Transaction History

```typescript
const history = await wallet.getTransactionHistory(publicKey, 20);
history.forEach(tx => {
  console.log(`${tx.created_at}: ${tx.hash}`);
});
```

Happy coding! 🌟
