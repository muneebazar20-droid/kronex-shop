# Kronex Shop - E-commerce Store with Settings

A modern e-commerce store built with Next.js featuring a comprehensive settings system.

## Features

✨ **Settings System**
- 🎨 Theme switching (Light/Dark mode)
- 🌍 Multi-language support (English, Spanish, French)
- 💰 Currency converter (USD, EUR, GBP)
- 🔔 Notification preferences
- 👤 User profile management

🛍️ **E-commerce Features**
- Product listing and filtering
- Product details page
- Shopping cart
- Persistent settings using localStorage
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Language:** TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/muneebazar20-droid/kronex-shop.git
cd kronex-shop
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── components/          # React components
│   ├── Navbar.tsx      # Navigation bar with settings button
│   ├── SettingsModal.tsx # Settings management modal
│   └── ProductCard.tsx  # Product display card
├── lib/
│   ├── store.ts        # Zustand settings store
│   └── constants.ts    # Product data and constants
├── pages/
│   ├── index.tsx       # Home page
│   ├── products.tsx    # Products listing
│   ├── cart.tsx        # Shopping cart
│   ├── product/[id].tsx # Product detail page
│   └── _app.tsx        # App wrapper
├── styles/
│   └── globals.css     # Global styles
└── public/             # Static files
```

## Settings Configuration

The settings are managed using Zustand and persisted to localStorage:

```typescript
interface Settings {
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
```

## Usage

### Accessing Settings Store

```typescript
import { useSettingsStore } from '@/lib/store';

function MyComponent() {
  const { settings, updateSettings } = useSettingsStore();
  
  return (
    <div>
      <button onClick={() => updateSettings({ theme: 'dark' })}>
        Toggle Dark Mode
      </button>
    </div>
  );
}
```

### Opening Settings Modal

Click the "⚙️ Settings" button in the navigation bar to open the settings modal.

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

## Support

For issues and feature requests, please visit the [GitHub Issues](https://github.com/muneebazar20-droid/kronex-shop/issues) page.
