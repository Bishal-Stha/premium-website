import { Resend } from 'resend';

/**
 * Returns a configured Resend client instance reading RESEND_API_KEY from process.env.
 * Throws a descriptive error with actionable troubleshooting guidance if the key is missing or blank.
 */
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || apiKey === 're_placeholder') {
    throw new Error(
      'RESEND_API_KEY is not configured or empty. Please set a valid Resend API key (e.g. re_...) in your environment (.env.local or Vercel dashboard) and restart the application.'
    );
  }

  return new Resend(apiKey);
}

/**
 * Proxy object exposing resend.emails for backward compatibility.
 * Throws descriptive runtime error when accessed if RESEND_API_KEY is unset.
 */
export const resend = {
  get emails() {
    return getResendClient().emails;
  },
};

/**
 * Default from email format. Falls back to onboarding@resend.dev if RESEND_FROM_EMAIL is unset.
 */
export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL?.trim() || 'Discover Nepal <onboarding@resend.dev>';
