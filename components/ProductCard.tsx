import { useRouter } from 'next/router';
import { Product, useCart } from '../lib/store';

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  return (
    <div className="bg-[#111] border border-white/5 hover:border-[#b8860b]/40 transition-all duration-300 group cursor-pointer"
      onClick={() => router.push(`/product/${product.id}`)}>
      <div className="aspect-square overflow-hidden bg-[#1a1a1a]">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <p className="text-[#b8860b] text-xs tracking-widest uppercase mb-1">{product.category}</p>
        <h3 className="font-bold text-white mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-lg">Rs. {product.price.toLocaleString()}</span>
          {product.inStock ? (
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="bg-[#b8860b] hover:bg-[#d4a017] text-black text-xs font-bold px-4 py-2 uppercase tracking-widest transition-colors"
            >
              Add to Cart
            </button>
          ) : (
            <span className="text-red-500 text-xs uppercase tracking-widest">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
