'use client';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, RotateCcw, Truck, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

interface ProductVariant {
  id: string;
  name: string | null;
  price: string;
  attributes: Record<string, string>;
  inventory?: { quantity: number };
}

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
  variants?: ProductVariant[];
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const isInWishlist = (id: string) => wishlistItems.some(i => i.id === id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
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

  // Derived state for variants
  const activeVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants.find(v => {
      if (!v.attributes) return false;
      return Object.entries(selectedOptions).every(([key, val]) => v.attributes[key] === val);
    });
  }, [product, selectedOptions]);

  const availableAttributes = useMemo(() => {
    if (!product?.variants?.length) return {};
    const attrs: Record<string, Set<string>> = {};
    product.variants.forEach(v => {
      if (v.attributes) {
        Object.entries(v.attributes).forEach(([k, val]) => {
          if (!attrs[k]) attrs[k] = new Set();
          attrs[k].add(val as string);
        });
      }
    });
    return attrs;
  }, [product]);

  // Select default variants on load
  useEffect(() => {
    if (product?.variants?.length && Object.keys(selectedOptions).length === 0) {
      const firstVariantAttrs = product.variants[0].attributes || {};
      setSelectedOptions(firstVariantAttrs);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (product) {
      const variantId = activeVariant?.id;
      const price = activeVariant ? parseFloat(activeVariant.price) : parseFloat(product.price);
      for (let i = 0; i < quantity; i++) {
        addItem({ id: product.id, variantId, name: product.name, price });
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

  const currentPrice = activeVariant ? parseFloat(activeVariant.price) : parseFloat(product.price);
  const currentStock = activeVariant?.inventory?.quantity ?? product.stockQuantity;

  const discountPct = product.originalPrice && parseFloat(product.originalPrice) > currentPrice
    ? Math.round(((parseFloat(product.originalPrice) - currentPrice) / parseFloat(product.originalPrice)) * 100)
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
                      addToWishlist({ id: product.id, name: product.name, price: currentPrice, image: product.images?.[0] });
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
              <span className="text-3xl font-bold text-gray-900">${currentPrice}</span>
              {product.originalPrice && <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>}
              {discountPct > 0 && <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">{discountPct}% OFF</span>}
            </div>
            
            <div className="mb-4">
               <span className={`text-sm font-semibold ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                 {currentStock > 0 ? `${currentStock} in stock` : 'Out of Stock'}
               </span>
            </div>

            {Object.keys(availableAttributes).map((attrKey) => (
              <div key={attrKey} className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 capitalize">{attrKey}</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(availableAttributes[attrKey]).map(val => (
                    <button
                      key={val}
                      onClick={() => setSelectedOptions({ ...selectedOptions, [attrKey]: val })}
                      className={`px-4 py-2 border rounded-md ${selectedOptions[attrKey] === val ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-6 mb-8 border-t border-b border-gray-100 py-8">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-50">-</button>
                <span className="px-4 font-semibold w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-50" disabled={quantity >= currentStock}>+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 bg-blue-600 text-white py-3.5 px-6 font-bold rounded-md shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                disabled={currentStock <= 0}
                className="flex-1 bg-gray-900 text-white py-3.5 px-6 font-bold rounded-md shadow-sm hover:bg-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
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
