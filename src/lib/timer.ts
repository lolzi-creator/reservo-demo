// Timer utilities for tracking reservation speed
'use client';

const TIMER_KEY = 'reservation_timer';

export interface TimerData {
  startTime: number;
  method: 'ai' | 'manual';
  currentPage: string;
}

// Start the timer when user lands on the site
export function startReservationTimer(method: 'ai' | 'manual' = 'manual'): void {
  if (typeof window === 'undefined') return;
  
  const timerData: TimerData = {
    startTime: Date.now(),
    method,
    currentPage: window.location.pathname
  };
  
  localStorage.setItem(TIMER_KEY, JSON.stringify(timerData));
}

// Get current timer data
export function getTimerData(): TimerData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(TIMER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading timer data:', error);
    return null;
  }
}

// Calculate elapsed time in seconds
export function getElapsedTime(): number {
  const timerData = getTimerData();
  if (!timerData) return 0;
  
  return Math.round((Date.now() - timerData.startTime) / 1000);
}

// Update the booking method (switch from manual to AI or vice versa)
export function updateBookingMethod(method: 'ai' | 'manual'): void {
  const timerData = getTimerData();
  if (!timerData) {
    startReservationTimer(method);
    return;
  }
  
  timerData.method = method;
  localStorage.setItem(TIMER_KEY, JSON.stringify(timerData));
}

// Complete the timer and return final time
export function completeReservationTimer(): { time: number; method: 'ai' | 'manual' } | null {
  const timerData = getTimerData();
  if (!timerData) return null;
  
  const completionTime = getElapsedTime();
  
  // Clear the timer
  localStorage.removeItem(TIMER_KEY);
  
  return {
    time: completionTime,
    method: timerData.method
  };
}

// Format time for display
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
}

// Get timer display for UI
export function getTimerDisplay(): string {
  const elapsed = getElapsedTime();
  return formatTime(elapsed);
}
