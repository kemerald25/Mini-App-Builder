import { MiniAppConfig, GeneratedFile } from '../types.js';

export function generateOnchainKitProvider(): string {
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

export function generateLayout(config: MiniAppConfig): string {
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
      <body className="bg-[#0A0B0D] text-white antialiased">
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

export function generateManifest(config: MiniAppConfig): string {
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

export function generateEnvExample(): string {
  return `NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_BACKEND_ORIGIN=http://localhost:3000
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here
NEXT_PUBLIC_APP_NAME=Your App Name
NEXT_PUBLIC_APP_DESCRIPTION=Your App Description
QUICK_AUTH_DOMAIN=your-domain.com
`;
}

export function generatePackageJson(config: MiniAppConfig): string {
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

export function generateTsConfig(): string {
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

export function generateNextConfig(): string {
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

export function generateTailwindConfig(): string {
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

export function generateGlobalsCSS(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
}

export function generateBottomNav(): string {
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#141519]/95 border-t border-[#1E1F25] backdrop-blur-lg">
      <div className="max-w-[430px] mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={\`flex flex-col items-center gap-1 text-xs font-medium transition-colors duration-200 \${
                  isActive ? 'text-[#0052FF]' : 'text-[#A0A0A0] hover:text-white'
                }\`}
              >
                <span
                  className={\`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 \${
                    isActive
                      ? 'bg-[#0052FF]/15 border border-[#0052FF]/30 shadow-[0_10px_30px_rgba(0,82,255,0.25)]'
                      : 'border border-transparent hover:border-[#0052FF]/20'
                  }\`}
                >
                  <Icon size={24} />
                </span>
                <span className="text-[11px] tracking-wide">{item.label}</span>
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

export function generateBrandFooter(): string {
  return `export function BrandFooter() {
  return (
    <footer className="mt-10 pt-8 border-t border-[#1E1F25] text-center space-y-2">
      <p className="text-xs font-semibold tracking-[0.3em] text-[#A0A0A0] uppercase">
        Built with Love by Dev Royale
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-[#A0A0A0]">
        <a
          href="https://x.com/iamdevroyale"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00D4FF] hover:text-white transition-colors duration-200"
        >
          Follow on X
        </a>
        <span className="text-[#1E1F25]">•</span>
        <a
          href="https://github.com/kemerald25"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00D4FF] hover:text-white transition-colors duration-200"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
`;
}

export function generateAppKitConfig(): string {
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

export function generateAppKitContext(): string {
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

export function generateExplorePage(config: MiniAppConfig): string {
  return `'use client';

import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { TrendingUp, Flame, Star, Zap, ArrowRight, Sparkles } from 'lucide-react';

const cardClasses =
  'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';

export default function Explore() {
  const categories = [
    { icon: TrendingUp, title: 'Trending', badge: 'Live' },
    { icon: Flame, title: 'Hot Drops', badge: 'Now' },
    { icon: Star, title: 'Featured', badge: 'Top' },
    { icon: Zap, title: 'Fresh', badge: 'New' },
  ];

  const spots = [
    { id: 1, title: '${config.name} Quest Hub', description: 'Curated missions, Base-native actions, and rapid progression loops.' },
    { id: 2, title: 'Creator Highlights', description: 'Discover standout experiences and agents in the ${config.category} space.' },
    { id: 3, title: 'Community Radar', description: 'Live signals from Farcaster, Warpcast, and Base social layers.' },
    { id: 4, title: 'Dev Royale Updates', description: 'Fresh templates, UI kits, and flows specifically for ${config.name} builders.' },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#0A0B0D] text-white">
        <div className="max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6">
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Discover</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                Explore ${config.name}
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">${config.description}</p>
          </header>

          <section className="grid grid-cols-2 gap-4">
            {categories.map(({ icon: Icon, title, badge }) => (
              <div key={title} className={\`\${cardClasses} space-y-3\`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0052FF]/25 bg-[#0052FF]/10 text-[#00D4FF]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A0A0A0]">{badge}</span>
                </div>
                <p className="text-sm font-semibold">{title}</p>
              </div>
            ))}
          </section>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Spotlight</p>
                <h2 className="text-xl font-semibold">What&apos;s next</h2>
              </div>
              <Sparkles className="h-5 w-5 text-[#00D4FF]" />
            </div>
            <div className="space-y-4">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className="rounded-2xl border border-[#1E1F25] bg-[#101217] p-4 transition-all duration-200 hover:border-[#0052FF]/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0052FF]/25 bg-[#0052FF]/10 text-lg font-semibold">
                      {spot.id.toString().padStart(2, '0')}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold">{spot.title}</h3>
                        <ArrowRight className="h-4 w-4 text-[#A0A0A0]" />
                      </div>
                      <p className="text-sm text-[#A0A0A0] leading-relaxed">{spot.description}</p>
                      <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#00D4FF]">
                        Base drop
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <BrandFooter />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
`;
}

export function generateProfilePage(config: MiniAppConfig): string {
  return `'use client';

import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { useOnchainKit } from '@coinbase/onchainkit';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { User, Wallet, Award, Activity } from 'lucide-react';

const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
const cardClasses =
  'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';

export default function Profile() {
  const { user } = useOnchainKit();
  const { userData } = useQuickAuth();
  const displayName = user?.displayName || 'User';

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Profile</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                Identity Hub
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">Your Farcaster + Base credentials inside ${config.name}.</p>
          </header>

          <section className={\`\${cardClasses} space-y-6\`}>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0052FF]/30 bg-[#0052FF]/15">
                <User className="h-8 w-8 text-[#00D4FF]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">Display Name</p>
                <p className="text-xl font-semibold">{displayName}</p>
                {userData?.fid && <p className="text-xs text-[#A0A0A0]">FID: {userData.fid}</p>}
              </div>
            </div>

            {userData?.address && (
              <div className="rounded-2xl border border-[#1E1F25] bg-[#0F1116] p-4">
                <div className="flex items-center justify-between text-xs text-[#A0A0A0]">
                  <span className="flex items-center gap-2 text-sm text-white">
                    <Wallet className="h-4 w-4 text-[#00D4FF]" />
                    Wallet Address
                  </span>
                </div>
                <p className="mt-3 font-mono text-xs text-white">{userData.address}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'Achievements', value: '0' }, { label: 'Activity', value: '0' }].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#1E1F25] bg-[#0F1116] p-4 text-center transition-colors duration-200 hover:border-[#0052FF]/40"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0052FF]/10 text-[#00D4FF]">
                    {item.label === 'Achievements' ? <Award className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
                  </div>
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Account Status</p>
                <h2 className="text-xl font-semibold">Royale credentials</h2>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Status', value: 'Active' },
                { label: 'Member Since', value: 'Today' },
                { label: 'Tier', value: 'Explorer' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-[#1E1F25] bg-[#101217] px-4 py-3"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <BrandFooter />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
`;
}

export function generateSettingsPage(config: MiniAppConfig): string {
  return `'use client';

import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { Bell, Moon, Shield, Info, LogOut, Cpu, Gauge, Sparkles } from 'lucide-react';

const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
const cardClasses =
  'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';
const primaryButtonClasses =
  'w-full bg-gradient-to-r from-[#FF4B6E] to-[#FF6B3D] text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_20px_45px_rgba(255,75,110,0.35)] transition-all duration-200 hover:shadow-[0px_25px_55px_rgba(255,75,110,0.55)] active:scale-95';

export default function Settings() {
  const { signOut } = useQuickAuth();

  const settings = [
    { icon: Bell, title: 'Notifications', description: 'Manage your notifications' },
    { icon: Moon, title: 'Theme', description: 'Dark mode preferences' },
    { icon: Shield, title: 'Privacy', description: 'Privacy and security settings' },
    { icon: Info, title: 'About', description: 'App information and version' },
  ];

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Settings</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                Control Center
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">Fine-tune ${config.name} for a perfect Base-native experience.</p>
          </header>

          <section className={\`\${cardClasses} space-y-3\`}>
            {settings.map(({ icon: Icon, title, description }) => (
              <button
                key={title}
                className="flex w-full items-center justify-between rounded-2xl border border-[#1E1F25] bg-[#0F1116] px-4 py-4 text-left transition-all duration-200 hover:border-[#0052FF]/40"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0052FF]/20 bg-[#0052FF]/10 text-[#00D4FF]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-[#A0A0A0]">{description}</p>
                  </div>
                </div>
                <Sparkles className="h-4 w-4 text-[#A0A0A0]" />
              </button>
            ))}
          </section>

          <section className="grid grid-cols-2 gap-4">
            {[
              { label: 'Performance', value: 'Ultra', Icon: Gauge },
              { label: 'Security', value: 'Shielded', Icon: Cpu },
            ].map(({ label, value, Icon }) => (
              <div key={label} className={\`\${cardClasses} flex flex-col space-y-2 bg-[#101217]\`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0052FF]/25 bg-[#0052FF]/10 text-[#00D4FF]">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">{label}</p>
                <p className="text-lg font-semibold">{value}</p>
              </div>
            ))}
          </section>

          <section className={cardClasses}>
            <div className="space-y-2 text-xs text-[#A0A0A0]">
              <p>Need to sign out? You can jump back in via Quick Auth anytime.</p>
            </div>
            <button onClick={signOut} className={\`\${primaryButtonClasses} mt-4\`}>
              <span className="flex items-center justify-center gap-2 text-sm">
                <LogOut className="h-4 w-4" />
                Sign Out Securely
              </span>
            </button>
          </section>

          <BrandFooter />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
`;
}

