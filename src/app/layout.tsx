import type { Metadata } from 'next';
import './globals.css';
import { headers } from 'next/headers';
import ContextProvider from '@/context';

export const metadata: Metadata = {
  title: 'Mini App Builder - Generate Base Mini Apps',
  description: 'AI-powered builder for creating production-ready Base Mini Apps',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}

