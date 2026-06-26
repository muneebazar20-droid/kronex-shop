'use client';

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { PRODUCTS } from '@/lib/constants';
import { useSettingsStore } from '@/lib/store';
import { useState, useMemo } from 'react';

export default function Products() {
  const { settings } = useSettingsStore();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // Category filter
    if (filter !== 'All') {
      result = result.filter((p) => p.category === filter);
    }

    // Search filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [filter, searchQuery]);

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

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={setSearchQuery} />
          </div>

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
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No products found</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
