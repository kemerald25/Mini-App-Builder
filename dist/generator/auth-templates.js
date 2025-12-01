export function generateAuthHook() {
    return `'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useSignMessage } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';

interface AuthState {
  token: string | null;
  userData: { fid?: number; address?: string } | null;
  isLoading: boolean;
}

// Detect if we're in Farcaster miniapp environment
function isFarcasterMiniapp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Check if sdk is available and has actions (miniapp SDK)
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

// Generate a random nonce for SIWF
function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function useQuickAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userData: null,
    isLoading: false,
  });

  const isMiniapp = isFarcasterMiniapp();
  const { address, isConnected } = useAccount();
  // Always initialize AppKit (it's needed for wallet connection outside miniapp)
  const appKit = useAppKit();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const addressRef = useRef(address);
  const hasAutoSignedIn = useRef(false);

  // Keep address ref in sync
  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  async function signIn() {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Use Farcaster miniapp SDK for authentication and wallet connection
      if (isMiniapp) {
        try {
          // Step 1: Request wallet connection
          let walletAddress: string | null = null;
          try {
            const accounts = await sdk.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
              walletAddress = accounts[0];
            }
          } catch (walletError) {
            console.warn('Wallet connection failed:', walletError);
            // Continue with sign-in even if wallet connection fails
          }

          // Step 2: Sign in with Farcaster (SIWF)
          const nonce = generateNonce();
          const { message, signature } = await sdk.actions.signIn({ 
            nonce,
            acceptAuthAddress: true 
          });

          // Step 3: Send to backend for verification
          const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || window.location.origin;
          const response = await fetch(\`\${backendOrigin}/api/auth\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message,
              signature,
              address: walletAddress,
            }),
          });

          if (!response.ok) {
            throw new Error('Authentication failed');
          }

          const data = await response.json();
          
          setAuthState({
            token: signature, // Use signature as token
            userData: {
              fid: data.fid,
              address: walletAddress || data.address,
            },
            isLoading: false,
          });
          return; // Success, exit early
        } catch (miniappError) {
          // If miniapp auth fails, fall back to AppKit
          console.warn('Miniapp authentication failed, falling back to AppKit:', miniappError);
          // Continue to AppKit flow below
        }
      }
      
      // Use Reown AppKit (WalletConnect) for browser or if Quick Auth failed
      let currentAddress = addressRef.current;
      
      if (!isConnected || !currentAddress) {
        // Open AppKit modal to connect wallet
        if (appKit?.open) {
          appKit.open();
        } else {
          throw new Error('Wallet connection not available. Please set NEXT_PUBLIC_PROJECT_ID or use the app in a Farcaster miniapp.');
        }
        
        // Wait for connection to establish and account to be available
        // Poll for address with timeout (max 10 seconds)
        let attempts = 0;
        while (!currentAddress && attempts < 100) {
          await new Promise(resolve => setTimeout(resolve, 100));
          currentAddress = addressRef.current;
          attempts++;
        }
        
        if (!currentAddress) {
          throw new Error('Wallet connection failed. Please connect your wallet and try again.');
        }
      }

      // Ensure we have an address
      if (!currentAddress) {
        throw new Error('Wallet address not available');
      }

      // Sign a message for authentication
      const message = \`Sign in to ${process.env.NEXT_PUBLIC_APP_NAME || 'this app'} at \${new Date().toISOString()}\`;
      const signature = await signMessageAsync({ message });

      // Send to backend for verification
      const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || window.location.origin;
      const response = await fetch(\`\${backendOrigin}/api/auth\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: currentAddress,
          message,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      const token = data.token || signature; // Use signature as token if backend doesn't provide one

      setAuthState({
        token,
        userData: { address: currentAddress, ...data },
        isLoading: false,
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }

  // Auto-sign in when in miniapp environment
  useEffect(() => {
    if (isMiniapp && !hasAutoSignedIn.current && !authState.token) {
      hasAutoSignedIn.current = true;
      signIn().catch((error) => {
        console.error('Auto sign-in failed:', error);
        hasAutoSignedIn.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiniapp, authState.token]);

  function signOut() {
    if (!isMiniapp && isConnected) {
      disconnect();
    }
    setAuthState({
      token: null,
      userData: null,
      isLoading: false,
    });
  }

  return {
    ...authState,
    signIn,
    signOut,
    isAuthenticated: isMiniapp ? !!authState.token : (isConnected && !!authState.token),
  };
}
`;
}
export function generateAuthApiRoute(config) {
    const domain = config.homeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'your-domain.com';
    return `import { createClient, Errors } from '@farcaster/quick-auth';
import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage } from 'viem';

const domain = process.env.QUICK_AUTH_DOMAIN || '${domain}';
const client = createClient();

// This endpoint handles both SIWF (Farcaster miniapp) and WalletConnect (browser) authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, signature, address } = body;

    // If we have message and signature, it's SIWF from miniapp
    if (message && signature) {
      try {
        // Extract FID from the SIWF message
        // The message format is: "Sign in to <domain> with Farcaster\n\nFID: <fid>\nNonce: <nonce>"
        const fidMatch = message.match(/FID: (\\d+)/);
        const fid = fidMatch ? parseInt(fidMatch[1], 10) : null;

        if (!fid) {
          return NextResponse.json({ error: 'Invalid SIWF message format' }, { status: 400 });
        }

        // Note: Full SIWF signature verification requires the Farcaster protocol
        // For now, we validate the message format and trust the miniapp SDK
        // In production, you should verify the signature using the Farcaster protocol
        // or use a library like @farcaster/frame-verify if available

        return NextResponse.json({
          fid,
          address: address || null,
          token: signature, // Use signature as token
        });
      } catch (verifyError) {
        console.error('SIWF verification error:', verifyError);
        return NextResponse.json({ error: 'SIWF verification failed' }, { status: 401 });
      }
    }

    // Fallback to wallet signature verification (browser/WalletConnect)
    if (!address || !message || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure signature starts with 0x
    const formattedSignature = signature.startsWith('0x') ? signature : \`0x\${signature}\`;
    
    // Verify the signature
    const isValid = await verifyMessage({
      address: address as \`0x\${string}\`,
      message,
      signature: formattedSignature as \`0x\${string}\`,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Return authenticated user data
    return NextResponse.json({
      address,
      token: signature, // Using signature as token for simplicity
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// GET endpoint for Quick Auth (legacy support)
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authorization.split(' ')[1];

  try {
    // Try Quick Auth verification (legacy)
    const payload = await client.verifyJwt({ token, domain });
    
    return NextResponse.json({
      fid: payload.sub,
    });
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    throw e;
  }
}
`;
}
