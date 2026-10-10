"use server";

import { supabase } from '@/lib/supabase'

export async function submitBooking(formData: FormData) {
  const destination_slug = formData.get("destination_slug") as string;
  const name = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const date = formData.get("bookingDate") as string;

  if (!destination_slug || !name || !email || !date) {
    return { error: "All fields are required." };
  }

  if (!email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const { error } = await supabase
    .from('booking_inquiries')
    .insert([{ 
      destination_slug, 
      name, 
      email, 
      date 
    }]);

  if (error) {
    console.error("Booking submission error:", error);
    return { error: "Failed to submit booking. Please try again later." };
  }

  return { success: true };
}
