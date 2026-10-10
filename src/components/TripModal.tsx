"use client";
import { useState } from 'react';
import { submitBooking } from '../app/actions';

export function TripModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
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
             <button onClick={onClose} className="mt-8 px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200">Close</button>
           </div>
        ) : (
          <form action={clientSubmit} className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Plan Your Trip</h3>
            <input type="hidden" name="destination" value="Custom Expedition" />
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Full Name</label>
              <input type="text" name="fullName" required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors" placeholder="E.g., Jane Mountaineer" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Email Address</label>
              <input type="email" name="email" required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors" placeholder="jane@example.com" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Target Date</label>
              <input type="date" name="bookingDate" required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition-colors [color-scheme:dark]" />
            </div>

            {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

            <button type="submit" disabled={status === 'loading'} className="w-full bg-white text-black font-semibold uppercase tracking-widest text-sm py-4 rounded-xl mt-4 hover:bg-zinc-200 transition-all disabled:opacity-50">
              {status === 'loading' ? 'Sending...' : 'Request Details'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
