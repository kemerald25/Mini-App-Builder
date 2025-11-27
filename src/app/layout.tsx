import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mini App Builder - Generate Base Mini Apps',
  description: 'AI-powered builder for creating production-ready Base Mini Apps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

