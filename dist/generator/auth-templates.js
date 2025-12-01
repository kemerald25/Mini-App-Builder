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

// Storage keys for persisting auth state
const AUTH_TOKEN_KEY = 'farcaster_auth_token';
const AUTH_USER_DATA_KEY = 'farcaster_auth_user_data';

// Load persisted auth state from storage
function loadAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { token: null, userData: null, isLoading: false };
  }
  
  try {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const userDataStr = sessionStorage.getItem(AUTH_USER_DATA_KEY);
    const userData = userDataStr ? JSON.parse(userDataStr) : null;
    
    return {
      token,
      userData,
      isLoading: false,
    };
  } catch {
    return { token: null, userData: null, isLoading: false };
  }
}

// Save auth state to storage
function saveAuthState(token: string | null, userData: { fid?: number; address?: string } | null) {
  if (typeof window === 'undefined') return;
  
  try {
    if (token) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
    
    if (userData) {
      sessionStorage.setItem(AUTH_USER_DATA_KEY, JSON.stringify(userData));
    } else {
      sessionStorage.removeItem(AUTH_USER_DATA_KEY);
    }
  } catch (error) {
    console.warn('Failed to save auth state:', error);
  }
}

export function useQuickAuth() {
  const [authState, setAuthState] = useState<AuthState>(loadAuthState);

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
  
  // Update persisted state when authState changes
  useEffect(() => {
    saveAuthState(authState.token, authState.userData);
  }, [authState.token, authState.userData]);

  async function signIn() {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Use Farcaster miniapp SDK for authentication
      // Note: Wallet connection is handled automatically by wagmi in miniapp environment
      if (isMiniapp) {
        try {
          // Sign in with Farcaster (SIWF)
          const nonce = generateNonce();
          const { message, signature } = await sdk.actions.signIn({ 
            nonce,
            acceptAuthAddress: true 
          });

          // Send to backend for verification
          const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || window.location.origin;
          const response = await fetch(\`\${backendOrigin}/api/auth\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message,
              signature,
              address: address || null, // Use wagmi's address if available
            }),
          });

          if (!response.ok) {
            throw new Error('Authentication failed');
          }

          const data = await response.json();
          
          const newAuthState = {
            token: signature, // Use signature as token
            userData: {
              fid: data.fid,
              address: address || data.address || null,
            },
            isLoading: false,
          };
          
          setAuthState(newAuthState);
          saveAuthState(newAuthState.token, newAuthState.userData);
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

      const newAuthState = {
        token,
        userData: { address: currentAddress, ...data },
        isLoading: false,
      };
      
      setAuthState(newAuthState);
      saveAuthState(newAuthState.token, newAuthState.userData);
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }

  // Auto-sign in when in miniapp environment (only once per session)
  useEffect(() => {
    // Only auto-sign-in if:
    // 1. We're in a miniapp
    // 2. We haven't already attempted auto-sign-in
    // 3. We don't have a token (not authenticated)
    // 4. We're not currently loading
    if (isMiniapp && !hasAutoSignedIn.current && !authState.token && !authState.isLoading) {
      hasAutoSignedIn.current = true;
      signIn().catch((error) => {
        console.error('Auto sign-in failed:', error);
        hasAutoSignedIn.current = false;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiniapp]); // Only depend on isMiniapp, not authState.token to avoid re-triggering

  function signOut() {
    if (!isMiniapp && isConnected) {
      disconnect();
    }
    hasAutoSignedIn.current = false; // Reset so user can sign in again if needed
    setAuthState({
      token: null,
      userData: null,
      isLoading: false,
    });
    saveAuthState(null, null); // Clear persisted state
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

    // Check if this is a SIWF message from Farcaster miniapp
    // SIWF messages contain "FID:" in the message text
    const isSIWFMessage = message && signature && typeof message === 'string' && message.includes('FID:');
    
    if (isSIWFMessage) {
      try {
        // Extract FID from the SIWF message
        // SIWF message format: Sign in to <domain> with Farcaster followed by FID and Nonce
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
