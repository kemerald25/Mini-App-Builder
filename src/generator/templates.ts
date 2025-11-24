import { MiniAppConfig, GeneratedFile } from '../types';

export function generateLayout(config: MiniAppConfig): string {
  return `import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import './globals.css';

export const metadata = {
  title: '${config.name}',
  description: '${config.description}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <OnchainKitProvider 
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''} 
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </body>
    </html>
  );
}
`;
}

export function generateManifest(config: MiniAppConfig): string {
  const manifest = {
    accountAssociation: {
      header: '',
      payload: '',
      signature: ''
    },
    frame: {
      version: '1',
      name: config.name,
      homeUrl: config.homeUrl,
      iconUrl: config.iconUrl || `${config.homeUrl}/icon.png`,
      splashImageUrl: `${config.homeUrl}/splash.png`,
      splashBackgroundColor: '#000000',
      webhookUrl: `${config.homeUrl}/api/webhook`,
      subtitle: config.description,
      description: config.description,
      screenshotUrls: [],
      primaryCategory: config.category,
      tags: [config.category, 'miniapp', 'base'],
      heroImageUrl: `${config.homeUrl}/og.png`,
      tagline: config.description,
      ogTitle: config.name,
      ogDescription: config.description,
      ogImageUrl: `${config.homeUrl}/og.png`,
      noindex: false
    }
  };

  return JSON.stringify(manifest, null, 2);
}

export function generateEnvExample(): string {
  return `NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
`;
}

export function generatePackageJson(config: MiniAppConfig): string {
  return `{
  "name": "${config.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@coinbase/onchainkit": "latest",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "wagmi": "^2.10.0",
    "viem": "^2.10.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.0"
  }
}
`;
}

export function generateTsConfig(): string {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
}

export function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`;
}

export function generateTailwindConfig(): string {
  return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
`;
}

export function generateGlobalsCSS(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;
    --foreground: #ffffff;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Inter, system-ui, -apple-system, sans-serif;
}
`;
}

