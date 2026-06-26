'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSettingsStore } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating,
}: ProductCardProps) {
  const { settings } = useSettingsStore();
  const currencySymbol = CURRENCIES[settings.currency];
  const convertedPrice = convertPrice(price, settings.currency);

  return (
    <Link href={`/product/${id}`}>
      <div className={`${
        settings.theme === 'dark'
          ? 'bg-gray-800 text-white hover:bg-gray-700'
          : 'bg-white text-gray-900 hover:shadow-xl'
      } rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer`}>
        <div className="relative h-48 bg-gray-200">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-blue-600">
              {currencySymbol}{convertedPrice.toFixed(2)}
            </span>
            <span className="text-yellow-500">⭐ {rating}</span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
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
