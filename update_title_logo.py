import re

# updating layout.tsx
with open('src/app/layout.tsx', 'r') as f:
    layout = f.read()

layout = re.sub(
    r'title: "Discover Nepal - Premium Himalayan Treks & Safaris"',
    r'title: "Discover Nepal"',
    layout
)
layout = re.sub(
    r'title: "Discover Nepal - Premium Tourism Experience"',
    r'title: "Discover Nepal"',
    layout
)
with open('src/app/layout.tsx', 'w') as f:
    f.write(layout)

# updating ScrollyCanvas.tsx (Hero, Navbar)
with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    canvas = f.read()

# Nav Logo
navbar_logo_orig = """      <Link href="/" className="text-white text-xl md:text-2xl font-bold tracking-tighter uppercase relative z-50">
        Discover Nepal
      </Link>"""
navbar_logo_new = """      <Link href="/" className="flex items-center gap-3 relative z-50">
        <img src="/logo.png" alt="Discover Nepal Logo" className="w-12 h-12 object-contain" />
        <span className="text-white text-xl md:text-2xl font-bold tracking-tighter uppercase hidden sm:block">
          Discover Nepal
        </span>
      </Link>"""
canvas = canvas.replace(navbar_logo_orig, navbar_logo_new)

# Hero Title
hero_orig = """<h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white drop-shadow-2xl mb-6">NEPAL</h1>"""
hero_new = """<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl mb-6">DISCOVER NEPAL</h1>"""
canvas = canvas.replace(hero_orig, hero_new)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(canvas)
    
# updating Footer.tsx
with open('src/components/Footer.tsx', 'r') as f:
    footer = f.read()

footer_logo_orig = """<h2 className="text-white text-2xl font-bold tracking-tighter uppercase mb-6">Discover Nepal</h2>"""
footer_logo_new = """<div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Discover Nepal" className="w-16 h-16 object-contain" />
            <h2 className="text-white text-2xl font-bold tracking-tighter uppercase hidden sm:block">Discover Nepal</h2>
          </div>"""
footer = footer.replace(footer_logo_orig, footer_logo_new)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(footer)
