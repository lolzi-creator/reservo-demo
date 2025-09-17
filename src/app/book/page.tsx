'use client';

import { useState } from 'react';
import Link from 'next/link';
import Section from '@/components/Section';
import CustomStepper, { CustomStep } from '@/components/CustomStepper';
// import BookingForm from '@/components/BookingForm';
import Counter from '@/components/Counter';
import ClickSpark from '@/components/ClickSpark';
// import ElectricBorder from '@/components/ElectricBorder';
import SpotlightCard from '@/components/SpotlightCard';
import TimerDisplay from '@/components/TimerDisplay';
import { Booking, addBooking } from '@/lib/storage';
import { completeReservationTimer } from '@/lib/timer';

// Booking page with Stepper component
export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    dietaryRestrictions: '',
    occasion: '',
    preferredSeating: '',
    date: '',
    time: '',
    people: 1,
    agreedToTerms: false,
    marketingConsent: false
  });
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleFormUpdate = (data: Record<string, string | number>) => {
    setFormData({ ...formData, ...data });
  };

  const handleBookingSubmit = async () => {
    try {
      console.log('💾 Creating booking in Supabase...');
      
      // Complete the timer and get timing data
      const timerResult = completeReservationTimer();
      
      const newBooking = await addBooking({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        people: formData.people,
        completion_time: timerResult?.time || 0,
        booking_method: timerResult?.method || 'manual',
        start_time: new Date().toISOString()
      });

      if (!newBooking) {
        console.error('❌ Failed to create booking');
        alert('Failed to create booking. Please try again.');
        return;
      }

      console.log('✅ Booking created successfully:', newBooking);

      // Send confirmation email
      try {
        console.log('📧 Sending confirmation email...');
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBooking),
        });

        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          console.log('✅ Confirmation email sent successfully');
        } else {
          console.error('❌ Failed to send confirmation email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
      }
      
      setBooking(newBooking);
    } catch (error) {
      console.error('❌ Error in handleBookingSubmit:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const isFormValid = formData.name && formData.email && formData.phone && formData.date && formData.time && formData.people > 0 && formData.preferredSeating && formData.agreedToTerms;

  return (
    <Section className="py-8 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-6">
            <TimerDisplay showMethod={true} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4 md:mb-6">
            Manual Booking Process
          </h1>
          <p className="text-white/80 text-base md:text-lg font-light">
            Complete all required steps and forms to secure your table reservation
          </p>
          <p className="text-white/60 text-sm mt-2">
            This comprehensive process ensures we have all details for your perfect dining experience
          </p>
        </div>

        <div className="card">
          <CustomStepper onComplete={handleBookingSubmit} hideNavigation={!!booking}>
            {/* Step 1: Personal Information */}
            <CustomStep>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4 md:mb-6">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormUpdate({ name: e.target.value })}
                      className="input-field w-full"
                      placeholder="Enter your full legal name"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1">Must match government ID</p>
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormUpdate({ email: e.target.value })}
                      className="input-field w-full"
                      placeholder="Enter your email"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1">Confirmation will be sent here</p>
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFormUpdate({ phone: e.target.value })}
                      className="input-field w-full"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1">For reservation updates and confirmations</p>
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Special Occasion
                    </label>
                    <select
                      value={formData.occasion}
                      onChange={(e) => handleFormUpdate({ occasion: e.target.value })}
                      className="input-field w-full"
                    >
                      <option value="">Select an occasion</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="business">Business Meeting</option>
                      <option value="date">Date Night</option>
                      <option value="celebration">Celebration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 font-medium mb-2">
                    Dietary Restrictions & Allergies
                  </label>
                  <textarea
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleFormUpdate({ dietaryRestrictions: e.target.value })}
                    className="input-field w-full h-24"
                    placeholder="Please list any dietary restrictions, allergies, or special requests..."
                  />
                  <p className="text-white/50 text-xs mt-1">Help us prepare the perfect dining experience</p>
                </div>
              </div>
            </CustomStep>

            {/* Step 2: Reservation Preferences */}
            <CustomStep>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4 md:mb-6">
                  Reservation Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Preferred Seating *
                    </label>
                    <select
                      value={formData.preferredSeating}
                      onChange={(e) => handleFormUpdate({ preferredSeating: e.target.value })}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Choose seating preference</option>
                      <option value="window">Window Table</option>
                      <option value="booth">Private Booth</option>
                      <option value="bar">Bar Seating</option>
                      <option value="patio">Outdoor Patio</option>
                      <option value="main">Main Dining Room</option>
                      <option value="quiet">Quiet Corner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Number of Guests *
                    </label>
                    <div className="flex items-center gap-4">
                      <ClickSpark sparkColor="#ef4444" sparkCount={3} sparkRadius={8}>
                        <button
                          type="button"
                          onClick={() => handleFormUpdate({ people: Math.max(1, formData.people - 1) })}
                          className="w-12 h-12 bg-red-600/20 border border-red-500/30 rounded-lg text-white hover:bg-red-600/30 transition-colors"
                        >
                          −
                        </button>
                      </ClickSpark>
                      <div className="flex items-center justify-center w-20 h-12 bg-white/10 border border-white/20 rounded-lg">
                        <span className="text-white font-bold text-xl">{formData.people}</span>
                      </div>
                      <ClickSpark sparkColor="#10b981" sparkCount={3} sparkRadius={8}>
                        <button
                          type="button"
                          onClick={() => handleFormUpdate({ people: Math.min(12, formData.people + 1) })}
                          className="w-12 h-12 bg-green-600/20 border border-green-500/30 rounded-lg text-white hover:bg-green-600/30 transition-colors"
                        >
                          +
                        </button>
                      </ClickSpark>
                    </div>
                    <p className="text-white/50 text-xs mt-1">Maximum 12 guests per reservation</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 font-medium mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleFormUpdate({ specialRequests: e.target.value })}
                    className="input-field w-full h-32"
                    placeholder="Any special requests for your dining experience? (decorations, cake, specific table arrangements, etc.)"
                  />
                </div>
              </div>
            </CustomStep>

            {/* Step 2: Reservation Details */}
            <CustomStep>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4 md:mb-6">
                  Reservation Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleFormUpdate({ date: e.target.value })}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleFormUpdate({ time: e.target.value })}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Number of Guests *
                    </label>
                    <div className="flex items-center gap-4">
                      <ClickSpark sparkColor="#60a5fa" sparkCount={4} sparkRadius={10}>
                        <button
                          type="button"
                          onClick={() => handleFormUpdate({ people: Math.max(1, formData.people - 1) })}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-colors"
                        >
                          −
                        </button>
                      </ClickSpark>
                      <Counter 
                        value={formData.people} 
                        fontSize={24}
                        places={[10, 1]}
                        textColor="white"
                        containerStyle={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <ClickSpark sparkColor="#60a5fa" sparkCount={4} sparkRadius={10}>
                        <button
                          type="button"
                          onClick={() => handleFormUpdate({ people: Math.min(20, formData.people + 1) })}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-colors"
                        >
                          +
                        </button>
                      </ClickSpark>
                    </div>
                  </div>
                </div>
              </div>
            </CustomStep>

            {/* Step 3: Review & Confirm */}
            <CustomStep>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4 md:mb-6">
                  Review Your Reservation
                </h3>
                {booking ? (
                  // Success state
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl sm:text-3xl font-light text-white mb-6 sm:mb-8 px-4 sm:px-0">
                      Reservation Confirmed!
                    </h4>
                    <SpotlightCard 
                      className="p-4 sm:p-6 mb-6 sm:mb-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl"
                      spotlightColor="rgba(96, 165, 250, 0.15)"
                    >
                      <div className="space-y-4 text-left">
                        {/* Name Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                          <span className="text-white/60 text-sm font-medium">Name:</span>
                          <span className="text-white font-medium text-base">{booking.name}</span>
                        </div>
                        
                        {/* Email Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                          <span className="text-white/60 text-sm font-medium">Email:</span>
                          <span className="text-white font-medium text-sm sm:text-base break-all">{booking.email}</span>
                        </div>
                        
                        {/* Date Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                          <span className="text-white/60 text-sm font-medium">Date:</span>
                          <span className="text-white font-medium text-base">{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Time Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                          <span className="text-white/60 text-sm font-medium">Time:</span>
                          <span className="text-white font-medium text-base">{booking.time}</span>
                        </div>
                        
                        {/* Guests Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                          <span className="text-white/60 text-sm font-medium">Guests:</span>
                          <span className="text-white font-medium text-base">{booking.people}</span>
                        </div>
                        
                        {/* Reference Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-t border-white/10 pt-3 mt-4">
                          <span className="text-white/60 text-sm font-medium">Reference:</span>
                          <span className="text-white font-mono text-xs sm:text-sm bg-white/10 px-2 py-1 rounded break-all">{booking.id}</span>
                        </div>
                      </div>
                    </SpotlightCard>
                    <div className="flex justify-center">
                      <ClickSpark sparkColor="#ffffff" sparkCount={6} sparkRadius={15}>
                        <Link href="/book" className="btn-primary">
                          New Reservation
                        </Link>
                      </ClickSpark>
                    </div>
                  </div>
                ) : (
                  // Review state
                  <div>
                    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
                      <div className="space-y-4">
                        {/* Name */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b border-white/10">
                          <span className="text-white/60 font-medium text-sm">Name:</span>
                          <span className="text-white font-medium text-base">{formData.name || '—'}</span>
                        </div>
                        
                        {/* Email */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b border-white/10">
                          <span className="text-white/60 font-medium text-sm">Email:</span>
                          <span className="text-white font-medium text-sm sm:text-base break-all">{formData.email || '—'}</span>
                        </div>
                        
                        {/* Date */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b border-white/10">
                          <span className="text-white/60 font-medium text-sm">Date:</span>
                          <span className="text-white font-medium text-base">
                            {formData.date ? new Date(formData.date).toLocaleDateString() : '—'}
                          </span>
                        </div>
                        
                        {/* Time */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2 border-b border-white/10">
                          <span className="text-white/60 font-medium text-sm">Time:</span>
                          <span className="text-white font-medium text-base">{formData.time || '—'}</span>
                        </div>
                        
                        {/* Guests */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 py-2">
                          <span className="text-white/60 font-medium text-sm">Guests:</span>
                          <span className="text-white font-medium text-base">{formData.people}</span>
                        </div>
                      </div>
                    </div>
                    {!isFormValid && (
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                        <p className="text-red-300 text-sm">
                          Please complete all required fields before confirming your reservation.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CustomStep>
          </CustomStepper>
        </div>
      </div>
    </Section>
  );
}
