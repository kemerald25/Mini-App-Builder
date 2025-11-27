import { MiniAppConfig } from '../types';

export function generateAuthHook(): string {
  return `'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface AuthState {
  token: string | null;
  userData: { fid: number } | null;
  isLoading: boolean;
}

export function useQuickAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userData: null,
    isLoading: false,
  });

  async function signIn() {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      const { token } = await sdk.quickAuth.getToken();
      
      // Use the token to authenticate the user and fetch authenticated user data
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
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }

  function signOut() {
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
    isAuthenticated: !!authState.token,
  };
}
`;
}

export function generateAuthApiRoute(config: MiniAppConfig): string {
  const domain = config.homeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'your-domain.com';
  
  return `import { createClient, Errors } from '@farcaster/quick-auth';
import { NextRequest, NextResponse } from 'next/server';

const domain = process.env.QUICK_AUTH_DOMAIN || '${domain}';
const client = createClient();

// This endpoint returns the authenticated user's FID
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authorization.split(' ')[1];

  try {
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

