import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  images: string[];
  inStock: boolean;
  stock: number;
  featured: boolean;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductStore {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Krone X Classic',
    price: 1800,
    description: 'Elegant stainless steel case with mineral glass. Perfect for everyday wear.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      'https://images.unsplash.com/photo-1548171915-3e1d09d42b28?w=600&q=80',
      'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
    ],
    inStock: true,
    stock: 10,
    featured: true,
    category: 'Classic',
  },
  {
    id: '2',
    name: 'Krone X Sport',
    price: 2200,
    description: 'Built for the active lifestyle. Water-resistant with bold dial design.',
    imageUrl: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    ],
    inStock: true,
    stock: 8,
    featured: true,
    category: 'Sport',
  },
  {
    id: '3',
    name: 'Krone X Executive',
    price: 2800,
    description: 'Premium gold-tone finish. Statement piece for formal occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1548171915-3e1d09d42b28?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1548171915-3e1d09d42b28?w=600&q=80',
      'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
    ],
    inStock: true,
    stock: 5,
    featured: true,
    category: 'Premium',
  },
];

export const useProducts = create<ProductStore>()(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,
      addProduct: (p) =>
        set((s) => ({
          products: [...s.products, { ...p, id: Date.now().toString() }],
        })),
      updateProduct: (id, p) =>
        set((s) => ({
          products: s.products.map((prod) => (prod.id === id ? { ...prod, ...p } : prod)),
        })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
    }),
    { name: 'kronex-products' }
  )
);

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) =>
        set((s) => {
          const existing = s.cart.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...s.cart, { product, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i.product.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: qty <= 0
            ? s.cart.filter((i) => i.product.id !== id)
            : s.cart.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)),
        })),
      clearCart: () => set({ cart: [] }),
      total: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'kronex-cart' }
  )
);
