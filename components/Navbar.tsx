import Link from 'next/link';
import { useCart } from '../lib/store';

export default function Navbar() {
  const { cart } = useCart();
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-[0.2em] text-white">
          KRONE <span className="text-[#b8860b]">X</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-gray-400 hover:text-white text-sm tracking-widest uppercase transition-colors">
            Shop
          </Link>
          <Link href="/cart" className="relative text-gray-400 hover:text-white text-sm tracking-widest uppercase transition-colors">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#b8860b] text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
