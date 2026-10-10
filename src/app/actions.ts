"use server";

import { supabase } from '@/lib/supabase'
import { z } from 'zod';
import escapeHtml from 'escape-html';

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
        date: parsed.data.date 
      }]);

    if (error) {
      console.error("Booking submission error:", error);
      return { error: "Failed to submit booking. Please try again later." };
    }

    return { success: true };
  } catch (err) {
    return { error: "An unexpected error occurred." };
  }
}
