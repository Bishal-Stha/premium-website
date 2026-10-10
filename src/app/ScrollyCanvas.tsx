"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Chapter {
  id: string;
  title: string;
  description: string;
  frame_start: number;
  frame_end: number;
}

export default function ScrollyCanvas({ chapters }: { chapters: Chapter[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const totalFrames = 240;

  // We keep track of the images so we can draw them quickly
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1); // 1 to 240

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    // Preload them
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      // frame_0001.webp
      const frameStr = i.toString().padStart(4, "0");
      img.src = `/assets/sequence/frame_${frameStr}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };
      // Error handling fallbacks could be added here
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      // cleanup if needed
    };
  }, []);

  // Set up ScrollTrigger and Drawing
  useGSAP(() => {
    if (!loaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas always fill the screen while keeping aspect ratio or covering
    const render = () => {
      if (!canvas || !ctx || !imagesRef.current) return;
      const f = Math.max(1, Math.min(totalFrames, Math.round(currentFrameRef.current))) - 1;
      const img = imagesRef.current[f];
      
      if (img && img.complete) {
        // Draw image covering the canvas (like object-fit: cover)
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

    // Draw first frame right away
    render();

    // Re-render on resize
    window.addEventListener("resize", render);

    // Setup timeline for scrolling
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalFrames * 20}`, // 20px per frame seems fine, or bigger
        scrub: 0.5, // 0.5s smoothing
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", render);
    };
  }, [loaded]);

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <p className="text-white text-xl tracking-widest uppercase font-light">Loading Experience...</p>
        </div>
      )}

      {/* The sticky canvas container */}
      <div className="relative w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        
        {/* Overlay gradient for text readability (cinematic touch) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

        {/* Text chapters container over the canvas */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center px-[10%] xl:px-[15%]">
          {chapters.map((chapter) => {
            return (
              <ChapterText 
                key={chapter.id} 
                chapter={chapter} 
                totalFrames={totalFrames}
                currentFrameRef={currentFrameRef} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Separate component for text to handle its own GSAP logic
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
    
    // We want the text to appear when we scroll into its frame region.
    // However, since the parent is pinned and handles the single ScrollTrigger scrub,
    // we can either hook into the same parent ScrollTrigger or create a custom GSAP 
    // timeline that observes `currentFrameRef.current` in an onUpdate loop.
    
    // An alternative GSAP-native way: Since the parent scrolltrigger scrubs 0-1 over the whole distance,
    // we can make a timeline that is synced to the outer scrolltrigger. 
    // But since `ScrollyCanvas` container is pinned, normal scrolltriggers inside it based on DOM position won't work well.
    // Instead, we just animate based on container's ScrollTrigger by finding it, or use GSAP timeline with `progress`.
    
    // Let's use GSAP's native timeline for this chapter, linked to the closest ScrollTrigger
    // Since we know the frame_start and frame_end, we can calculate the percentage (0 to 1).
    
    const startProgress = chapter.frame_start / totalFrames;
    const endProgress = Math.min(1, chapter.frame_end / totalFrames);
    const midProgress = startProgress + (endProgress - startProgress) / 2;

    // We can just use a ticker to check the frame, or a GSAP tween that scrubs.
    // Since the parent scrub might not be 100% linear if we have complex things, a ticker is robust:
    const onTick = () => {
      const frame = currentFrameRef.current;
      // Fade in smoothly when entering chapter, fade out smoothly when leaving
      const margin = 10; // frames for fade
      
      let opacity = 0;
      let yOffset = 20;

      if (frame >= chapter.frame_start && frame <= chapter.frame_end) {
        // We are inside the chapter
        if (frame < chapter.frame_start + margin) {
          // fades in
          const t = (frame - chapter.frame_start) / margin;
          opacity = t;
          yOffset = 20 * (1 - t);
        } else if (frame > chapter.frame_end - margin) {
          // fades out
          const t = (chapter.frame_end - frame) / margin;
          opacity = t;
          yOffset = -20 * (1 - t);
        } else {
          opacity = 1;
          yOffset = 0;
        }
      }

      if (textRef.current) {
        textRef.current.style.opacity = opacity.toString();
        textRef.current.style.transform = `translateY(${yOffset}px)`;
        textRef.current.style.visibility = opacity > 0 ? "visible" : "hidden";
      }
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [chapter, totalFrames, currentFrameRef]);

  return (
    <div 
      ref={textRef} 
      className="absolute top-1/2 left-[10%] xl:left-[15%] -translate-y-1/2 max-w-2xl opacity-0 invisible"
    >
      <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white drop-shadow-md">
        {chapter.title}
      </h2>
      <p className="text-xl md:text-2xl font-light text-neutral-200 leading-relaxed drop-shadow-lg">
        {chapter.description}
      </p>
    </div>
  );
}
