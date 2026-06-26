import Navbar from '@/components/Navbar';
import { PRODUCTS, CURRENCIES } from '@/lib/constants';
import { useSettingsStore } from '@/lib/store';
import { useRouter } from 'next/router';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { settings } = useSettingsStore();

  const product = PRODUCTS.find((p) => p.id === Number(id));
  if (!product) {
    return <div>Product not found</div>;
  }

  const currencySymbol = CURRENCIES[settings.currency];
  const convertedPrice = convertPrice(product.price, settings.currency);

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

        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-blue-600 mb-4">
                {currencySymbol}{convertedPrice.toFixed(2)}
              </p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 text-lg">⭐ {product.rating}</span>
                <span className="text-gray-500 ml-2">(128 reviews)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                High-quality {product.name} perfect for your needs. Premium materials and excellent durability.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition mb-4">
                Add to Cart
              </button>
              <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 py-3 rounded-lg font-semibold transition">
                Add to Wishlist
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function convertPrice(price: number, currency: string): number {
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
  };
  return price * (rates[currency] || 1);
}
