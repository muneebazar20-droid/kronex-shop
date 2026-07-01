import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProducts } from '../lib/store';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Countdown from '../components/Countdown';

export default function Home() {
  const router = useRouter();
  const { products, fetchProducts, loading } = useProducts();
  const featured = products.filter(p => p.featured && p.inStock).slice(0, 3);

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="min-h-screen bg-[#121214] text-white">
      <Navbar />
      <Countdown />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 w-[620px] h-[620px] hidden md:block">
          {[620, 480, 340].map((size) => (
            <div key={size} className="absolute rounded-full border border-[#D4AF37]/15"
              style={{ width: size, height: size, top: `${(620 - size) / 2}px`, left: `${(620 - size) / 2}px` }} />
          ))}
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-6 max-w-6xl mx-auto px-6 sm:px-10 pt-32 sm:pt-40 pb-20">
          <div className="hidden md:flex flex-col items-start gap-6 pt-4">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#D4AF37]/40" />
            {['Sovereign', 'Regent', 'Monarch', 'Duke'].map((name, i) => (
              <button key={name} onClick={() => router.push('/products')}
                className={`text-[11px] tracking-[0.15em] uppercase text-left leading-tight transition-colors ${
                  i === 1 ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white'
                }`}>
                {name}
              </button>
            ))}
            <div className="w-px h-8 bg-gradient-to-t from-transparent to-[#D4AF37]/40" />
          </div>

          <div className="flex flex-col justify-center gap-6 text-center md:text-left items-center md:items-start">
            <p className="text-[#D4AF37] tracking-[0.3em] text-xs uppercase font-medium">Krone X — Affordable Luxury</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
              Time, Crafted<br /><span className="text-[#D4AF37]">for You.</span>
            </h1>
            <p className="text-gray-400 max-w-sm text-base">
              Premium watches at prices that make sense. Delivered to your door, cash on delivery.
            </p>
            <button onClick={() => router.push('/products')}
              className="group flex items-center gap-3 bg-[#D4AF37] hover:bg-[#C9A02E] text-black font-bold px-10 py-4 tracking-widest text-sm uppercase transition-all duration-300">
              Shop Now
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center min-h-[280px] md:min-h-0">
            <WatchMark />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <h2 className="text-2xl font-bold mb-2 text-center">Featured Watches</h2>
          <p className="text-gray-500 text-center text-sm mb-10 tracking-widest uppercase">Bestsellers</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => router.push('/products')}
              className="border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300">
              View All Watches
            </button>
          </div>
        </section>
      )}

      <section className="border-t border-white/5 py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: '📦', title: 'Cash on Delivery', desc: 'Pay when your watch arrives. No risk, no hassle.' },
            { icon: '⚡', title: 'Fast Delivery', desc: 'Delivered across Pakistan within 3–5 working days.' },
            { icon: '✅', title: 'Quality Assured', desc: 'Every watch checked before it leaves our hands.' },
          ].map(f => (
            <div key={f.title} className="flex flex-col items-center gap-3">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-bold text-white">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        © 2025 Krone X. All rights reserved. | Rawalpindi, Pakistan
      </footer>
    </div>
  );
}

function WatchMark() {
  return (
    <div className="relative w-56 h-56 sm:w-72 sm:h-72">
      <div className="absolute inset-0 rounded-full border border-[#D4AF37]/25" />
      <div className="absolute inset-6 rounded-full border border-[#D4AF37]/40" />
      <div className="absolute inset-10 rounded-full bg-gradient-to-br from-[#1B1B1E] to-[#121214] border border-[#D4AF37]/60 shadow-[0_0_60px_-10px_rgba(212,175,55,0.35)]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute left-1/2 top-1/2 w-[2px] h-3 bg-[#D4AF37]/70 origin-bottom"
            style={{ transform: `rotate(${i * 30}deg) translate(-50%, -96px)` }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-[#D4AF37] text-xs tracking-[0.3em]">KX</span>
        </div>
        <div className="absolute left-1/2 top-1/2 w-[1.5px] h-20 bg-[#D4AF37] origin-bottom"
          style={{ transform: 'translate(-50%, -100%)', animation: 'kx-sweep 60s linear infinite' }} />
      </div>
      <style>{`@keyframes kx-sweep { from { transform: translate(-50%, -100%) rotate(0deg); } to { transform: translate(-50%, -100%) rotate(360deg); } }`}</style>
    </div>
  );
}
