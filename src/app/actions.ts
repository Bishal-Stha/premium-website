"use server";

import { supabase } from '@/lib/supabase';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { z } from 'zod';
import escapeHtml from 'escape-html';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import { BookingConfirmation } from '@/emails/BookingConfirmation';
import { TripFinalized } from '@/emails/TripFinalized';

const destinationLabels: Record<string, string> = {
  himalayas: 'The Himalayas / Everest Base Camp',
  hills: 'The Hilly Region / Annapurna Circuit',
  rivers: 'The Raging Rivers Expedition',
  terai: 'The Terai Plains / Chitwan Safari',
};

const BookingSchema = z.object({
  destination_slug: z.string().trim().min(1, "Please select a destination."),
  name: z.string().trim().min(1, "Full name is required.").max(120, "Name must not exceed 120 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  date: z.string().trim().refine((val) => {
    const selectedDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, { message: "Booking date cannot be in the past." })
});

export async function submitBooking(formData: FormData) {
  try {
    const rawData = {
      destination_slug: formData.get("destination_slug")?.toString() || "",
      name: formData.get("fullName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      date: formData.get("bookingDate")?.toString() || ""
    };

    const parsed = BookingSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0].message,
        formData: rawData // Return the data so the frontend can preserve state if needed
      };
    }

    // Escape HTML from text inputs to prevent stored XSS
    const sanitizedName = escapeHtml(parsed.data.name);
    const sanitizedEmail = escapeHtml(parsed.data.email);
    const sanitizedDestination = escapeHtml(parsed.data.destination_slug);

    const { error } = await supabase
      .from('booking_inquiries')
      .insert([{
        destination_slug: sanitizedDestination,
        name: sanitizedName,
        email: sanitizedEmail,
        date: parsed.data.date,
        status: 'pending'
      }]);

    if (error) {
      console.error("Booking submission error:", error);
      return { error: "Failed to submit booking. Please try again later." };
    }

    // STAGE 8 Auto-Responder: Trigger BookingConfirmation email via Resend
    try {
      const destinationDisplay =
        destinationLabels[parsed.data.destination_slug] || parsed.data.destination_slug;

      const emailResult = await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
        to: [parsed.data.email],
        subject: 'Expedition Inquiry Received — Discover Nepal',
        react: BookingConfirmation({
          customerName: parsed.data.name,
          destinationName: destinationDisplay,
          bookingDate: parsed.data.date,
        }),
      });

      if (emailResult.error) {
        const resendMessage = emailResult.error?.message || 'Resend delivery failed';
        console.error('Resend auto-responder delivery error:', emailResult.error);
        // Non-fatal for booking flow; booking already persisted
      }
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : 'Email dispatch error';
      console.error('Resend auto-responder unexpected failure:', emailError);
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in submitBooking:", err);
    return { error: "An unexpected error occurred." };
  }
}

export async function finalizeBooking(
  inquiryId: string,
  leadDetails?: {
    name?: string;
    email?: string;
    destination_slug?: string;
    date?: string;
  }
) {
  try {
    const serverSupabase = await createServerSupabaseClient();

    // 1. Update row status to 'confirmed' in Supabase
    const { data: updatedRow, error: updateError } = await serverSupabase
      .from('booking_inquiries')
      .update({ status: 'confirmed' })
      .eq('id', inquiryId)
      .select('id, name, email, destination_slug, date, status')
      .single();

    if (updateError) {
      console.error("Error updating booking inquiry to confirmed:", updateError);
      return { error: updateError.message || "Failed to update inquiry status." };
    }

    const lead = updatedRow || leadDetails;
    const recipientEmail = lead?.email || leadDetails?.email;
    const recipientName = lead?.name || leadDetails?.name || 'Valued Guest';
    const destSlug = lead?.destination_slug || leadDetails?.destination_slug || 'himalayas';
    const destDisplay = destinationLabels[destSlug] || destSlug;
    const tripDate = lead?.date || leadDetails?.date || 'Upcoming Season';

    // 2. Dispatch TripFinalized email via Resend
    let emailSent = false;
    let emailWarning: string | null = null;

    if (recipientEmail) {
      try {
        const emailResult = await resend.emails.send({
          from: DEFAULT_FROM_EMAIL,
          to: [recipientEmail],
          subject: 'Official Expedition Confirmation & Next Steps — Discover Nepal',
          react: TripFinalized({
            customerName: recipientName,
            destinationName: destDisplay,
            bookingDate: tripDate,
          }),
        });

        if (emailResult.error) {
          const detail = emailResult.error.message || 'Resend delivery error';
          console.error("Resend trip finalized delivery error:", emailResult.error);
          emailWarning = detail;
        } else {
          emailSent = true;
        }
      } catch (emailError: unknown) {
        console.error("Resend trip finalized exception:", emailError);
        const detail =
          emailError instanceof Error
            ? emailError.message
            : typeof emailError === 'string'
            ? emailError
            : 'Email dispatch failure';
        emailWarning = detail;
      }
    } else {
      emailWarning = "No recipient email address found for this inquiry.";
    }

    return { success: true, emailSent, emailWarning };
  } catch (err) {
    console.error("Unexpected error in finalizeBooking:", err);
    return { error: "An unexpected error occurred while finalizing booking." };
  }
}

/**
 * Alias for finalizeBooking ensuring consistency across admin dispatch actions.
 */
export const sendOfficialConfirmation = finalizeBooking;
