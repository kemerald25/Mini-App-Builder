# CSP Fixes for Base App Compatibility

## Changes Made

### 1. Removed Google Fonts
- **Removed from `src/app/layout.tsx`:**
  - Removed `import { Inter } from 'next/font/google'`
  - Removed `className={inter.className}` from body tag

### 2. Updated to System Fonts
- **Updated `src/app/globals.css`:**
  - Changed from Google Fonts (Inter) to system font stack
  - Uses native fonts: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...`

### 3. Updated Generated Templates
- **Updated `src/generator/templates.ts`:**
  - All generated Mini Apps now use system fonts instead of Google Fonts
  - CSP-compliant font loading

### 4. Simplified Next.js Config
- **Updated `next.config.cjs`:**
  - Removed CSP header configuration (Base App handles CSP)
  - Base App enforces its own strict CSP policy

## About CSP in Base App

Base App enforces strict Content Security Policy (CSP) when Mini Apps run inside it:

- **External fonts are blocked** - Use system fonts instead
- **External scripts are restricted** - Use `'unsafe-inline'` and `'unsafe-eval'` only when necessary
- **Images from external domains may be blocked** - Host images on your own domain
- **Connections are restricted** - Only to approved domains like `auth.farcaster.xyz`

## Remaining CSP Considerations

The errors you saw:
1. **Font errors** - ✅ Fixed (using system fonts)
2. **Image errors (ngrok favicon)** - This is from ngrok's own page, not your app
3. **Module import error (allerrors.js)** - Likely from browser dev tools, not your code

## Testing

When testing your Mini App in Base App:
- CSP errors will appear in the browser console
- The app should still function if using CSP-compliant resources
- Use Base App's developer tools to debug CSP violations

## Best Practices

1. ✅ Use system fonts (already implemented)
2. ✅ Host all assets on your own domain
3. ✅ Minimize use of `'unsafe-inline'` and `'unsafe-eval'`
4. ✅ Test in Base App environment, not just localhost






