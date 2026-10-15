"use client";

import { useState } from 'react';
import { submitBooking } from '../../actions';

export function BookingForm({ destinationSlug }: { destinationSlug: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    destination_slug: destinationSlug,
    fullName: "",
    email: "",
    confirmEmail: "",
    bookingDate: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  async function clientSubmit(data: FormData) {
    setStatus('loading');
    setErrorMsg("");

    const result = await submitBooking(data);

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
          A dedicated specialist will contact you shortly to curate your perfect itinerary.
        </p>
      </div>
    );
  }

  return (
    <form action={clientSubmit} className="space-y-5 relative z-10">
      <div>
        <label htmlFor="formDestination" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Destination</label>
        <select
          id="formDestination"
          name="destination_slug"
          value={formData.destination_slug}
          onChange={handleChange}
          required
          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition-colors appearance-none"
        >
          <option value="" disabled>Select a Destination...</option>
          <option value="himalayas">The Himalayas / Everest</option>
          <option value="hills">The Hilly Region / Annapurna</option>
          <option value="rivers">The Raging Rivers</option>
          <option value="terai">The Terai Plains / Chitwan</option>
          <option value="upper-mustang">Upper Mustang (14 Days)</option>
          <option value="manaslu-circuit">Manaslu Circuit (14 Days)</option>
          <option value="langtang-valley">Langtang Valley (10 Days)</option>
          <option value="gokyo-lakes">Gokyo Lakes & Everest (15 Days)</option>
          <option value="mardi-himal">Mardi Himal Base Camp (8 Days)</option>
        </select>
      </div>

      <div>
        <label htmlFor="formName" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Full Name</label>
        <input
          id="formName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors"
          placeholder="E.g., Jane Mountaineer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="formEmail" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Email Address</label>
          <input
            id="formEmail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="formConfirmEmail" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Confirm Email</label>
          <input
            id="formConfirmEmail"
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="formDate" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Desired Start Date</label>
        <input
          id="formDate"
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
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
        className="w-full bg-white text-black font-semibold uppercase tracking-widest text-sm py-4 rounded-xl mt-4 hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {status === 'loading' ? 'Processing...' : 'Request Booking'}
      </button>

      <p className="text-center text-xs text-zinc-600 mt-4">
        No payment required yet. This is an inquiry.
      </p>
    </form>
  );
}
