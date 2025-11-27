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
    // Check if sdk is available and initialized
    return typeof sdk !== 'undefined' && sdk !== null;
  } catch {
    return false;
  }
}

export function useQuickAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userData: null,
    isLoading: false,
  });

  const isMiniapp = isFarcasterMiniapp();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const addressRef = useRef(address);

  // Keep address ref in sync
  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  async function signIn() {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      if (isMiniapp) {
        // Use Quick Auth for Farcaster miniapp
        const { token } = await sdk.quickAuth.getToken();
        
        const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || window.location.origin;
        const response = await sdk.quickAuth.fetch(\`\${backendOrigin}/api/auth\`, {
          headers: { 'Authorization': \`Bearer \${token}\` }
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        
        setAuthState({
          token,
          userData: data,
          isLoading: false,
        });
      } else {
        // Use Reown AppKit (WalletConnect) for browser
        let currentAddress = addressRef.current;
        
        if (!isConnected || !currentAddress) {
          // Open AppKit modal to connect wallet
          open();
          
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
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }

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

// This endpoint handles both Quick Auth (Farcaster miniapp) and WalletConnect (browser) authentication
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authorization.split(' ')[1];

  try {
    // Try Quick Auth verification first (for Farcaster miniapp)
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

// POST endpoint for WalletConnect authentication (browser)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, message, signature } = body;

    if (!address || !message || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the signature
    const isValid = await verifyMessage({
      address: address as \`0x\${string}\`,
      message,
      signature: signature as \`0x\${string}\`,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Return authenticated user data
    // In a real app, you might want to create a session token here
    return NextResponse.json({
      address,
      token: signature, // Using signature as token for simplicity
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
`;
}
