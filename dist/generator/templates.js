export function generateLayout(config) {
    return `import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import './globals.css';
import { headers } from 'next/headers';
import ContextProvider from '@/context';

export const metadata = {
  title: '${config.name}',
  description: '${config.description}',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>
          <OnchainKitProvider 
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''} 
            chain={base}
          >
            {children}
          </OnchainKitProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
`;
}
export function generateManifest(config) {
    const manifest = {
        accountAssociation: {
            header: '',
            payload: '',
            signature: ''
        },
        frame: {
            version: '1',
            name: config.name,
            homeUrl: config.homeUrl,
            iconUrl: config.iconUrl || `${config.homeUrl}/icon.png`,
            splashImageUrl: `${config.homeUrl}/splash.png`,
            splashBackgroundColor: '#000000',
            webhookUrl: `${config.homeUrl}/api/webhook`,
            subtitle: config.description,
            description: config.description,
            screenshotUrls: [],
            primaryCategory: config.category,
            tags: [config.category, 'miniapp', 'base'],
            heroImageUrl: `${config.homeUrl}/og.png`,
            tagline: config.description,
            ogTitle: config.name,
            ogDescription: config.description,
            ogImageUrl: `${config.homeUrl}/og.png`,
            noindex: false
        }
    };
    return JSON.stringify(manifest, null, 2);
}
export function generateEnvExample() {
    return `NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_BACKEND_ORIGIN=http://localhost:3000
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_DESCRIPTION=Your App Description
QUICK_AUTH_DOMAIN=your-domain.com
`;
}
export function generatePackageJson(config) {
    return `{
  "name": "${config.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@coinbase/onchainkit": "latest",
    "@coinbase/wallet-sdk": "latest",
    "@farcaster/miniapp-sdk": "latest",
    "@farcaster/quick-auth": "latest",
    "@reown/appkit": "latest",
    "@reown/appkit-adapter-wagmi": "latest",
    "@tanstack/react-query": "^5.0.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "wagmi": "^2.10.0",
    "viem": "^2.10.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.0"
  }
}
`;
}
export function generateTsConfig() {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
}
export function generateNextConfig() {
    return `const webpack = require('webpack');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add externals for optional dependencies
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Create alias for optional wallet connector dependencies to empty modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@gemini-wallet/core': path.resolve(__dirname, 'src/utils/empty-module.js'),
      '@solana/kit': path.resolve(__dirname, 'src/utils/empty-module.js'),
    };
    
    return config;
  },
}

module.exports = nextConfig
`;
}
export function generateTailwindConfig() {
    return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
`;
}
export function generateGlobalsCSS() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;
    --foreground: #ffffff;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
}
export function generateAppKitConfig() {
    return `import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks';

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_PROJECT_ID is not defined. WalletConnect will not work properly.');
}

export const networks = [base];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
`;
}
export function generateAppKitContext() {
    return `'use client';

import { wagmiAdapter, projectId } from '@/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { base } from '@reown/appkit/networks';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Mini App',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A Base Mini App',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create the modal (only if projectId is available)
if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [base],
    defaultNetwork: base,
    metadata: metadata,
    features: {
      analytics: true,
    },
  });
}

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);
  
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
`;
}
