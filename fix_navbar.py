import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    canvas = f.read()

orig = """        <Link href="/" className="text-white text-xl md:text-2xl font-bold tracking-tighter uppercase relative z-50">
          Discover Nepal
        </Link>"""

new = """        <Link href="/" className="flex items-center relative z-50 hover:scale-105 transition-transform">
          <img src="/logo.png" alt="Discover Nepal" className="w-16 h-16 md:w-20 md:h-20 object-contain hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all" />
          <span className="sr-only">Discover Nepal</span>
        </Link>"""

canvas = canvas.replace(orig, new)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(canvas)
