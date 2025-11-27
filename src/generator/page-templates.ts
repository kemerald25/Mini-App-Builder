import { MiniAppConfig } from '../types';

export function generateSimplePage(config: MiniAppConfig): string {
  return `'use client';

import { useMiniKit } from '@coinbase/onchainkit';
import { useQuickAuth } from '@/hooks/useQuickAuth';

export default function Home() {
  const { user } = useMiniKit();
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = user?.displayName || 'Friend';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to ${config.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">${config.description}</p>
            <button
              onClick={signIn}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            Welcome to ${config.name}
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            ${config.description}
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Hello, {displayName}!</h2>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign Out
              </button>
            </div>
            
            {userData && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Authenticated as FID: {userData.fid}
              </p>
            )}
            
            <div className="space-y-4">
              ${config.features.map(feature => `
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-300">${feature}</p>
              </div>
              `).join('')}
            </div>
          </div>

          <div className="text-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}

export function generateTransactionPage(config: MiniAppConfig): string {
  return `'use client';

import { useMiniKit } from '@coinbase/onchainkit';
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { useQuickAuth } from '@/hooks/useQuickAuth';

export default function Home() {
  const { user } = useMiniKit();
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = user?.displayName || 'Friend';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">${config.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">${config.description}</p>
            <button
              onClick={signIn}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Continue'}
            </button>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            ${config.name}
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            ${config.description}
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Hello, {displayName}!</h2>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign Out
              </button>
            </div>
            
            {userData && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Authenticated as FID: {userData.fid}
              </p>
            )}
            
            <div className="space-y-4 mb-6">
              ${config.features.map(feature => `
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-300">${feature}</p>
              </div>
              `).join('')}
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4">Wallet</h3>
              <Wallet />
            </div>

            <div className="border-t dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Transaction</h3>
              <Transaction
                contracts={[contractConfig]}
              >
                <TransactionButton />
              </Transaction>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}

export function generateAgentIntegratedPage(config: MiniAppConfig): string {
  const agentAddress = config.agentAddress || '0x0000000000000000000000000000000000000000';
  
  return `'use client';

import { useMiniKit } from '@coinbase/onchainkit';
import { useQuickAuth } from '@/hooks/useQuickAuth';

export default function Home() {
  const { user } = useMiniKit();
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = user?.displayName || 'Friend';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">${config.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">${config.description}</p>
            <button
              onClick={signIn}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChatWithAgent = () => {
    const deeplink = \`cbwallet://messaging/${agentAddress}\`;
    if (typeof window !== 'undefined') {
      window.location.href = deeplink;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            ${config.name}
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            ${config.description}
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Hello, {displayName}!</h2>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign Out
              </button>
            </div>
            
            {userData && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Authenticated as FID: {userData.fid}
              </p>
            )}
            
            <div className="space-y-4 mb-6">
              ${config.features.map(feature => `
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-300">${feature}</p>
              </div>
              `).join('')}
            </div>

            <div className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4">Chat with Agent</h3>
              <button
                onClick={handleChatWithAgent}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                💬 Chat with Agent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}

export function generateGamePage(config: MiniAppConfig): string {
  return `'use client';

import { useMiniKit } from '@coinbase/onchainkit';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { useState } from 'react';

export default function Home() {
  const { user } = useMiniKit();
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = user?.displayName || 'Friend';
  const [score, setScore] = useState(0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">${config.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">${config.description}</p>
            <button
              onClick={signIn}
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Play'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-purple-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            ${config.name}
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">${config.name}</h2>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign Out
              </button>
            </div>
            
            {userData && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Authenticated as FID: {userData.fid}
              </p>
            )}
            
            <div className="text-center mb-6">
              <p className="text-3xl font-bold mb-2">Score: {score}</p>
              <p className="text-gray-600 dark:text-gray-400">Player: {displayName}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setScore(score + 1)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                🎮 Play!
              </button>
              
              <button
                onClick={() => setScore(0)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}

export function generatePollPage(config: MiniAppConfig): string {
  return `'use client';

import { useMiniKit } from '@coinbase/onchainkit';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { useState } from 'react';

export default function Home() {
  const { user } = useMiniKit();
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = user?.displayName || 'Friend';
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votes, setVotes] = useState({ option1: 0, option2: 0, option3: 0 });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-green-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">${config.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">${config.description}</p>
            <button
              onClick={signIn}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Vote'}
            </button>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-green-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            ${config.name}
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Cast your vote</h2>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign Out
              </button>
            </div>
            
            {userData && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Authenticated as FID: {userData.fid}
              </p>
            )}
            
            <div className="space-y-4">
              {options.map((option, index) => {
                const key = \`option\${index + 1}\` as keyof typeof votes;
                const percentage = totalVotes > 0 ? (votes[key] / totalVotes) * 100 : 0;
                const isSelected = selectedOption === option;

                return (
                  <button
                    key={option}
                    onClick={() => handleVote(option)}
                    disabled={!!selectedOption}
                    className={\`w-full text-left p-4 rounded-lg border-2 transition-all \${
                      isSelected
                        ? 'border-green-500 bg-green-50 dark:bg-green-900'
                        : 'border-gray-300 dark:border-gray-700 hover:border-green-300'
                    } \${
                      selectedOption && !isSelected ? 'opacity-50 cursor-not-allowed' : ''
                    }\`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{option}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {votes[key]} votes ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: \`\${percentage}%\` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                <p className="text-green-800 dark:text-green-200">
                  ✓ Thanks for voting, {displayName}! You selected: {selectedOption}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
`;
}

export function generateNFTGalleryPage(config: MiniAppConfig): string {
  return `'use client';

import { useMiniKit } from '@coinbase/onchainkit';
import { useQuickAuth } from '@/hooks/useQuickAuth';
import { useState } from 'react';

interface NFT {
  id: number;
  name: string;
  image: string;
  description: string;
}

const mockNFTs: NFT[] = [
  { id: 1, name: 'NFT #1', image: 'https://via.placeholder.com/300', description: 'A beautiful NFT' },
  { id: 2, name: 'NFT #2', image: 'https://via.placeholder.com/300', description: 'Another amazing NFT' },
  { id: 3, name: 'NFT #3', image: 'https://via.placeholder.com/300', description: 'Stunning artwork' },
];

export default function Home() {
  const { user } = useMiniKit();
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const displayName = user?.displayName || 'Friend';
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-pink-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">${config.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">${config.description}</p>
            <button
              onClick={signIn}
              disabled={isLoading}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In to View Gallery'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-pink-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">
              ${config.name}
            </h1>
            <button
              onClick={signOut}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Sign Out
            </button>
          </div>
          
          {userData && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
              Authenticated as FID: {userData.fid}
            </p>
          )}
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Welcome, {displayName}! Browse the collection below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNFTs.map((nft) => (
              <div
                key={nft.id}
                onClick={() => setSelectedNFT(nft)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{nft.description}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedNFT && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="w-full rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{selectedNFT.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedNFT.description}</p>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
`;
}

