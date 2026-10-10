import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    content = f.read()

# Add import
import_str = "import { TripModal } from '../components/TripModal';\n"
content = content.replace('gsap.registerPlugin(ScrollTrigger, useGSAP);', import_str + '\ngsap.registerPlugin(ScrollTrigger, useGSAP);')

# Update Navbar signature and internals
navbar_orig = """function Navbar() {
  const [scrolled, setScrolled] = useState(false);"""
navbar_new = """function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);"""
content = content.replace(navbar_orig, navbar_new)

# Update the "Plan Your Trip" and "Book Now" links in Navbar to point to modal
from_links = """        <Link href="/destinations/rivers" className="hover:text-white transition-colors">Plan Your Trip</Link>
        <Link href="/destinations/terai" className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white">Book Now</Link>"""
to_links = """        <button onClick={() => setModalOpen(true)} className="hover:text-white transition-colors uppercase tracking-widest text-sm">Plan Your Trip</button>
        <button onClick={() => setModalOpen(true)} className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white uppercase tracking-widest text-sm">Book Now</button>
      </div>
      <TripModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />"""
content = content.replace(from_links + "\n      </div>", to_links)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(content)
