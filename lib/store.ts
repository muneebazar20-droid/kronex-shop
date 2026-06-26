import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  currency: 'USD' | 'EUR' | 'GBP';
  notifications: boolean;
  emailUpdates: boolean;
  wishlistNotifications: boolean;
  profile: {
    name: string;
    email: string;
    phone: string;
  };
}

export const defaultSettings: Settings = {
  theme: 'light',
  language: 'en',
  currency: 'USD',
  notifications: true,
  emailUpdates: true,
  wishlistNotifications: false,
  profile: {
    name: '',
    email: '',
    phone: '',
  },
};

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  updateProfile: (profile: Partial<Settings['profile']>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateProfile: (newProfile) =>
        set((state) => ({
          settings: {
            ...state.settings,
            profile: { ...state.settings.profile, ...newProfile },
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'kronex-shop-settings',
    }
  )
);
