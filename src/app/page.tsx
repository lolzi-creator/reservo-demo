'use client';

import Link from 'next/link';
import Section from '@/components/Section';
import QRCode from '@/components/QRCode';
import Silk from '@/components/Silk';
import TimerDisplay from '@/components/TimerDisplay';
import { useState, useEffect } from 'react';
import { startReservationTimer, updateBookingMethod } from '@/lib/timer';

// Landing page with hero section and CTA buttons
export default function HomePage() {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Set QR code URL to absolute path
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}/book`);
    }
    
    // Start the reservation timer when user lands on homepage
    startReservationTimer('manual');
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
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
      
      {/* Hero Section */}
      <Section className="flex-1 flex items-center justify-center py-20 relative z-10">
        <div className="text-center space-y-16 max-w-4xl mx-auto">
          {/* Timer Display */}
          <div className="flex justify-center">
            <TimerDisplay showMethod={true} />
          </div>
          
          <div className="space-y-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light text-white tracking-tight">
              RESERVO
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
              <strong>Speed Challenge:</strong> How fast can you make a reservation?
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Compare AI vs Manual booking speeds. Try both methods and see who&apos;s faster!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/book" 
              className="btn-primary text-lg px-10 py-4"
              onClick={() => updateBookingMethod('manual')}
            >
              Manual Booking
            </Link>
            <Link 
              href="/assistant" 
              className="btn-ghost text-lg px-10 py-4"
              onClick={() => updateBookingMethod('ai')}
            >
              AI Assistant
            </Link>
            <Link href="/admin" className="btn-ghost text-lg px-10 py-4">
              Management
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <div className="w-8 h-8 border-2 border-white rounded"></div>
              </div>
              <h3 className="text-xl font-medium text-white mb-4">
                Streamlined Booking
              </h3>
              <p className="text-white/70 leading-relaxed">
                Intuitive form-based reservation system with comprehensive validation
              </p>
            </div>

            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-medium text-white mb-4">
                AI Processing
              </h3>
              <p className="text-white/70 leading-relaxed">
                Advanced natural language parsing for efficient reservation handling
              </p>
            </div>

            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <div className="w-8 h-8 border-2 border-white"></div>
              </div>
              <h3 className="text-xl font-medium text-white mb-4">
                Admin Dashboard
              </h3>
              <p className="text-white/70 leading-relaxed">
                Comprehensive management interface for all reservation data
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer with QR Code */}
      <footer className="border-t border-white/10 relative z-10">
        <Section className="py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <p className="text-white/80 mb-2 font-medium">
                Quick Access
              </p>
              <p className="text-sm text-white/60">
                Scan QR code for instant reservation access
              </p>
            </div>
            
            {qrUrl && (
              <div className="flex flex-col items-center">
                <QRCode url={qrUrl} size={100} />
                <p className="text-xs text-white/60 mt-3 text-center font-medium">
                  Mobile Access
                </p>
              </div>
            )}
          </div>
        </Section>
      </footer>
    </div>
  );
}