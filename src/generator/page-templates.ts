import { MiniAppConfig } from '../types.js';

export function generateSimplePage(config: MiniAppConfig): string {
  return `'use client';

import { useQuickAuth } from '@/hooks/useQuickAuth';
import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { Zap, Activity, Sparkles, Shield, ArrowRight, Bell, Wallet, CheckCircle2 } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';

// Detect if we're in Farcaster miniapp environment
function isFarcasterMiniapp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      typeof sdk !== 'undefined' && 
      sdk !== null && 
      sdk.actions &&
      typeof sdk.actions.signIn === 'function'
    );
  } catch {
    return false;
  }
}

export default function Home() {
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = userData?.fid ? 'Explorer #' + userData.fid : 'Friend';
  const isMiniapp = isFarcasterMiniapp();

  const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
  const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
  const cardClasses =
    'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';
  const primaryButtonClasses =
    'w-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_20px_45px_rgba(0,82,255,0.35)] transition-all duration-200 hover:shadow-[0px_25px_55px_rgba(0,82,255,0.55)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';
  const secondaryButtonClasses =
    'w-full bg-[#1E1F25] border border-[#2A2B35] text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:border-[#0052FF]/40';
  const badgeClasses =
    'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#00D4FF] text-[11px] font-semibold tracking-wide border border-[#0052FF]/25';

  // In miniapp, don't show connect wallet UI - authentication happens automatically
  // Show loading state while authenticating in miniapp
  if (!isAuthenticated) {
    // In miniapp, show loading state instead of connect wallet button
    if (isMiniapp && isLoading) {
      return (
        <>
          <main className={containerClasses}>
            <div className="flex min-h-screen items-center justify-center px-4 pb-32">
              <div className="w-full max-w-[380px] space-y-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30">
                  <Zap className="h-8 w-8 text-[#00D4FF] animate-pulse" />
                </div>
                <p className="text-sm text-[#A0A0A0]">Connecting...</p>
              </div>
            </div>
          </main>
          <BottomNav />
        </>
      );
    }
    
    // Web browser - show connect wallet UI
    return (
      <>
        <main className={containerClasses}>
          <div className="flex min-h-screen items-center justify-center px-4 pb-32">
            <div className="w-full max-w-[380px] space-y-8">
              <div className="text-center space-y-4">
                <span className={badgeClasses}>Base powered mini app</span>
                <h1 className="text-3xl font-bold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                    Welcome to ${config.name}
                  </span>
                </h1>
                <p className="text-sm text-[#A0A0A0]">${config.description}</p>
              </div>
              <div className={\`\${cardClasses} text-center space-y-6\`}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30">
                  <Zap className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <p className="text-sm text-[#A0A0A0]">
                  Connect your wallet or Farcaster identity to unlock ${config.name}.
                </p>
                <div className="space-y-3">
                  <button onClick={signIn} disabled={isLoading} className={primaryButtonClasses}>
                    {isLoading ? 'Connecting…' : 'Connect Wallet'}
                  </button>
                  <p className="text-xs text-[#A0A0A0]">Secure by WalletConnect • Powered by Base</p>
                </div>
              </div>
              <BrandFooter />
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-4 border-b border-[#1E1F25] pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={badgeClasses}>Welcome back</p>
                <h1 className="mt-3 text-3xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                    Hey {displayName}
                  </span>
                </h1>
                <p className="text-sm text-[#A0A0A0]">${config.description}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0052FF]/40 bg-[#0052FF]/15 text-xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <section className={\`\${cardClasses} space-y-5\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#A0A0A0]">Overview</p>
                <p className="mt-2 text-3xl font-semibold">$0.00</p>
                <p className="text-xs text-[#A0A0A0]">Total balance across Base</p>
              </div>
              <div className="rounded-2xl border border-[#0066FF]/40 bg-[#0066FF]/15 p-4">
                <Activity className="h-6 w-6 text-[#00D4FF]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Points', value: '0 XP' },
                { label: 'Reputation', value: '0%' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#1E1F25] bg-[#0F1013] p-4 text-center shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0]">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Signals</p>
                <h2 className="mt-1 text-xl font-semibold">What&apos;s happening</h2>
              </div>
              <Shield className="h-5 w-5 text-[#00D4FF]" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Notifications', value: '0', icon: Bell },
                { label: 'Engagement', value: '0', icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-[#1E1F25] bg-[#101217] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052FF]/15 text-[#00D4FF]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-[#A0A0A0]">Updated just now</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {userData && (
            <section className={\`\${cardClasses} space-y-4\`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Identity</p>
                  <h2 className="mt-1 text-xl font-semibold">Farcaster Credentials</h2>
                </div>
                <CheckCircle2 className="h-5 w-5 text-[#00FF88]" />
              </div>
              <div className="rounded-xl border border-[#1E1F25] bg-[#0F1116] p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A0A0A0]">FID</span>
                  <span className="font-semibold">{userData.fid || 'N/A'}</span>
                </div>
                {userData.address && (
                  <div className="flex items-center justify-between text-xs text-[#A0A0A0]">
                    <span className="flex items-center gap-2 text-sm text-white">
                      <Wallet className="h-4 w-4 text-[#00D4FF]" />
                      Wallet
                    </span>
                    <span className="font-mono text-white">
                      {userData.address.slice(0, 6)}...{userData.address.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className={\`\${cardClasses} space-y-3\`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Quick Actions</p>
              <span className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Live</span>
            </div>
            ${config.features
              .map(
                (feature, index) => `
            <button
              key="${feature}-${index}"
              className="flex w-full items-center justify-between rounded-xl border border-[#1E1F25] bg-[#0F1116] px-4 py-3 text-left text-sm text-white transition-all duration-200 hover:border-[#0052FF]/40"
            >
              <span>${feature}</span>
              <ArrowRight className="h-4 w-4 text-[#A0A0A0]" />
            </button>
            `
              )
              .join('')}
            <div className="space-y-2 pt-2">
              <button onClick={signOut} className={secondaryButtonClasses}>
                Disconnect
              </button>
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

export function generateTransactionPage(config: MiniAppConfig): string {
  return `'use client';

import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { Zap, Shield, ArrowRight } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';

// Detect if we're in Farcaster miniapp environment
function isFarcasterMiniapp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      typeof sdk !== 'undefined' && 
      sdk !== null && 
      sdk.actions &&
      typeof sdk.actions.signIn === 'function'
    );
  } catch {
    return false;
  }
}

