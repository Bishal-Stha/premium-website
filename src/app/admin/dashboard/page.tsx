"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { finalizeBooking } from '../../actions';

type LeadStatus = 'pending' | 'contacted' | 'confirmed' | 'archived';

type BookingInquiry = {
  id: string;
  name: string;
  email: string;
  destination_slug: string;
  date: string;
  status: LeadStatus;
  created_at: string;
};

const statusOptions: LeadStatus[] = ['pending', 'contacted', 'confirmed', 'archived'];

const destinationLabels: Record<string, string> = {
  himalayas: 'The Himalayas / Everest',
  hills: 'The Hilly Region / Annapurna',
  rivers: 'The Raging Rivers',
  terai: 'The Terai Plains / Chitwan',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<BookingInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [finalizingId, setFinalizingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setError('');
    const { data, error } = await supabaseBrowser
      .from('booking_inquiries')
      .select('id,name,email,destination_slug,date,status,created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setLeads([]);
    } else {
      setLeads((data || []) as BookingInquiry[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!mounted) return;

      if (!data.session) {
        router.replace('/admin/login');
        return;
      }

      await fetchLeads();
    }

    verifySession();

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/admin/login');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchLeads, router]);

  async function updateLeadStatus(id: string, status: LeadStatus) {
    setUpdatingId(id);
    setError('');
    setNotification(null);

    const previous = leads;
    setLeads(current => current.map(lead => (lead.id === id ? { ...lead, status } : lead)));

    const { error } = await supabaseBrowser
      .from('booking_inquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      setError(error.message);
      setLeads(previous);
    } else {
      setNotification({ text: `Status updated to ${status}.`, type: 'info' });
    }

    setUpdatingId(null);
  }

  async function handleFinalize(lead: BookingInquiry) {
    setFinalizingId(lead.id);
    setError('');
    setNotification(null);

    const previous = leads;
    // Optimistically update status to 'confirmed'
    setLeads(current =>
      current.map(item => (item.id === lead.id ? { ...item, status: 'confirmed' } : item))
    );

    const result = await finalizeBooking(lead.id, lead);

    if (result.error) {
      setError(result.error);
      setLeads(previous);
    } else if (result.emailSent) {
      setNotification({
        text: `Official confirmation email sent to ${lead.email} and booking marked as confirmed!`,
        type: 'success',
      });
    } else if (result.emailWarning) {
      setNotification({
        text: `Booking marked as confirmed in database. (Email note: ${result.emailWarning})`,
        type: 'info',
      });
    } else {
      setNotification({
        text: `Booking confirmed successfully.`,
        type: 'success',
      });
    }

    setFinalizingId(null);
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    router.replace('/admin/login');
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-8 md:px-10">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Discover Nepal" className="w-14 h-14 object-contain" />
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">Discover Nepal</span>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Booking Inquiries</h1>
          <p className="text-zinc-400 mt-2">
            Newest leads first. Update statuses or dispatch official confirmation emails with payment instructions.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchLeads}
            className="px-5 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors text-sm uppercase tracking-widest cursor-pointer"
          >
            Refresh
          </button>
          <button
            onClick={signOut}
            className="px-5 py-3 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors text-sm uppercase tracking-widest font-semibold cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Notifications Banner */}
      {notification && (
        <div className="max-w-7xl mx-auto mb-6">
          <div
            className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}
          >
            <span>{notification.text}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 cursor-pointer ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="p-4 rounded-2xl border border-red-800 bg-red-950/60 text-red-200 text-sm">
            {error}
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/70 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-10 text-zinc-400">Loading inquiries...</div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-zinc-400">No booking inquiries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/30 text-zinc-500 uppercase tracking-widest text-xs">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Created</th>
                  <th className="text-left px-6 py-4 font-medium">Customer</th>
                  <th className="text-left px-6 py-4 font-medium">Destination</th>
                  <th className="text-left px-6 py-4 font-medium">Target Date</th>
                  <th className="text-left px-6 py-4 font-medium">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-5 text-zinc-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-white">{lead.name}</div>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-zinc-400 hover:text-white transition-colors text-xs"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-6 py-5 text-zinc-300 whitespace-nowrap">
                      {destinationLabels[lead.destination_slug] || lead.destination_slug}
                    </td>
                    <td className="px-6 py-5 text-zinc-300 whitespace-nowrap">
                      {lead.date}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div>
                          <label htmlFor={`status-${lead.id}`} className="sr-only">
                            Update status for {lead.name}
                          </label>
                          <select
                            id={`status-${lead.id}`}
                            value={lead.status}
                            disabled={updatingId === lead.id || finalizingId === lead.id}
                            onChange={event =>
                              updateLeadStatus(lead.id, event.target.value as LeadStatus)
                            }
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-white/50 disabled:opacity-50 text-xs"
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* STAGE 8 Admin Finalize Action */}
                        <button
                          type="button"
                          disabled={finalizingId === lead.id || updatingId === lead.id}
                          onClick={() => handleFinalize(lead)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
                          title="Dispatch TripFinalized email to customer with payment instructions & set status to confirmed"
                        >
                          {finalizingId === lead.id
                            ? 'Dispatching...'
                            : lead.status === 'confirmed'
                            ? 'Resend Official Confirmation'
                            : 'Send Official Confirmation'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
