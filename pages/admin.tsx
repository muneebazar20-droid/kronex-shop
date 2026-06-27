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
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    name: '', price: '', description: '', category: '', stock: '', inStock: true, featured: false,
  });

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError('');
    } else setPwError('Wrong password');
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
      name: p.name, price: String(p.price), description: p.description || '',
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
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!authed) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-widest text-white">KRONE <span className="text-amber-400">X</span></h1>
          <p className="text-gray-500 mt-2">Admin Panel</p>
        </div>
        <div className="bg-zinc-900 p-8 rounded-2xl border border-amber-400/20">
          <input 
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full bg-black border border-zinc-700 px-5 py-4 text-white rounded-xl focus:border-amber-400 focus:outline-none"
            placeholder="Enter admin password"
          />
          {pwError && <p className="text-red-500 text-sm mt-3">{pwError}</p>}
          <button onClick={login} className="w-full mt-6 bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 rounded-xl transition">
            LOGIN TO ADMIN
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-black border-b border-amber-400/20 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-widest">KRONE <span className="text-amber-400">X</span></h1>
          <span className="text-amber-400/60 text-sm">ADMIN PANEL</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm hover:text-amber-400 transition">View Live Site</a>
          <button onClick={() => setShowForm(true)} className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-2.5 rounded-lg font-semibold text-sm transition">
            + ADD NEW WATCH
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Products', val: products.length },
            { label: 'In Stock', val: products.filter(p => p.inStock).length },
            { label: 'Total Units', val: totalStock },
            { label: 'Low Stock', val: lowStock.length, alert: true },
          ].map(s => (
            <div key={s.label} className={`bg-zinc-900 border p-6 rounded-2xl ${s.alert && lowStock.length > 0 ? 'border-orange-500/50' : 'border-amber-400/10'}`}>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{s.label}</p>
              <p className={`text-4xl font-bold mt-2 ${s.alert && lowStock.length > 0 ? 'text-orange-400' : 'text-white'}`}>{s.val}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search watches..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:border-amber-400 outline-none"
          />
        </div>

        {/* Products Table */}
        <div className="bg-zinc-900 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                <th className="py-5 px-6 text-xs uppercase text-gray-500 font-normal">Product</th>
                <th className="py-5 px-6 text-xs uppercase text-gray-500 font-normal">Price</th>
                <th className="py-5 px-6 text-xs uppercase text-gray-500 font-normal">Stock</th>
                <th className="py-5 px-6 text-xs uppercase text-gray-500 font-normal">Status</th>
                <th className="py-5 px-6 text-xs uppercase text-gray-500 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className="border-b border-zinc-700 hover:bg-zinc-800/50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={p.imageUrl} alt="" className="w-14 h-14 object-cover rounded-lg" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-semibold text-amber-400">Rs. {p.price.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={p.stock <= 3 ? "text-orange-400" : ""}>{p.stock}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs ${p.inStock ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button onClick={() => openEdit(p)} className="text-amber-400 hover:underline mr-4">Edit</button>
                    <button onClick={() => { if (confirm('Delete this product?')) deleteProduct(p.id); }} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal - Keep your existing form or I can improve it further if you want */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          {/* Your existing form code goes here - let me know if you want me to improve this part too */}
        </div>
      )}
    </div>
  );
}