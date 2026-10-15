"use server";

import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import escapeHtml from 'escape-html';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import { generateEsewaSignature, DEFAULT_ESEWA_MERCHANT_CODE } from '@/lib/esewa';
import { BookingConfirmation } from '@/emails/BookingConfirmation';
import { TripFinalized } from '@/emails/TripFinalized';

const destinationLabels: Record<string, string> = {
  himalayas: 'The Himalayas / Everest Base Camp',
  hills: 'The Hilly Region / Annapurna Circuit',
  rivers: 'The Raging Rivers Expedition',
  terai: 'The Terai Plains / Chitwan Safari',
  'upper-mustang': 'Upper Mustang / Forbidden Kingdom',
  'manaslu-circuit': 'Manaslu Circuit Trek',
  'langtang-valley': 'Langtang Valley / Valley of Glaciers',
  'gokyo-lakes': 'Gokyo Lakes & Everest Panorama',
  'mardi-himal': 'Mardi Himal Base Camp Trek',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Strict Input Validation Schema (Pillar 2)
const BookingSchema = z
  .object({
    destination_slug: z.enum([
      'himalayas',
      'hills',
      'rivers',
      'terai',
      'upper-mustang',
      'manaslu-circuit',
      'langtang-valley',
      'gokyo-lakes',
      'mardi-himal',
    ], {
      message: "Please select a valid destination from the list.",
    }),
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(120, "Name must not exceed 120 characters."),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(255, "Email address is too long."),
    confirmEmail: z
      .string()
      .trim()
      .email("Please enter a valid confirmation email address.")
      .max(255, "Confirmation email address is too long."),
    date: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date format (YYYY-MM-DD).")
      .refine((val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 3);

        return selectedDate >= today && selectedDate <= maxDate;
      }, { message: "Booking date must be today or within the next 3 years." })
  })
  .refine((data) => data.email.toLowerCase() === data.confirmEmail.toLowerCase(), {
    message: "Email addresses do not match.",
    path: ["confirmEmail"],
  });

