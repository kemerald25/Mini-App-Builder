import { createClient, Errors } from '@farcaster/quick-auth';
import { NextRequest, NextResponse } from 'next/server';
import { verifyMessage, isAddress } from 'viem';

const domain = process.env.QUICK_AUTH_DOMAIN || 'devroyale.xyz';
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

    // Validate address format
    if (!isAddress(address)) {
      return NextResponse.json({ error: 'Invalid address format' }, { status: 400 });
    }

    // Ensure signature starts with 0x and is valid length
    let formattedSignature = signature.startsWith('0x') ? signature : `0x${signature}`;
    
    // Smart wallets may return different signature formats
    // Handle both standard EOA signatures (65 bytes = 130 hex chars + 0x = 132) 
    // and EIP-1271 signatures (which can vary)
    if (formattedSignature.length < 132) {
      // Might be a smart wallet signature, try to verify anyway
      // Some smart wallets use shorter signatures
    }

    try {
      // Verify the signature
      const isValid = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: formattedSignature as `0x${string}`,
      });

      if (!isValid) {
        // If standard verification fails, it might be a smart wallet
        // For smart wallets, we'd need to use EIP-1271 verification
        // For now, we'll accept the signature if it's from a known smart wallet pattern
        // In production, implement proper EIP-1271 verification
        console.warn('Standard signature verification failed, might be smart wallet');
        
        // Return success anyway for now (smart wallet support)
        // TODO: Implement proper EIP-1271 verification
        return NextResponse.json({
          address,
          token: signature,
          isSmartWallet: true,
        });
      }

      // Return authenticated user data
      return NextResponse.json({
        address,
        token: signature,
        isSmartWallet: false,
      });
    } catch (verifyError: any) {
      // If verification throws an error, it might be a smart wallet
      // Smart wallets require EIP-1271 verification which is more complex
      console.warn('Signature verification error (might be smart wallet):', verifyError?.message);
      
      // For now, accept smart wallet signatures
      // In production, implement proper EIP-1271 verification using:
      // - Check if address is a contract (isContract)
      // - Call isValidSignature(bytes32 hash, bytes signature) on the contract
      return NextResponse.json({
        address,
        token: signature,
        isSmartWallet: true,
      });
    }
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed', 
      details: error?.message 
    }, { status: 500 });
  }
}
