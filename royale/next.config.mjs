import path from 'path';
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