export async function submitBooking(formData: FormData) {
  try {
    // 1. Rate Limiting (Pillar 1) — Max 5 submissions per minute per IP
    const rateCheck = await checkRateLimit('submit_booking', 5, 60);
    if (!rateCheck.allowed) {
      return {
        error: `Too many submissions. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
      };
    }

    // 2. Extract and Validate Input (Pillar 2)
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
        formData: rawData // Return user data so frontend preserves form state
      };
    }

    // 3. XSS Sanitization
    const sanitizedName = escapeHtml(parsed.data.name);
    const sanitizedEmail = escapeHtml(parsed.data.email);
    const sanitizedDestination = escapeHtml(parsed.data.destination_slug);

    // 4. Generate Unique Booking Reference
    const generatedRef = randomUUID();
    const assignedRef: string = generatedRef;

    // 5. Database Insertion
    let { error } = await supabase
      .from('booking_inquiries')
      .insert([{
        destination_slug: sanitizedDestination,
        name: sanitizedName,
        email: sanitizedEmail,
        date: parsed.data.date,
        status: 'pending',
        booking_reference: generatedRef
      }]);

    if (error && error.message?.includes('booking_reference')) {
      // Fallback if column not yet added
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
      // Log full internal error on server without leaking details to client (Pillar 4)
      console.error("Booking submission internal error:", error);
      return { error: "Failed to submit booking inquiry. Please try again later." };
    }

    // 6. Auto-Responder Transactional Email via Resend
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
    // Information Leakage Prevention: Never expose raw stack traces
    console.error("Unexpected error in submitBooking:", err);
    return { error: "An unexpected error occurred while processing your request." };
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
    // 1. Rate Limiting — Max 15 admin updates per minute
    const rateCheck = await checkRateLimit('finalize_booking', 15, 60);
    if (!rateCheck.allowed) {
      return {
        error: `Rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds before confirming more leads.`,
      };
    }

    // 2. Validate inquiryId
    if (!inquiryId || !UUID_REGEX.test(inquiryId.trim())) {
      return { error: "Invalid booking inquiry identifier." };
    }

    const serverSupabase = await createServerSupabaseClient();

    // 3. Update row status to 'confirmed'
    const { data: updatedRow, error: updateError } = await serverSupabase
      .from('booking_inquiries')
      .update({ status: 'confirmed' })
      .eq('id', inquiryId)
      .select('id, name, email, destination_slug, date, status, booking_reference')
      .maybeSingle();

    if (updateError) {
      console.error("Error updating booking inquiry to confirmed:", updateError);
      return { error: "Failed to update inquiry status in database." };
    }

    const lead = updatedRow || leadDetails;
    const recipientEmail = lead?.email || leadDetails?.email;
    const recipientName = lead?.name || leadDetails?.name || 'Valued Guest';
    const destSlug = lead?.destination_slug || leadDetails?.destination_slug || 'himalayas';
    const destDisplay = destinationLabels[destSlug] || destSlug;
    const tripDate = lead?.date || leadDetails?.date || 'Upcoming Season';
    const bookingRef = (lead as Record<string, unknown>)?.booking_reference as string | undefined;

    // 4. Dispatch Official Confirmation Email
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

export const sendOfficialConfirmation = finalizeBooking;

// Guest Portal Server Actions (/manage-booking)

export async function lookupBookingForGuest(email: string, reference: string) {
  try {
    // 1. Rate Limiting (Pillar 1) — Max 10 lookups per minute to prevent brute-force attacks
    const rateCheck = await checkRateLimit('lookup_booking', 10, 60);
    if (!rateCheck.allowed) {
      return {
        error: `Too many lookup attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
      };
    }

    const cleanEmail = email?.trim().toLowerCase();
    const cleanRef = reference?.trim();

    if (!cleanEmail || !cleanRef) {
      return { error: "Please enter both your email address and booking reference." };
    }

    // 2. Validate email format & UUID format (Pillar 2)
    const emailCheck = z.string().email().safeParse(cleanEmail);
    if (!emailCheck.success) {
      return { error: "Please provide a valid email address." };
    }

    if (!UUID_REGEX.test(cleanRef)) {
      return { error: "Invalid booking reference format. Must be a valid UUID (e.g., 123e4567-e89b-12d3-a456-426614174000)." };
    }

    // 3. Try RPC lookup first
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

    // 4. Direct query fallback
    const serverSupabase = await createServerSupabaseClient();
    const { data: directData } = await serverSupabase
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
    // 1. Rate Limiting — Max 5 date updates per minute
    const rateCheck = await checkRateLimit('update_booking_date', 5, 60);
    if (!rateCheck.allowed) {
      return {
        error: `Too many update attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
      };
    }

    const cleanEmail = email?.trim().toLowerCase();
    const cleanRef = reference?.trim();

    if (!cleanEmail || !cleanRef || !newDate) {
      return { error: "Email, reference, and new desired date are required." };
    }

    // 2. Strict Input Validation (Pillar 2)
    if (!UUID_REGEX.test(cleanRef)) {
      return { error: "Invalid booking reference format." };
    }

    const emailCheck = z.string().email().safeParse(cleanEmail);
    if (!emailCheck.success) {
      return { error: "Invalid email address format." };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newDate)) {
      return { error: "Invalid date format. Expected YYYY-MM-DD." };
    }

    const selectedDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 3);

    if (isNaN(selectedDate.getTime()) || selectedDate < today || selectedDate > maxDate) {
      return { error: "Expedition date must be today or within the next 3 years." };
    }

    // 3. Try RPC update first
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

    // 4. Direct query fallback
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

export async function createEsewaPaymentPayload(bookingReference: string) {
  try {
    const cleanRef = bookingReference?.trim();
    if (!cleanRef || !UUID_REGEX.test(cleanRef)) {
      return { error: "Invalid booking reference." };
    }

    const totalAmount = 500;
    const productCode = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE || DEFAULT_ESEWA_MERCHANT_CODE;
    const signature = generateEsewaSignature(totalAmount, cleanRef, productCode);

    return {
      success: true,
      payload: {
        amount: totalAmount.toString(),
        tax_amount: '0',
        total_amount: totalAmount.toString(),
        transaction_uuid: cleanRef,
        product_code: productCode,
        product_service_charge: '0',
        product_delivery_charge: '0',
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature,
      },
    };
  } catch (err) {
    console.error("Error generating eSewa payload:", err);
    return { error: "Failed to generate eSewa payment checkout data." };
  }
}

