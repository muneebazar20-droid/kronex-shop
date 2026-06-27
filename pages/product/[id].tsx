import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useProducts, useCart } from '../../lib/store';

const WHATSAPP_NUMBER = '923165199256';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { products } = useProducts();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <Navbar />
      <p className="text-gray-500">Product not found.</p>
    </div>
  );

  const images = product.images?.length ? product.images : [product.imageUrl];

  const orderOnWhatsApp = () => {
    const msg = `Hi! I want to order:\n\n*${product.name}*\nPrice: Rs. ${product.price.toLocaleString()}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-white text-sm mb-8 uppercase tracking-widest">
          ← Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-[#111] overflow-hidden mb-3">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#b8860b]' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-[#b8860b] text-xs tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-400 mb-4">{product.description}</p>

            {/* Stock counter */}
            {product.inStock && product.stock <= 10 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-400 text-sm font-medium">
                    {product.stock <= 3 ? '🔥' : '⚡'} Only {product.stock} left in stock!
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full">
                  <div
                    className="bg-[#b8860b] h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.max(10, (product.stock / 20) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <p className="text-4xl font-bold text-white mb-8">Rs. {product.price.toLocaleString()}</p>

            {product.inStock ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { addToCart(product); router.push('/cart'); }}
                  className="bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold py-4 uppercase tracking-widest transition-colors"
                >
                  Add to Cart & Checkout
                </button>
                <button
                  onClick={orderOnWhatsApp}
                  className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold py-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.532 5.845L.057 23.5l5.797-1.519A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.497-5.197-1.367l-.373-.22-3.438.902.918-3.352-.241-.387A9.944 9.944 0 012 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z"/></svg>
                  Order on WhatsApp
                </button>
              </div>
            ) : (
              <div className="border border-red-500/30 text-red-400 text-center py-4 text-sm uppercase tracking-widest">
                Out of Stock
              </div>
            )}

            <div className="mt-8 border-t border-white/5 pt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 uppercase tracking-widest text-xs mb-1">Delivery</p>
                <p className="text-gray-300">3–5 working days</p>
              </div>
              <div>
                <p className="text-gray-600 uppercase tracking-widest text-xs mb-1">Payment</p>
                <p className="text-gray-300">COD / Easypaisa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
