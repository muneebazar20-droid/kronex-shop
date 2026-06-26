import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/constants';
import { useSettingsStore } from '@/lib/store';
import { useState } from 'react';

export default function Products() {
  const { settings } = useSettingsStore();
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))];
  const filteredProducts =
    filter === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === filter);

  return (
    <div className={settings.theme === 'dark' ? 'dark' : ''}>
      <div
        className={`${
          settings.theme === 'dark'
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-900'
        } min-h-screen`}
      >
        <Navbar />

        <section className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Shop Products</h1>

          {/* Category Filter */}
          <div className="mb-8 flex gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : settings.theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
