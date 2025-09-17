'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

// QR Code component that renders a QR code for any provided URL
export default function QRCode({ url, size = 128, className = '' }: QRCodeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-3 ${className}`}
        style={{ width: size + 24, height: size + 24 }}
      >
        <div className="w-full h-full bg-white/10 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-3 ${className}`}>
      <QRCodeSVG
        value={url}
        size={size}
        level="M"
        includeMargin={false}
      />
    </div>
  );
}
