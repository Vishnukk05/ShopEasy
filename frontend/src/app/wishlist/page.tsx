'use client';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const addItemToCart = useCartStore((state) => state.addItem);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <div className="bg-[#f8f9fa] min-h-[70vh] font-sans pb-20">
      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
          {toast}
        </div>
      )}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Heart size={24} className="text-red-500 fill-red-500" /> My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love here and buy them later.</p>
            <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col group hover:shadow-lg transition-all">
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform mix-blend-multiply" />
                  ) : (
                    <Image src="/logo.jpg" alt={item.name} width={100} height={100} className="object-contain group-hover:scale-105 transition-transform" />
                  )}
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 z-10"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 hover:text-blue-600 line-clamp-2">{item.name}</h3>
                  </Link>
                  <p className="font-bold text-gray-900 mb-4">${item.price}</p>
                  <button 
                    onClick={() => {
                      addItemToCart({ id: item.id, name: item.name, price: item.price });
                      removeFromWishlist(item.id);
                      showToast('Moved to cart!');
                    }}
                    className="mt-auto w-full bg-gray-900 text-white font-medium py-2 rounded text-sm hover:bg-black transition-colors"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
