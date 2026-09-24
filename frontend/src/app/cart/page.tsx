'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="bg-[#f8f9fa] min-h-screen py-8"></div>;
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 99 ? 0 : 10;
  const discount = items.length > 0 ? 500 : 0; // Flat discount example as per prompt
  // If cart total is less than discount, don't show negative
  const actualDiscount = Math.min(discount, subtotal);
  const total = subtotal + shipping - actualDiscount;

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart <span className="text-gray-500 font-normal text-lg">({getTotalItems()} items)</span></h1>
        
        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden py-32 px-4 text-center flex flex-col items-center shadow-sm w-full">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
              <Image src="/logo.jpg" alt="Empty Cart" width={70} height={70} className="opacity-30" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-10 text-lg">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products" className="bg-blue-600 text-white px-10 py-4 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md text-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      {/* Item Image */}
                      <div className="w-24 h-24 shrink-0 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center p-2 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        ) : (
                          <Image src="/logo.jpg" alt={item.name} width={60} height={60} className="object-contain" />
                        )}
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-grow w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link href={`/product/${item.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-1">
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">Color: Black</p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-300 rounded-md bg-white">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-medium text-sm border-x border-gray-300 h-8 flex items-center justify-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.cartItemId)}
                            className="text-gray-400 hover:text-red-500 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:w-1/3">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-28 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {actualDiscount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span className="font-medium text-green-600">-${actualDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-md font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
