'use client';

import { useState } from 'react';
import { addBooking, Booking } from '@/lib/storage';

interface BookingFormProps {
  onSuccess?: (booking: Booking) => void;
  onReset?: () => void;
}

// Reusable booking form component
export default function BookingForm({ onSuccess, onReset }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    people: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'people' ? parseInt(value) || 1 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (formData.people < 1) {
      newErrors.people = 'At least 1 person is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const booking = await addBooking(formData);
      if (booking) {
        onSuccess?.(booking);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          date: '',
          time: '',
          people: 1
        });
        setErrors({});
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      date: '',
      time: '',
      people: 1
    });
    setErrors({});
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-3">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input-field ${
            errors.name ? 'border-red-500' : ''
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-3">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`input-field ${
            errors.email ? 'border-red-500' : ''
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-white/80 mb-3">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`input-field ${
              errors.date ? 'border-red-500' : ''
            }`}
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-400">{errors.date}</p>
          )}
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-white/80 mb-3">
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`input-field ${
              errors.time ? 'border-red-500' : ''
            }`}
          />
          {errors.time && (
            <p className="mt-2 text-sm text-red-400">{errors.time}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="people" className="block text-sm font-medium text-white/80 mb-3">
          Number of Guests
        </label>
        <input
          type="number"
          id="people"
          name="people"
          min="1"
          max="20"
          value={formData.people}
          onChange={handleChange}
          className={`input-field ${
            errors.people ? 'border-red-500' : ''
          }`}
        />
        {errors.people && (
          <p className="mt-2 text-sm text-red-400">{errors.people}</p>
        )}
      </div>

      <div className="flex gap-6 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-primary"
        >
          {isSubmitting ? 'Processing...' : 'Create Reservation'}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="btn-ghost"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
}
