import { MiniAppConfig, GeneratedFile, AppType } from '../types.js';
import {
  generateLayout,
  generateManifest,
  generateEnvExample,
  generatePackageJson,
  generateTsConfig,
  generateNextConfig,
  generateTailwindConfig,
  generateGlobalsCSS,
  generateAppKitConfig,
  generateAppKitContext,
  generateOnchainKitProvider,
  generateBottomNav,
  generateBrandFooter,
  generateExplorePage,
  generateProfilePage,
  generateSettingsPage,
} from './templates.js';
import {
  generateSimplePage,
  generateTransactionPage,
  generateAgentIntegratedPage,
  generateGamePage,
  generatePollPage,
  generateNFTGalleryPage,
} from './page-templates.js';
import { generateAuthHook, generateAuthApiRoute } from './auth-templates.js';
// These imports are safe in Node.js environments (CLI and API routes)
import * as fs from 'fs/promises';
import * as path from 'path';

export class MiniAppGenerator {
  private config: MiniAppConfig;

  constructor(config: MiniAppConfig) {
    this.config = config;
  }

  private determineAppType(): AppType {
    if (this.config.needsAgent) return 'agent-integrated';
    if (this.config.needsTransaction) return 'transaction';
    if (this.config.category === 'gaming') return 'game';
    if (this.config.features.some(f => f.toLowerCase().includes('poll'))) return 'poll';
    if (this.config.features.some(f => f.toLowerCase().includes('nft'))) return 'nft-gallery';
    return 'simple';
  }

  private generatePage(): string {
    const appType = this.determineAppType();

    switch (appType) {
      case 'transaction':
        return generateTransactionPage(this.config);
      case 'agent-integrated':
        return generateAgentIntegratedPage(this.config);
      case 'game':
        return generateGamePage(this.config);
      case 'poll':
        return generatePollPage(this.config);
      case 'nft-gallery':
        return generateNFTGalleryPage(this.config);
      default:
        return generateSimplePage(this.config);
    }
  }

  public async generateFiles(outputDir: string): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Core Next.js files
    files.push({
      path: 'app/layout.tsx',
      content: generateLayout(this.config),
    });

    files.push({
      path: 'app/page.tsx',
      content: this.generatePage(),
    });

    files.push({
      path: 'app/globals.css',
      content: generateGlobalsCSS(),
    });

    // Auth hook
    files.push({
      path: 'hooks/useQuickAuth.ts',
      content: generateAuthHook(),
    });

    // Auth API route
    files.push({
      path: 'app/api/auth/route.ts',
      content: generateAuthApiRoute(this.config),
    });

    // AppKit config
    files.push({
      path: 'config/index.ts',
      content: generateAppKitConfig(),
    });

    // AppKit context provider
    files.push({
      path: 'context/index.tsx',
      content: generateAppKitContext(),
    });

    // OnchainKit Provider wrapper (client component)
    files.push({
      path: 'components/OnchainKitProvider.tsx',
      content: generateOnchainKitProvider(),
    });

    // Bottom Navigation component
    files.push({
      path: 'components/BottomNav.tsx',
      content: generateBottomNav(),
    });

    files.push({
      path: 'components/BrandFooter.tsx',
      content: generateBrandFooter(),
    });

    // Additional pages
    files.push({
      path: 'app/explore/page.tsx',
      content: generateExplorePage(this.config),
    });

    files.push({
      path: 'app/profile/page.tsx',
      content: generateProfilePage(this.config),
    });

    files.push({
      path: 'app/settings/page.tsx',
      content: generateSettingsPage(this.config),
    });

    // Manifest
    files.push({
      path: 'public/.well-known/farcaster.json',
      content: generateManifest(this.config),
    });

    // Configuration files
    files.push({
      path: 'package.json',
      content: generatePackageJson(this.config),
    });

    files.push({
      path: 'tsconfig.json',
      content: generateTsConfig(),
    });

    files.push({
      path: 'next.config.mjs',
      content: generateNextConfig(),
    });

    files.push({
      path: 'tailwind.config.ts',
      content: generateTailwindConfig(),
    });

    files.push({
      path: 'postcss.config.mjs',
      content: `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
`,
    });

    // Empty module stub for optional dependencies
    files.push({
      path: 'src/utils/empty-module.js',
      content: `// Empty module stub for optional dependencies
module.exports = {};
`,
    });

    files.push({
      path: '.env.example',
      content: generateEnvExample(),
    });

    files.push({
      path: '.gitignore',
      content: `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`,
    });

    files.push({
      path: 'README.md',
      content: `# ${this.config.name}

${this.config.description}

## Getting Started

1. Copy \`.env.example\` to \`.env.local\` and add your OnchainKit API key:
   \`\`\`
   cp .env.example .env.local
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
   
   If you encounter dependency conflicts, try:
   \`\`\`
   npm install --legacy-peer-deps
   \`\`\`

3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy

Deploy your Mini App to any Next.js hosting platform (Vercel, etc.).

Make sure to:
- Set \`NEXT_PUBLIC_ONCHAINKIT_API_KEY\` in your environment variables
- Set \`QUICK_AUTH_DOMAIN\` to match your deployment domain for authentication
- Update the manifest at \`public/.well-known/farcaster.json\` with your production URLs
- Verify your manifest at [base.dev/preview](https://base.dev/preview)

## Authentication

This Mini App includes Quick Auth integration using Farcaster's identity system. Authentication is already set up:

- Frontend hook: \`hooks/useQuickAuth.ts\` - Custom hook for authentication
- Backend route: \`app/api/auth/route.ts\` - API route for JWT verification
- All pages are protected and require authentication

To configure:
1. Set \`QUICK_AUTH_DOMAIN\` in your environment variables to your production domain
2. The domain must match your deployment URL for authentication to work
3. Users will see a sign-in screen before accessing the app

## Features

${this.config.features.map(f => `- ${f}`).join('\n')}
`,
    });

    return files;
  }

  public async writeFiles(outputDir: string): Promise<void> {
    const files = await this.generateFiles(outputDir);

    for (const file of files) {
      const filePath = path.join(outputDir, file.path);
      const dir = path.dirname(filePath);

      // Create directory if it doesn't exist
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, file.content, 'utf-8');
    }
  }
}

