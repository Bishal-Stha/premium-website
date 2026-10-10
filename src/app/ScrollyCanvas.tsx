"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Chapter {
  id: string;
  title: string;
  description: string;
  frame_start: number;
  frame_end: number;
  cta_text: string | null;
  cta_link: string | null;
}

export default function ScrollyCanvas({ chapters }: { chapters: Chapter[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const totalFrames = 240;

  // Track images & current scrub frame
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);

  // Preloader logic
  useEffect(() => {
    let count = 0;
    const images: HTMLImageElement[] = [];
    
    // Lock scroll on body while loading
    document.body.style.overflow = "hidden";

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameStr = i.toString().padStart(4, "0");
      img.src = `/assets/sequence/frame_${frameStr}.webp`;
      img.onload = () => {
        count++;
        setLoadedFrames(count);
        if (count === totalFrames) {
          // Add a slight delay for cinematic effect
          setTimeout(() => {
            setIsFullyLoaded(true);
            document.body.style.overflow = "auto";
          }, 800);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useGSAP(() => {
    if (!isFullyLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (!canvas || !ctx || !imagesRef.current) return;
      const f = Math.max(1, Math.min(totalFrames, Math.round(currentFrameRef.current))) - 1;
      const img = imagesRef.current[f];
      
      if (img && img.complete) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShiftX,
          centerShiftY,
          img.width * ratio,
          img.height * ratio
        );
      }
    };

    // Initial render
    render();
    window.addEventListener("resize", render);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalFrames * 25}`, // Make scroll path quite long
        scrub: 0.5,
        pin: true,
      },
    });

    tl.to(currentFrameRef, {
      current: totalFrames,
      snap: "current",
      ease: "none",
      onUpdate: () => {
        requestAnimationFrame(render);
      },
    });

    return () => {
      window.removeEventListener("resize", render);
    };
  }, [isFullyLoaded]);

  const loadingPercentage = Math.round((loadedFrames / totalFrames) * 100);

  return (
    <>
      <Navbar />

      {/* Cinematic Preloader */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 transition-all duration-1000 ${
          isFullyLoaded ? 'opacity-0 pointer-events-none translate-y-[-10px]' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <div className="w-64 mb-8">
          <div className="h-0.5 w-full bg-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100" 
              style={{ width: `${loadingPercentage}%` }} 
            />
          </div>
        </div>
        <p className="text-white text-sm tracking-[0.3em] uppercase font-light">
          Preparing the Journey — {loadingPercentage}%
        </p>
      </div>

      <div ref={containerRef} className="relative w-full bg-black">
        {/* The sticky canvas container */}
        <div className="relative w-full h-screen overflow-hidden">
          {/* Object-fit style via JS canvas rendering simulates cover perfectly */}
          <canvas ref={canvasRef} className="w-full h-full" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

          {/* Chapters Container with pointer-events-none so we don't block scroll but pointer-events-auto on children */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-[10%] xl:px-[15%] pointer-events-none">
            {chapters.map((chapter) => (
              <ChapterText 
                key={chapter.id} 
                chapter={chapter} 
                totalFrames={totalFrames}
                currentFrameRef={currentFrameRef} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Post-Canvas Section: Featured Packages */}
      <FeaturedPackages />
    </>
  );
}

// Navbar Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 transition-all duration-500 border-b border-transparent ${
      scrolled ? 'bg-black/50 backdrop-blur-md border-white/10 shadow-xl' : 'bg-transparent'
    }`}>
      <Link href="/" className="text-white text-xl md:text-2xl font-bold tracking-tighter uppercase lock relative">
        Discover Nepal
      </Link>
      <div className="hidden md:flex gap-8 items-center text-sm tracking-widest uppercase text-white/80">
        <Link href="#" className="hover:text-white transition-colors">Destinations</Link>
        <Link href="#" className="hover:text-white transition-colors">Experiences</Link>
        <Link href="#" className="hover:text-white transition-colors">Plan Your Trip</Link>
        <Link href="#" className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white">Book Now</Link>
      </div>
    </nav>
  );
}

function ChapterText({ 
  chapter, 
  totalFrames, 
  currentFrameRef 
}: { 
  chapter: Chapter; 
  totalFrames: number; 
  currentFrameRef: React.MutableRefObject<number> 
}) {
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;
    
    const onTick = () => {
      const frame = currentFrameRef.current;
      const margin = 15; 
      
      let opacity = 0;
      let yOffset = 30;

      if (frame >= chapter.frame_start && frame <= chapter.frame_end) {
        if (frame < chapter.frame_start + margin) {
          const t = (frame - chapter.frame_start) / margin;
          opacity = Math.pow(t, 2); 
          yOffset = 30 * (1 - opacity);
        } else if (frame > chapter.frame_end - margin) {
          const t = (chapter.frame_end - frame) / margin;
          opacity = Math.pow(t, 2);
          yOffset = -30 * (1 - opacity);
        } else {
          opacity = 1;
          yOffset = 0;
        }
      }

      const el = textRef.current;
      if (el) {
        el.style.opacity = opacity.toString();
        el.style.transform = `translateY(${yOffset}px)`;
        // Set visibility natively combined with pointerEvents so users can click only when visible!
        el.style.visibility = opacity > 0.05 ? "visible" : "hidden";
        el.style.pointerEvents = opacity > 0.8 ? "auto" : "none";
      }
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [chapter, totalFrames, currentFrameRef]);

  return (
    <div 
      ref={textRef} 
      className="absolute top-1/2 -translate-y-1/2 max-w-xl opacity-0 invisible"
    >
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white drop-shadow-md">
          {chapter.title}
        </h2>
        <p className="text-lg md:text-xl font-light text-neutral-300 leading-relaxed drop-shadow-lg mb-8">
          {chapter.description}
        </p>
        
        {chapter.cta_text && (
          <Link 
            href={chapter.cta_link || "#"} 
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm uppercase tracking-widest font-semibold rounded-full hover:bg-neutral-200 transition-transform hover:scale-105"
          >
            {chapter.cta_text}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

// Dummy extra section for scrolling
function FeaturedPackages() {
  const packages = [
    { id: 1, title: 'Everest Base Camp', days: '14 Days', img: '⛰️' },
    { id: 2, title: 'Annapurna Circuit', days: '12 Days', img: '🏕️' },
    { id: 3, title: 'Chitwan Wildlife Tour', days: '4 Days', img: '🦏' }
  ];

  return (
    <section className="bg-zinc-950 py-32 px-6 md:px-12 min-h-screen flex flex-col justify-center border-t border-zinc-900">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-16 text-center">
          Featured Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-colors group cursor-pointer">
              <div className="h-64 bg-zinc-800 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-700">
                {pkg.img}
              </div>
              <div className="p-8">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 block">{pkg.days}</span>
                <h3 className="text-2xl font-medium text-white mb-6">{pkg.title}</h3>
                <button className="text-sm font-medium border-b border-white pb-1 text-white hover:text-zinc-300 transition-colors">
                  View Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
