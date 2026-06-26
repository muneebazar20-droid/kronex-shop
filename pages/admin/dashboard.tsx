'use client';

import Navbar from '@/components/Navbar';
import { useSettingsStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/constants';
import { useState } from 'react';

export default function AdminDashboard() {
  const { settings } = useSettingsStore();
  const [products] = useState(PRODUCTS);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: '',
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      alert('Product added! (Demo - not saved)');
      setNewProduct({ name: '', price: 0, category: '' });
    }
  };

  return (
    <div className={settings.theme === 'dark' ? 'dark' : ''}>
      <div
        className={`${
          settings.theme === 'dark'
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-900'
        } min-h-screen`}
      >
        <Navbar />

        <section className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">📊 Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              className={`${
                settings.theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500'
              } text-white rounded-lg p-6`}
            >
              <p className="text-gray-200 text-sm">Total Products</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div
              className={`${
                settings.theme === 'dark'
                  ? 'bg-gradient-to-r from-green-900 to-green-800'
                  : 'bg-gradient-to-r from-green-600 to-green-500'
              } text-white rounded-lg p-6`}
            >
              <p className="text-gray-200 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">1,234</p>
            </div>
            <div
              className={`${
                settings.theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-900 to-purple-800'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500'
              } text-white rounded-lg p-6`}
            >
              <p className="text-gray-200 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">$45,230</p>
            </div>
            <div
              className={`${
                settings.theme === 'dark'
                  ? 'bg-gradient-to-r from-orange-900 to-orange-800'
                  : 'bg-gradient-to-r from-orange-600 to-orange-500'
              } text-white rounded-lg p-6`}
            >
              <p className="text-gray-200 text-sm">Active Users</p>
              <p className="text-3xl font-bold">892</p>
            </div>
          </div>

          {/* Add Product Form */}
          <div
            className={`${
              settings.theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-300'
            } border rounded-lg p-6 mb-8`}
          >
            <h2 className="text-2xl font-bold mb-4">➕ Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product Name"
                className={`p-2 border rounded ${
                  settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                placeholder="Price"
                className={`p-2 border rounded ${
                  settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="Category"
                className={`p-2 border rounded ${
                  settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              />
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
              >
                Add Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div
            className={`${
              settings.theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-300'
            } border rounded-lg overflow-hidden`}
          >
            <h2 className="text-2xl font-bold p-6 border-b border-gray-700">📦 Products List</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${
                  settings.theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-100 border-gray-300'
                } border-b`}>
                  <tr>
                    <th className="px-6 py-3 text-left">Product Name</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Rating</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={`${
                        settings.theme === 'dark'
                          ? 'border-gray-700 hover:bg-gray-700'
                          : 'border-gray-300 hover:bg-gray-100'
                      } border-b transition`}
                    >
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-semibold">${product.price}</td>
                      <td className="px-6 py-4">⭐ {product.rating}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
