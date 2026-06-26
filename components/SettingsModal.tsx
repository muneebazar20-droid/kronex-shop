'use client';

import { useSettingsStore } from '@/lib/store';
import { CURRENCIES, LANGUAGES } from '@/lib/constants';
import { useState } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings, updateProfile } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'display' | 'account' | 'notifications'>('display');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        settings.theme === 'dark'
          ? 'bg-gray-800 text-white'
          : 'bg-white text-gray-900'
      } rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 transition"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 dark:border-gray-700">
          {(['display', 'account', 'notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 capitalize font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'display' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'es' | 'fr' })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                >
                  {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value as 'USD' | 'EUR' | 'GBP' })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                >
                  {Object.keys(CURRENCIES).map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeTab === 'account' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  placeholder="Your name"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={settings.profile.phone}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="flex items-center justify-between">
                <label className="font-medium">Push Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSettings({ notifications: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">Email Updates</label>
                <input
                  type="checkbox"
                  checked={settings.emailUpdates}
                  onChange={(e) => updateSettings({ emailUpdates: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">Wishlist Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.wishlistNotifications}
                  onChange={(e) => updateSettings({ wishlistNotifications: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-300 dark:border-gray-700 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
