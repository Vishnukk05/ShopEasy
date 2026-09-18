'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Package, Calendar } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect } from 'react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const clearCart = useCartStore((state) => state.clearCart);

  // In a real app, we'd fetch the order details using params.orderId
  // Here we just use dummy data for the success screen
  const orderId = params.orderId || 'ORD1234567';
  
  // Optional: clear cart on load (if not done previously)
  // useEffect(() => { clearCart(); }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4">
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm text-center p-12">
          
          <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            {/* Confetti Particles */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-sm confetti" style={{'--tx': '-40px', '--ty': '-30px', transform: 'rotate(12deg)'} as any}></div>
            <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-yellow-400 rounded-full confetti" style={{'--tx': '-50px', '--ty': '10px'} as any}></div>
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-orange-400 confetti" style={{'--tx': '-30px', '--ty': '40px', transform: 'rotate(-45deg)'} as any}></div>
            
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-sm confetti" style={{'--tx': '40px', '--ty': '-40px', transform: 'rotate(-12deg)'} as any}></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full confetti" style={{'--tx': '50px', '--ty': '20px'} as any}></div>
            <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-yellow-400 confetti" style={{'--tx': '30px', '--ty': '50px', transform: 'rotate(45deg)'} as any}></div>
            
            {/* Big Green Circle */}
            <div className="w-20 h-20 bg-[#00bfa5] rounded-full flex items-center justify-center shadow-lg relative z-10 animate-scale-in">
              <svg className="w-10 h-10 text-white animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2 tracking-tight animate-scale-in">Order Placed Successfully!</h1>
          <p className="text-[#64748b] mb-10 font-medium">Thank you for your purchase.</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order Number</p>
              <p className="text-gray-900 font-medium">{orderId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Order Date</p>
              <p className="text-gray-900 font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Amount</p>
              <p className="text-gray-900 font-medium text-lg">$249.99</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Payment Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Paid
              </span>
            </div>
          </div>

          <div className="border-t border-b border-gray-100 py-6 mb-8 flex items-center justify-center gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Package size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Estimated Delivery</p>
                <p className="text-sm text-gray-500">By {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/account/orders" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
              View Order
            </Link>
            <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors shadow-sm">
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

