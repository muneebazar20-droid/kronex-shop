import { useState, useRef } from 'react';
import { useProducts, Product, ProductColor } from '../lib/store';

const ADMIN_PASSWORD = 'kronex2025';
const CLOUDINARY_UPLOAD_PRESET = 'kronex_watches';
const CLOUDINARY_CLOUD_NAME = 'dnu1evy86';

const PRESET_COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#b8860b' },
  { name: 'Rose Gold', hex: '#b76e79' },
  { name: 'Blue', hex: '#1e3a5f' },
  { name: 'Brown', hex: '#6b4226' },
  { name: 'Green', hex: '#2d5a27' },
  { name: 'Red', hex: '#8b0000' },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [colorList, setColorList] = useState<ProductColor[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#b8860b');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', price: '', description: '', category: '', stock: '', inStock: true, featured: false,
  });

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(''); }
    else setPwError('Wrong password');
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', category: '', stock: '', inStock: true, featured: false });
    setUploadedImages([]);
    setColorList([]);
    setNewColorName('');
    setNewColorHex('#b8860b');
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, price: String(p.price), description: p.description,
      category: p.category, stock: String(p.stock), inStock: p.inStock, featured: p.featured
    });
    setUploadedImages(p.images || [p.imageUrl]);
    setColorList(p.colors || []);
    setEditId(p.id);
    setShowForm(true);
  };

  const uploadImages = async (files: FileList) => {
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url);
      } catch (e) { console.error('Upload failed', e); }
    }
    setUploadedImages(prev => [...prev, ...uploaded]);
    setUploading(false);
  };

  const addPresetColor = (color: ProductColor) => {
    if (!colorList.find(c => c.name === color.name)) {
      setColorList(prev => [...prev, color]);
    }
  };

  const addCustomColor = () => {
    if (!newColorName.trim()) return;
    if (!colorList.find(c => c.name === newColorName)) {
      setColorList(prev => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
    }
    setNewColorName('');
    setNewColorHex('#b8860b');
  };

  const removeColor = (name: string) => setColorList(prev => prev.filter(c => c.name !== name));

  const save = () => {
    if (!form.name || !form.price || uploadedImages.length === 0) {
      alert('Please add at least one image and fill name & price');
      return;
    }
    const data = {
      name: form.name, price: Number(form.price), description: form.description,
      imageUrl: uploadedImages[0], images: uploadedImages,
      category: form.category || 'Watch', stock: Number(form.stock) || 0,
      inStock: form.inStock, featured: form.featured,
      colors: colorList,
    };
    if (editId) updateProduct(editId, data);
    else addProduct(data);
    resetForm();
  };

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
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
          <button onClick={login} className="w-full bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold py-3 uppercase tracking-widest transition-colors">Login</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-[#111] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold tracking-widest">KRONE <span className="text-[#b8860b]">X</span> Admin</h1>
          <p className="text-gray-500 text-xs">{products.length} products • {totalStock} units total</p>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="border border-white/10 text-gray-400 hover:text-white px-4 py-2 text-xs uppercase tracking-widest transition-colors">View Site</a>
          <button onClick={() => setShowForm(true)} className="bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold px-4 py-2 text-xs uppercase tracking-widest transition-colors">+ Add Watch</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', val: products.length },
            { label: 'In Stock', val: products.filter(p => p.inStock).length },
            { label: 'Total Units', val: totalStock },
            { label: 'Low Stock', val: lowStock.length, alert: lowStock.length > 0 },
          ].map(s => (
            <div key={s.label} className={`bg-[#111] border p-4 ${s.alert ? 'border-orange-500/40' : 'border-white/5'}`}>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.alert ? 'text-orange-400' : 'text-white'}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {lowStock.length > 0 && (
          <div className="bg-orange-900/20 border border-orange-500/30 p-4 mb-6">
            <p className="text-orange-400 text-sm font-medium mb-1">⚠️ Low Stock Alert</p>
            <p className="text-gray-400 text-xs">{lowStock.map(p => `${p.name} (${p.stock} left)`).join(' • ')}</p>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-[#111] border border-white/10 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="font-bold text-lg mb-6">{editId ? 'Edit Product' : 'Add New Watch'}</h2>
              <div className="flex flex-col gap-4">

                {/* Image Upload */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Watch Images</label>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={e => e.target.files && uploadImages(e.target.files)} />
                  <button onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed py-8 text-center transition-colors ${uploading ? 'border-[#b8860b] bg-[#b8860b]/5' : 'border-white/10 hover:border-[#b8860b] hover:bg-[#b8860b]/5'}`}>
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#b8860b] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[#b8860b] text-sm">Uploading...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">📸</span>
                        <p className="text-gray-400 text-sm">Click to upload watch photos</p>
                        <p className="text-gray-600 text-xs">Multiple images allowed</p>
                      </div>
                    )}
                  </button>
                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-3">
                      {uploadedImages.map((url, i) => (
                        <div key={i} className="relative">
                          <img src={url} alt="" className="w-16 h-16 object-cover border border-white/10" />
                          {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-[#b8860b] text-black text-[8px] text-center font-bold">MAIN</span>}
                          <button onClick={() => setUploadedImages(prev => prev.filter((_, j) => j !== i))}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Basic Fields */}
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

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Watch description..." rows={3}
                    className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b] resize-none" />
                </div>

                {/* COLOR MANAGEMENT */}
                <div className="border border-white/10 p-4">
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-3">Available Colors</label>

                  {/* Selected colors */}
                  {colorList.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {colorList.map(c => (
                        <div key={c.name} className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1">
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                          <span className="text-xs text-gray-300">{c.name}</span>
                          <button onClick={() => removeColor(c.name)} className="text-gray-600 hover:text-red-400 ml-1 text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preset colors */}
                  <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Quick Add</p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {PRESET_COLORS.map(c => (
                      <button key={c.name} onClick={() => addPresetColor(c)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${colorList.find(x => x.name === c.name) ? 'border-[#b8860b]' : 'border-white/20'}`}
                        style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>

                  {/* Custom color */}
                  <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Custom Color</p>
                  <div className="flex gap-2">
                    <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)}
                      className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer" />
                    <input type="text" value={newColorName} onChange={e => setNewColorName(e.target.value)}
                      placeholder="Color name (e.g. Navy Blue)"
                      className="flex-1 bg-[#0a0a0a] border border-white/10 px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b] text-sm" />
                    <button onClick={addCustomColor}
                      className="bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold px-3 py-2 text-xs uppercase tracking-widest transition-colors">
                      Add
                    </button>
                  </div>
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
                <button onClick={save} disabled={uploading}
                  className="flex-1 bg-[#b8860b] hover:bg-[#d4a017] disabled:opacity-50 text-black font-bold py-3 uppercase tracking-widest transition-colors">
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
                {['Product', 'Price', 'Stock', 'Colors', 'Status', 'Featured', 'Actions'].map(h => (
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
                        <p className="text-gray-500 text-xs">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-[#b8860b] font-bold">Rs. {p.price.toLocaleString()}</td>
                  <td className="py-4 pr-4">
                    <span className={`font-medium ${p.stock <= 3 ? 'text-orange-400' : 'text-gray-300'}`}>
                      {p.stock} {p.stock <= 3 && '⚠️'}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-1 flex-wrap">
                      {(p.colors || []).length > 0
                        ? p.colors.map(c => (
                          <div key={c.name} title={c.name}
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: c.hex }} />
                        ))
                        : <span className="text-gray-600 text-xs">None</span>
                      }
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <button onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                      className={`text-xs px-2 py-1 uppercase tracking-widest cursor-pointer transition-colors ${p.inStock ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-4 pr-4">
                    <button onClick={() => updateProduct(p.id, { featured: !p.featured })}
                      className={`text-xs ${p.featured ? 'text-[#b8860b]' : 'text-gray-600 hover:text-gray-400'}`}>
                      {p.featured ? '★ Featured' : '☆ Set'}
                    </button>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-white text-xs uppercase tracking-widest">Edit</button>
                      <button onClick={() => { if (confirm('Delete ' + p.name + '?')) deleteProduct(p.id); }}
                        className="text-gray-600 hover:text-red-400 text-xs uppercase tracking-widest">Delete</button>
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
      </div>
    </div>
  );
}
