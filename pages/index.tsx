import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/constants';
import { useSettingsStore } from '@/lib/store';

export default function Home() {
  const { settings } = useSettingsStore();

  return (
    <div
      className={settings.theme === 'dark' ? 'dark' : ''}
    >
      <div
        className={`${
          settings.theme === 'dark'
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-900'
        } min-h-screen`}
      >
        <Navbar />

        {/* Hero Section */}
        <section className={`${
          settings.theme === 'dark'
            ? 'bg-gradient-to-r from-blue-900 to-purple-900'
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        } text-white py-16`}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Kronex Shop</h1>
            <p className="text-lg md:text-xl mb-8">Discover amazing products at great prices</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className={`${
          settings.theme === 'dark'
            ? 'bg-gray-800 text-gray-300'
            : 'bg-gray-100 text-gray-600'
        } py-8 mt-16`}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 Kronex Shop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