export default function Home() {
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = userData?.fid ? 'Explorer #' + userData.fid : 'Friend';
  const isMiniapp = isFarcasterMiniapp();

  const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
  const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
  const cardClasses =
    'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';
  const primaryButtonClasses =
    'w-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_20px_45px_rgba(0,82,255,0.35)] transition-all duration-200 hover:shadow-[0px_25px_55px_rgba(0,82,255,0.55)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';
  const badgeClasses =
    'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#00D4FF] text-[11px] font-semibold tracking-wide border border-[#0052FF]/25';

  // In miniapp, don't show connect wallet UI - authentication happens automatically
  if (!isAuthenticated) {
    // In miniapp, show loading state instead of connect wallet button
    if (isMiniapp && isLoading) {
      return (
        <>
          <main className={containerClasses}>
            <div className="flex min-h-screen items-center justify-center px-4 pb-32">
              <div className="w-full max-w-[380px] space-y-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30">
                  <Zap className="h-8 w-8 text-[#00D4FF] animate-pulse" />
                </div>
                <p className="text-sm text-[#A0A0A0]">Connecting...</p>
              </div>
            </div>
          </main>
          <BottomNav />
        </>
      );
    }
    
    // Web browser - show connect wallet UI
    return (
      <>
        <main className={containerClasses}>
          <div className="flex min-h-screen items-center justify-center px-4 pb-32">
            <div className="w-full max-w-[380px] space-y-8 text-center">
              <span className={badgeClasses}>Base transaction mini app</span>
              <div className={\`\${cardClasses} space-y-4\`}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0052FF]/30 bg-[#0052FF]/15">
                  <Zap className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                    ${config.name}
                  </span>
                </h1>
                <p className="text-sm text-[#A0A0A0]">${config.description}</p>
                <button onClick={signIn} disabled={isLoading} className={primaryButtonClasses}>
                  {isLoading ? 'Connecting…' : 'Connect to continue'}
                </button>
              </div>
              <BrandFooter />
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  // Example contract configuration - update with your contract details
  const contractConfig = {
    address: '0x0000000000000000000000000000000000000000' as \`0x\${string}\`,
    abi: [
      {
        inputs: [],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
    functionName: 'mint' as const,
    args: [],
  };

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Transaction</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                ${config.name}
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">${config.description}</p>
          </header>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">Connected</p>
                <p className="text-xl font-semibold">{displayName}</p>
              </div>
              <button onClick={signOut} className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">
                Sign Out
              </button>
            </div>
            {userData && (
              <div className="rounded-xl border border-[#1E1F25] bg-[#0F1116] p-4 text-xs text-[#A0A0A0]">
                <p className="flex items-center justify-between text-sm text-white">
                  <span>FID</span>
                  <span>{userData.fid}</span>
                </p>
                {userData.address && (
                  <p className="mt-2 font-mono text-white">
                    {userData.address.slice(0, 6)}...{userData.address.slice(-4)}
                  </p>
                )}
              </div>
            )}
          </section>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Wallet</p>
                <h2 className="text-xl font-semibold">Ready to send</h2>
              </div>
              <Shield className="h-5 w-5 text-[#00D4FF]" />
            </div>
            <Wallet />
          </section>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Action</p>
                <h2 className="text-xl font-semibold">Execute contract</h2>
              </div>
            </div>
            <Transaction contracts={[contractConfig]}>
              <TransactionButton className="group">
                <span className="flex w-full items-center justify-between">
                  Start Transaction
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </TransactionButton>
            </Transaction>
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

export function generateAgentIntegratedPage(config: MiniAppConfig): string {
  const agentAddress = config.agentAddress || '0x0000000000000000000000000000000000000000';
  
  return `'use client';

import { useQuickAuth } from '@/hooks/useQuickAuth';
import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { Bot, MessageCircle, Zap } from 'lucide-react';

export default function Home() {
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = userData?.fid ? 'Explorer #' + userData.fid : 'Friend';

  const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
  const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
  const cardClasses =
    'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';
  const primaryButtonClasses =
    'w-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_20px_45px_rgba(0,82,255,0.35)] transition-all duration-200 hover:shadow-[0px_25px_55px_rgba(0,82,255,0.55)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';
  const badgeClasses =
    'inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#00D4FF] text-[11px] font-semibold tracking-wide border border-[#0052FF]/25';

  if (!isAuthenticated) {
    return (
      <>
        <main className={containerClasses}>
          <div className="flex min-h-screen items-center justify-center px-4 pb-32">
            <div className="w-full max-w-[380px] space-y-8 text-center">
              <span className={badgeClasses}>Agent powered experience</span>
              <div className={\`\${cardClasses} space-y-4\`}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0052FF]/30 bg-[#0052FF]/15">
                  <Bot className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                    ${config.name}
                  </span>
                </h1>
                <p className="text-sm text-[#A0A0A0]">${config.description}</p>
                <button onClick={signIn} disabled={isLoading} className={primaryButtonClasses}>
                  {isLoading ? 'Connecting…' : 'Connect to chat'}
                </button>
              </div>
              <BrandFooter />
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  const handleChatWithAgent = () => {
    const deeplink = \`cbwallet://messaging/${agentAddress}\`;
    if (typeof window !== 'undefined') {
      window.location.href = deeplink;
    }
  };

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Agent</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                ${config.name}
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">Chat with your Base-native agent instantly.</p>
          </header>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">Connected</p>
                <p className="text-xl font-semibold">{displayName}</p>
              </div>
              <button onClick={signOut} className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">
                Sign Out
              </button>
            </div>
            {userData && (
              <div className="rounded-xl border border-[#1E1F25] bg-[#0F1116] p-4 text-xs text-[#A0A0A0]">
                <p className="flex items-center justify-between text-sm text-white">
                  <span>FID</span>
                  <span>{userData.fid}</span>
                </p>
              </div>
            )}
          </section>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Highlights</p>
                <h2 className="text-xl font-semibold">Agent features</h2>
              </div>
              <Zap className="h-5 w-5 text-[#00D4FF]" />
            </div>
            <div className="space-y-3">
              ${config.features
                .map(
                  (feature) => `
              <div className="flex items-center gap-3 rounded-xl border border-[#1E1F25] bg-[#101217] px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0052FF]/15 text-[#00D4FF]">
                  •
                </span>
                <p className="text-sm text-white">${feature}</p>
              </div>
              `
                )
                .join('')}
            </div>
          </section>

          <section className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Chat</p>
                <h2 className="text-xl font-semibold">Open session</h2>
              </div>
              <MessageCircle className="h-5 w-5 text-[#00D4FF]" />
            </div>
            <button
              onClick={handleChatWithAgent}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0052FF]/40 bg-[#0052FF]/10 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-[#0052FF]/60"
            >
              Launch Agent
              <MessageCircle className="h-4 w-4" />
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

export function generateGamePage(config: MiniAppConfig): string {
  return `'use client';

import { useQuickAuth } from '@/hooks/useQuickAuth';
import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { Gamepad2, RefreshCcw, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = userData?.fid ? 'Explorer #' + userData.fid : 'Friend';
  const [score, setScore] = useState(0);

  const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
  const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
  const cardClasses =
    'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';
  const primaryButtonClasses =
    'w-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_20px_45px_rgba(0,82,255,0.35)] transition-all duration-200 hover:shadow-[0px_25px_55px_rgba(0,82,255,0.55)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';
  const secondaryButtonClasses =
    'w-full bg-[#1E1F25] border border-[#2A2B35] text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:border-[#0052FF]/40';

  if (!isAuthenticated) {
    return (
      <>
        <main className={containerClasses}>
          <div className="flex min-h-screen items-center justify-center px-4 pb-32">
            <div className="w-full max-w-[380px] space-y-8 text-center">
              <div className={\`\${cardClasses} space-y-4\`}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0052FF]/30 bg-[#0052FF]/15">
                  <Gamepad2 className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                    ${config.name}
                  </span>
                </h1>
                <p className="text-sm text-[#A0A0A0]">${config.description}</p>
                <button onClick={signIn} disabled={isLoading} className={primaryButtonClasses}>
                  {isLoading ? 'Connecting…' : 'Connect to play'}
                </button>
              </div>
              <BrandFooter />
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Game</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                ${config.name}
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">Tap to boost your score and unlock Base perks.</p>
          </header>

          <section className={\`\${cardClasses} text-center space-y-4\`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Player</span>
              <button onClick={signOut} className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">
                Sign Out
              </button>
            </div>
            <p className="text-xl font-semibold">{displayName}</p>
            <div className="rounded-2xl border border-[#1E1F25] bg-[#0F1116] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">Score</p>
              <p className="mt-2 text-5xl font-bold">{score}</p>
            </div>
            <p className="text-xs text-[#A0A0A0]">
              Tap play to increment your score. Reset anytime to start fresh.
            </p>
            <div className="space-y-3">
              <button onClick={() => setScore(score + 1)} className={primaryButtonClasses}>
                <span className="flex items-center justify-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  Play
                </span>
              </button>
              <button onClick={() => setScore(0)} className={secondaryButtonClasses}>
                <span className="flex items-center justify-center gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </span>
              </button>
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

export function generatePollPage(config: MiniAppConfig): string {
  return `'use client';

import { useQuickAuth } from '@/hooks/useQuickAuth';
import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { Vote, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = userData?.fid ? 'Explorer #' + userData.fid : 'Friend';
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votes, setVotes] = useState({ option1: 0, option2: 0, option3: 0 });

  const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
  const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
  const cardClasses =
    'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';
  const primaryButtonClasses =
    'w-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_20px_45px_rgba(0,82,255,0.35)] transition-all duration-200 hover:shadow-[0px_25px_55px_rgba(0,82,255,0.55)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';

  if (!isAuthenticated) {
    return (
      <>
        <main className={containerClasses}>
          <div className="flex min-h-screen items-center justify-center px-4 pb-32">
            <div className="w-full max-w-[380px] space-y-8 text-center">
              <div className={\`\${cardClasses} space-y-4\`}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0052FF]/30 bg-[#0052FF]/15">
                  <Vote className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                    ${config.name}
                  </span>
                </h1>
                <p className="text-sm text-[#A0A0A0]">${config.description}</p>
                <button onClick={signIn} disabled={isLoading} className={primaryButtonClasses}>
                  {isLoading ? 'Connecting…' : 'Connect to vote'}
                </button>
              </div>
              <BrandFooter />
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleVote = (option: string) => {
    if (selectedOption) return; // Already voted
    
    setSelectedOption(option);
    const key = \`option\${options.indexOf(option) + 1}\` as keyof typeof votes;
    setVotes({ ...votes, [key]: votes[key] + 1 });
  };

  const totalVotes = votes.option1 + votes.option2 + votes.option3;

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Poll</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                ${config.name}
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">Cast your vote and watch the Base community respond.</p>
          </header>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">Voter</p>
                <p className="text-xl font-semibold">{displayName}</p>
              </div>
              <button onClick={signOut} className="text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">
                Sign Out
              </button>
            </div>
            {userData && (
              <p className="rounded-xl border border-[#1E1F25] bg-[#0F1116] p-3 text-xs text-[#A0A0A0]">
                FID: {userData.fid}
              </p>
            )}
          </section>

  ... (rest of patch)
  );
}
`;
}

export function generateNFTGalleryPage(config: MiniAppConfig): string {
  return `'use client';

import { useQuickAuth } from '@/hooks/useQuickAuth';
import { BottomNav } from '@/components/BottomNav';
import { BrandFooter } from '@/components/BrandFooter';
import { Image as ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

type NFT = {
  id: number;
  name: string;
  image: string;
  description: string;
};

const mockNFTs: NFT[] = [
  { id: 1, name: 'Aurora Bloom', image: 'https://via.placeholder.com/640x480', description: 'Dynamic gradients inspired by Base blocks.' },
  { id: 2, name: 'Neon Bridge', image: 'https://via.placeholder.com/640x480', description: 'Cyberpunk skyline rendered in Base blue.' },
  { id: 3, name: 'Circuit Blossom', image: 'https://via.placeholder.com/640x480', description: 'Organic patterns blending with circuitry.' },
];

export default function Home() {
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const displayName = userData?.fid ? \`Explorer #\${userData.fid}\` : 'Friend';

  const containerClasses = 'min-h-screen bg-[#0A0B0D] text-white';
  const shellClasses = 'max-w-[430px] mx-auto px-4 py-8 pb-32 space-y-6';
  const cardClasses =
    'bg-[#141519] border border-[#1E1F25] rounded-2xl p-6 shadow-[0px_25px_80px_rgba(0,82,255,0.08)] transition-colors duration-300 hover:border-[#0052FF]/40';

  if (!isAuthenticated) {
    return (
      <>
        <main className={containerClasses}>
          <div className="flex min-h-screen items-center justify-center px-4 pb-32">
            <div className="w-full max-w-[380px] space-y-8 text-center">
              <div className={\`\${cardClasses} space-y-4\`}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0052FF]/30 bg-[#0052FF]/15">
                  <ImageIcon className="h-8 w-8 text-[#00D4FF]" />
                </div>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                    ${config.name}
                  </span>
                </h1>
                <p className="text-sm text-[#A0A0A0]">${config.description}</p>
                <button
                  onClick={signIn}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0052FF] to-[#0066FF] text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_20px_45px_rgba(0,82,255,0.35)] transition-all duration-200 hover:shadow-[0px_25px_55px_rgba(0,82,255,0.55)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Connecting…' : 'Connect Wallet'}
                </button>
              </div>
              <BrandFooter />
            </div>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <main className={containerClasses}>
        <div className={shellClasses}>
          <header className="space-y-3 border-b border-[#1E1F25] pb-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Gallery</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0052FF] to-[#00D4FF] bg-clip-text text-transparent">
                ${config.name}
              </span>
            </h1>
            <p className="text-sm text-[#A0A0A0]">Curated pieces for {displayName}</p>
          </header>

          <section className={\`\${cardClasses} space-y-4\`}>
            <div className="grid grid-cols-1 gap-4">
              {mockNFTs.map((nft) => (
                <button
                  key={nft.id}
                  onClick={() => setSelectedNFT(nft)}
                  className="flex items-center gap-4 rounded-2xl border border-[#1E1F25] bg-[#0F1116] p-4 text-left transition-all duration-200 hover:border-[#0052FF]/40"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#1E1F25] bg-[#141519]">
                    <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{nft.name}</p>
                    <p className="text-xs text-[#A0A0A0]">{nft.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {selectedNFT && (
            <section className={\`\${cardClasses} space-y-3\`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedNFT.name}</h3>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="rounded-full border border-[#1E1F25] p-2 text-[#A0A0A0] hover:border-[#0052FF]/40 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-[#1E1F25]">
                <img src={selectedNFT.image} alt={selectedNFT.name} className="w-full object-cover" />
              </div>
              <p className="text-sm text-[#A0A0A0]">{selectedNFT.description}</p>
            </section>
          )}

          <section className={cardClasses}>
            <button
              onClick={signOut}
              className="w-full bg-[#1E1F25] border border-[#2A2B35] text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:border-[#0052FF]/40"
            >
              Sign Out
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

