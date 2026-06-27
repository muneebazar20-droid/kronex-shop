import { useRouter } from 'next/router';
import { useProducts } from '../lib/store';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Countdown from '../components/Countdown';

export default function Home() {
  const router = useRouter();
  const { products } = useProducts();
  const featured = products.filter(p => p.featured && p.inStock).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622445275576-721325763afe')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        
        <div className="relative z-10 px-6 max-w-4xl">
          <h2 className="text-6xl md:text-7xl font-light tracking-[0.15em] mb-6 text-amber-400">MILANCELOS</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-md mx-auto">
            Discover timeless elegance with our latest collection
          </p>
          <button
            onClick={() => router.push('/products')}
            className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-12 py-5 tracking-widest text-lg uppercase transition-all"
          >
            SHOP THIS COLLECTION
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-zinc-950 border-b border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
          {[
            { icon: '🚚', title: 'FREE SHIPPING', desc: 'On orders above Rs. 5000' },
            { icon: '🔄', title: '30 DAYS RETURN', desc: 'Hassle-free returns' },
            { icon: '🛡️', title: 'GENUINE PRODUCTS', desc: 'Quality assured' },
            { icon: '💰', title: 'CASH ON DELIVERY', desc: 'All over Pakistan' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-amber-400">{item.title}</h4>
              <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Sellers */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-5xl font-light text-center mb-4 tracking-wide">TOP SELLERS</h2>
          <p className="text-center text-gray-500 mb-12">Premium Picks</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/products')}
              className="border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-10 py-4 text-sm tracking-widest uppercase transition-all"
            >
              VIEW ALL WATCHES
            </button>
          </div>
        </section>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923165199256?text=Hi%2C%20I%27m%20interested%20in%20your%20watches"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50 transition-all hover:scale-110"
      >
        <span className="text-4xl">💬</span>
      </a>

      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        © 2026 Krone X. All rights reserved. | Rawalpindi, Pakistan
      </footer>
    </div>
  );
}