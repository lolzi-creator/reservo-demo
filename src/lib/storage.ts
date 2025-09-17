// Storage utilities for managing bookings with Supabase
import { supabase } from './supabase';
import { sendBookingConfirmation } from './email';

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  people: number;
  created_at?: string;
  completion_time?: number; // Time in seconds to complete reservation
  booking_method?: 'ai' | 'manual'; // Track if AI or manual booking
  start_time?: string; // When user started the booking process
}

export interface NotificationEvent {
  type: 'new_booking';
  booking: Booking;
  timestamp: number;
}

type NotificationCallback = (event: NotificationEvent) => void;
const notificationListeners: NotificationCallback[] = [];

// Get all bookings from Supabase
export async function getBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// Add a new booking to Supabase
export async function addBooking(booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding booking:', error);
      return null;
    }

    const newBooking = data as Booking;
    
    // Send email confirmation
    try {
      await sendBookingConfirmation(newBooking);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking if email fails
    }
    
    // Trigger real-time notification
    notificationListeners.forEach(callback => {
      callback({
        type: 'new_booking',
        booking: newBooking,
        timestamp: Date.now()
      });
    });
    
    return newBooking;
  } catch (error) {
    console.error('Error adding booking:', error);
    return null;
  }
}

// Subscribe to new booking notifications
export function onNewBooking(callback: NotificationCallback): () => void {
  notificationListeners.push(callback);
  
  // Set up Supabase real-time subscription
  const channel = supabase
    .channel('bookings-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bookings'
      },
      (payload) => {
        const newBooking = payload.new as Booking;
        callback({
          type: 'new_booking',
          booking: newBooking,
          timestamp: Date.now()
        });
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    const index = notificationListeners.indexOf(callback);
    if (index > -1) {
      notificationListeners.splice(index, 1);
    }
    supabase.removeChannel(channel);
  };
}

// Clear all bookings (useful for testing)
export async function clearBookings(): Promise<void> {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .gte('id', 0); // Delete all records
    
    if (error) {
      console.error('Error clearing bookings:', error);
    }
  } catch (error) {
    console.error('Error clearing bookings:', error);
  }
}