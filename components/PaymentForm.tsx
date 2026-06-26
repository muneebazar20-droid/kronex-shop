'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/lib/store';

export default function PaymentForm() {
  const { settings } = useSettingsStore();
  const [paymentMethod, setPaymentMethod] = useState('cod');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        {[
          { id: 'cod', label: '🚚 Cash on Delivery (COD)', description: 'Pay when you receive your order' },
          { id: 'easypaisa', label: '💳 Easypaisa', description: 'Secure mobile payment' },
        ].map((method) => (
          <label
            key={method.id}
            className={`flex items-start gap-3 cursor-pointer p-4 border rounded-lg transition $${
              paymentMethod === method.id
                ? settings.theme === 'dark'
                  ? 'bg-blue-900 border-blue-700'
                  : 'bg-blue-50 border-blue-600'
                : settings.theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 mt-1"
            />
            <div>
              <p className="font-semibold">{method.label}</p>
              <p className="text-sm text-gray-500 mt-1">{method.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* COD Info */}
      {paymentMethod === 'cod' && (
        <div
          className={`${
            settings.theme === 'dark'
              ? 'bg-green-900 border-green-700'
              : 'bg-green-50 border-green-600'
          } border rounded-lg p-4 mt-4`}
        >
          <p className="font-semibold text-green-700 dark:text-green-300">✅ Cash on Delivery</p>
          <ul className="text-sm text-green-600 dark:text-green-400 mt-2 space-y-1">
            <li>• No payment required now</li>
            <li>• Pay when delivery arrives</li>
            <li>• You'll receive order confirmation on WhatsApp</li>
          </ul>
        </div>
      )}

      {/* Easypaisa Info */}
      {paymentMethod === 'easypaisa' && (
        <div
          className={`${
            settings.theme === 'dark'
              ? 'bg-purple-900 border-purple-700'
              : 'bg-purple-50 border-purple-600'
          } border rounded-lg p-4 mt-4`}
        >
          <p className="font-semibold text-purple-700 dark:text-purple-300">💳 Easypaisa Payment</p>
          <ol className="text-sm text-purple-600 dark:text-purple-400 mt-2 space-y-1">
            <li>1. Click "Place Order"</li>
            <li>2. You'll get Easypaisa payment details on WhatsApp</li>
            <li>3. Complete payment and confirm</li>
            <li>4. Your order will be confirmed</li>
          </ol>
        </div>
      )}

      <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 rounded-lg p-3 mt-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          📱 <strong>WhatsApp Notification:</strong> After placing your order, you'll receive complete order details, payment instructions, and delivery updates on WhatsApp.
        </p>
      </div>
    </div>
  );
}
