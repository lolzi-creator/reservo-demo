'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import GooeyNav from './GooeyNav';
import Dock from './Dock';

// Responsive navigation component
export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  // Removed mobile menu state since we're using dock now
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/book', label: 'Book' },
    { href: '/assistant', label: 'Assistant' },
    { href: '/admin', label: 'Admin' },
  ];

  // Create dock items with icons
  const dockItems = [
    {
      icon: (
        <svg className={`w-6 h-6 ${pathname === '/' ? 'text-blue-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Home',
      onClick: () => router.push('/'),
      className: pathname === '/' ? 'dock-item-active' : ''
    },
    {
      icon: (
        <svg className={`w-6 h-6 ${pathname === '/book' ? 'text-green-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Book',
      onClick: () => router.push('/book'),
      className: pathname === '/book' ? 'dock-item-active' : ''
    },
    {
      icon: (
        <svg className={`w-6 h-6 ${pathname === '/assistant' ? 'text-purple-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: 'Assistant',
      onClick: () => router.push('/assistant'),
      className: pathname === '/assistant' ? 'dock-item-active' : ''
    },
    {
      icon: (
        <svg className={`w-6 h-6 ${pathname === '/admin' ? 'text-orange-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: 'Admin',
      onClick: () => router.push('/admin'),
      className: pathname === '/admin' ? 'dock-item-active' : ''
    }
  ];

  // Update active index when pathname changes
  useEffect(() => {
    const newActiveIndex = navItems.findIndex(item => item.href === pathname);
    setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : 0);
  }, [pathname]);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="border-b border-white/10 relative z-50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link 
              href="/" 
              className="text-2xl font-light text-white tracking-wide"
            >
              RESERVO
            </Link>
            
            {/* Desktop Navigation - Gooey Nav */}
            <div className="hidden md:block relative z-50">
              <GooeyNav 
                items={navItems}
                initialActiveIndex={activeIndex >= 0 ? activeIndex : 0}
                animationTime={400}
                particleCount={12}
                colors={[1, 2, 3, 4]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dock Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <Dock 
          items={dockItems}
          magnification={60}
          distance={100}
          baseItemSize={48}
          panelHeight={64}
        />
      </div>
    </>
  );
}
