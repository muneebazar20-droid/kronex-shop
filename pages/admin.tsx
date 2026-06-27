import { useState } from 'react';
import { useProducts, Product } from '../lib/store';

const ADMIN_PASSWORD = 'kronex2025';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [form, setForm] = useState({
    name: '', price: '', description: '', imageUrl: '',
    images: '', category: '', stock: '', inStock: true, featured: false,
  });

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(''); }
    else setPwError('Wrong password');
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', imageUrl: '', images: '', category: '', stock: '', inStock: true, featured: false });
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, price: String(p.price), description: p.description,
      imageUrl: p.imageUrl, images: (p.images || []).join('\n'),
      category: p.category, stock: String(p.stock), inStock: p.inStock, featured: p.featured
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.price) return;
    const imagesList = form.images.split('\n').map(s => s.trim()).filter(Boolean);
    const mainImg = imagesList[0] || form.imageUrl;
    const data = {
      name: form.name, price: Number(form.price), description: form.description,
      imageUrl: mainImg, images: imagesList.length ? imagesList : [mainImg],
      category: form.category || 'Watch', stock: Number(form.stock) || 0,
      inStock: form.inStock, featured: form.featured
    };
    if (editId) updateProduct(editId, data);
    else addProduct(data);
    resetForm();
  };

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const inStockCount = products.filter(p => p.inStock).length;
  const lowStock = products.filter(p => p.stock <= 3 && p.inStock);

  if (!authed) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-widest">KRONE <span className="text-[#b8860b]">X</span></h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-6">
          <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#b8860b] mb-3"
            placeholder="Enter password" />
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
          <p className="text-gray-500 text-xs">{products.length} products • {totalStock} units total</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="border border-white/10 text-gray-400 hover:text-white px-4 py-2 text-xs uppercase tracking-widest transition-colors">View Site</a>
          <button onClick={() => setShowForm(true)} className="bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold px-4 py-2 text-xs uppercase tracking-widest transition-colors">
            + Add Watch
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', val: products.length },
            { label: 'In Stock', val: inStockCount },
            { label: 'Total Units', val: totalStock },
            { label: 'Low Stock', val: lowStock.length, alert: lowStock.length > 0 },
          ].map(s => (
            <div key={s.label} className={`bg-[#111] border p-4 ${s.alert ? 'border-orange-500/40' : 'border-white/5'}`}>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.alert ? 'text-orange-400' : 'text-white'}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Low stock warning */}
        {lowStock.length > 0 && (
          <div className="bg-orange-900/20 border border-orange-500/30 p-4 mb-6 rounded">
            <p className="text-orange-400 text-sm font-medium mb-1">⚠️ Low Stock Alert</p>
            <p className="text-gray-400 text-xs">{lowStock.map(p => `${p.name} (${p.stock} left)`).join(' • ')}</p>
          </div>
        )}

        {/* Product Form Modal */}
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
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">{f.label}</label>
                    <input type={f.type || 'text'} value={form[f.key as keyof typeof form] as string}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b]" />
                  </div>
                ))}

                {/* Multiple images */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">
                    Image URLs (one per line — first image is main)
                  </label>
                  <textarea value={form.images}
                    onChange={e => setForm({ ...form, images: e.target.value })}
                    placeholder={'https://i.ibb.co/xxx/watch1.jpg\nhttps://i.ibb.co/xxx/watch2.jpg'}
                    rows={4}
                    className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b] resize-none text-sm" />
                  <p className="text-gray-600 text-xs mt-1">Upload images at imgbb.com → paste Direct Links here</p>
                </div>

                {/* Image previews */}
                {form.images && (
                  <div className="flex gap-2 flex-wrap">
                    {form.images.split('\n').filter(Boolean).map((url, i) => (
                      <img key={i} src={url.trim()} alt="" className="w-16 h-16 object-cover bg-[#0a0a0a] border border-white/10"
                        onError={e => (e.currentTarget.style.display = 'none')} />
                    ))}
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Watch description..." rows={3}
                    className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b] resize-none" />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="accent-[#b8860b]" />
                    <span className="text-sm text-gray-300">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-[#b8860b]" />
                    <span className="text-sm text-gray-300">Featured (homepage)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={resetForm} className="border border-white/10 text-gray-400 hover:text-white px-6 py-3 text-sm uppercase tracking-widest transition-colors">Cancel</button>
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
                {['Product', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="py-3 pr-4 text-gray-500 uppercase tracking-widest text-xs font-normal">{h}</th>
                ))}
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
                        <p className="text-gray-500 text-xs">{p.category} • {(p.images || []).length} images</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-[#b8860b] font-bold">Rs. {p.price.toLocaleString()}</td>
                  <td className="py-4 pr-4">
                    <span className={`font-medium ${p.stock <= 3 ? 'text-orange-400' : 'text-gray-300'}`}>
                      {p.stock} units {p.stock <= 3 && '⚠️'}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <button onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                      className={`text-xs px-2 py-1 uppercase tracking-widest cursor-pointer transition-colors ${p.inStock ? 'bg-green-900/30 text-green-400 hover:bg-red-900/30 hover:text-red-400' : 'bg-red-900/30 text-red-400 hover:bg-green-900/30 hover:text-green-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-4 pr-4">
                    <button onClick={() => updateProduct(p.id, { featured: !p.featured })}
                      className={`text-xs transition-colors ${p.featured ? 'text-[#b8860b]' : 'text-gray-600 hover:text-gray-400'}`}>
                      {p.featured ? '★ Featured' : '☆ Set Featured'}
                    </button>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors">Edit</button>
                      <button onClick={() => { if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id); }}
                        className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-widest transition-colors">Delete</button>
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
          <p className="text-[#b8860b] text-xs uppercase tracking-widest mb-3">How to Add Watch Images</p>
          <ol className="text-gray-500 text-sm space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://imgbb.com" target="_blank" className="text-[#b8860b] hover:underline">imgbb.com</a></li>
            <li>Upload your watch photo(s)</li>
            <li>Click "Direct link" and copy the URL</li>
            <li>Paste in the Image URLs box (one per line for multiple)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
