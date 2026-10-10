import Link from 'next/link';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Destinations | Discover Nepal',
  description: 'Explore our curated selection of premium travel packages across the Himalayas, Hills, Rivers, and Terai regions of Nepal.',
};

export const instant = false; // Disable partial prerendering if needed

const packages = [
  { id: 1, slug: 'himalayas', title: 'The Himalayas', days: '14 Days', img: '/assets/thumb_everest.jpg', description: 'Journey to the roof of the world. Stand in the shadow of Mount Everest and explore ancient Sherpa villages.' },
  { id: 2, slug: 'hills', title: 'The Hilly Region', days: '12 Days', img: '/assets/thumb_annapurna.jpg', description: 'Trek the legendary Annapurna circuit. Vibrant valleys, rhododendron forests, and deeply rooted local cultures.' },
  { id: 3, slug: 'rivers', title: 'The Raging Rivers', days: '5 Days', img: '/assets/thumb_river.jpg', description: 'Adrenaline-pumping whitewater rafting and kayaking adventures winding down from the glacial peaks.' },
  { id: 4, slug: 'terai', title: 'The Terai Plains', days: '4 Days', img: '/assets/thumb_chitwan.jpg', description: 'Exclusive jungle safaris. Track Bengal tigers, one-horned rhinos, and wild elephants in their natural habitats.' }
];

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <Link href="/" className="flex items-center hover:scale-105 transition-transform">
          <img src="/logo.png" alt="Discover Nepal" className="w-16 h-16 md:w-20 md:h-20 object-contain hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all" />
        </Link>
        <Link href="/" className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white uppercase tracking-widest text-sm cursor-pointer">
          Back to Home
        </Link>
      </nav>

      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex-1">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-md">All Destinations</h1>
          <p className="text-xl font-light text-neutral-300 max-w-2xl mx-auto">
            Choose your path through Nepal's diverse landscapes. Every region offers a fundamentally unique perspective of the country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map(pkg => (
            <Link href={`/destinations/${pkg.slug}`} key={pkg.id} className="block group">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-colors cursor-pointer h-full flex flex-col">
                <div className="h-80 bg-zinc-800 relative overflow-hidden">
                  <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-black/20 to-transparent group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-widest text-white font-semibold">
                      {pkg.days}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-3xl font-medium text-white mb-4">{pkg.title}</h3>
                  <p className="text-zinc-400 font-light mb-8 flex-1">{pkg.description}</p>
                  <div className="inline-block text-sm font-medium border-b border-white/30 pb-1 text-white group-hover:border-white transition-colors self-start">
                    View Details & Itinerary
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
