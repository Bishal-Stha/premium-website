import Link from 'next/link';

export default function PoliciesPage() {
  return (
    <main className="bg-zinc-950 min-h-screen text-white pt-32 px-6 md:px-12 pb-32">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold mb-12">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 border-b border-zinc-800 pb-8">Legal & Policies</h1>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-semibold mb-6">1. Terms & Conditions</h2>
            <div className="text-zinc-400 font-light leading-relaxed space-y-4">
              <p>Welcome to Discover Nepal. By booking a tour, trek, or expedition with us, you agree to the following terms and conditions. These form the fundamental agreement between you (the client) and Discover Nepal Premium Tours.</p>
              <p>All participants must be of robust physical health for Himalayan treks. We require accurate medical declarations prior to expedition authorization.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">2. Cancellation Policy</h2>
            <div className="text-zinc-400 font-light leading-relaxed space-y-4">
              <p>Due to the rigorous logistic forecasting required for premium wilderness access, our cancellation policy protects both our local crews and global operations.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-sm text-zinc-300">
                <li><strong>60+ Days Prior:</strong> Full refund minus a $200 processing and permit fee.</li>
                <li><strong>30 - 59 Days Prior:</strong> 50% refund applied to original booking string.</li>
                <li><strong>Under 30 Days:</strong> Non-refundable due to fully locked logistics, porters, and localized permits.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">3. Privacy & Data Handling</h2>
            <div className="text-zinc-400 font-light leading-relaxed space-y-4">
              <p>Your privacy is paramount. Lead inquiries containing Personally Identifiable Information (email, legal name, phone structures) are encrypted within our cloud storage array strictly for booking operations.</p>
              <p>We do not broker, sell, or distribute your email data to tertiary marketing affiliates. Data requests can be terminated upon explicit email request.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
