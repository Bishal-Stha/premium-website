import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dataParam = searchParams.get('data');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin || 'https://discovernepaltours.vercel.app';

  if (!dataParam) {
    console.error('eSewa verification callback received without data parameter');
    return NextResponse.redirect(`${siteUrl}/manage-booking?error=payment_missing_data`);
  }

  try {
    // 1. Decode base64 response from eSewa
    const decodedString = Buffer.from(dataParam, 'base64').toString('utf-8');
    const parsedData = JSON.parse(decodedString);

    const {
      status,
      transaction_uuid,
      total_amount,
    } = parsedData || {};

    if (status !== 'COMPLETE') {
      console.warn(`eSewa payment not marked complete: status=${status}`);
      return NextResponse.redirect(`${siteUrl}/manage-booking?error=payment_failed`);
    }

    if (!transaction_uuid || !UUID_REGEX.test(transaction_uuid)) {
      console.error('Invalid transaction_uuid received from eSewa:', transaction_uuid);
      return NextResponse.redirect(`${siteUrl}/manage-booking?error=invalid_reference`);
    }

    // 2. Verify and update booking in Supabase
    const serverSupabase = await createServerSupabaseClient();

    // Check if inquiry exists with this reference
    const { data: inquiry, error: lookupError } = await serverSupabase
      .from('booking_inquiries')
      .select('id, email, booking_reference, status')
      .eq('booking_reference', transaction_uuid)
      .maybeSingle();

    if (lookupError || !inquiry) {
      console.error('No booking inquiry found for eSewa reference:', transaction_uuid, lookupError);
      return NextResponse.redirect(`${siteUrl}/manage-booking?error=booking_not_found`);
    }

    // Update status to deposit_paid
    const { error: updateError } = await serverSupabase
      .from('booking_inquiries')
      .update({ status: 'deposit_paid' })
      .eq('booking_reference', transaction_uuid);

    if (updateError) {
      console.error('Failed to update booking status to deposit_paid:', updateError);
      return NextResponse.redirect(`${siteUrl}/manage-booking?error=update_failed`);
    }

    console.log(`eSewa payment verified: ref=${transaction_uuid}, amount=${total_amount}`);

    // Redirect to guest portal with success indicator and reference
    return NextResponse.redirect(
      `${siteUrl}/manage-booking?success=true&ref=${encodeURIComponent(transaction_uuid)}`
    );
  } catch (err) {
    console.error('Exception during eSewa verification:', err);
    return NextResponse.redirect(`${siteUrl}/manage-booking?error=payment_verification_error`);
  }
}
