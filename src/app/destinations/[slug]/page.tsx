import Link from 'next/link';
import { BookingForm } from './BookingForm';
import { notFound } from 'next/navigation';

export const instant = false;

const destinationData = {
  himalayas: {
    title: "Everest & The Himalayas",
    tagline: "High-altitude serenity and monumental peaks.",
    description: "Experience the breathtaking landscapes and unparalleled adventures of the High Himalayas. This is your opportunity to immerse yourself in one of the most remarkable regional geographies of Nepal. Towering peaks, profound sherpa culture, and cinematic terrain await your arrival.",
    duration: "14 Days",
    difficulty: "Challenging",
    price: "$2,400 USD",
    itinerary: [
      { day: 1, title: "Arrival in Kathmandu" },
      { day: 2, title: "Fly to Lukla & Trek to Phakding" },
      { day: 3, title: "Ascent to Namche Bazaar" },
      { day: 14, title: "Return to Kathmandu" }
    ]
  },
  hills: {
    title: "Cultural Heartlands",
    tagline: "Terraced valleys and medieval heritage.",
    description: "Journey through the ancient trade routes and profound cultural heritage surrounding the Annapurna circuit. Encounter medieval temples, welcoming local homestays, and stunning mid-altitude trails.",
    duration: "12 Days",
    difficulty: "Moderate",
    price: "$1,850 USD",
    itinerary: [
      { day: 1, title: "Arrival in Kathmandu & Transfer to Pokhara" },
      { day: 2, title: "Trek to Tikhedhunga" },
      { day: 3, title: "Ascent to Ghorepani" },
      { day: 12, title: "Return to Pokhara" }
    ]
  },
  rivers: {
    title: "River Expeditions",
    tagline: "White water raging down from the glaciers.",
    description: "Navigate some of the fastest, most exhilarating glacial rapids on earth. From the Trisuli to the Sun Kosi, our river expeditions offer heart-pounding adventure fused with remote riverside camping.",
    duration: "6 Days",
    difficulty: "Moderate to Challenging",
    price: "$950 USD",
    itinerary: [
      { day: 1, title: "Briefing & River Transfer" },
      { day: 2, title: "Class IV Rapids Navigation" },
      { day: 3, title: "Riverside Beach Camp" },
      { day: 6, title: "Takeout & Return Transfer" }
    ]
  },
  terai: {
    title: "Jungle Safaris",
    tagline: "Untamed wilderness and rare wildlife.",
    description: "Explore the golden flatlands and dense tropical jungles of the Terai. Home to the endangered one-horned rhinoceros and the elusive Bengal Tiger. Experience luxury eco-lodges integrated seamlessly into the wilderness.",
    duration: "4 Days",
    difficulty: "Relaxing",
    price: "$1,200 USD",
    itinerary: [
      { day: 1, title: "Fly to Bharatpur & Lodge Check-in" },
      { day: 2, title: "Jeep Safari & Wildlife Tracking" },
      { day: 3, title: "Canoe Ride & Tharu Cultural Event" },
      { day: 4, title: "Departure" }
    ]
  }
};

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  if (!(slug in destinationData)) {
    notFound();
  }

  const data = destinationData[slug as keyof typeof destinationData];

  return (
    <main className="bg-zinc-950 min-h-screen text-white pt-32 px-6 md:px-12">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold mb-12">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 pb-32">
        
        {/* Left Col: Info */}
        <div>
          <span className="text-zinc-500 uppercase tracking-[0.3em] font-medium text-sm block mb-4">Destination</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            {data.title}
          </h1>
          <h2 className="text-xl md:text-2xl font-light text-zinc-300 mb-8 italic">
            "{data.tagline}"
          </h2>
          <p className="text-lg md:text-xl font-light text-zinc-400 leading-relaxed mb-8">
            {data.description}
          </p>
          
          <div className="grid grid-cols-3 gap-6 mt-12 border-t border-zinc-900 pt-10">
            <div>
              <h4 className="text-white font-semibold mb-2">Duration</h4>
              <p className="text-zinc-500 text-sm">{data.duration}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Difficulty</h4>
              <p className="text-zinc-500 text-sm">{data.difficulty}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Est. Cost</h4>
              <p className="text-emerald-400 text-sm font-semibold">{data.price}</p>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-semibold mb-6">Sample Itinerary</h3>
            <div className="space-y-4">
              {data.itinerary.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                  <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest min-w-[80px]">Day {item.day}</span>
                  <span className="text-white text-lg font-light">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Booking Form */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden h-fit sticky top-32">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          <h3 className="text-2xl font-semibold mb-6">Plan Your Experience</h3>
          <BookingForm destinationSlug={slug} />
        </div>

      </div>
    </main>
  );
}
