'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { Heart, Star, Clock, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  category: { name: string };
  images?: string[];
}

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  // Fake countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get('/products');
        // Just take a random slice of products to act as "deals"
        setProducts(response.data.slice(0, 8));
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();

    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-16 font-sans">
      {/* Deals Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full font-bold text-sm mb-6 shadow-sm">
              <Zap size={16} fill="currentColor" /> Flash Sale Active
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Super Deals of the Week</h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Get up to 70% off on premium products across top categories. Hurry, these offers won't last long!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-2 text-blue-100 mb-3 font-medium">
              <Clock size={18} /> Sale Ends In:
            </div>
            <div className="flex gap-4 text-center">
              <div className="flex flex-col">
                <span className="bg-white text-blue-900 text-3xl font-bold rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs text-blue-200 mt-2 font-medium">Hours</span>
              </div>
              <div className="text-2xl font-bold mt-3 text-blue-300">:</div>
              <div className="flex flex-col">
                <span className="bg-white text-blue-900 text-3xl font-bold rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs text-blue-200 mt-2 font-medium">Mins</span>
              </div>
              <div className="text-2xl font-bold mt-3 text-blue-300">:</div>
              <div className="flex flex-col">
                <span className="bg-white text-blue-900 text-3xl font-bold rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs text-blue-200 mt-2 font-medium">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Deals</h2>
          <Link href="/products" className="text-blue-600 font-medium hover:underline">View All Offers &rarr;</Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const originalPrice = (parseFloat(product.price) * 1.4).toFixed(2); // Fake 40% markup for "original" price
              return (
                <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                  {/* Image & Badges */}
                  <div className="relative aspect-square p-6 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                      40% OFF
                    </div>
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100">
                      <Heart size={18} />
                    </button>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category.name}</p>
                    <Link href={`/product/${product.id}`} className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </Link>
                    
                    <div className="flex items-center gap-1 text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-gray-300"} />
                      ))}
                      <span className="text-xs text-gray-500 ml-1 font-medium">(128)</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                        <p className="text-xs text-gray-400 line-through">₹{originalPrice}</p>
                      </div>
                      <button 
                        onClick={() => addItem({ id: product.id, name: product.name, price: parseFloat(product.price), image: product.images?.[0] || '' })}
                        className="bg-gray-900 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-colors shadow-sm"
                        title="Add to cart"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
