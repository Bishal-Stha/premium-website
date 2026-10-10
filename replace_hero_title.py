import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    canvas = f.read()

hero_orig = """<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl mb-6">DISCOVER NEPAL</h1>"""
hero_new = """<h1 className="sr-only">Discover Nepal</h1>
             <img src="/logo.png" alt="Discover Nepal" className="w-64 h-64 md:w-96 md:h-96 object-contain mb-6 drop-shadow-2xl" />"""

canvas = canvas.replace(hero_orig, hero_new)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(canvas)
