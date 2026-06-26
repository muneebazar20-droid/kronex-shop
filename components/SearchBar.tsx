'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/lib/store';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { settings } = useSettingsStore();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={`${
      settings.theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-gray-50 border-gray-300'
    } border rounded-lg px-4 py-2 flex items-center gap-2 max-w-md`}>
      <span className="text-gray-500">🔍</span>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search products..."
        className={`flex-1 bg-transparent outline-none ${
          settings.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      />
    </div>
  );
}
