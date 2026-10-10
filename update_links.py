import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    content = f.read()

# Update Navbar Links
content = re.sub(
    r'<Link href="#" className="hover:text-white transition-colors">Destinations</Link>',
    r'<Link href="/destinations/himalayas" className="hover:text-white transition-colors">Destinations</Link>',
    content
)
content = re.sub(
    r'<Link href="#" className="hover:text-white transition-colors">Experiences</Link>',
    r'<Link href="/destinations/hills" className="hover:text-white transition-colors">Experiences</Link>',
    content
)
content = re.sub(
    r'<Link href="#" className="hover:text-white transition-colors">Plan Your Trip</Link>',
    r'<Link href="/destinations/rivers" className="hover:text-white transition-colors">Plan Your Trip</Link>',
    content
)
content = re.sub(
    r'<Link href="#" className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white">Book Now</Link>',
    r'<Link href="/destinations/terai" className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors font-medium text-white">Book Now</Link>',
    content
)

# Update fallback CTA link
content = re.sub(
    r'href={chapter.cta_link \|\| "#"}',
    r'href={chapter.cta_link || "/destinations/himalayas"}',
    content
)

# Update packages to include links
pkg1 = r"{ id: 1, title: 'Everest Base Camp', days: '14 Days', img: '/assets/sequence/frame_0010.webp' }"
pkg1_new = r"{ id: 1, title: 'Everest Base Camp', days: '14 Days', img: '/assets/sequence/frame_0010.webp', link: '/destinations/himalayas' }"

pkg2 = r"{ id: 2, title: 'Annapurna Circuit', days: '12 Days', img: '/assets/sequence/frame_0080.webp' }"
pkg2_new = r"{ id: 2, title: 'Annapurna Circuit', days: '12 Days', img: '/assets/sequence/frame_0080.webp', link: '/destinations/hills' }"

pkg3 = r"{ id: 3, title: 'Chitwan Wildlife Tour', days: '4 Days', img: '/assets/sequence/frame_0200.webp' }"
pkg3_new = r"{ id: 3, title: 'Chitwan Wildlife Tour', days: '4 Days', img: '/assets/sequence/frame_0200.webp', link: '/destinations/terai' }"

content = content.replace(pkg1, pkg1_new)
content = content.replace(pkg2, pkg2_new)
content = content.replace(pkg3, pkg3_new)

# Update the button to use Link
button_str = r"""                <button className="text-sm font-medium border-b border-white pb-1 text-white hover:text-zinc-300 transition-colors">
                  View Itinerary
                </button>"""
link_str = r"""                <Link href={pkg.link} className="text-sm font-medium border-b border-white pb-1 text-white hover:text-zinc-300 transition-colors inline-block mt-auto">
                  View Itinerary
                </Link>"""
content = content.replace(button_str, link_str)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(content)
