"use client";

import { useState } from 'react';
import Link from 'next/link';
import { lookupBookingForGuest, updateGuestBookingDate } from '../actions';

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

export default function ManageBookingPage() {
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupRef, setLookupRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [booking, setBooking] = useState<GuestBooking | null>(null);

  const [newDate, setNewDate] = useState('');
  const [updatingDate, setUpdatingDate] = useState(false);

  const today = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '';

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

  function handleResetSearch() {
    setBooking(null);
    setLookupEmail('');
    setLookupRef('');
    setErrorMsg('');
    setSuccessMsg('');
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 selection:text-black">
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
          /* STEP 2: Booking Details & Date Modification */
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
                      booking.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : booking.status === 'contacted'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {booking.status}
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
    </main>
  );
}
