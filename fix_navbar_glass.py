import re

with open('src/app/ScrollyCanvas.tsx', 'r') as f:
    canvas = f.read()

orig = "scrolled || menuOpen ? 'bg-black/90 backdrop-blur-md border-white/10 shadow-xl' : 'bg-transparent'"
new = "scrolled || menuOpen ? 'bg-black/30 backdrop-blur-xl border-white/10 shadow-2xl' : 'bg-transparent'"

canvas = canvas.replace(orig, new)

with open('src/app/ScrollyCanvas.tsx', 'w') as f:
    f.write(canvas)
