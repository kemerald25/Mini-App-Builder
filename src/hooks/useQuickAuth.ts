'use client';

import { useState } from 'react';
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
      const response = await sdk.quickAuth.fetch(`${backendOrigin}/api/auth`, {
        headers: { 'Authorization': `Bearer ${token}` }
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

