import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-6 text-center">
      <div className="absolute inset-0 bg-[url('/assets/thumb_everest.jpg')] opacity-20 bg-cover bg-center pointer-events-none" />
      <div className="relative z-10">
        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-light mb-8">This path remains untraveled.</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-12">
          The page or destination you are looking for has been moved, removed, or never existed in our itineraries.
        </p>
        <Link href="/" className="px-8 py-4 bg-white text-black font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors">
          Return to Basecamp
        </Link>
      </div>
    </div>
  );
}
