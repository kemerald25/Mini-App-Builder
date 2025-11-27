'use client';

import { useState } from 'react';
import MiniAppForm from '@/components/MiniAppForm';
import { MiniAppConfig } from '@/types';
import { useQuickAuth } from '@/hooks/useQuickAuth';

export default function Home() {
  const { token, userData, signIn, signOut, isAuthenticated, isLoading } = useQuickAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [appName, setAppName] = useState<string>('');

  const handleGenerate = async (config: MiniAppConfig) => {
    setIsGenerating(true);
    setAppName(config.name);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Mini App');
      }

      // Get the zip file as a blob
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Use the filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'miniapp.zip';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      } else {
        const safeName = config.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        filename = `${safeName || 'miniapp'}.zip`;
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    } catch (error) {
      console.error('Error generating Mini App:', error);
      alert('Failed to generate Mini App. Please try again.');
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Mini App Builder</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate production-ready Next.js Mini Apps for Base
            </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Mini App Builder
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Generate production-ready Next.js Mini Apps for Base
              </p>
            </div>
            <div className="text-right">
              {userData && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  FID: {userData.fid}
                </p>
              )}
              <button
                onClick={signOut}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {isGenerating ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-lg font-semibold">Generating your Mini App...</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">This may take a few seconds</p>
            </div>
          ) : (
            <>
              {appName && (
                <div className="mb-6 bg-green-100 dark:bg-green-900 border border-green-500 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">✅ Download Complete!</h2>
                      <p className="text-green-800 dark:text-green-200 mb-4">
                        Your Mini App <strong>{appName}</strong> has been generated and downloaded as a ZIP file.
                      </p>
                      
                      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mt-4">
                        <h3 className="font-semibold mb-2">Next Steps:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Extract the ZIP file to a new directory</li>
                          <li>Copy <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.example</code> to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.local</code> and add your OnchainKit API key</li>
                          <li>Run <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm install</code></li>
                          <li>Run <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm run dev</code></li>
                          <li>Update the manifest at <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">public/.well-known/farcaster.json</code> with your production URLs</li>
                          <li>Verify your manifest at <a href="https://base.dev/preview" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">base.dev/preview</a></li>
                        </ol>
                      </div>
                    </div>
                    <button
                      onClick={() => setAppName('')}
                      className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              )}
              
              <MiniAppForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
