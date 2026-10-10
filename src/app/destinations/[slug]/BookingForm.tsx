"use client";

import { useState } from 'react';
import { submitBooking } from '../../actions';

export function BookingForm({ destination }: { destination: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState("");

  async function clientSubmit(formData: FormData) {
    setStatus('loading');
    setErrorMsg("");

    const result = await submitBooking(formData);

    if (result.error) {
      setErrorMsg(result.error);
      setStatus('idle');
    } else {
      setStatus('success');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center h-full">
        <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h4 className="text-2xl font-semibold mb-2">Request Received</h4>
        <p className="text-zinc-400 font-light text-sm">
          A dedicated specialist will contact you shortly to curate your perfect {destination} itinerary.
        </p>
      </div>
    );
  }

  return (
    <form action={clientSubmit} className="space-y-6 relative z-10">
      <input type="hidden" name="destination" value={destination} />
      
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Full Name</label>
        <input 
          type="text" 
          name="fullName"
          required
          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors"
          placeholder="E.g., Jane Mountaineer"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Email Address</label>
        <input 
          type="email" 
          name="email"
          required
          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Desired Start Date</label>
        <input 
          type="date" 
          name="bookingDate"
          required
          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors [color-scheme:dark]"
        />
      </div>

      {errorMsg && (
        <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full bg-white text-black font-semibold uppercase tracking-widest text-sm py-4 rounded-xl mt-4 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
      >
        {status === 'loading' ? 'Processing...' : 'Request Booking'}
      </button>

      <p className="text-center text-xs text-zinc-600 mt-4">
        No payment required yet. This is an inquiry.
      </p>
    </form>
  );
}
