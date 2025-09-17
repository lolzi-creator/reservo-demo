'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/Section';
import { getBookings, Booking, onNewBooking, NotificationEvent } from '@/lib/storage';
import FadeContent from '@/components/FadeContent';
import ElectricBorder from '@/components/ElectricBorder';
import AdminLogin from '@/components/AdminLogin';
import { isAdminAuthenticated, logoutAdmin } from '@/lib/auth';

// Admin page showing all bookings in a table
export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [newBookingIds, setNewBookingIds] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAdminAuthenticated();
      setIsAuthenticated(authenticated);
      setAuthChecked(true);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    // Only load bookings if authenticated
    if (!isAuthenticated) return;

    // Load bookings from Supabase
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        console.log('📊 Admin: Loading bookings from Supabase...');
        const allBookings = await getBookings();
        // Bookings are already sorted by created_at desc in getBookings()
        setBookings(allBookings);
        console.log('✅ Admin: Loaded', allBookings.length, 'bookings');
      } catch (error) {
        console.error('❌ Admin: Error loading bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadBookings();

    // Subscribe to real-time booking notifications
    console.log('🎯 Admin page: Setting up Supabase realtime listener');
    const unsubscribe = onNewBooking((event: NotificationEvent) => {
      console.log('🎉 Admin page: Received realtime notification!', event);
      
      // Add notification toast
      setNotifications(prev => [event, ...prev.slice(0, 4)]); // Keep only last 5 notifications
      
      // Mark booking as new for visual indication
      setNewBookingIds(prev => new Set([...prev, event.booking.id]));
      
      // Refresh bookings list from database
      loadBookings();
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.timestamp !== event.timestamp));
      }, 5000);
      
      // Auto-remove new booking indicator after 10 seconds
      setTimeout(() => {
        setNewBookingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(event.booking.id);
          return newSet;
        });
      }, 10000);
    });

    return unsubscribe;
  }, [isAuthenticated]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setBookings([]);
    setNotifications([]);
    setNewBookingIds(new Set());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getShortId = (id: string) => {
    return id.slice(-6); // Last 6 characters
  };

  // Show login screen if not authenticated
  if (!authChecked) {
    return (
      <Section className="py-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-white/60 mt-4">Checking authentication...</p>
        </div>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <Section className="py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading bookings...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <div className="max-w-6xl mx-auto">
        {/* Live Notifications */}
        <div className="fixed top-6 right-6 z-50 space-y-3">
          {notifications.map((notification) => (
            <FadeContent key={notification.timestamp} duration={400}>
              <ElectricBorder color="#60a5fa" speed={0.15} chaos={0.4}>
                <div className="bg-black/80 backdrop-blur-xl border border-white/20 text-white p-5 rounded-2xl shadow-2xl min-w-[320px] max-w-[380px]">
                  <div className="flex items-start gap-4">
                    {/* Animated Icon */}
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">New Reservation</h4>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-white/60 font-mono">#{notification.booking.id.slice(-6)}</span>
                        </div>
                      </div>
                      
                      {/* Guest Info */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-white/90">
                          <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium truncate">{notification.booking.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white/70">
                          <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{notification.booking.people} {notification.booking.people === 1 ? 'guest' : 'guests'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white/70">
                          <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(notification.booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {notification.booking.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </ElectricBorder>
            </FadeContent>
          ))}
        </div>

        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-light text-white mb-6">
              Admin Panel
            </h1>
            <p className="text-white/80 text-lg font-light">
              View and manage all reservations
              {notifications.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live notifications active
                </span>
              )}
            </p>
          </div>
          
          {/* Logout Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200 text-sm"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-2 border-white"></div>
            </div>
            <h2 className="text-2xl font-medium text-white mb-4">
              No Reservations Yet
            </h2>
            <p className="text-white/60 mb-8 font-light">
              Bookings will appear here once customers make reservations
            </p>
            <div className="text-sm text-white/50">
              Total bookings: <span className="font-semibold text-white/80">0</span>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                All Reservations
              </h2>
              <div className="text-sm text-white/60">
                Total: <span className="font-semibold text-white/80">{bookings.length}</span>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/80">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/80">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/80">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/80">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/80">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-white/80">
                      People
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const isNew = newBookingIds.has(booking.id);
                    return (
                      <tr 
                        key={booking.id} 
                        className={`border-b border-neutral-800 hover:bg-neutral-800/50 transition-all duration-500 ${
                          isNew ? 'bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-transparent animate-pulse shadow-lg shadow-blue-500/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-sm text-white/60 font-mono relative">
                          {isNew && (
                            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {getShortId(booking.id)}
                            {isNew && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`py-3 px-4 text-sm font-medium ${isNew ? 'text-blue-300' : 'text-white'}`}>
                          <div className="flex items-center gap-2">
                            {booking.name}
                            {isNew && (
                              <svg className="w-4 h-4 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td className={`py-3 px-4 text-sm ${isNew ? 'text-blue-200' : 'text-white/80'}`}>
                          {booking.email}
                        </td>
                        <td className={`py-3 px-4 text-sm ${isNew ? 'text-blue-200' : 'text-white/80'}`}>
                          {formatDate(booking.date)}
                        </td>
                        <td className={`py-3 px-4 text-sm ${isNew ? 'text-blue-200' : 'text-white/80'}`}>
                          {formatTime(booking.time)}
                        </td>
                        <td className={`py-3 px-4 text-sm ${isNew ? 'text-blue-200' : 'text-white/80'}`}>
                          <div className="flex items-center gap-2">
                            {booking.people}
                            {isNew && (
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {bookings.map((booking) => {
                const isNew = newBookingIds.has(booking.id);
                return (
                  <div 
                    key={booking.id} 
                    className={`rounded-xl p-4 transition-all duration-500 relative ${
                      isNew 
                        ? 'bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-neutral-800 border border-blue-500/30 shadow-lg shadow-blue-500/20' 
                        : 'bg-neutral-800'
                    }`}
                  >
                    {isNew && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/30 text-blue-300 border border-blue-500/50 animate-pulse">
                          ⚡ NEW
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-3 pr-16">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${isNew ? 'text-blue-300' : 'text-white'}`}>
                          {booking.name}
                        </h3>
                        {isNew && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <span className={`text-xs font-mono ${isNew ? 'text-blue-400' : 'text-white/60'}`}>
                        ID: {getShortId(booking.id)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Email:</span>
                        <span className={isNew ? 'text-blue-200' : 'text-white/80'}>{booking.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Date:</span>
                        <span className={isNew ? 'text-blue-200' : 'text-white/80'}>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Time:</span>
                        <span className={isNew ? 'text-blue-200' : 'text-white/80'}>{formatTime(booking.time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">People:</span>
                        <div className="flex items-center gap-2">
                          <span className={isNew ? 'text-blue-200' : 'text-white/80'}>{booking.people}</span>
                          {isNew && (
                            <svg className="w-3 h-3 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isNew && (
                      <div className="mt-3 w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
