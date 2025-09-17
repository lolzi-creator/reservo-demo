# Reservo Demo

A minimal, mobile-first Next.js 14 reservation tool demo with AI assistant parsing capabilities.

## Features

- **Landing Page** (`/`) - Hero section with CTA buttons and QR code
- **Booking Form** (`/book`) - Traditional form-based reservations with validation
- **AI Assistant** (`/assistant`) - Natural language parsing for quick reservations
- **Admin Panel** (`/admin`) - View all reservations in a clean table format

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with dark theme
- **Client-side storage** using localStorage
- **QR Code generation** for quick access

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page (/)
│   ├── book/page.tsx      # Booking form (/book)
│   ├── assistant/page.tsx  # AI assistant (/assistant)
│   ├── admin/page.tsx     # Admin panel (/admin)
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── BookingForm.tsx    # Form component
│   ├── QRCode.tsx         # QR code component
│   ├── Section.tsx        # Layout wrapper
│   └── Navigation.tsx     # Top navigation
└── lib/                   # Utility functions
    ├── storage.ts         # localStorage helpers
    └── parse.ts           # AI parsing logic
```

## Key Features

### AI Assistant Parsing
The AI assistant can parse natural language like:
- "table for 2 at 19:00 today under Sam sam@mail.com"
- "reservation tomorrow 20:00 for 4 under Mia mia@ex.com"
- "book 3 at 18:00 alex@ex.com under Alex"

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Dark theme with neutral colors
- Responsive tables and forms
- Touch-friendly interface

### Data Persistence
- All bookings stored in localStorage
- SSR-safe with window checks
- Automatic sorting by creation time

## Development

- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type check:** `npm run type-check`

## License

MIT License - feel free to use this demo for your own projects!