// Storage utilities for managing bookings in localStorage
// Handles SSR safety with window checks

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  people: number;
}

const STORAGE_KEY = 'bookings';

// Check if we're in browser environment
const isClient = typeof window !== 'undefined';

// Get all bookings from localStorage
export function getBookings(): Booking[] {
  if (!isClient) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading bookings from localStorage:', error);
    return [];
  }
}

// Add a new booking to localStorage
export function addBooking(booking: Omit<Booking, 'id'>): Booking {
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString()
  };
  
  if (!isClient) return newBooking;
  
  try {
    const existingBookings = getBookings();
    const updatedBookings = [...existingBookings, newBooking];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
    return newBooking;
  } catch (error) {
    console.error('Error saving booking to localStorage:', error);
    return newBooking;
  }
}

// Clear all bookings (useful for testing)
export function clearBookings(): void {
  if (!isClient) return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing bookings from localStorage:', error);
  }
}
