"use server";

import { randomUUID } from 'crypto';
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

// STAGE 9: Email Validation (Double-Entry)
const BookingSchema = z
  .object({
    destination_slug: z.string().trim().min(1, "Please select a destination."),
    name: z.string().trim().min(1, "Full name is required.").max(120, "Name must not exceed 120 characters."),
    email: z.string().trim().email("Please enter a valid email address."),
    confirmEmail: z.string().trim().email("Please enter a valid confirmation email address."),
    date: z.string().trim().refine((val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, { message: "Booking date cannot be in the past." })
  })
  .refine((data) => data.email.toLowerCase() === data.confirmEmail.toLowerCase(), {
    message: "Email addresses do not match.",
    path: ["confirmEmail"],
  });

export async function submitBooking(formData: FormData) {
  try {
    const rawData = {
      destination_slug: formData.get("destination_slug")?.toString() || "",
      name: formData.get("fullName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      confirmEmail: formData.get("confirmEmail")?.toString() || "",
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

    // STAGE 9: Generate Unique Booking Reference
    const generatedRef = randomUUID();
    let assignedRef: string = generatedRef;

    // Insert into booking_inquiries (with graceful fallback if migration not yet applied)
    let { data: insertedRow, error } = await supabase
      .from('booking_inquiries')
      .insert([{
        destination_slug: sanitizedDestination,
        name: sanitizedName,
        email: sanitizedEmail,
        date: parsed.data.date,
        status: 'pending',
        booking_reference: generatedRef
      }])
      .select('id, booking_reference')
      .maybeSingle();

    if (error && error.message?.includes('booking_reference')) {
      // Fallback if booking_reference column has not been added yet
      const retry = await supabase
        .from('booking_inquiries')
        .insert([{
          destination_slug: sanitizedDestination,
          name: sanitizedName,
          email: sanitizedEmail,
          date: parsed.data.date,
          status: 'pending'
        }]);
      error = retry.error;
    }

    if (error) {
      console.error("Booking submission error:", error);
      return { error: "Failed to submit booking. Please try again later." };
    }

    if (insertedRow?.booking_reference) {
      assignedRef = insertedRow.booking_reference;
    }

    // STAGE 8 & 9 Auto-Responder: Trigger BookingConfirmation email via Resend including booking reference
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
          bookingReference: assignedRef,
        }),
      });

      if (emailResult.error) {
        console.error('Resend auto-responder delivery error:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Resend auto-responder unexpected failure:', emailError);
    }

    return { success: true, bookingReference: assignedRef };
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
    booking_reference?: string;
  }
) {
  try {
    const serverSupabase = await createServerSupabaseClient();

    // 1. Update row status to 'confirmed' in Supabase
    const { data: updatedRow, error: updateError } = await serverSupabase
      .from('booking_inquiries')
      .update({ status: 'confirmed' })
      .eq('id', inquiryId)
      .select('id, name, email, destination_slug, date, status, booking_reference')
      .maybeSingle();

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
    const bookingRef = (lead as Record<string, unknown>)?.booking_reference as string | undefined;

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
            bookingReference: bookingRef,
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

// STAGE 9: Guest Portal Server Actions (/manage-booking)

export async function lookupBookingForGuest(email: string, reference: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanRef = reference.trim();

    if (!cleanEmail || !cleanRef) {
      return { error: "Please enter both your email address and booking reference." };
    }

    // 1. Try RPC lookup first (bypasses RLS restrictions securely)
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_guest_booking', {
        p_email: cleanEmail,
        p_reference: cleanRef,
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        const b = rpcData[0];
        return {
          success: true,
          booking: {
            id: b.id,
            name: b.name,
            email: b.email,
            destination_slug: b.destination_slug,
            destination_name: destinationLabels[b.destination_slug] || b.destination_slug,
            date: b.date,
            status: b.status,
            booking_reference: b.booking_reference,
          },
        };
      }
    } catch {
      // RPC may not exist if migration is pending
    }

    // 2. Direct query fallback
    const serverSupabase = await createServerSupabaseClient();
    const { data: directData, error: directError } = await serverSupabase
      .from('booking_inquiries')
      .select('id, name, email, destination_slug, date, status, booking_reference')
      .ilike('email', cleanEmail)
      .eq('booking_reference', cleanRef)
      .maybeSingle();

    if (directData) {
      return {
        success: true,
        booking: {
          id: directData.id,
          name: directData.name,
          email: directData.email,
          destination_slug: directData.destination_slug,
          destination_name: destinationLabels[directData.destination_slug] || directData.destination_slug,
          date: directData.date,
          status: directData.status,
          booking_reference: directData.booking_reference,
        },
      };
    }

    return { error: "No booking found matching that email and booking reference combination." };
  } catch (err) {
    console.error("Error looking up booking for guest:", err);
    return { error: "An unexpected error occurred while searching for your reservation." };
  }
}

export async function updateGuestBookingDate(email: string, reference: string, newDate: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanRef = reference.trim();

    if (!cleanEmail || !cleanRef || !newDate) {
      return { error: "Email, reference, and new desired date are required." };
    }

    const selectedDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return { error: "Expedition date cannot be in the past." };
    }

    // 1. Try RPC update first
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('update_guest_booking_date', {
        p_email: cleanEmail,
        p_reference: cleanRef,
        p_new_date: newDate,
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        return {
          success: true,
          newDate: rpcData[0].date,
          message: "Your expedition date has been updated successfully!",
        };
      }
    } catch {
      // RPC may not exist if migration is pending
    }

    // 2. Direct query fallback
    const serverSupabase = await createServerSupabaseClient();
    const { data: updated, error: updateError } = await serverSupabase
      .from('booking_inquiries')
      .update({ date: newDate })
      .ilike('email', cleanEmail)
      .eq('booking_reference', cleanRef)
      .select('id, date')
      .maybeSingle();

    if (updateError || !updated) {
      return { error: "Failed to update date. Please confirm your email and reference are correct." };
    }

    return {
      success: true,
      newDate: updated.date,
      message: "Your expedition date has been updated successfully!",
    };
  } catch (err) {
    console.error("Error updating guest booking date:", err);
    return { error: "An unexpected error occurred while updating your reservation date." };
  }
}
