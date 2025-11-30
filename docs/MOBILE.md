# Mobile App Structure (Future Implementation)

The mobile app packages will be added in future phases:

## Planned Structure

```
packages/
├── mobile-common/     # Shared React Native components and logic
├── mobile-ios/        # iOS-specific configuration
└── mobile-android/    # Android-specific configuration
```

## Technology Stack (Planned)

- **Framework**: React Native
- **Core**: @starcade/core (shared wallet logic)
- **Navigation**: React Navigation
- **State**: React Context API / Redux
- **Secure Storage**: react-native-keychain
- **Biometrics**: react-native-biometrics

## Setup Steps (When Ready)

1. Initialize React Native project:
   ```bash
   npx react-native init StarcadeMobile
   ```

2. Install dependencies:
   ```bash
   npm install @starcade/core
   npm install react-native-keychain
   npm install @react-native-async-storage/async-storage
   ```

3. Implement platform-specific secure storage adapters

4. Build and deploy to App Store / Play Store

## Benefits of Current Architecture

The current monorepo structure with `@starcade/core` makes mobile integration straightforward:

- ✅ All Stellar logic is platform-agnostic
- ✅ Core wallet functionality can be reused 100%
- ✅ Only UI and storage layers need mobile-specific implementation
- ✅ Business logic is tested once, works everywhere
