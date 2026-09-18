'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  description: string;
  category: { name: string; slug: string };
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products
        const res = await api.get('/products');
        
        // Filter by category slug in the frontend 
        const categoryProducts = res.data.filter(
          (p: Product) => p.category?.slug === slug
        );
        
        // If the category is empty, just show nothing (empty array)
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  return (
    <div className="bg-[#f1f3f6] min-h-screen p-4 font-sans">
      <div className="max-w-[1600px] mx-auto bg-white shadow-sm rounded-sm">
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-2xl font-medium text-gray-800 capitalize">{slug?.replace('-', ' ')}</h1>
          <p className="text-sm text-gray-500 mt-1">Showing 1 – {products.length} of {products.length} results</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[blue-600]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products available in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0 border-t border-l border-gray-100">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col items-center border-b border-r border-gray-100 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] p-4 transition-shadow bg-white z-10 relative">
                {/* Image Placeholder */}
                <div className="w-full aspect-square bg-white mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="/logo.jpg" 
                    alt="Product Placeholder" 
                    width={100} 
                    height={100} 
                    className="opacity-20 object-contain"
                  />
                </div>
                
                {/* Product Details */}
                <div className="w-full text-left">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-[blue-600] transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="bg-[green-600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center">
                      4.2 ★
                    </span>
                    <span className="text-gray-500 text-xs">(32)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-medium text-gray-900">${product.price}</span>
                    <span className="text-gray-500 line-through text-xs">${(Number(product.price) * 1.2).toFixed(2)}</span>
                    <span className="text-[green-600] text-xs font-medium">20% off</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Free delivery</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

