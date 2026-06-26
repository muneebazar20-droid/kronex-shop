import Navbar from '@/components/Navbar';
import { useSettingsStore } from '@/lib/store';

export default function Cart() {
  const { settings } = useSettingsStore();

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
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div
            className={`${
              settings.theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-300'
            } border rounded-lg p-8 text-center`}
          >
            <p className="text-lg mb-4">Your cart is empty</p>
            <p className="text-gray-500">Start shopping to add items to your cart!</p>
          </div>
        </section>
      </div>
    </div>
  );
}
