'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/lib/store';

export default function PaymentForm() {
  const { settings } = useSettingsStore();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>

      {/* Payment Method Selection */}
      <div className="flex gap-4">
        {['card', 'paypal', 'google'].map((method) => (
          <label key={method} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <span className="capitalize">
              {method === 'card'
                ? '💳 Credit/Debit Card'
                : method === 'paypal'
                ? '🅿️ PayPal'
                : '🔵 Google Pay'}
            </span>
          </label>
        ))}
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-3 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              type="text"
              name="cardName"
              value={cardDetails.cardName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`w-full p-2 border rounded ${
                settings.theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full p-2 border rounded ${
                settings.theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full p-2 border rounded ${
                  settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={3}
                className={`w-full p-2 border rounded ${
                  settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* PayPal */}
      {paymentMethod === 'paypal' && (
        <div className={`${
          settings.theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-50 border-gray-300'
        } border rounded-lg p-4 text-center`}>
          <p className="text-blue-600 font-semibold">🅿️ PayPal</p>
          <p className="text-sm text-gray-500 mt-2">You will be redirected to PayPal to complete your payment</p>
        </div>
      )}

      {/* Google Pay */}
      {paymentMethod === 'google' && (
        <div className={`${
          settings.theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-50 border-gray-300'
        } border rounded-lg p-4 text-center`}>
          <p className="text-gray-800 font-semibold">🔵 Google Pay</p>
          <p className="text-sm text-gray-500 mt-2">Quick and secure payment with Google Pay</p>
        </div>
      )}
    </div>
  );
}
