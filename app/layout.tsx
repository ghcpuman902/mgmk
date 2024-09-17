import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Fira_Code } from 'next/font/google';
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Background } from './components/background';

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: "--font-fira-code",
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'URL shortener for mg.mk and mangl.es',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} font-sans antialiased bg-black`}>
        <Background/>
          {children}
        <Analytics />
      </body>
    </html>
  );
}