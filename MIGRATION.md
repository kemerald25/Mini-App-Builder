# Migration Guide: Updating to v1.0.7

This guide helps you update existing Mini App projects to version 1.0.7, which includes:
- ✅ Automatic Farcaster authentication in miniapp environment
- ✅ Automatic wallet connection in miniapp environment
- ✅ Fixed `next.config.cjs` issue (now uses `next.config.js`)
- ✅ Added `sdk.actions.ready()` call to hide splash screen

## Quick Migration Steps

### Step 1: Update Your Files

You need to update the following files in your existing project:

#### 1. Update `hooks/useQuickAuth.ts`

Replace the entire file with the new version that includes:
- `sdk.actions.signIn()` for Farcaster miniapp authentication
- Automatic wallet connection via `sdk.ethereum.request()`
- Auto-sign-in on mount when in miniapp environment

**Key changes:**
- Detection now checks for `sdk.actions.signIn` instead of `sdk.quickAuth`
- Uses SIWF (Sign In with Farcaster) protocol
- Automatically connects wallet and signs in when in miniapp

#### 2. Update `app/api/auth/route.ts`

Replace the entire file with the new version that:
- Handles SIWF message/signature verification
- Extracts FID from SIWF messages
- Maintains backward compatibility with Quick Auth and WalletConnect

#### 3. Update `app/layout.tsx`

Add the `MiniappReady` component import and include it in the layout:

```tsx
import { MiniappReady } from '@/components/MiniappReady';

// ... in the return statement:
return (
  <html lang="en" className="dark">
    <body className="bg-[#0A0B0D] text-white antialiased">
      <MiniappReady />
      <ContextProvider cookies={cookies}>
        <OnchainKitWrapper>
          {children}
        </OnchainKitWrapper>
      </ContextProvider>
    </body>
  </html>
);
```

#### 4. Create `components/MiniappReady.tsx`

Create a new file with this content:

```tsx
'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function MiniappReady() {
  useEffect(() => {
    // Call ready() to hide splash screen and display the app
    // This is required for Farcaster miniapps
    if (typeof window !== 'undefined' && sdk?.actions?.ready) {
      sdk.actions.ready().catch((error) => {
        console.warn('Failed to call sdk.actions.ready():', error);
      });
    }
  }, []);

  return null;
}
```

#### 5. Fix `next.config.js` (if you have `next.config.mjs` or `next.config.cjs`)

If you have `next.config.mjs` or `next.config.cjs`, delete it and create `next.config.js` with CommonJS syntax:

```js
const path = require('path');

const aliasEntries = {
  '@walletconnect/logger': path.resolve(__dirname, 'src/utils/walletconnect-logger.ts'),
  '@gemini-wallet/core': path.resolve(__dirname, 'src/utils/empty-module.js'),
  'why-is-node-running': path.resolve(__dirname, 'src/utils/empty-module.js'),
  tape: path.resolve(__dirname, 'src/utils/empty-module.js'),
  tap: path.resolve(__dirname, 'src/utils/empty-module.js'),
  desm: path.resolve(__dirname, 'src/utils/empty-module.js'),
  'pino-elasticsearch': path.resolve(__dirname, 'src/utils/empty-module.js'),
  fastbench: path.resolve(__dirname, 'src/utils/empty-module.js'),
  'thread-stream': path.resolve(__dirname, 'src/utils/empty-module.js'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...aliasEntries,
    };
    return config;
  },
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@walletconnect/logger': './src/utils/walletconnect-logger.ts',
      '@gemini-wallet/core': './src/utils/empty-module.js',
      'why-is-node-running': './src/utils/empty-module.js',
      tape: './src/utils/empty-module.js',
      tap: './src/utils/empty-module.js',
      desm: './src/utils/empty-module.js',
      'pino-elasticsearch': './src/utils/empty-module.js',
      fastbench: './src/utils/empty-module.js',
      'thread-stream': './src/utils/empty-module.js',
    },
  },
};

module.exports = nextConfig;
```

### Step 2: Get the Updated Files

You have two options:

#### Option A: Copy from a New Generated Project (Easiest)

1. Generate a new project with the latest CLI:
   ```bash
   npx @devroyale/miniapp@latest
   ```

2. Copy the following files from the new project to your existing project:
   - `hooks/useQuickAuth.ts`
   - `app/api/auth/route.ts`
   - `app/layout.tsx`
   - `components/MiniappReady.tsx` (new file)
   - `next.config.js` (if you had `.mjs` or `.cjs`)

3. Adjust any customizations you made to these files

#### Option B: Manual Update

Follow the file-by-file instructions above and update each file manually.

### Step 3: Test Your Application

1. **Test in Web Browser:**
   ```bash
   npm run dev
   ```
   - Should still work with WalletConnect/AppKit
   - Manual wallet connection should work as before

2. **Test in Farcaster Miniapp:**
   - Deploy your app
   - Open in Farcaster client
   - Should automatically:
     - Hide splash screen
     - Connect wallet
     - Sign in with FID
     - No manual steps required!

## What Changed?

### Authentication Flow

**Before (v1.0.6 and earlier):**
- Used Quick Auth (`sdk.quickAuth.getToken()`) for miniapp
- Required manual wallet connection
- Required manual sign-in

**After (v1.0.7):**
- Uses SIWF (`sdk.actions.signIn()`) for miniapp
- Automatically connects wallet via `sdk.ethereum.request()`
- Automatically signs in on app load
- Falls back to AppKit/WalletConnect for web browsers

### New Features

1. **Automatic Authentication**: Users are automatically signed in when the app loads in a Farcaster miniapp
2. **Automatic Wallet Connection**: Wallet is automatically connected in miniapp environment
3. **Splash Screen Handling**: `sdk.actions.ready()` is called automatically to hide the splash screen
4. **Better Detection**: Improved miniapp environment detection

## Breaking Changes

⚠️ **None!** This update is backward compatible. Your existing web functionality will continue to work exactly as before.

## Troubleshooting

### Issue: "Configuring Next.js via 'next.config.cjs' is not supported"

**Solution:** Delete `next.config.cjs` or `next.config.mjs` and create `next.config.js` with CommonJS syntax (see Step 5 above).

### Issue: Auto-sign-in not working in miniapp

**Check:**
1. Make sure `MiniappReady` component is in your layout
2. Verify `sdk.actions.signIn` is available (check console)
3. Check that your API route handles SIWF messages correctly

### Issue: Wallet not auto-connecting

**Check:**
1. Verify you're in a Farcaster miniapp environment (not just web)
2. Check browser console for errors
3. Ensure `sdk.ethereum.request` is available

## Need Help?

If you encounter issues during migration:
1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [Farcaster Miniapp SDK Docs](https://docs.farcaster.xyz/miniapps)
3. Generate a fresh project and compare files

## Summary

The migration is straightforward:
1. Update 4-5 files
2. Add 1 new component
3. Test in both web and miniapp environments

Your existing customizations and features will remain intact - this update only improves the authentication and wallet connection experience in Farcaster miniapp environments.

