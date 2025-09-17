# 📧 Email Setup for Reservo Demo

## Quick Setup for Real Email Sending

### 1. Get Resend API Key
1. Go to [https://resend.com/](https://resend.com/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Configure Environment
Create a `.env.local` file in the root directory:

```bash
# Add this to .env.local
RESEND_API_KEY=your_actual_api_key_here
```

### 3. Test Email Sending
1. Restart your development server: `npm run dev`
2. Make a reservation via the chat or booking form
3. Check the console - you should see "✅ Email sent successfully via Resend!"

## Email Features
- ✅ Professional HTML email templates
- ✅ Booking confirmation emails to customers
- ✅ Real-time admin notifications
- ✅ Responsive email design
- ✅ Error handling and fallbacks

## Demo Mode
Without an API key, the app runs in demo mode:
- Emails are logged to console
- All functionality works except real sending
- Perfect for testing and development

## Troubleshooting
- Make sure `.env.local` is in the root directory
- Restart the dev server after adding the API key
- Check console for detailed error messages

