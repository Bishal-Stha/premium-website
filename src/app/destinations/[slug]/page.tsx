import Link from 'next/link';
import { BookingForm } from './BookingForm';
import { notFound } from 'next/navigation';

export const instant = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://discovernepaltours.vercel.app';

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
  },
  'upper-mustang': {
    title: "Upper Mustang",
    tagline: "The Last Forbidden Kingdom of the Himalayas.",
    description: "Journey into the \"Last Forbidden Kingdom.\" Experience Trans-Himalayan deserts, ancient sky caves, and the walled Tibetan city of Lo Manthang. Immerse yourself in preserved centuries-old Tibetan Buddhist traditions amidst dramatic ochre canyons.",
    duration: "14 Days",
    difficulty: "Challenging",
    price: "$2,650 USD",
    itinerary: [
      { day: 1, title: "Arrival in Kathmandu & Special Permit Processing" },
      { day: 2, title: "Fly to Pokhara & Drive to Jomsom" },
      { day: 3, title: "Enter Restricted Region: Trek to Kagbeni & Chele" },
      { day: 7, title: "Explore the Walled Capital of Lo Manthang" },
      { day: 10, title: "Discover Ancient Sky Caves & Monasteries in Chhoser" },
      { day: 14, title: "Return Flight to Kathmandu via Pokhara" }
    ]
  },
  'manaslu-circuit': {
    title: "Manaslu Circuit",
    tagline: "Circling the Mountain of the Spirit.",
    description: "An off-the-beaten-path adventure circling the world's 8th highest peak, featuring the thrilling Larkya La Pass and rich Tibetan Buddhist culture. Traverse dramatic river gorges, pristine alpine forests, and rugged Himalayan wilderness.",
    duration: "14 Days",
    difficulty: "Challenging",
    price: "$2,100 USD",
    itinerary: [
      { day: 1, title: "Drive from Kathmandu to Soti Khola / Machha Khola" },
      { day: 3, title: "Trek along the Budhi Gandaki Gorge to Jagat" },
      { day: 6, title: "Ascend to Samagaon with Views of Mount Manaslu" },
      { day: 9, title: "Acclimatization & Exploration around Samdo" },
      { day: 11, title: "Cross the High Larkya La Pass (5,160m)" },
      { day: 14, title: "Descend to Besisahar & Drive back to Kathmandu" }
    ]
  },
  'langtang-valley': {
    title: "Langtang Valley",
    tagline: "The Valley of Glaciers and Sacred Monasteries.",
    description: "Known as the \"Valley of Glaciers.\" A stunning, accessible trek through Tamang villages, alpine meadows, and Kyanjin Gompa. Gaze at panoramic views of Langtang Lirung and experience the warmth of resilient Himalayan communities.",
    duration: "10 Days",
    difficulty: "Moderate",
    price: "$1,450 USD",
    itinerary: [
      { day: 1, title: "Drive from Kathmandu to Syabrubesi" },
      { day: 2, title: "Trek through Lush Forests to Lama Hotel" },
      { day: 4, title: "Ascent into Langtang Village and Kyanjin Gompa" },
      { day: 6, title: "Panoramic Sunrise Hike up Kyanjin Ri (4,773m)" },
      { day: 8, title: "Descend back toward Bamboo and Rimche" },
      { day: 10, title: "Return Drive to Kathmandu" }
    ]
  },
  'gokyo-lakes': {
    title: "Gokyo Lakes & Everest",
    tagline: "Cobalt alpine waters beneath the giants.",
    description: "A pristine alternative to the crowded Everest Base Camp trail. Witness sapphire Himalayan lakes and a panoramic sunrise from Gokyo Ri. Marvel at four 8,000-meter peaks including Everest, Lhotse, Makalu, and Cho Oyu from one vantage point.",
    duration: "15 Days",
    difficulty: "Challenging",
    price: "$2,550 USD",
    itinerary: [
      { day: 1, title: "Scenic Flight from Kathmandu to Lukla & Trek to Phakding" },
      { day: 3, title: "Ascend to Sherpa Capital Namche Bazaar" },
      { day: 6, title: "Trek through Dole and Machhermo into the Gokyo Valley" },
      { day: 8, title: "Reach the Turquoise Third Lake of Gokyo" },
      { day: 10, title: "Sunrise Ascent of Gokyo Ri (5,357m) with Everest Panorama" },
      { day: 15, title: "Trek to Lukla and Fly back to Kathmandu" }
    ]
  },
  'mardi-himal': {
    title: "Mardi Himal Base Camp",
    tagline: "The quiet ridgeline trek beneath Fishtail.",
    description: "A hidden gem in the Annapurna region offering peaceful ridgeline walks and spectacular, close-up views of Mount Machhapuchhre (Fishtail). Walk above the cloud line on narrow, dramatic ridges flanked by soaring Himalayan summits.",
    duration: "8 Days",
    difficulty: "Moderate",
    price: "$1,250 USD",
    itinerary: [
      { day: 1, title: "Drive from Pokhara to Kande & Trek to Australian Camp" },
      { day: 2, title: "Ascend through Enchanting Rhododendron Forests to Forest Camp" },
      { day: 3, title: "Climb along the Ridge to Low Camp and High Camp (3,580m)" },
      { day: 5, title: "Pre-dawn Trek to Mardi Himal Viewpoint & Base Camp (4,500m)" },
      { day: 6, title: "Descend to Siding Village" },
      { day: 8, title: "Return to Pokhara for Lakeside Relaxation" }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const data = destinationData[slug as keyof typeof destinationData];

  if (!data) {
    return {
      title: 'Destination Not Found',
    };
  }

  const canonicalUrl = `${siteUrl}/destinations/${slug}`;

  return {
    title: `${data.title} | Discover Nepal`,
    description: data.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${data.title} | Discover Nepal`,
      description: data.description,
      url: canonicalUrl,
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!(slug in destinationData)) {
    notFound();
  }

  const data = destinationData[slug as keyof typeof destinationData];
  const canonicalUrl = `${siteUrl}/destinations/${slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Destinations",
        "item": `${siteUrl}/destinations`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <main className="bg-zinc-950 min-h-screen text-white pt-32 px-6 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 font-medium">
          <li>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
          </li>
          <li>/</li>
          <li className="text-zinc-300 font-semibold">{data.title}</li>
        </ol>
      </nav>

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
            &ldquo;{data.tagline}&rdquo;
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
