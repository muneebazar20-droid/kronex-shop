import { create } from 'zustand';
import { supabase } from './supabase';

export interface ProductColor {
  name: string;
  hex: string;
}

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
  colors: ProductColor[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ProductColor;
}

// Convert DB row to Product
const toProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: row.price,
  description: row.description || '',
  imageUrl: row.image_url || '',
  images: row.images || [],
  inStock: row.in_stock,
  stock: row.stock,
  featured: row.featured,
  category: row.category || '',
  colors: row.colors || [],
});

// Convert Product to DB row
const toDB = (p: Omit<Product, 'id'> & { id?: string }) => ({
  id: p.id || Date.now().toString(),
  name: p.name,
  price: p.price,
  description: p.description,
  image_url: p.imageUrl,
  images: p.images,
  in_stock: p.inStock,
  stock: p.stock,
  featured: p.featured,
  category: p.category,
  colors: p.colors,
});

interface ProductStore {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product, color?: ProductColor) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useProducts = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) set({ products: data.map(toProduct) });
    set({ loading: false });
  },
  addProduct: async (p) => {
    const row = toDB(p);
    const { data, error } = await supabase.from('products').insert(row).select().single();
    if (!error && data) set((s) => ({ products: [toProduct(data), ...s.products] }));
  },
  updateProduct: async (id, p) => {
    const updates: any = {};
    if (p.name !== undefined) updates.name = p.name;
    if (p.price !== undefined) updates.price = p.price;
    if (p.description !== undefined) updates.description = p.description;
    if (p.imageUrl !== undefined) updates.image_url = p.imageUrl;
    if (p.images !== undefined) updates.images = p.images;
    if (p.inStock !== undefined) updates.in_stock = p.inStock;
    if (p.stock !== undefined) updates.stock = p.stock;
    if (p.featured !== undefined) updates.featured = p.featured;
    if (p.category !== undefined) updates.category = p.category;
    if (p.colors !== undefined) updates.colors = p.colors;
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (!error && data) set((s) => ({ products: s.products.map((prod) => prod.id === id ? toProduct(data) : prod) }));
  },
  deleteProduct: async (id) => {
    await supabase.from('products').delete().eq('id', id);
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
  },
}));

export const useCart = create<CartStore>((set, get) => ({
  cart: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('kronex-cart') || '[]') : [],
  addToCart: (product, color) => {
    set((s) => {
      const existing = s.cart.find((i) => i.product.id === product.id && i.selectedColor?.name === color?.name);
      const newCart = existing
        ? s.cart.map((i) => i.product.id === product.id && i.selectedColor?.name === color?.name ? { ...i, quantity: i.quantity + 1 } : i)
        : [...s.cart, { product, quantity: 1, selectedColor: color }];
      localStorage.setItem('kronex-cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },
  removeFromCart: (id) => set((s) => {
    const newCart = s.cart.filter((i) => i.product.id !== id);
    localStorage.setItem('kronex-cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  updateQty: (id, qty) => set((s) => {
    const newCart = qty <= 0 ? s.cart.filter((i) => i.product.id !== id) : s.cart.map((i) => i.product.id === id ? { ...i, quantity: qty } : i);
    localStorage.setItem('kronex-cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  clearCart: () => { localStorage.removeItem('kronex-cart'); set({ cart: [] }); },
  total: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
