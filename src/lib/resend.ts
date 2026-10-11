import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'Discover Nepal <onboarding@resend.dev>';
