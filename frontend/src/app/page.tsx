'use client';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Truck, RefreshCw, ShieldCheck, Headphones, Tag, CheckCircle2, Star, ShoppingCart, Package, Users } from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';
import api from '@/lib/axios';

const staticProducts = [
  { id: '1', name: 'Apple iPhone 15 Pro Max (256GB)', price: '159900', originalPrice: '169900', discount: '6% OFF', rating: 4820, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop' },
  { id: '2', name: 'Samsung Galaxy S24 Ultra 5G', price: '129999', originalPrice: '134999', discount: '4% OFF', rating: 3198, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop' },
  { id: '3', name: 'Sony WH-1000XM5 ANC Headphones', price: '29990', originalPrice: '34990', discount: '14% OFF', rating: 1245, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop' },
  { id: '4', name: 'Apple MacBook Air M3 (8GB/256GB)', price: '114900', originalPrice: '119900', discount: '4% OFF', rating: 2854, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop' },
];

function HomeContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'STAFF') && !isPreview) {
      router.replace('/admin');
    }
  }, [user, isPreview, router]);

  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const isInWishlist = (id: string) => wishlistItems.some(i => i.id === id);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>(staticProducts);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/products').catch(() => ({ data: staticProducts })),
      api.get('/admin/banners').catch(() => ({ data: [] })),
      api.get('/categories').catch(() => ({ data: [] }))
    ]).then(([prodRes, banRes, catRes]) => {
      if (prodRes.data && prodRes.data.length > 0) setProducts(prodRes.data);
      if (banRes.data) setBanners(banRes.data);
      if (catRes.data && catRes.data.length > 0) setCategories(catRes.data);
      setLoading(false);
    });
  }, []);

  const heroSlides = [
    // Dynamic Banners from Admin
    ...banners.map(b => ({
      image: b.imageUrl,
      title: b.title,
      subtitle: "Exclusive deal available now!",
      btnText: "Shop Offer",
      gradient: "linear-gradient(to right, rgba(0,0,0, 0.7) 0%, rgba(0,0,0, 0.4) 100%)",
      titleColor: "text-white",
      subColor: "text-gray-200",
      btnClass: "bg-white text-gray-900 hover:bg-gray-100"
    })),
    // Fallback static slides
    {
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600&q=80",
      title: "Latest Tech Offers.\nUnbeatable Prices Guaranteed.",
      subtitle: "Get the best deals on Apple, Samsung, Sony, and more. 100% Original.",
      btnText: "Shop Electronics",
      gradient: "linear-gradient(to right, rgba(224, 239, 254, 0.95) 0%, rgba(224, 239, 254, 0.8) 40%, rgba(224, 239, 254, 0.2) 100%)",
      titleColor: "text-[#1e293b]",
      subColor: "text-gray-700",
      btnClass: "bg-blue-600 text-white hover:bg-blue-700"
    },
    {
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1600&q=80",
      title: "Apple iPhone 15 Pro.\nTitanium Design.",
      subtitle: "Experience the power of the A17 Pro chip. 100% Original.",
      btnText: "Buy iPhone",
      gradient: "linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.2) 100%)",
      titleColor: "text-white",
      subColor: "text-gray-300",
      btnClass: "bg-white text-slate-900 hover:bg-gray-100"
    },
    {
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1600&q=80",
      title: "Samsung Galaxy S24 Ultra.\nGalaxy AI is here.",
      subtitle: "Experience the ultimate smartphone, with unbeatable features.",
      btnText: "Shop Samsung",
      gradient: "linear-gradient(to right, rgba(224, 239, 254, 0.95) 0%, rgba(224, 239, 254, 0.8) 40%, rgba(224, 239, 254, 0.2) 100%)",
      titleColor: "text-[#1e293b]",
      subColor: "text-gray-700",
      btnClass: "bg-blue-600 text-white hover:bg-blue-700"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="bg-white min-h-screen font-sans pb-10">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
          {toast}
        </div>
      )}

      {/* Hero Section Carousel */}
      <section className="relative h-[500px] md:h-[550px] flex items-center overflow-hidden bg-gray-100 transition-all duration-1000"
        style={{
          backgroundImage: `${heroSlides[currentSlide].gradient}, url('${heroSlides[currentSlide].image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 transition-all duration-500 ease-in-out">
            <h1 className={`text-5xl md:text-[64px] font-bold mb-6 leading-[1.1] tracking-tight whitespace-pre-line ${heroSlides[currentSlide].titleColor}`}>
              {heroSlides[currentSlide].title}
            </h1>
            <p className={`text-xl mb-10 max-w-lg font-medium ${heroSlides[currentSlide].subColor}`}>
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link href="/products" className={`${heroSlides[currentSlide].btnClass} px-8 py-4 rounded-md font-bold text-lg transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-blue-600/30`}>
              {heroSlides[currentSlide].btnText} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-blue-600 w-8' : 'bg-gray-400 opacity-50 hover:bg-gray-300'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center gap-4">
              <Truck size={36} className="text-blue-600" />
              <div>
                <h4 className="font-bold text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-500">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <RefreshCw size={36} className="text-blue-600" />
              <div>
                <h4 className="font-bold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-500">Hassle free returns</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <ShieldCheck size={36} className="text-blue-600" />
              <div>
                <h4 className="font-bold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-500">100% safe & secure</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Headphones size={36} className="text-blue-600" />
              <div>
                <h4 className="font-bold text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-500">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Shop by Category</h2>
          <Link href="/categories" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((cat, i) => (
            <Link href={`/category/${cat.slug}`} key={i} className="flex flex-col items-center gap-5 bg-white border border-gray-100 shadow-sm rounded-xl p-8 hover:shadow-md hover:border-blue-100 transition-all">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <img src="/logo.jpg" alt={cat.name} className="w-full h-full object-cover" />
                )}
              </div>
              <span className="font-semibold text-gray-900 text-sm text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Featured Products</h2>
          <Link href="/products" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* 3 Product Cards */}
            {products.slice(0, 3).map((product) => {
              const oPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
              const cPrice = parseFloat(product.price);
              const discountPct = oPrice && oPrice > cPrice 
                ? Math.round(((oPrice - cPrice) / oPrice) * 100) 
                : 0;
              
              const ratingVal = product.rating || 0;
              
              return (
              <div key={product.id} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col bg-white">
                <Link href={`/product/${product.id}`} className="block relative bg-gray-50 aspect-square overflow-hidden border-b border-gray-100 flex items-center justify-center p-4">
                  {discountPct > 0 ? (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-20">
                      {discountPct}% OFF
                    </span>
                  ) : product.discount ? (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded z-20">
                      {product.discount}
                    </span>
                  ) : null}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist({ id: product.id, name: product.name, price: parseFloat(product.price), image: (product.images && product.images.length > 0) ? product.images[0] : product.image || "/logo.jpg" });
                      }
                    }}
                    className={`absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm transition-colors z-20 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>
                  <img 
                    src={(product.images && product.images.length > 0) ? product.images[0] : product.image || "/logo.jpg"} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                
                <div className="p-4 flex flex-col flex-grow border-t border-gray-100">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600">{product.name}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>}
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill={star <= Math.round(ratingVal) ? "currentColor" : "none"} className={star <= Math.round(ratingVal) ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    {ratingVal > 0 && <span className="text-xs text-gray-500 ml-1 font-medium">{ratingVal.toFixed(1)}</span>}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addItem({ id: product.id, name: product.name, price: parseFloat(product.price), image: (product.images && product.images.length > 0) ? product.images[0] : product.image || "/logo.jpg" });
                      showToast('Added to cart!');
                    }}
                    className="mt-auto w-full bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            )})}

            {/* Promotional Banner taking 2 columns */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden relative bg-[#e0effe] p-10 flex flex-col justify-center">
              <div 
                className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1489987707023-afc7e4348d5d?w=800&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'right center',
                }}
              ></div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">New Collection</p>
                <h3 className="text-4xl font-black text-[#1e293b] mb-4 leading-tight">Style<br/>Meets Comfort</h3>
                <p className="text-gray-600 mb-8 font-medium">Trendy looks for every occasion</p>
                <Link href="/products" className="bg-white text-gray-900 px-6 py-3 rounded-md font-bold text-sm hover:bg-gray-50 transition-colors inline-flex items-center gap-2 shadow-sm">
                  Shop Fashion <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <HomeContent />
    </Suspense>
  );
}
