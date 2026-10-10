import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    content = f.read()

navbar_orig = """function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
        <Link href="/destinations/himalayas" className="hover:text-white transition-colors">Destinations</Link>
        <Link href="/destinations/hills" className="hover:text-white transition-colors">Experiences</Link>
        <button onClick={() => setModalOpen(true)} className="hover:text-white transition-colors uppercase tracking-widest text-sm">Plan Your Trip</button>
        <button onClick={() => setModalOpen(true)} className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white uppercase tracking-widest text-sm">Book Now</button>
      </div>
      <TripModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </nav>
  );
}"""

navbar_new = """function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 transition-all duration-500 border-b border-transparent ${
        scrolled || menuOpen ? 'bg-black/90 backdrop-blur-md border-white/10 shadow-xl' : 'bg-transparent'
      }`}>
        <Link href="/" className="text-white text-xl md:text-2xl font-bold tracking-tighter uppercase relative z-50">
          Discover Nepal
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center text-sm tracking-widest uppercase text-white/80">
          <Link href="/destinations/himalayas" className="hover:text-white transition-colors">Destinations</Link>
          <Link href="/destinations/hills" className="hover:text-white transition-colors">Experiences</Link>
          <button onClick={() => setModalOpen(true)} className="hover:text-white transition-colors uppercase tracking-widest text-sm">Plan Your Trip</button>
          <button onClick={() => setModalOpen(true)} className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white uppercase tracking-widest text-sm cursor-pointer">Book Now</button>
        </div>

        {/* Mobile Hamburger Icon */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white z-50 focus:outline-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center transition-all duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-8 items-center text-lg tracking-widest uppercase text-white">
          <Link onClick={() => setMenuOpen(false)} href="/destinations/himalayas" className="hover:text-gray-300">Destinations</Link>
          <Link onClick={() => setMenuOpen(false)} href="/destinations/hills" className="hover:text-gray-300">Experiences</Link>
          <button onClick={() => { setMenuOpen(false); setModalOpen(true); }} className="hover:text-gray-300 uppercase tracking-widest">Plan Your Trip</button>
          <button onClick={() => { setMenuOpen(false); setModalOpen(true); }} className="px-8 py-3 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium cursor-pointer">Book Now</button>
        </div>
      </div>

      <TripModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}"""

content = content.replace(navbar_orig, navbar_new)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(content)
