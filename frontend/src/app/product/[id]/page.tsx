'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, RotateCcw, Truck, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string | null;
  rating: number | null;
  stockQuantity: number;
  category: { name: string };
  images?: string[];
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user, openAuthModal } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${params.id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({ id: product.id, name: product.name, price: parseFloat(product.price) });
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center bg-white text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link href="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const discountPct = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const ratingVal = product.rating || 0;
  const activeImage = (product.images && product.images.length > 0) ? product.images[activeImageIndex] : null;

  return (
    <div className="bg-white min-h-screen py-8 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category?.name.toLowerCase()}`} className="hover:text-blue-600">{product.category?.name}</Link>
          <span>/</span>
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Images */}
          <div className="flex gap-4 min-w-0">
            {/* Thumbnails */}
            <div className="w-16 md:w-20 shrink-0 flex flex-col gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImageIndex(i)} className={`aspect-square bg-gray-50 border rounded-md flex items-center justify-center cursor-pointer ${i === activeImageIndex ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'} overflow-hidden`}>
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="aspect-square bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center cursor-pointer overflow-hidden">
                  <Image src="/logo.jpg" alt="thumb" width={40} height={40} />
                </div>
              )}
            </div>
            {/* Main Image */}
            <div className="w-full bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center relative aspect-square overflow-hidden p-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (product) {
                    if (isInWishlist(product.id)) {
                      removeFromWishlist(product.id);
                    } else {
                      addToWishlist({ id: product.id, name: product.name, price: parseFloat(product.price), image: product.images?.[0] });
                    }
                  }
                }}
                className={`absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm cursor-pointer z-10 transition-colors ${product && isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart size={20} fill={product && isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              ) : (
                <Image src="/logo.jpg" alt={product.name} width={250} height={250} className="object-contain max-w-full max-h-full" />
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill={star <= Math.round(ratingVal) ? "currentColor" : "none"} className={star <= Math.round(ratingVal) ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">{ratingVal > 0 ? ratingVal.toFixed(1) : 'No reviews'}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>}
              {discountPct > 0 && <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">{discountPct}% OFF</span>}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Key Features:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Active Noise Cancellation</li>
                <li>35 Hours Battery Life</li>
                <li>Bluetooth 5.2</li>
                <li>Lightweight & Comfortable</li>
                <li>Built-in Microphone</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 mb-8 border-t border-b border-gray-100 py-8">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-50">-</button>
                <span className="px-4 font-semibold w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-50">+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3.5 px-6 font-bold rounded-md shadow-sm hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              
              <button 
                onClick={() => { 
                  if (!user) {
                    openAuthModal('login');
                    return;
                  }
                  handleAddToCart(); 
                  router.push('/cart'); 
                }}
                className="flex-1 bg-gray-900 text-white py-3.5 px-6 font-bold rounded-md shadow-sm hover:bg-black transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2"><Truck size={18} /> Free Shipping</div>
              <div className="flex items-center gap-2"><RotateCcw size={18} /> 7 Days Return</div>
              <div className="flex items-center gap-2"><ShieldCheck size={18} /> 1 Year Warranty</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 z-50 animate-scale-in">
          <CheckCircle2 size={24} className="text-green-400" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">Added to cart!</span>
            <span className="text-xs text-gray-300">{product.name} x{quantity}</span>
          </div>
        </div>
      )}
    </div>
  );
}
