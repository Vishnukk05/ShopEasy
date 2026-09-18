'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Link href={`/category/${cat.slug}`} key={i} className="group rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all relative">
              <div className="h-48 overflow-hidden bg-gray-100">
                {cat.imageUrl && (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-4 absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
                <h3 className="text-white font-bold text-xl">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
