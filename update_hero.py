import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    content = f.read()

# Add heroRef
import_str = "export default function ScrollyCanvas({ chapters }: { chapters: Chapter[] }) {"
hero_refs = """export default function ScrollyCanvas({ chapters }: { chapters: Chapter[] }) {
  const heroRef = useRef<HTMLDivElement>(null);"""
content = content.replace(import_str, hero_refs)

# Update the render ticking code to hide the hero layer past frame 15
gsap_tl = """      onUpdate: () => {
        if (!isMobile) requestAnimationFrame(render);
      },"""
gsap_tl_new = """      onUpdate: () => {
        if (!isMobile) requestAnimationFrame(render);
        // Fade out hero
        if (heroRef.current) {
          const frame = currentFrameRef.current;
          const opacity = Math.max(0, 1 - (frame / 20));
          heroRef.current.style.opacity = opacity.toString();
          heroRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
        }
      },"""
content = content.replace(gsap_tl, gsap_tl_new)

# Add the Hero UI just above Chapter text map
target_div = "{/* Interactive Text Layer */}"
hero_ui = """{/* First-Load Hero Overlay */}
          <div ref={heroRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none transition-opacity duration-300">
             <span className="text-white/80 uppercase tracking-[0.5em] text-sm md:text-base font-semibold mb-4 drop-shadow-md">Welcome to the Top of the World</span>
             <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white drop-shadow-2xl mb-6">NEPAL</h1>
             <p className="max-w-xl text-lg md:text-xl font-light text-neutral-200 drop-shadow-xl">Embark on a cinematic journey through ancient mountains, cultural heartlands, and wild plains.</p>
             <div className="mt-12 flex flex-col items-center gap-2 animate-bounce opacity-80">
                <span className="text-xs uppercase tracking-widest text-white">Scroll to Explore</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
             </div>
          </div>
          
          {/* Interactive Text Layer */}"""

content = content.replace(target_div, hero_ui)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(content)

