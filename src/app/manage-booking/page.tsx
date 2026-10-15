"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { lookupBookingForGuest, updateGuestBookingDate, createEsewaPaymentPayload } from '../actions';
import { ESEWA_SANDBOX_URL } from '@/lib/esewa';

interface GuestBooking {
  id: string;
  name: string;
  email: string;
  destination_slug: string;
  destination_name: string;
  date: string;
  status: string;
  booking_reference: string;
}

function ManageBookingContent() {
  const searchParams = useSearchParams();
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupRef, setLookupRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [booking, setBooking] = useState<GuestBooking | null>(null);

  const [newDate, setNewDate] = useState('');
  const [updatingDate, setUpdatingDate] = useState(false);

  // Hidden form submission ref for eSewa Sandbox checkout
  const esewaFormRef = useRef<HTMLFormElement>(null);
  const [esewaPayload, setEsewaPayload] = useState<{
    amount: string;
    tax_amount: string;
    total_amount: string;
    transaction_uuid: string;
    product_code: string;
    product_service_charge: string;
    product_delivery_charge: string;
    signed_field_names: string;
    signature: string;
    success_url: string;
    failure_url: string;
  } | null>(null);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  const today = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '';

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('success');
    const refParam = searchParams.get('ref');

    const timer = setTimeout(() => {
      if (errorParam === 'payment_failed') {
        setErrorMsg('eSewa transaction was cancelled or failed. Please try again.');
      } else if (errorParam) {
        setErrorMsg(`Payment error: ${errorParam}. Please try again or contact support.`);
      }

      if (successParam === 'true') {
        setSuccessMsg('Deposit payment successful! Your booking status has been updated to Deposit Paid.');
        if (refParam) {
          setLookupRef(refParam);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // When esewaPayload is set and ready, auto-submit the hidden HTML form directly to eSewa Sandbox URL
  useEffect(() => {
    if (esewaPayload && esewaFormRef.current) {
      esewaFormRef.current.submit();
    }
  }, [esewaPayload]);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const result = await lookupBookingForGuest(lookupEmail, lookupRef);

    if (result.error) {
      setErrorMsg(result.error);
      setBooking(null);
    } else if (result.booking) {
      setBooking(result.booking);
      setNewDate(result.booking.date || '');
    }

    setLoading(false);
  }

  async function handleUpdateDate(e: React.FormEvent) {
    e.preventDefault();
    if (!booking) return;

    setErrorMsg('');
    setSuccessMsg('');
    setUpdatingDate(true);

    const result = await updateGuestBookingDate(booking.email, booking.booking_reference, newDate);

    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success) {
      setBooking(prev => (prev ? { ...prev, date: result.newDate } : null));
      setSuccessMsg(result.message || 'Your expedition date has been updated!');
    }

    setUpdatingDate(false);
  }

  async function handleEsewaCheckout() {
    if (!booking) return;
    setInitiatingPayment(true);
    setErrorMsg('');

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const res = await createEsewaPaymentPayload(booking.booking_reference);

    if (res.error || !res.payload) {
      setErrorMsg(res.error || 'Failed to initialize eSewa payment.');
      setInitiatingPayment(false);
      return;
    }

    setEsewaPayload({
      ...res.payload,
      success_url: `${origin}/api/esewa/verify`,
      failure_url: `${origin}/manage-booking?error=payment_failed`,
    });
  }

  function handleResetSearch() {
    setBooking(null);
    setLookupEmail('');
    setLookupRef('');
    setErrorMsg('');
    setSuccessMsg('');
  }

  return (
    <>
      {/* Hidden form for direct browser submission to eSewa Sandbox URL */}
      {esewaPayload && (
        <form
          ref={esewaFormRef}
          method="POST"
          action={ESEWA_SANDBOX_URL}
          className="hidden"
        >
          <input type="hidden" name="amount" value={esewaPayload.amount} />
          <input type="hidden" name="tax_amount" value={esewaPayload.tax_amount} />
          <input type="hidden" name="total_amount" value={esewaPayload.total_amount} />
          <input type="hidden" name="transaction_uuid" value={esewaPayload.transaction_uuid} />
          <input type="hidden" name="product_code" value={esewaPayload.product_code} />
          <input type="hidden" name="product_service_charge" value={esewaPayload.product_service_charge} />
          <input type="hidden" name="product_delivery_charge" value={esewaPayload.product_delivery_charge} />
          <input type="hidden" name="success_url" value={esewaPayload.success_url} />
          <input type="hidden" name="failure_url" value={esewaPayload.failure_url} />
          <input type="hidden" name="signed_field_names" value={esewaPayload.signed_field_names} />
          <input type="hidden" name="signature" value={esewaPayload.signature} />
        </form>
      )}

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Discover Nepal" className="w-10 h-10 object-contain" />
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-zinc-300">Discover Nepal</span>
        </Link>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs uppercase tracking-widest font-semibold mb-4">
            Guest Portal
          </span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            Manage Your <span className="font-serif italic text-emerald-400">Expedition</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Look up your reservation inquiry using your email address and unique booking reference key to view status or modify your dates.
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl border border-red-800 bg-red-950/60 text-red-200 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg('')}
              className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-8 p-4 rounded-2xl border border-emerald-800 bg-emerald-950/60 text-emerald-200 text-sm flex items-center justify-between">
            <span>{successMsg}</span>
            <button
              onClick={() => setSuccessMsg('')}
              className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {!booking ? (
          /* STEP 1: Search Form */
          <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Find Your Reservation
            </h2>

            <form onSubmit={handleLookup} className="space-y-6">
              <div>
                <label
                  htmlFor="lookupEmail"
                  className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-medium"
                >
                  Email Address
                </label>
                <input
                  id="lookupEmail"
                  type="email"
                  required
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  placeholder="The email you used during inquiry"
                  className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 outline-none focus:border-emerald-500/60 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="lookupRef"
                  className="block text-xs uppercase tracking-widest text-zinc-400 mb-2 font-medium"
                >
                  Booking Reference Key
                </label>
                <input
                  id="lookupRef"
                  type="text"
                  required
                  value={lookupRef}
                  onChange={(e) => setLookupRef(e.target.value)}
                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                  className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-mono text-sm placeholder-zinc-600 outline-none focus:border-emerald-500/60 transition-colors"
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Found in your initial booking confirmation email received after inquiry submission.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {loading ? 'Searching Reservations...' : 'Retrieve Reservation'}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Booking Details, eSewa Payment & Date Modification */
          <div className="space-y-8">
            <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-widest text-zinc-500">Expedition Overview</span>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white mt-1">
                    {booking.destination_name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-zinc-400">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold ${
                      booking.status === 'confirmed' || booking.status === 'deposit_paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : booking.status === 'contacted'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {booking.status === 'deposit_paid' ? 'Deposit Paid' : booking.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-white/10">
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">Guest Name</div>
                  <div className="text-base font-medium text-white mt-1">{booking.name}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">Email Address</div>
                  <div className="text-base text-zinc-300 mt-1">{booking.email}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">Current Start Date</div>
                  <div className="text-base font-semibold text-emerald-400 mt-1">{booking.date}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">Booking Reference</div>
                  <div className="text-xs font-mono text-zinc-300 mt-1 bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 inline-block">
                    {booking.booking_reference}
                  </div>
                </div>
              </div>

              {/* eSewa Test Mode Payment Section (Displayed for pending status) */}
              {booking.status === 'pending' && (
                <div className="py-6 border-b border-white/10 bg-emerald-950/20 -mx-8 md:-mx-10 px-8 md:px-10 rounded-2xl my-2 border border-emerald-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400">
                          Secure Expedition Slot
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-white mt-1">
                        Pay Deposit via eSewa (Test Mode)
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Deposit Amount: <span className="text-white font-mono font-medium">NPR 500.00</span> — Instantly secures your expedition slot in test mode.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleEsewaCheckout}
                      disabled={initiatingPayment}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#60BB46] hover:bg-[#52a43b] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer whitespace-nowrap"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      {initiatingPayment ? 'Redirecting to eSewa...' : 'eSewa Pay (Test)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Modify Date Form */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Need to Change Your Dates?</h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Select a new expedition date below. Our expedition planners will instantly update your itinerary window.
                </p>

                <form onSubmit={handleUpdateDate} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="newDate" className="sr-only">New Expedition Date</label>
                    <input
                      id="newDate"
                      type="date"
                      min={today}
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 [color-scheme:dark]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingDate || newDate === booking.date}
                    className="px-6 py-3 bg-emerald-500 text-black font-semibold uppercase tracking-wider text-xs rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-40 cursor-pointer shadow-lg whitespace-nowrap"
                  >
                    {updatingDate ? 'Updating...' : 'Update Date'}
                  </button>
                </form>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleResetSearch}
                className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                ← Search Another Reservation
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ManageBookingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 selection:text-black">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-zinc-500 uppercase tracking-widest text-xs">Loading Reservation Portal...</p>
        </div>
      }>
        <ManageBookingContent />
      </Suspense>
    </main>
  );
}
