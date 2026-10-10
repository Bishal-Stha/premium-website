"use server";

import { supabase } from '@/lib/supabase'

export async function submitBooking(formData: FormData) {
  const destination = formData.get("destination") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const bookingDate = formData.get("bookingDate") as string;

  if (!destination || !fullName || !email || !bookingDate) {
    return { error: "All fields are required." };
  }

  // Basic email validation
  if (!email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const { error } = await supabase
    .from('bookings')
    .insert([{ 
      destination, 
      full_name: fullName, 
      email, 
      booking_date: bookingDate 
    }]);

  if (error) {
    console.error("Booking submission error:", error);
    return { error: "Failed to submit booking. Please try again later." };
  }

  return { success: true };
}
