"use client";
import { useState } from 'react';
import { submitBooking } from '../app/actions';

export function TripModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    destination_slug: "",
    fullName: "",
    email: "",
    confirmEmail: "",
    bookingDate: ""
  });

  // Explicitly reset all state variables whenever modal is closed
  const handleClose = () => {
    setFormData({
      destination_slug: "",
      fullName: "",
      email: "",
      confirmEmail: "",
      bookingDate: ""
    });
    setStatus('idle');
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

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

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {status === 'success' ? (
           <div className="text-center py-8">
             <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
             </div>
             <h3 className="text-2xl font-semibold mb-2 text-white">Inquiry Sent</h3>
             <p className="text-zinc-400">Our expedition team will contact you shortly.</p>
             <button
               onClick={handleClose}
               className="mt-8 px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
             >
               Close
             </button>
           </div>
        ) : (
          <form action={clientSubmit} className="space-y-5">
            <h3 className="text-2xl font-semibold text-white mb-6">Plan Your Trip</h3>

            <div>
              <label htmlFor="destination_slug" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Destination</label>
              <select
                id="destination_slug"
                name="destination_slug"
                value={formData.destination_slug || ""}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition-colors appearance-none"
              >
                <option value="" disabled>Select a Destination...</option>
                <option value="himalayas">The Himalayas / Everest</option>
                <option value="hills">The Hilly Region / Annapurna</option>
                <option value="rivers">The Raging Rivers</option>
                <option value="terai">The Terai Plains / Chitwan</option>
              </select>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Full Name</label>
              <input
                id="fullName"
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
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Email Address</label>
                <input
                  id="email"
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
                <label htmlFor="confirmEmail" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Confirm Email</label>
                <input
                  id="confirmEmail"
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
              <label htmlFor="bookingDate" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Target Date</label>
              <input
                id="bookingDate"
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition-colors [color-scheme:dark]"
              />
            </div>

            {errorMsg && <p className="text-red-400 text-sm font-medium">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-white text-black font-semibold uppercase tracking-widest text-sm py-4 rounded-xl mt-4 hover:bg-zinc-200 transition-all disabled:opacity-50 cursor-pointer"
            >
              {status === 'loading' ? 'Sending...' : 'Request Details'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
