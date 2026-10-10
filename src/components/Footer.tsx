import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center mb-6">
            <img src="/logo.png" alt="Discover Nepal" className="w-20 h-20 object-contain" />
          </div>
          <p className="font-light text-sm max-w-sm mb-6 leading-relaxed">
            Premium Himalayan treks, curated cultural experiences, and luxury wildlife safaris. Journey beyond the ordinary.
          </p>
          <div className="text-sm">
            <p>123 Thamel Marg, Kathmandu, Nepal</p>
            <p>+977 1 4400000</p>
            <p>concierge@discovernepal.example.com</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-white uppercase tracking-widest text-xs font-semibold mb-6">Experiences</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/destinations/himalayas" className="hover:text-white transition-colors">Everest & Himalayas</Link></li>
            <li><Link href="/destinations/hills" className="hover:text-white transition-colors">Cultural Heartlands</Link></li>
            <li><Link href="/destinations/rivers" className="hover:text-white transition-colors">River Expeditions</Link></li>
            <li><Link href="/destinations/terai" className="hover:text-white transition-colors">Jungle Safaris</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white uppercase tracking-widest text-xs font-semibold mb-6">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/policies" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/policies" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/policies" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-zinc-900 text-xs flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2026 Discover Nepal Premium Tours. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer">Instagram</span>
          <span className="hover:text-white cursor-pointer">Facebook</span>
          <span className="hover:text-white cursor-pointer">Twitter</span>
        </div>
      </div>
    </footer>
  );
}
