"use client";

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin/dashboard');
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace('/admin/dashboard');
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <Link href="/" className="inline-flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="Discover Nepal" className="w-14 h-14 object-contain" />
          <span className="text-sm uppercase tracking-[0.3em] text-zinc-400">Admin</span>
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight mb-2">Lead Management</h1>
        <p className="text-zinc-400 mb-8">Sign in securely to view and process booking inquiries.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none focus:border-white/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}
