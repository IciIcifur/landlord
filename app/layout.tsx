import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { Providers } from '@/app/providers';
import { montserrat } from '@/public/fonts/fonts';

export const metadata: Metadata = {
  title: 'LandLord',
  description: 'A web-app for rental tracking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${montserrat.className} h-screen bg-default-50 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
