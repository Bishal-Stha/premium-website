"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TripModal } from "../components/TripModal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ChapterData {
  id: string;
  type: "hero" | "portal" | "red" | "culture" | "wild" | "finale";
  eyebrow?: string;
  headlineMain?: string;
  headlineHighlight?: string;
  headlineAccent?: string;
  subtext?: string;
  theme: "purple" | "portal" | "red" | "noir" | "terai" | "halftone";
  image: string;
  imageAlt: string;
  accentBadge?: string;
}

const CINEMATIC_CHAPTERS: ChapterData[] = [
  {
    id: "chapter-hero",
    type: "hero",
    eyebrow: "VOL. 01 — THE HIMALAYAN AWAKENING",
    headlineMain: "WHERE THE EARTH",
    headlineHighlight: "TOUCHES THE SKY",
    subtext: "Eight-thousand-meter monoliths piercing high-altitude twilight. An odyssey through pristine air, sacred valleys, and frozen eternal heights.",
    theme: "purple",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Himalayan night skyline bathed in deep purple and magenta twilight",
    accentBadge: "8,848M / NEON NOIR",
  },
  {
    id: "chapter-portal",
    type: "portal",
    eyebrow: "INTERLUDE — THE PASSAGE",
    headlineMain: "INTO THE VOID",
    subtext: "Beyond the troposphere, silence becomes tangible.",
    theme: "portal",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Deep magenta nebula and cosmic cloud swirls over high Himalayan ridge silhouettes",
    accentBadge: "DIMENSION TRANSIT",
  },
  {
    id: "chapter-red",
    type: "red",
    eyebrow: "VOL. 02 — SCARLET HORIZON",
    headlineMain: "THE ROOF OF",
    headlineHighlight: "THE WORLD",
    headlineAccent: "SAGARMATHA",
    subtext: "High-altitude oxygen depletion. Razor-sharp ice seracs glowing crimson in the last alpine sunset. Where legends test human mortality.",
    theme: "red",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Mount Everest and Lhotse bathed in crimson red sunset light with jagged glacial topography",
    accentBadge: "EBC // ELEVATION 5,364M",
  },
  {
    id: "chapter-culture",
    type: "culture",
    eyebrow: "VOL. 03 — ANCIENT CHRONICLES",
    headlineMain: "ANCIENT STREETS",
    headlineHighlight: "LIVING GODS",
    subtext: "Intricately carved pagoda roofs whispering centuries of tantric mysticism. Butter lamps flickering through narrow brick alleys of Kathmandu Valley.",
    theme: "noir",
    image: "https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Kathmandu Valley medieval temple square at midnight with glowing oil lamps and moody shadows",
    accentBadge: "KATHMANDU / VALLEY OF SHRINES",
  },
  {
    id: "chapter-wild",
    type: "wild",
    eyebrow: "VOL. 04 — JUNGLE PRIMAL",
    headlineMain: "BEFORE THE MIST LIFTS,",
    headlineHighlight: "THE JUNGLE IS ALREADY AWAKE.",
    subtext: "Deep sal forests echo with warning barks. Shadows of the greater one-horned rhinoceros carve trails through golden morning wetlands.",
    theme: "terai",
    image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Wild grasslands and jungle rivers of Chitwan shrouded in dense morning mist",
    accentBadge: "TERAI WILDLANDS // 150M ELEVATION",
  },
  {
    id: "chapter-finale",
    type: "finale",
    eyebrow: "EPILOGUE — YOUR SUMMONS",
    headlineMain: "SOMEWHERE ABOVE THE CLOUDS,",
    headlineHighlight: "NEPAL IS WAITING.",
    subtext: "Step beyond ordinary travels. Enter the realm of mountain kings, glacial passes, and timeless silence.",
    theme: "halftone",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Dramatic black and white panoramic mountain range collage with high-contrast comic framing",
    accentBadge: "EXPEDITION SEASON 2026/2027",
  },
];

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useLayoutEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMobile(!mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Desktop GSAP ScrollTrigger timeline pinning full viewport scenes
  useGSAP(
    () => {
      if (isMobile || !containerRef.current) return;

      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
      if (panels.length === 0) return;

      // Ensure first panel is visible immediately
      gsap.set(panels[0], { autoAlpha: 1, scale: 1 });
      // Hide other panels initially
      panels.slice(1).forEach((p) => {
        gsap.set(p, { autoAlpha: 0, scale: 1.08 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${panels.length * 100}%`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const index = Math.min(
              panels.length - 1,
              Math.floor(self.progress * panels.length)
            );
            setActiveChapterIndex(index);
          },
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const prevPanel = panels[i - 1];

        // Cross-dissolve + scale zoom for intense cinematic Spider-Verse feel
        tl.to(
          prevPanel,
          {
            autoAlpha: 0,
            scale: 0.94,
            filter: "brightness(0.4) blur(4px)",
            ease: "power2.inOut",
            duration: 1,
          },
          `step-${i}`
        );

        tl.fromTo(
          panel,
          {
            autoAlpha: 0,
            scale: 1.08,
            filter: "brightness(1.4) blur(4px)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "brightness(1) blur(0px)",
            ease: "power2.out",
            duration: 1,
          },
          `step-${i}`
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { dependencies: [isMobile], scope: containerRef }
  );

  return (
    <>
      <Navbar onBookNow={() => setModalOpen(true)} />

      {/* Persistent Film Grain and Vignette Texture Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 opacity-40 mix-blend-overlay film-grain"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]"
      />

      {/* Screen Reader Semantic Outlines */}
      <div className="sr-only">
        <h1>Discover Nepal — Cinematic Expedition Journey</h1>
        {CINEMATIC_CHAPTERS.map((ch, idx) => (
          <section key={ch.id} aria-label={`Chapter ${idx + 1}: ${ch.headlineMain}`}>
            <h2>{ch.headlineMain} {ch.headlineHighlight || ""}</h2>
            <p>{ch.subtext}</p>
          </section>
        ))}
      </div>

      {/* MAIN CONTAINER */}
      <div
        ref={containerRef}
        className={
          isMobile
            ? "relative w-full bg-black flex flex-col"
            : "relative w-full h-screen bg-black overflow-hidden"
        }
      >
        {CINEMATIC_CHAPTERS.map((chapter, idx) => (
          <div
            key={chapter.id}
            ref={(el) => {
              panelsRef.current[idx] = el;
            }}
            className={
              isMobile
                ? "relative w-full min-h-screen flex flex-col justify-between p-6 md:p-12 overflow-hidden border-b border-white/10"
                : `absolute inset-0 w-full h-full flex flex-col justify-between p-8 md:p-16 overflow-hidden ${
                    idx === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`
            }
          >
            {/* Background Art Layer with Color Grading */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={chapter.image}
                alt={chapter.imageAlt}
                fill
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className={`object-cover object-center transition-all duration-700 ${
                  chapter.theme === "purple"
                    ? "brightness-[0.72] contrast-[1.25] hue-rotate-[260deg] saturate-[1.6]"
                    : chapter.theme === "portal"
                    ? "brightness-[0.68] contrast-[1.4] hue-rotate-[290deg] saturate-[2.1]"
                    : chapter.theme === "red"
                    ? "brightness-[0.75] contrast-[1.35] hue-rotate-[320deg] saturate-[1.8]"
                    : chapter.theme === "noir"
                    ? "brightness-[0.6] contrast-[1.3] hue-rotate-[240deg] saturate-[1.4]"
                    : chapter.theme === "terai"
                    ? "brightness-[0.65] contrast-[1.25] hue-rotate-[340deg] saturate-[1.5]"
                    : "grayscale contrast-[1.65] brightness-[0.7]"
                }`}
              />

              {/* Tint Overlays matching Spider-Verse Reference Grading */}
              {chapter.theme === "purple" && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0014] via-[#3b0764]/40 to-[#18002e]/60 mix-blend-multiply" />
              )}
              {chapter.theme === "portal" && (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2e0854] via-[#86198f]/40 to-[#020617]/70 mix-blend-color-burn" />
              )}
              {chapter.theme === "red" && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#450a0a]/50 via-[#881337]/35 to-[#000000]/80 mix-blend-multiply" />
              )}
              {chapter.theme === "noir" && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b]/60 via-[#0f172a]/40 to-black/85 mix-blend-multiply" />
              )}
              {chapter.theme === "terai" && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-[#9f1239]/25 to-black/70 mix-blend-darken" />
              )}
              {chapter.theme === "halftone" && (
                <>
                  <div className="absolute inset-0 bg-black/60 z-0" />
                  <div className="absolute inset-0 halftone-dots opacity-20 mix-blend-overlay z-0" />
                  {/* Comic panel framing borders */}
                  <div className="absolute inset-4 md:inset-8 border-2 border-white/20 pointer-events-none z-10" />
                </>
              )}

              {/* Bottom black fade gradient for smooth readability */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
            </div>

            {/* TOP CHAPTER TAG / METRICS */}
            <div className="relative z-10 pt-20 md:pt-12 flex justify-between items-center text-xs tracking-[0.3em] uppercase">
              <span className="inline-flex items-center gap-2 font-mono font-bold text-white/80 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-white/15">
                <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
                {chapter.eyebrow}
              </span>
              {chapter.accentBadge && (
                <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-400 bg-white/5 px-2.5 py-1 border border-white/10 uppercase tracking-widest">
                  {chapter.accentBadge}
                </span>
              )}
            </div>

            {/* CENTER / BOTTOM CONTENT BLOCK */}
            <div className="relative z-10 pb-8 md:pb-12 max-w-5xl">
              {chapter.type === "hero" && (
                <div>
                  <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif-display uppercase font-black tracking-tight leading-[0.9] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
                    {chapter.headlineMain} <br />
                    <span className="bg-gradient-to-r from-white via-fuchsia-200 to-[#E11D48] bg-clip-text text-transparent italic font-serif">
                      {chapter.headlineHighlight}
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed drop-shadow-md">
                    {chapter.subtext}
                  </p>
                  <div className="mt-8 flex items-center gap-3 text-xs tracking-[0.4em] uppercase text-zinc-400">
                    <span className="w-12 h-[1px] bg-[#E11D48]" />
                    Scroll to Traverse Realm
                  </div>
                </div>
              )}

              {chapter.type === "portal" && (
                <div className="text-center mx-auto max-w-2xl py-12">
                  <span className="text-xs uppercase tracking-[0.6em] text-fuchsia-400 font-mono mb-4 block">
                    TRANS-HIMALAYAN CORRIDOR
                  </span>
                  <h2 className="text-5xl sm:text-7xl md:text-8xl font-condensed uppercase tracking-wider text-white drop-shadow-[0_0_40px_rgba(192,38,211,0.6)]">
                    {chapter.headlineMain}
                  </h2>
                  <p className="mt-4 text-xs md:text-sm uppercase tracking-widest text-zinc-300 font-light">
                    {chapter.subtext}
                  </p>
                </div>
              )}

              {chapter.type === "red" && (
                <div>
                  <span className="text-xs uppercase font-mono tracking-[0.4em] text-[#E11D48] font-bold mb-2 block">
                    8,848 METERS // CRUSHING PRESSURE
                  </span>
                  <h2 className="text-5xl sm:text-7xl md:text-9xl font-condensed uppercase tracking-tight text-[#E11D48] leading-[0.88] drop-shadow-[0_0_50px_rgba(225,29,72,0.6)]">
                    {chapter.headlineMain} <br />
                    <span className="text-white drop-shadow-2xl">
                      {chapter.headlineHighlight}
                    </span>
                  </h2>
                  <p className="mt-6 max-w-xl text-sm md:text-base text-zinc-300 font-light leading-relaxed border-l-2 border-[#E11D48] pl-4">
                    {chapter.subtext}
                  </p>
                </div>
              )}

              {chapter.type === "culture" && (
                <div>
                  <span className="text-xs uppercase font-mono tracking-[0.4em] text-fuchsia-300/80 mb-2 block">
                    THE SHADOW TEMPLES // KATHMANDU VALLEY
                  </span>
                  <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif-display uppercase font-bold tracking-tight text-white leading-[0.92] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                    {chapter.headlineMain} <br />
                    <span className="italic font-serif text-fuchsia-300 drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]">
                      {chapter.headlineHighlight}
                    </span>
                  </h2>
                  <p className="mt-6 max-w-xl text-sm md:text-base text-zinc-300 font-light leading-relaxed">
                    {chapter.subtext}
                  </p>
                </div>
              )}

              {chapter.type === "wild" && (
                <div>
                  <span className="text-xs uppercase font-mono tracking-[0.4em] text-[#E11D48] font-semibold mb-2 block">
                    THE CHITWAN FLOODPLAINS
                  </span>
                  <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-condensed uppercase tracking-tight text-white leading-[0.95]">
                    {chapter.headlineMain} <br />
                    <span className="text-[#E11D48] drop-shadow-[0_0_35px_rgba(225,29,72,0.8)]">
                      {chapter.headlineHighlight}
                    </span>
                  </h2>
                  <p className="mt-6 max-w-xl text-sm md:text-base text-zinc-300 font-light leading-relaxed border-l border-[#E11D48]/60 pl-4">
                    {chapter.subtext}
                  </p>
                </div>
              )}

              {chapter.type === "finale" && (
                <div className="relative z-20">
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#E11D48] font-mono text-xs uppercase tracking-widest font-bold">
                    <span>★</span> THE FINAL SUMMONS <span>★</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-condensed uppercase tracking-tight text-white leading-[0.9] drop-shadow-2xl">
                    {chapter.headlineMain} <br />
                    <span className="text-[#E11D48] drop-shadow-[0_0_40px_rgba(225,29,72,0.9)] underline decoration-white/30 decoration-wavy">
                      {chapter.headlineHighlight}
                    </span>
                  </h2>
                  <p className="mt-6 max-w-xl text-sm md:text-lg text-zinc-300 font-light leading-relaxed">
                    {chapter.subtext}
                  </p>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="px-10 py-5 bg-[#E11D48] hover:bg-[#be123c] text-white text-xs md:text-sm uppercase font-condensed tracking-[0.25em] font-bold rounded-sm shadow-[0_0_35px_rgba(225,29,72,0.8)] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3"
                    >
                      Begin The Journey
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>

                    <Link
                      href="/destinations"
                      className="px-8 py-5 border border-white/30 hover:border-white text-white text-xs uppercase tracking-widest font-semibold hover:bg-white/10 transition-colors"
                    >
                      Explore All 9 Expeditions
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Chapter Indicator Bar */}
            <div className="relative z-10 hidden md:flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-zinc-500">
              <span>0{idx + 1}</span>
              <div className="w-16 h-[2px] bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#E11D48] transition-all duration-300"
                  style={{
                    width: activeChapterIndex === idx ? "100%" : "0%",
                  }}
                />
              </div>
              <span>0{CINEMATIC_CHAPTERS.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Expeditions Grid below the cinematic hero experience */}
      <FeaturedPackages />

      <TripModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function Navbar({ onBookNow }: { onBookNow: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 border-b ${
          scrolled || menuOpen
            ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl"
            : "bg-gradient-to-b from-black/80 to-transparent border-transparent"
        }`}
      >
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-3 relative z-50 group"
        >
          <img
            src="/logo.png"
            alt="Discover Nepal"
            className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(225,29,72,0.6)]"
          />
          <span className="text-xs uppercase tracking-[0.35em] font-semibold text-white/90">
            DISCOVER NEPAL
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main Navigation" className="hidden md:flex gap-8 items-center text-xs tracking-[0.25em] uppercase text-zinc-300 font-medium">
          <Link
            href="/destinations"
            className="hover:text-white transition-colors"
          >
            Destinations
          </Link>
          <a href="#experiences" className="hover:text-white transition-colors">
            Featured
          </a>
          <Link
            href="/manage-booking"
            className="hover:text-emerald-400 transition-colors"
          >
            Portal
          </Link>
          <button
            onClick={onBookNow}
            className="px-6 py-2.5 bg-[#E11D48] text-white hover:bg-[#be123c] rounded-sm font-condensed uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_20px_rgba(225,29,72,0.5)] cursor-pointer"
          >
            Plan Expedition
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-white z-50 focus:outline-none p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-8 items-center text-sm tracking-[0.3em] uppercase text-white font-medium">
          <Link onClick={() => setMenuOpen(false)} href="/destinations" className="hover:text-zinc-400">
            Destinations
          </Link>
          <a onClick={() => setMenuOpen(false)} href="#experiences" className="hover:text-zinc-400">
            Featured
          </a>
          <Link onClick={() => setMenuOpen(false)} href="/manage-booking" className="hover:text-emerald-400">
            Manage Booking
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              onBookNow();
            }}
            className="px-8 py-3 bg-[#E11D48] text-white uppercase font-condensed tracking-widest text-xs font-bold rounded-sm shadow-xl cursor-pointer"
          >
            Plan Expedition
          </button>
        </div>
      </div>
    </>
  );
}

function FeaturedPackages() {
  const packages = [
    {
      id: "ebc",
      title: "Everest Base Camp",
      days: "14 Days",
      img: "/assets/thumb_everest.jpg",
      link: "/destinations/himalayas",
      tagline: "The high-altitude proving ground under Sagarmatha.",
    },
    {
      id: "mustang",
      title: "Upper Mustang Forbidden Kingdom",
      days: "14 Days",
      img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      link: "/destinations/upper-mustang",
      tagline: "Ancient Tibetan sky caves and the walled city of Lo Manthang.",
    },
    {
      id: "gokyo",
      title: "Gokyo Lakes & Everest",
      days: "15 Days",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      link: "/destinations/gokyo-lakes",
      tagline: "Sapphire glacial waters reflecting four 8,000m summits.",
    },
  ];

  return (
    <section id="experiences" className="bg-zinc-950 py-20 px-6 md:px-12 border-t border-zinc-900 relative z-20">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] font-mono text-[#E11D48] font-bold block mb-2">
              CURATED HIMALAYAN EXPEDITIONS
            </span>
            <h2 className="text-4xl md:text-6xl font-condensed uppercase tracking-tight text-white">
              Signature Journeys
            </h2>
          </div>
          <Link
            href="/destinations"
            className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border-b border-white/20 pb-1 self-start md:self-auto"
          >
            View All 9 Regional Packages →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Link href={pkg.link} key={pkg.id} className="block group">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-[#E11D48]/50 transition-all duration-500 cursor-pointer h-full flex flex-col group-hover:-translate-y-1">
                <div className="h-64 bg-zinc-800 relative overflow-hidden">
                  <Image
                    src={pkg.img}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest text-white border border-white/10 font-bold">
                      {pkg.days}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-serif-display uppercase font-bold text-white mb-2 group-hover:text-[#E11D48] transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6 flex-1">
                    {pkg.tagline}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-zinc-300">
                    <span>View Itinerary</span>
                    <span className="text-[#E11D48] group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
