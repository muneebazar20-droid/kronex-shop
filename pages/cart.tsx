import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../lib/store';

const WHATSAPP_NUMBER = '923165199256';
const EASYPAISA_NUMBER = '03165199256';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [payMethod, setPayMethod] = useState<'cod' | 'easypaisa'>('cod');
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.phone.trim() || !/^03\d{9}$/.test(form.phone)) e.phone = 'Valid Pakistani number required (03XXXXXXXXX)';
    if (!form.address.trim()) e.address = 'Address required';
    if (!form.city.trim()) e.city = 'City required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    if (!validate()) return;
    const items = cart.map(i =>
      `• ${i.product.name}${i.selectedColor ? ` (${i.selectedColor.name})` : ''} × ${i.quantity} = Rs. ${(i.product.price * i.quantity).toLocaleString()}`
    ).join('\n');
    const msg = `🕐 *New Order — Krone X*\n\n*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*City:* ${form.city}\n*Address:* ${form.address}\n\n*Items:*\n${items}\n\n*Total:* Rs. ${total().toLocaleString()}\n*Payment:* ${payMethod === 'cod' ? 'Cash on Delivery' : 'Easypaisa'}\n\nPlease confirm this order. Thank you!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    clearCart();
    setStep('success');
  };

  if (step === 'success') return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4">
      <Navbar />
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Order Sent!</h2>
        <p className="text-gray-400 mb-6">Your order has been sent to WhatsApp. We'll confirm soon.</p>
        <button onClick={() => { setStep('cart'); window.location.href = '/products'; }}
          className="bg-[#b8860b] text-black font-bold px-8 py-3 uppercase tracking-widest hover:bg-[#d4a017] transition-colors">
          Continue Shopping
        </button>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-40 gap-4">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <a href="/products" className="text-[#b8860b] uppercase tracking-widest text-sm hover:underline">Browse Watches →</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        {step === 'cart' && (
          <>
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <div className="flex flex-col gap-4 mb-8">
              {cart.map(({ product, quantity, selectedColor }, idx) => (
                <div key={idx} className="flex gap-4 bg-[#111] border border-white/5 p-4">
                  <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover bg-[#1a1a1a]" />
                  <div className="flex-1">
                    <p className="font-bold">{product.name}</p>
                    {selectedColor && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: selectedColor.hex }} />
                        <span className="text-gray-500 text-xs">{selectedColor.name}</span>
                      </div>
                    )}
                    <p className="text-[#b8860b] text-sm mt-1">Rs. {product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQty(product.id, quantity - 1)} className="w-6 h-6 border border-white/20 hover:border-[#b8860b] text-white flex items-center justify-center text-sm transition-colors">−</button>
                      <span className="text-sm">{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)} className="w-6 h-6 border border-white/20 hover:border-[#b8860b] text-white flex items-center justify-center text-sm transition-colors">+</button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <button onClick={() => removeFromCart(product.id)} className="text-gray-600 hover:text-red-400 text-xs transition-colors">Remove</button>
                    <p className="font-bold">Rs. {(product.price * quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-6 flex justify-between items-center mb-6">
              <span className="text-gray-400 uppercase tracking-widest text-sm">Total</span>
              <span className="text-2xl font-bold">Rs. {total().toLocaleString()}</span>
            </div>
            <button onClick={() => setStep('checkout')}
              className="w-full bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold py-4 uppercase tracking-widest transition-colors">
              Proceed to Checkout
            </button>
          </>
        )}

        {step === 'checkout' && (
          <>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="bg-[#111] border border-white/5 p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Order Summary</p>
              {cart.map(({ product, quantity, selectedColor }, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <span className="text-gray-400">
                    {product.name}
                    {selectedColor && (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: selectedColor.hex }} />
                        <span className="text-gray-600">{selectedColor.name}</span>
                      </span>
                    )}
                    {' '}× {quantity}
                  </span>
                  <span>Rs. {(product.price * quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-white/5 mt-3 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#b8860b]">Rs. {total().toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
                  { key: 'easypaisa', label: '📱 Easypaisa', desc: EASYPAISA_NUMBER },
                ].map(m => (
                  <button key={m.key} onClick={() => setPayMethod(m.key as 'cod' | 'easypaisa')}
                    className={`border p-4 text-left transition-all duration-200 ${payMethod === m.key ? 'border-[#b8860b] bg-[#b8860b]/10' : 'border-white/10 hover:border-white/30'}`}>
                    <p className="font-bold text-sm">{m.label}</p>
                    <p className="text-gray-500 text-xs mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>
              {payMethod === 'easypaisa' && (
                <div className="mt-3 bg-yellow-900/20 border border-yellow-700/30 p-3 text-yellow-400 text-sm">
                  Send payment to <strong>{EASYPAISA_NUMBER}</strong> before your order is confirmed.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-8">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Muhammad Ali' },
                { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '03001234567' },
                { key: 'city', label: 'City', type: 'text', placeholder: 'Rawalpindi' },
                { key: 'address', label: 'Full Address', type: 'text', placeholder: 'House #, Street, Area' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className={`w-full bg-[#111] border px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#b8860b] transition-colors ${errors[f.key] ? 'border-red-500' : 'border-white/10'}`} />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('cart')}
                className="border border-white/10 text-gray-400 hover:border-white hover:text-white px-6 py-4 uppercase tracking-widest text-sm transition-colors">
                ← Back
              </button>
              <button onClick={placeOrder}
                className="flex-1 bg-[#b8860b] hover:bg-[#d4a017] text-black font-bold py-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.532 5.845L.057 23.5l5.797-1.519A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.497-5.197-1.367l-.373-.22-3.438.902.918-3.352-.241-.387A9.944 9.944 0 012 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z"/></svg>
                Place Order via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
