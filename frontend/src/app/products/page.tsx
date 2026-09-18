'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Heart, ChevronRight, SlidersHorizontal, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice: string | null;
  rating: number | null;
  category: { name: string };
  images?: string[];
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const addItem = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(50000);

  const availableBrands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setAllProducts(prodRes.data);
        setFilteredProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Failed to connect to the server. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = allProducts;

    // Filter by Category
    if (selectedCats.length > 0) {
      result = result.filter(p => p.category?.name && selectedCats.includes(p.category.name));
    }

    // Filter by Brand (checking if product name includes the brand name)
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase())));
    }

    // Filter by Price
    result = result.filter(p => parseFloat(p.price) <= maxPrice);

    setFilteredProducts(result);
  }, [selectedCats, selectedBrands, maxPrice, allProducts]);

  const toggleCategory = (catName: string) => {
    setSelectedCats(prev => prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]);
  };

  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev => prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]);
  };

  const clearAllFilters = () => {
    setSelectedCats([]);
    setSelectedBrands([]);
    setMaxPrice(50000);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
          {toast}
        </div>
      )}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900">Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h3>
                <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:underline">Clear All</button>
              </div>

              {/* Categories Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCats.includes(cat.name)}
                        onChange={() => toggleCategory(cat.name)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                      />
                      <span className="text-gray-600 text-sm">{cat.name}</span>
                    </label>
                  ))}
                  {categories.length === 0 && <p className="text-xs text-gray-400">No categories found.</p>}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Price Range (Max)</h4>
                <input 
                  type="range" 
                  min="0" 
                  max="50000" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-blue-600" 
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$0</span>
                  <span className="font-medium text-gray-900">${maxPrice}</span>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Brand</h4>
                <div className="space-y-3">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                      />
                      <span className="text-gray-600 text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-3/4">
            
            {/* Top Bar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-900">All Products <span className="text-gray-500 text-sm font-normal">({filteredProducts.length})</span></h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-red-200">
                <h2 className="text-xl font-bold text-red-600 mb-2">Network Error</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Refresh Page</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
                 <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
                 <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                 <button onClick={clearAllFilters} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const oPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
                  const cPrice = parseFloat(product.price);
                  const discountPct = oPrice && oPrice > cPrice 
                    ? Math.round(((oPrice - cPrice) / oPrice) * 100) 
                    : 0;
                  const ratingVal = product.rating || 0;
                  
                  return (
                  <div key={product.id} className="group border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col">
                    <Link href={`/product/${product.id}`} className="block relative bg-gray-50 aspect-square flex items-center justify-center p-4">
                      {discountPct > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-20">
                          {discountPct}% OFF
                        </span>
                      )}
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Image 
                          src="/logo.jpg" 
                          alt={product.name} 
                          width={100} 
                          height={100} 
                          className="opacity-20 group-hover:scale-105 transition-transform duration-300 object-contain"
                        />
                      )}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id);
                          } else {
                            addToWishlist({ id: product.id, name: product.name, price: parseFloat(product.price), image: product.images?.[0] });
                          }
                        }}
                        className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm transition-colors z-20 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                      </button>
                    </Link>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-blue-600">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= Math.round(ratingVal) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= Math.round(ratingVal) ? "text-yellow-400" : "text-gray-300"}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        {ratingVal > 0 && <span className="text-[10px] text-gray-500 font-medium ml-1">{ratingVal.toFixed(1)}</span>}
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-base font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>}
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({ id: product.id, name: product.name, price: parseFloat(product.price), image: product.images?.[0] || '/logo.jpg' });
                          showToast('Added to cart!');
                        }}
                        className="mt-auto w-full bg-blue-600 text-white font-medium py-2 rounded text-sm hover:bg-blue-700 transition-colors active:scale-[0.98]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )})}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
