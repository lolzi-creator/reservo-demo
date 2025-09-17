'use client';

import { useState, useEffect } from 'react';
import { getElapsedTime, formatTime, getTimerData } from '@/lib/timer';

interface TimerDisplayProps {
  showMethod?: boolean;
  className?: string;
}

export default function TimerDisplay({ showMethod = false, className = '' }: TimerDisplayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [method, setMethod] = useState<'ai' | 'manual'>('manual');

  useEffect(() => {
    // Initial setup
    const timerData = getTimerData();
    if (timerData) {
      setMethod(timerData.method);
    }

    // Update every second
    const interval = setInterval(() => {
      const currentElapsed = getElapsedTime();
      setElapsed(currentElapsed);
      
      const currentTimerData = getTimerData();
      if (currentTimerData) {
        setMethod(currentTimerData.method);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (elapsed === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-white font-mono text-sm font-medium">
          {formatTime(elapsed)}
        </span>
        {showMethod && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            method === 'ai' 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-orange-500/20 text-orange-300'
          }`}>
            {method === 'ai' ? 'AI' : 'Manual'}
          </span>
        )}
      </div>
    </div>
  );
}
