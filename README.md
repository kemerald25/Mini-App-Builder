# Mini App Builder

AI Agent-powered Mini App builder for generating production-ready Next.js Mini Apps that work in Base App.

## Quick Start (npm)

The easiest way to use the Mini App Builder is via npx (no installation required):

```bash
npx @devroyale/miniapp
```

Or use the shorter command:

```bash
npx miniapp
```

This will start an interactive CLI that guides you through creating your Mini App. The generated app will be created in your current directory.

Alternatively, install globally:

```bash
npm install -g @devroyale/miniapp
miniapp
```

## Features

- 🚀 **Quick Generation** - Generate complete Mini App code in seconds
- 📱 **Multiple App Types** - Support for simple apps, transaction apps, games, polls, NFT galleries, and agent-integrated apps
- 🎨 **Production Ready** - Uses Next.js 14+, TypeScript, Tailwind CSS, OnchainKit, and MiniKit
- 💻 **Web Interface** - Beautiful web UI for generating Mini Apps
- 🔧 **CLI Tool** - Command-line interface for developers
- 📦 **Complete Structure** - Generates all necessary files including manifests, layouts, and components
- 🔐 **Auto Authentication** - Automatic Farcaster sign-in and wallet connection in miniapp environments (v1.0.7+)

## Updating Existing Projects

If you have an existing project created with an older version, see [MIGRATION.md](./MIGRATION.md) for instructions on updating to the latest version without starting fresh.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
npm install
```

**Note:** The builder tool doesn't require OnchainKit/MiniKit packages - it only generates code. The generated Mini Apps will need those packages installed separately. See [PACKAGE_SETUP.md](./PACKAGE_SETUP.md) for details.

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
QUICK_AUTH_DOMAIN=localhost:3000
NEXT_PUBLIC_BACKEND_ORIGIN=http://localhost:3000
```

For production, update `QUICK_AUTH_DOMAIN` to match your deployment domain.

### Development

Run the web interface:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### CLI Usage (Development)

When developing the builder tool itself, generate a Mini App via:

```bash
npm run generate
```

Or using tsx directly:

```bash
npx tsx src/cli.ts
```

**Note:** For end users, use `npx init-builder` instead (see Quick Start above).

## What Gets Generated

The builder generates a complete Next.js Mini App with:

- **Core Files:**
  - `app/layout.tsx` - OnchainKitProvider wrapper
  - `app/page.tsx` - Main UI component (type-specific)
  - `app/globals.css` - Tailwind CSS setup
  - `package.json` - All dependencies
  - `tsconfig.json` - TypeScript configuration
  - `next.config.js` - Next.js configuration
  - `tailwind.config.ts` - Tailwind configuration

- **Manifest:**
  - `public/.well-known/farcaster.json` - Mini App metadata

- **Configuration:**
  - `.env.example` - Environment variables template
  - `.gitignore` - Git ignore rules
  - `README.md` - Project documentation

## Supported App Types

### Simple Apps
Basic Mini Apps with no transaction requirements - games, polls, social tools, content viewers.

### Transaction Apps
Apps that need blockchain transactions - uses OnchainKit Transaction component and Wallet component.

### Agent-Integrated Apps
Apps that integrate with XMTP chat agents - includes deeplink buttons for "Chat with Agent" functionality.

### Game Apps
Interactive game Mini Apps with score tracking and gameplay mechanics.

### Poll Apps
Voting/polling Mini Apps with real-time vote counting and visualization.

### NFT Gallery Apps
NFT collection viewers with image galleries and detail views.

## Configuration Options

When generating a Mini App, you can specify:

- **Name** - Mini App name
- **Description** - Brief description of what the app does
- **Category** - social, gaming, defi, or utility
- **Features** - List of features to highlight
- **Transaction Support** - Enable blockchain transaction capabilities
- **Agent Integration** - Enable chat agent integration
- **Agent Address** - 0x address for agent deeplink (if agent integration enabled)
- **Home URL** - Production URL for the Mini App

## Best Practices

### Authentication
- Defer authentication until needed
- Use `useMiniKit()` for context (display name, pfp)
- Use `useAuthenticate()` only when transaction/identity needed
- **Never use localStorage** - use React state only

### UI Requirements
- Mobile-first Tailwind design
- OnchainKit components for wallet/transactions
- Clear CTAs, smooth onboarding
- Social sharing built-in
- Use system fonts (Base App CSP compliant)

### Manifest
- Complete all required fields
- Use high-quality images (1024x1024px icon, no transparency)
- Set appropriate category and tags
- Include webhook URL if needed

### Content Security Policy (CSP)
- Base App enforces strict CSP policies
- Generated apps use system fonts (no external font loading)
- All assets should be hosted on your domain
- See [CSP_FIXES.md](./CSP_FIXES.md) for more details

## Deployment

After generating your Mini App:

1. Copy `.env.example` to `.env.local`
2. Add your `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
3. Install dependencies: `npm install`
4. Run locally: `npm run dev`
5. Deploy to Vercel or any Next.js hosting platform
6. Update manifest URLs with production URLs
7. Verify manifest at [base.dev/preview](https://base.dev/preview)

## Tech Stack

### Builder Tool
- **Next.js 14+** - App Router (for web UI)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Generated Mini Apps
- **Next.js 14+** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OnchainKit** - Wallet and transaction components (installed separately)
- **Wagmi & Viem** - Ethereum interaction libraries

## Resources

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps)
- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Base App](https://base.org)

## License

MIT
