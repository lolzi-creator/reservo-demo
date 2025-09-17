'use client';

import { Space_Grotesk } from 'next/font/google';
import Head from 'next/head';
import './globals.css';
import Navigation from '@/components/Navigation';
import Silk from '@/components/Silk';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Reservo Demo - Smarter Reservations</title>
        <meta name="description" content="A demo reservation tool with AI assistant parsing" />
      </Head>
        <body className={`${spaceGrotesk.className} text-white min-h-screen`}>
        {/* Global Silk Background */}
        <div className="fixed inset-0 w-full h-full z-0">
          <Silk 
            speed={3}
            scale={1.2}
            color="#6B7280"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
        
        {/* Fallback background in case Silk doesn't load */}
        <div className="fixed inset-0 w-full h-full z-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-50"></div>

        <div className="flex flex-col min-h-screen relative z-10">
          <Navigation />
          <main className="flex-1 relative pb-20 md:pb-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}