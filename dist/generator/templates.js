export function generateOnchainKitProvider() {
    return `'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';

export function OnchainKitWrapper({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider 
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''} 
      chain={base}
    >
      {children}
    </OnchainKitProvider>
  );
}
`;
}
export function generateLayout(config) {
    return `import './globals.css';
import { headers } from 'next/headers';
import ContextProvider from '@/context';
import { OnchainKitWrapper } from '@/components/OnchainKitProvider';

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
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        <ContextProvider cookies={cookies}>
          <OnchainKitWrapper>
            {children}
          </OnchainKitWrapper>
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
    "@devroyale/miniapp": "latest",
    "@farcaster/miniapp-sdk": "latest",
    "@farcaster/quick-auth": "latest",
    "@reown/appkit": "latest",
    "@reown/appkit-adapter-wagmi": "latest",
    "@tanstack/react-query": "latest",
    "lucide-react": "latest",
    "next": "latest",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "wagmi": "latest",
    "viem": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@tailwindcss/postcss": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "postcss": "latest",
    "tailwindcss": "latest",
    "typescript": "latest"
  },
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
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
    return `import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  turbopack: {
    resolveAlias: {
      '@gemini-wallet/core': './src/utils/empty-module.js',
      '@solana/kit': './src/utils/empty-module.js',
    },
  },
}

export default nextConfig;
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
  --background: #000000;
  --foreground: #ffffff;
  --cyan: #06b6d4;
  --purple: #a855f7;
  --pink: #ec4899;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Cyberpunk scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #06b6d4, #a855f7);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #22d3ee, #c084fc);
}

/* Glow effects */
@keyframes glow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.cyberpunk-glow {
  animation: glow 2s ease-in-out infinite;
}
`;
}
export function generateBottomNav() {
    return `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, User, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-cyan-500/20">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={\`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 \${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }\`}
              >
                <div
                  className={\`relative p-2 rounded-lg transition-all duration-300 \${
                    isActive
                      ? 'bg-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                      : 'hover:bg-cyan-500/10'
                  }\`}
                >
                  <Icon
                    size={22}
                    className={\`transition-all duration-300 \${
                      isActive ? 'scale-110' : 'scale-100'
                    }\`}
                  />
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-cyan-500/10 animate-pulse" />
                  )}
                </div>
                <span
                  className={\`text-xs mt-1 font-medium transition-all duration-300 \${
                    isActive ? 'text-cyan-400' : 'text-gray-500'
                  }\`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
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

// Always create AppKit (even without projectId, it will work in miniapp mode)
// Use a dummy projectId if none is provided to prevent errors
const appKitProjectId = projectId || '00000000000000000000000000000000';
createAppKit({
  adapters: [wagmiAdapter],
  projectId: appKitProjectId,
  networks: [base],
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: !!projectId, // Only enable analytics if projectId is set
  },
});

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
export function generateExplorePage(config) {
    return `'use client';

import { BottomNav } from '@/components/BottomNav';
import { TrendingUp, Flame, Star, Zap } from 'lucide-react';

export default function Explore() {
  const features = [
    { icon: TrendingUp, title: 'Trending', color: 'cyan' },
    { icon: Flame, title: 'Hot', color: 'orange' },
    { icon: Star, title: 'Featured', color: 'yellow' },
    { icon: Zap, title: 'New', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black pb-20">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Explore
            </h1>
            <p className="text-gray-400 text-sm">Discover what's happening</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
                orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
                yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400',
                purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
              };

              return (
                <div
                  key={index}
                  className={\`bg-gradient-to-br \${colorClasses[feature.color as keyof typeof colorClasses]} border rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300\`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{item}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-cyan-400 font-semibold mb-1">Feature {item}</h3>
                    <p className="text-gray-400 text-sm">
                      Discover amazing content and features in this section.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
`;
}
export function generateProfilePage(config) {
    return `'use client';

import { BottomNav } from '@/components/BottomNav';
import { useOnchainKit } from '@coinbase/onchainkit';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { User, Wallet, Award, Activity } from 'lucide-react';

export default function Profile() {
  const { user } = useOnchainKit();
  const { userData } = useQuickAuth();
  const displayName = user?.displayName || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black pb-20">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-gray-400 text-sm">Your account information</p>
          </div>

          <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyan-400">{displayName}</h2>
                {userData?.fid && (
                  <p className="text-gray-400 text-sm">FID: {userData.fid}</p>
                )}
              </div>
            </div>

            {userData?.address && (
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-300 font-medium">Wallet Address</span>
                </div>
                <p className="text-xs text-gray-400 font-mono break-all">
                  {userData.address}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20 text-center">
                <Award className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-cyan-400">0</p>
                <p className="text-xs text-gray-400">Achievements</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20 text-center">
                <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-400">0</p>
                <p className="text-xs text-gray-400">Activity</p>
              </div>
            </div>
          </div>

          <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Account Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-cyan-500/5 rounded-lg">
                <span className="text-gray-300 text-sm">Status</span>
                <span className="text-cyan-400 text-sm font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-500/5 rounded-lg">
                <span className="text-gray-300 text-sm">Member Since</span>
                <span className="text-purple-400 text-sm font-medium">Today</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
`;
}
export function generateSettingsPage(config) {
    return `'use client';

import { BottomNav } from '@/components/BottomNav';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { Bell, Moon, Shield, Info, LogOut } from 'lucide-react';

export default function Settings() {
  const { signOut } = useQuickAuth();

  const settings = [
    { icon: Bell, title: 'Notifications', description: 'Manage your notifications', color: 'cyan' },
    { icon: Moon, title: 'Theme', description: 'Dark mode preferences', color: 'purple' },
    { icon: Shield, title: 'Privacy', description: 'Privacy and security settings', color: 'green' },
    { icon: Info, title: 'About', description: 'App information and version', color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black pb-20">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 text-sm">Customize your experience</p>
          </div>

          <div className="space-y-4 mb-6">
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              const colorClasses = {
                cyan: 'border-cyan-500/30 hover:border-cyan-500/50',
                purple: 'border-purple-500/30 hover:border-purple-500/50',
                green: 'border-green-500/30 hover:border-green-500/50',
                blue: 'border-blue-500/30 hover:border-blue-500/50',
              };

              return (
                <div
                  key={index}
                  className={\`bg-black/80 backdrop-blur-xl border \${colorClasses[setting.color as keyof typeof colorClasses]} rounded-2xl p-5 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300 cursor-pointer\`}
                >
                  <div className="flex items-center gap-4">
                    <div className={\`p-3 rounded-xl bg-gradient-to-br \${
                      setting.color === 'cyan' ? 'from-cyan-500/20 to-cyan-500/5' :
                      setting.color === 'purple' ? 'from-purple-500/20 to-purple-500/5' :
                      setting.color === 'green' ? 'from-green-500/20 to-green-500/5' :
                      'from-blue-500/20 to-blue-500/5'
                    }\`}>
                      <Icon className={\`w-5 h-5 \${
                        setting.color === 'cyan' ? 'text-cyan-400' :
                        setting.color === 'purple' ? 'text-purple-400' :
                        setting.color === 'green' ? 'text-green-400' :
                        'text-blue-400'
                      }\`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{setting.title}</h3>
                      <p className="text-gray-400 text-sm">{setting.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={signOut}
            className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 text-red-400 font-medium py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
`;
}
