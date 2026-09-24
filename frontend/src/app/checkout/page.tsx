'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import api from '@/lib/axios';

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: '', country: 'India', paymentMethod: 'Card'
  });
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !user) {
      router.push('/login?message=Please+login+to+continue+to+checkout');
    }
  }, [isMounted, user, router]);

  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (formData.pincode.length === 6 && /^\d+$/.test(formData.pincode)) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            const postOffices = data[0].PostOffice;
            const state = postOffices[0].State;
            const districts = Array.from(new Set(postOffices.map((po: any) => po.District))) as string[];
            
            setCityOptions(districts);
            setFormData(prev => ({
              ...prev,
              state: state,
              city: districts.length === 1 ? districts[0] : prev.city
            }));
          }
        } catch (err) {
          console.error("Failed to fetch pincode details:", err);
        }
      }
    };
    fetchPincodeDetails();
  }, [formData.pincode]);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 99 ? 0 : 10;
  const discount = items.length > 0 ? 500 : 0;
  const actualDiscount = Math.min(discount, subtotal);
  const total = subtotal + shipping - actualDiscount;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add items to your cart to checkout.</p>
        <Link href="/products" className="bg-[#2874f0] text-white px-8 py-3 rounded-md font-bold shadow-sm hover:bg-blue-600">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      if (!formData.address || !formData.city) {
        alert('Please fill out the shipping address completely');
        return;
      }
      
      // Create Address First
      const addressRes = await api.post('/addresses', {
        name: formData.fullName,
        phone: formData.phone,
        type: 'HOME',
        line1: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: formData.country,
        isDefault: true
      }, { headers: { 'x-user-id': user?.id } });

      const payload = {
        items: items.map(i => ({ productId: i.id, variantId: i.variantId || undefined, quantity: i.quantity, price: i.price })),
        totalAmount: getTotalPrice(),
        shippingAddressId: addressRes.data.id,
        paymentId: `PAY-${Date.now()}`
      };

      const res = await api.post('/orders', payload);
      useCartStore.getState().clearCart();
      router.push(`/order-confirmation/${res.data.id}`);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Progress Bar */}
        <div className="mb-10 flex items-center justify-center max-w-2xl mx-auto">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <span className={`ml-3 font-medium text-sm ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Shipping</span>
          </div>
          <div className={`w-16 sm:w-24 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className={`ml-3 font-medium text-sm ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Payment</span>
          </div>
          <div className={`w-16 sm:w-24 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <span className={`ml-3 font-medium text-sm ${step >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Review</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Form Area */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              
              {/* STEP 1: SHIPPING */}
              {step === 1 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="Vishnu K K" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="83819 92616" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="123, Main Street" />
                    </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        {cityOptions.length > 0 ? (
                          <select value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white">
                            <option value="">Select City</option>
                            {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <input type="text" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="Chennai" />
                        )}
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input type="text" value={formData.state} onChange={e=>setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="Tamil Nadu" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input type="text" value={formData.pincode} onChange={e=>setFormData({...formData, pincode: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="600001" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white">
                        <option>India</option>
                        <option>United States</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="bg-blue-600 text-white w-full sm:w-auto px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors">
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 2 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  <div className="space-y-4 mb-8">
                    {['Credit/Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'].map(method => (
                      <label key={method} className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${formData.paymentMethod === method ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="payment" className="w-5 h-5 text-blue-600" checked={formData.paymentMethod === method} onChange={() => setFormData({...formData, paymentMethod: method})} />
                        <span className="ml-3 font-medium text-gray-900">{method}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-md mb-8">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-medium">100% Secure Payment Processing</span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors">Review Order</button>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW */}
              {step === 3 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                  
                  <div className="bg-gray-50 p-6 rounded-md mb-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-900">Shipping Details</h3>
                      <button onClick={() => setStep(1)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                    </div>
                    <p className="text-gray-700">{formData.fullName || 'No Name'}</p>
                    <p className="text-gray-600 text-sm">{formData.address || 'No Address'}, {formData.city || 'No City'}, {formData.state || 'No State'} {formData.pincode}</p>
                    <p className="text-gray-600 text-sm mt-1">{formData.phone}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-md mb-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-gray-900">Payment Method</h3>
                      <button onClick={() => setStep(2)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CreditCard size={18} />
                      <span>{formData.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={handlePlaceOrder} className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors">Place Order</button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-28 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.cartItemId} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Image src="/logo.jpg" alt={item.name} width={30} height={30} className="object-contain" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 border-t border-gray-100 pt-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {actualDiscount > 0 && (
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Discount</span>
                    <span className="font-medium text-green-600">-${actualDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

