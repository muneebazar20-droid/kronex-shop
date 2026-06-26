'use client';

import Navbar from '@/components/Navbar';
import PaymentForm from '@/components/PaymentForm';
import { useSettingsStore } from '@/lib/store';
import { useCartStore } from '@/lib/cart-store';
import { CURRENCIES } from '@/lib/constants';
import Link from 'next/link';
import { useState } from 'react';

const WHATSAPP_NUMBER = '+923165199256';
const BUSINESS_NAME = 'Kronex Shop';

function convertPrice(price: number, currency: string): number {
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
  };
  return price * (rates[currency] || 1);
}

export default function Checkout() {
  const { settings } = useSettingsStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const currencySymbol = CURRENCIES[settings.currency];
  const totalPrice = convertPrice(getTotalPrice(), settings.currency);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendToWhatsApp = () => {
    // Create order message
    const orderDetails = items
      .map((item) => `• ${item.name} x${item.quantity} = ${currencySymbol}${convertPrice(item.price * item.quantity, settings.currency).toFixed(2)}`)
      .join('\n');

    const message = `
🛍️ *NEW ORDER FROM KRONEX SHOP*

👤 *Customer Information:*
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

📍 *Delivery Address:*
${formData.address}
${formData.city}, ${formData.zipCode}

📦 *Order Items:*
${orderDetails}

💰 *Order Summary:*
Subtotal: ${currencySymbol}${totalPrice.toFixed(2)}
Tax (10%): ${currencySymbol}${(totalPrice * 0.1).toFixed(2)}
Total: ${currencySymbol}${(totalPrice * 1.1).toFixed(2)}

💳 *Payment Method:*
${paymentMethod === 'cod' ? '🚚 Cash on Delivery' : '💳 Easypaisa'}

---
Order Date: ${new Date().toLocaleString()}
`.trim();

    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const handlePlaceOrder = () => {
    if (formData.fullName && formData.email && formData.phone && formData.address && formData.city && formData.zipCode) {
      setOrderPlaced(true);
      
      // Send to WhatsApp
      setTimeout(() => {
        sendToWhatsApp();
        clearCart();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }, 500);
    } else {
      alert('Please fill in all fields');
    }
  };

  if (items.length === 0 && !orderPlaced) {
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
          <section className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">Add some products before checking out!</p>
            <Link href="/products">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                Continue Shopping
              </button>
            </Link>
          </section>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
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
          <section className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
            <p className="text-green-600 font-semibold mb-4">📱 Your order details have been sent to WhatsApp!</p>
            <p className="text-gray-500 mb-8">Our team will contact you shortly to confirm payment and delivery.</p>
            <Link href="/products">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                Continue Shopping
              </button>
            </Link>
          </section>
        </div>
      </div>
    );
  }

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

        <section className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div
                className={`${
                  settings.theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                } border rounded-lg p-6`}
              >
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className={`w-full p-2 border rounded ${
                      settings.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`w-full p-2 border rounded ${
                      settings.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number (e.g., +923165199256)"
                    className={`w-full p-2 border rounded ${
                      settings.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    rows={3}
                    className={`w-full p-2 border rounded ${
                      settings.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className={`w-full p-2 border rounded ${
                        settings.theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="Zip Code"
                      className={`w-full p-2 border rounded ${
                        settings.theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div
                className={`${
                  settings.theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-300'
                } border rounded-lg p-6`}
              >
                <PaymentForm />
              </div>
            </div>

            {/* Order Summary */}
            <div
              className={`${
                settings.theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              } border rounded-lg p-6 h-fit`}
            >
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {currencySymbol}{convertPrice(item.price * item.quantity, settings.currency).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className={`${
                  settings.theme === 'dark'
                    ? 'border-gray-700'
                    : 'border-gray-300'
                } border-t border-b py-3 mb-4`}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{currencySymbol}{(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>{currencySymbol}{(totalPrice * 1.1).toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                📱 Place Order & Send to WhatsApp
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
