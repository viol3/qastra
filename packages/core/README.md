# @starcade/core

Core wallet functionality for Starcade, providing Stellar blockchain integration.

## Features

- Wallet creation and import
- Account management
- Transaction signing and submission
- Balance queries
- Testnet funding support
- Secure key storage abstraction

## Usage

```typescript
import { StellarWallet, NetworkType } from '@starcade/core';

// Initialize wallet
const wallet = new StellarWallet({
  network: NetworkType.TESTNET
});

// Generate new account
const { publicKey, secretKey } = wallet.generateKeypair();

// Get account details
const details = await wallet.getAccountDetails(publicKey);

// Send payment
const result = await wallet.sendPayment(secretKey, {
  destination: 'GXXXXX...',
  amount: '10.5',
});
```
