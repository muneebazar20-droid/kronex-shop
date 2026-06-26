import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useSettingsStore } from '@/lib/store';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  return <Component {...pageProps} />;
}
