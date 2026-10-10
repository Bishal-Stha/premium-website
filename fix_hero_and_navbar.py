import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    canvas = f.read()

# 1. Restore the Hero Title and remove the huge logo
hero_orig = """<h1 className="sr-only">Discover Nepal</h1>
             <img src="/logo.png" alt="Discover Nepal" className="w-64 h-64 md:w-96 md:h-96 object-contain mb-6 drop-shadow-2xl" />"""
hero_new = """<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl mb-6">DISCOVER NEPAL</h1>"""
canvas = canvas.replace(hero_orig, hero_new)

# 2. Navbar: Remove the "Discover Nepal" text, keep ONLY the logo image
nav_logo_orig = """      <Link href="/" className="flex items-center gap-3 relative z-50">
        <img src="/logo.png" alt="Discover Nepal Logo" className="w-12 h-12 object-contain" />
        <span className="text-white text-xl md:text-2xl font-bold tracking-tighter uppercase hidden sm:block">
          Discover Nepal
        </span>
      </Link>"""
nav_logo_new = """      <Link href="/" className="flex items-center relative z-50 hover:scale-105 transition-transform">
        <img src="/logo.png" alt="Discover Nepal Logo" className="w-14 h-14 md:w-16 md:h-16 object-contain" />
        <span className="sr-only">Discover Nepal</span>
      </Link>"""
canvas = canvas.replace(nav_logo_orig, nav_logo_new)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(canvas)
    

# 3. Footer: Also remove the text next to the logo just to be consistent
with open('src/components/Footer.tsx', 'r') as f:
    footer = f.read()

footer_logo_orig = """<div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Discover Nepal" className="w-16 h-16 object-contain" />
            <h2 className="text-white text-2xl font-bold tracking-tighter uppercase hidden sm:block">Discover Nepal</h2>
          </div>"""
footer_logo_new = """<div className="flex items-center mb-6">
            <img src="/logo.png" alt="Discover Nepal" className="w-20 h-20 object-contain" />
          </div>"""
footer = footer.replace(footer_logo_orig, footer_logo_new)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(footer)
