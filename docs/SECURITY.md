# Security Considerations

## Overview

Starcade handles sensitive cryptographic keys and financial transactions. Security is our top priority.

## Key Storage

### Browser Extension

- **Chrome Storage API**: Uses browser's encrypted storage
- **Separation**: Public keys in `wallet` object, private keys in separate encrypted entries
- **Key Format**: `starcade_key_{publicKey}` for encrypted secret keys

**Important**: Current implementation stores keys with basic separation. For production:

```typescript
// TODO: Implement proper encryption
import { encrypt, decrypt } from './crypto';

// When saving
const encrypted = encrypt(secretKey, userPassword);
await storage.set(`key_${publicKey}`, encrypted);

// When loading
const encrypted = await storage.get(`key_${publicKey}`);
const secretKey = decrypt(encrypted, userPassword);
```

### Recommended Encryption

1. **AES-256-GCM** for symmetric encryption
2. **PBKDF2** or **Argon2** for key derivation from password
3. **Salt**: Unique salt per wallet
4. **Iterations**: Minimum 100,000 rounds

### Mobile (Future)

- **iOS**: Use Keychain Services
- **Android**: Use Android Keystore
- **React Native**: `react-native-keychain` library

## Authentication

### Current State

- No password protection (development only)
- Direct access to wallet on extension open

### Production Requirements

1. **Password/PIN Protection**
   - Required on first use
   - Re-prompt after inactivity
   - Minimum 8 characters

2. **Biometric Support** (Mobile)
   - Face ID / Touch ID (iOS)
   - Fingerprint / Face Unlock (Android)

3. **Session Management**
   - Auto-lock after 5 minutes
   - Clear sensitive data from memory
   - Secure session tokens

## Network Security

### HTTPS Only

All API calls must use HTTPS:
- Horizon API: `https://horizon.stellar.org`
- Testnet API: `https://horizon-testnet.stellar.org`

### Content Security Policy

Extension manifest includes strict CSP:

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Host Permissions

Only whitelist necessary domains:
```json
{
  "host_permissions": [
    "https://horizon.stellar.org/*",
    "https://horizon-testnet.stellar.org/*",
    "https://friendbot.stellar.org/*"
  ]
}
```

## Transaction Security

### Validation

Always validate before signing:

```typescript
// Check destination format
if (!/^G[A-Z0-9]{55}$/.test(destination)) {
  throw new Error('Invalid destination');
}

// Check amount
const amount = parseFloat(amountString);
if (amount <= 0 || isNaN(amount)) {
  throw new Error('Invalid amount');
}

// Check balance
if (balance < amount + fee + reserve) {
  throw new Error('Insufficient balance');
}
```

### User Confirmation

1. **Display full details** before signing
2. **Show fees** clearly
3. **Confirm destination** address
4. **Allow cancellation** at any time

### Memo Handling

```typescript
// Validate memo
if (memo && memo.length > 28) {
  throw new Error('Memo too long (max 28 bytes)');
}

// For exchanges, memo is often required
if (isExchangeAddress(destination) && !memo) {
  showWarning('This address may require a memo');
}
```

## Code Security

### Input Sanitization

```typescript
// Sanitize all user inputs
const sanitize = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
```

### Dependency Security

```bash
# Regular audits
npm audit

# Update dependencies
npm update

# Check for vulnerabilities
npm audit fix
```

### Secret Key Handling

**Never:**
- Log private keys
- Send keys over network
- Store keys in plaintext
- Display full keys in UI

**Always:**
- Clear from memory after use
- Use secure random generation
- Validate before importing
- Warn users about backups

## Browser Extension Specific

### Permissions

Request minimum necessary:
```json
{
  "permissions": [
    "storage",        // For wallet state
    "activeTab"       // For current tab only
  ]
}
```

### Message Passing

Validate all messages:

```typescript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Validate sender
  if (!sender.id === chrome.runtime.id) {
    return;
  }
  
  // Validate request structure
  if (!request.type || typeof request.type !== 'string') {
    sendResponse({ error: 'Invalid request' });
    return;
  }
  
  // Handle message
  // ...
});
```

### Content Scripts

- Minimize or avoid content scripts
- Never inject sensitive data into web pages
- Validate all postMessage communications

## Backup & Recovery

### Seed Phrase (TODO)

Implement BIP39 mnemonic generation:

```typescript
import * as bip39 from 'bip39';

// Generate 24-word phrase
const mnemonic = bip39.generateMnemonic(256);

// Derive keypair from mnemonic
const seed = bip39.mnemonicToSeedSync(mnemonic);
const keypair = Keypair.fromRawEd25519Seed(seed.slice(0, 32));
```

### Export Warning

When exporting keys:
1. Show clear warning about security
2. Require password confirmation
3. Suggest secure storage methods
4. Never auto-copy to clipboard

## Incident Response

### In Case of Compromise

1. **Immediate**: Transfer funds to new account
2. **Update**: Change all passwords
3. **Review**: Check transaction history
4. **Report**: Contact support if fraudulent transactions

### Monitoring

- Watch for unusual transaction patterns
- Alert on large transfers
- Log failed authentication attempts
- Rate limit operations

## Compliance

### Privacy

- Minimal data collection
- No tracking or analytics (or explicit consent)
- Clear privacy policy
- GDPR compliance for EU users

### Regulatory

- Not custodial (user controls keys)
- Clear disclaimers
- Terms of service
- Age restrictions where required

## Testing

### Security Testing

```bash
# Check for common vulnerabilities
npm audit

# Test CSP
# Use browser dev tools

# Verify encryption
# Unit tests for crypto functions

# Penetration testing
# Before mainnet launch
```

## Best Practices Checklist

- [ ] Encrypt private keys with user password
- [ ] Implement auto-lock mechanism
- [ ] Add biometric support (mobile)
- [ ] Generate secure random keys
- [ ] Validate all inputs
- [ ] Use HTTPS exclusively
- [ ] Minimize permissions
- [ ] Regular dependency updates
- [ ] Security audit before launch
- [ ] Incident response plan
- [ ] User education materials
- [ ] Backup/recovery mechanism
- [ ] Clear security warnings

## Resources

- [OWASP Browser Extension Security](https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Security_Cheat_Sheet.html)
- [Stellar Security Guide](https://developers.stellar.org/docs/building-apps/security/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
