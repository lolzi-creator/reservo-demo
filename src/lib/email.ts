import { Resend } from 'resend';
import { Booking } from './storage';

// Initialize Resend - only on server side
let resend: Resend | null = null;
if (typeof window === 'undefined' && process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    // Check if we have Resend configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.log('='.repeat(50));
      console.log('📧 EMAIL WOULD BE SENT (DEMO MODE - NO API KEY)');
      console.log('='.repeat(50));
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Content Preview:', html.substring(0, 200) + '...');
      console.log('='.repeat(50));
      console.log('💡 To enable real email sending:');
      console.log('   1. Get API key from https://resend.com/');
      console.log('   2. Add to .env.local: RESEND_API_KEY=your_key_here');
      console.log('='.repeat(50));
      
      return { success: true, demo: true };
    }

    // Send real email via Resend
    console.log('📧 Sending real email via Resend...');
    
    const { data, error } = await resend.emails.send({
      from: 'Reservo <noreply@resend.dev>', // Using Resend's test domain
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('❌ Resend email error:', error);
      return { success: false, error };
    }

    console.log('✅ Email sent successfully via Resend!');
    console.log('   Email ID:', data?.id);
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error };
  }
}

export function generateBookingConfirmationEmail(booking: Booking): string {
  const date = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const time = new Date(`2000-01-01T${booking.time}`).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Confirmed - Reservo</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .email-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 30px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .logo {
          font-size: 32px;
          font-weight: 300;
          color: white;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          font-weight: 300;
        }
        .content {
          background: white;
          padding: 40px;
        }
        .confirmation-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          display: inline-block;
          font-weight: 600;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .booking-details {
          background: #f8fafc;
          border-radius: 16px;
          padding: 30px;
          margin: 30px 0;
          border-left: 4px solid #667eea;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detail-value {
          font-weight: 600;
          color: #1e293b;
        }
        .reference-id {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 14px;
        }
        .footer {
          background: #1e293b;
          padding: 30px;
          text-align: center;
          color: #94a3b8;
        }
        .footer-links {
          margin: 20px 0;
        }
        .footer-link {
          color: #60a5fa;
          text-decoration: none;
          margin: 0 15px;
        }
        .social-icons {
          margin: 20px 0;
        }
        @media (max-width: 600px) {
          .content {
            padding: 30px 20px;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <div class="logo">RESERVO</div>
          <div class="subtitle">Premium Reservation Experience</div>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="confirmation-badge">
            ✅ Reservation Confirmed
          </div>

          <h1 style="color: #1e293b; margin-bottom: 10px; font-weight: 600;">
            Hi ${booking.name}!
          </h1>
          
          <p style="color: #64748b; font-size: 16px; margin-bottom: 30px;">
            Thank you for choosing Reservo. Your table has been successfully reserved. 
            We're excited to welcome you for an exceptional dining experience.
          </p>

          <!-- Booking Details -->
          <div class="booking-details">
            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-weight: 600;">
              Reservation Details
            </h3>
            
            <div class="detail-row">
              <div class="detail-label">
                📅 Date
              </div>
              <div class="detail-value">${date}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                🕐 Time
              </div>
              <div class="detail-value">${time}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                👥 Party Size
              </div>
              <div class="detail-value">${booking.people} ${booking.people === 1 ? 'Guest' : 'Guests'}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                📧 Contact
              </div>
              <div class="detail-value">${booking.email}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                🆔 Reference ID
              </div>
              <div class="detail-value">
                <span class="reference-id">#${booking.id.slice(-6)}</span>
              </div>
            </div>
          </div>

          <!-- Important Information -->
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 30px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
              ⚠️ Important Information
            </h4>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>Please arrive 10 minutes before your reservation time</li>
              <li>If you need to cancel or modify, contact us at least 2 hours in advance</li>
              <li>Bring a valid ID for verification</li>
              <li>Our dress code is smart casual</li>
            </ul>
          </div>

          <!-- Contact Information -->
          <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
            <h4 style="color: #1e293b; margin: 0 0 10px 0;">
              Need to make changes?
            </h4>
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              Please contact us at least 2 hours before your reservation time.<br>
              Reference your booking ID: <strong>#${booking.id.slice(-6)}</strong>
            </p>
          </div>

          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 40px;">
            We look forward to providing you with an exceptional dining experience!
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div style="font-weight: 600; color: white; margin-bottom: 10px;">
            RESERVO
          </div>
          <div style="font-size: 14px; margin-bottom: 20px;">
            Premium Restaurant Reservations
          </div>
          
          <div class="footer-links">
            <a href="#" class="footer-link">Website</a>
            <a href="#" class="footer-link">Menu</a>
            <a href="#" class="footer-link">Contact</a>
            <a href="#" class="footer-link">Support</a>
          </div>
          
          <div style="font-size: 12px; color: #64748b; margin-top: 20px;">
            This email was sent regarding your reservation #${booking.id.slice(-6)}<br>
            If you did not make this reservation, please contact us immediately.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendBookingConfirmation(booking: Booking) {
  const emailHtml = generateBookingConfirmationEmail(booking);
  
  return await sendEmail({
    to: booking.email,
    subject: `Reservation Confirmed - ${new Date(booking.date).toLocaleDateString()} at ${booking.time}`,
    html: emailHtml,
  });
}
