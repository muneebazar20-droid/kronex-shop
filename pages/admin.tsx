import { useState } from 'react';
import { useProducts, Product } from '../lib/store';

const ADMIN_PASSWORD = 'kronex2025'; // CHANGE THIS

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', description: '', imageUrl: '',
    category: '', stock: '', inStock: true, featured: false,
  });

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(''); }
    else setPwError('Wrong password');
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', imageUrl: '', category: '', stock: '', inStock: true, featured: false });
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), description: p.description, imageUrl: p.imageUrl, category: p.category, stock: String(p.stock), inStock: p.inStock, featured: p.featured });
    setEditId(p.id);
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.price) return;
    const data = { name: form.name, price: Number(form.price), description: form.description, imageUrl: form.imageUrl, category: form.category || 'Watch', stock: Number(form.stock) || 0, inStock: form.inStock, featured: form.featured };
    if (editId) updateProduct(editId, data);
    else addProduct(data);
    resetForm();
  };

  if (!authed) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-widest">KRONE <span className="text-[#b8860b]">X</span></h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-6">
          <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Password</label>
          <input
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#b8860b] mb-3"
            placeholder="Enter password"
          />
          {pwError && <p className="text-red-400 text-xs mb-3">{pwError}</p>}
          <button onClick={login} className="w-full bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold py-3 uppercase tracking-widest transition-colors">
            Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold tracking-widest">KRONE <span className="text-[#b8860b]">X</span> Admin</h1>
          <p className="text-gray-500 text-xs">{products.length} products</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="border border-white/10 text-gray-400 hover:text-white px-4 py-2 text-xs uppercase tracking-widest transition-colors">View Site</a>
          <button onClick={() => setShowForm(true)} className="bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold px-4 py-2 text-xs uppercase tracking-widest transition-colors">
            + Add Watch
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Product Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-[#111] border border-white/10 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="font-bold text-lg mb-6">{editId ? 'Edit Product' : 'Add New Watch'}</h2>
              <div className="flex flex-col gap-4">
                {[
                  { key: 'name', label: 'Watch Name', placeholder: 'Krone X Classic' },
                  { key: 'price', label: 'Price (PKR)', placeholder: '1800', type: 'number' },
                  { key: 'category', label: 'Category', placeholder: 'Classic / Sport / Premium' },
                  { key: 'stock', label: 'Stock Quantity', placeholder: '10', type: 'number' },
                  { key: 'imageUrl', label: 'Image URL', placeholder: 'https://...' },
                  { key: 'description', label: 'Description', placeholder: 'Watch description...' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">{f.label}</label>
                    {f.key === 'description' ? (
                      <textarea
                        value={form[f.key as keyof typeof form] as string}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        rows={3}
                        className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b] resize-none"
                      />
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={form[f.key as keyof typeof form] as string}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b]"
                      />
                    )}
                  </div>
                ))}

                {/* Image Preview */}
                {form.imageUrl && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Image Preview</label>
                    <img src={form.imageUrl} alt="preview" className="w-full h-48 object-cover bg-[#0a0a0a]" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="accent-[#b8860b]" />
                    <span className="text-sm text-gray-300">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-[#b8860b]" />
                    <span className="text-sm text-gray-300">Featured (show on homepage)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={resetForm} className="border border-white/10 text-gray-400 hover:text-white px-6 py-3 text-sm uppercase tracking-widest transition-colors">
                  Cancel
                </button>
                <button onClick={save} className="flex-1 bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold py-3 uppercase tracking-widest transition-colors">
                  {editId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="py-3 pr-4 text-gray-500 uppercase tracking-widest text-xs font-normal">Product</th>
                <th className="py-3 pr-4 text-gray-500 uppercase tracking-widest text-xs font-normal">Price</th>
                <th className="py-3 pr-4 text-gray-500 uppercase tracking-widest text-xs font-normal">Stock</th>
                <th className="py-3 pr-4 text-gray-500 uppercase tracking-widest text-xs font-normal">Status</th>
                <th className="py-3 pr-4 text-gray-500 uppercase tracking-widest text-xs font-normal">Featured</th>
                <th className="py-3 text-gray-500 uppercase tracking-widest text-xs font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover bg-[#1a1a1a]" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-gray-500 text-xs">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-[#b8860b] font-bold">Rs. {p.price.toLocaleString()}</td>
                  <td className="py-4 pr-4 text-gray-300">{p.stock} units</td>
                  <td className="py-4 pr-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-widest ${p.inStock ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    {p.featured ? <span className="text-[#b8860b] text-xs">★ Featured</span> : <span className="text-gray-600 text-xs">—</span>}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors">Edit</button>
                      <button onClick={() => { if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id); }} className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-widest transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center text-gray-600 py-16">No products yet. Add your first watch.</div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-10 bg-[#111] border border-white/5 p-5">
          <p className="text-[#b8860b] text-xs uppercase tracking-widest mb-3">Quick Tips</p>
          <ul className="text-gray-500 text-sm space-y-2">
            <li>• Upload watch images to <a href="https://imgbb.com" target="_blank" className="text-[#b8860b] hover:underline">imgbb.com</a> and paste the URL here</li>
            <li>• Toggle "In Stock" to hide/show products without deleting them</li>
            <li>• "Featured" products appear on the homepage</li>
            <li>• Changes save automatically in browser storage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
