import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../lib/store';

export default function Products() {
  const { products, fetchProducts, loading } = useProducts();
  const [cat, setCat] = useState('All');

  useEffect(() => { fetchProducts(); }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = cat === 'All' ? products : products.filter(p => p.category === cat);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">
        <h1 className="text-4xl font-bold mb-2">All Watches</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase mb-10">Krone X Collection</p>
        <div className="flex gap-3 mb-10 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2 text-xs tracking-widest uppercase border transition-all duration-200 ${cat === c ? 'bg-[#b8860b] border-[#b8860b] text-black font-bold' : 'border-white/10 text-gray-400 hover:border-[#b8860b] hover:text-[#b8860b]'}`}>
              {c}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading watches...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-600 py-20">No products yet. Check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
