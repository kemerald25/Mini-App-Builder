import './globals.css';
import { headers } from 'next/headers';
import ContextProvider from '@/context';
import { OnchainKitWrapper } from '@/components/OnchainKitProvider';

export const metadata = {
  title: 'Royale',
  description: 'Just a dev',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0B0D] text-white antialiased">
        <ContextProvider cookies={cookies}>
          <OnchainKitWrapper>
            {children}
          </OnchainKitWrapper>
        </ContextProvider>
      </body>
    </html>
  );
}
