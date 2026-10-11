# Discover Nepal

A premium cinematic tourism website for exploring Nepal's Himalayas, cultural heartlands, river expeditions, and Terai wildlife experiences.

## Live Website

Visit the production site here:

**https://discovernepaltours.vercel.app/**

## Features

- Cinematic desktop scrollytelling experience powered by GSAP and a canvas frame sequence
- Mobile-optimized video fallback to avoid heavy frame loading on small devices
- Dedicated destination catalog and dynamic destination detail pages
- Booking inquiry forms with server-side validation and Supabase persistence
- SEO support with dynamic metadata, sitemap, and robots configuration

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to preview locally.

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- GSAP ScrollTrigger
- Supabase
- Resend & React Email
- Vercel

## Guest Booking Portal (/manage-booking)

Guests can view and modify their reservation inquiries without creating an account:
- **Secure Reference System**: Each inquiry receives a unique UUID `booking_reference` sent in their confirmation email.
- **Double-Entry Email Validation**: Prevents typos by requiring email confirmation before inquiry submission.
- **Self-Service Rescheduling**: Guests navigate to `/manage-booking`, enter their email and reference key, and update their desired expedition start date.

## Customer Communication & Transactional Emails

The platform features an automated customer communication pipeline powered by Resend and `@react-email/components`:

- **Auto-Responder (`BookingConfirmation.tsx`)**: Dispatched automatically upon customer inquiry submission with trip details and concierge contact.
- **Official Confirmation (`TripFinalized.tsx`)**: Dispatched from the Admin Dashboard when clicking **Send Official Confirmation**, sending full itinerary preparation, permit handling, gear checklists, and wire payment details while transitioning lead status to `confirmed`.

To enable email delivery in production, configure the following environment variable in Vercel or `.env.local`:
```bash
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL="Discover Nepal <onboarding@resend.dev>"
```
*(If omitted, Server Actions automatically log warnings gracefully without blocking the database or UI workflow).*

## Admin Lead Management

The admin dashboard is available at `/admin/login` and lets authenticated Supabase users view booking inquiries and update each lead's status.

Create the first admin user from your local terminal with the Supabase CLI:

```bash
supabase auth users create admin@example.com --password 'REPLACE_WITH_A_STRONG_PASSWORD' --email-confirm
```

Alternatively, create the user in the Supabase dashboard under **Authentication → Users → Add user** and enable email/password sign-in for the project.

## Deployment

Production is deployed on Vercel and currently available at:

- https://discovernepaltours.vercel.app/
- https://premium-website-pearl.vercel.app/
