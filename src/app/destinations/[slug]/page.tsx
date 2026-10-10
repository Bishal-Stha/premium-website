export const instant = false;
import Link from 'next/link';
import { BookingForm } from './BookingForm';

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Format slug to nice title: "himalayas" -> "Himalayas"
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  return (
    <main className="bg-zinc-950 min-h-screen text-white pt-32 px-6 md:px-12">
      {/* Return Navigation */}
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold mb-12">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Maps
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 pb-32">
        
        {/* Left Col: Info */}
        <div>
          <span className="text-zinc-500 uppercase tracking-[0.3em] font-medium text-sm block mb-4">Destination</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg md:text-xl font-light text-zinc-400 leading-relaxed mb-8">
            Experience the breathtaking landscapes and unparalleled adventures of the {title}. This is your opportunity to immerse yourself in one of the most remarkable regional geographies of Nepal. High-altitude serenity, profound culture, and cinematic terrain await your arrival.
          </p>
          
          <div className="grid grid-cols-2 gap-6 mt-16 border-t border-zinc-900 pt-10">
            <div>
              <h4 className="text-white font-semibold mb-2">Duration</h4>
              <p className="text-zinc-500 text-sm">Flexible (4 - 14 Days)</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Difficulty</h4>
              <p className="text-zinc-500 text-sm">Adaptive</p>
            </div>
          </div>
        </div>

        {/* Right Col: Booking Form */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <h3 className="text-2xl font-semibold mb-6">Plan Your Experience</h3>
          <BookingForm destination={title} />
        </div>

      </div>
    </main>
  );
}
