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
- Vercel

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
