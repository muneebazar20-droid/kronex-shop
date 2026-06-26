'use client';

import Link from 'next/link';
import { useSettingsStore } from '@/lib/store';
import { useState } from 'react';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const { settings } = useSettingsStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <nav className={`${
        settings.theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-900'
      } shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Kronex Shop
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/products" className="hover:text-blue-600 transition">
              Shop
            </Link>
            <Link href="/cart" className="hover:text-blue-600 transition">
              Cart
            </Link>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </nav>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
