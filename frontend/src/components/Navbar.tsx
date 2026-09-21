'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, User as UserIcon, Heart, ShoppingCart, Globe, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const { user, logout, openAuthModal } = useAuthStore();
  const cartItemCount = useCartStore((state) => state.getTotalItems());
  const [isMounted, setIsMounted] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    // Trigger location prompt immediately on page load
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using a free public API
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          // Extract city or state
          const city = data.address?.city || data.address?.town || data.address?.state_district || 'Your Location';
          const postal = data.address?.postcode || '';
          setLocation(`${city} ${postal}`.trim());
        } catch (error) {
          console.error("Failed to fetch location name", error);
          setLocation("Location Found");
        }
      }, (error) => {
        console.warn("Location access denied or unavailable.");
      });
    } else {
      console.warn("Geolocation is not supported by your browser.");
    }
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top Tier */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Logo & Location */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2 overflow-visible">
            <img src="/logo.jpg" alt="ShopEasy Logo" className="h-16 md:h-20 w-auto mix-blend-multiply object-contain scale-[1.3] origin-left" />
          </Link>
        </div>

        {/* Center Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            className="w-full bg-[#f0f5ff] text-gray-900 px-4 py-2.5 rounded-md pl-11 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {(!isMounted || (user?.role !== 'ADMIN' && user?.role !== 'STAFF')) && (
            <div className="flex items-center gap-5">
              <Link href="/account" className="hidden sm:block text-gray-600 hover:text-blue-600 transition-colors">
                <UserIcon size={22} />
              </Link>
              
              <Link href="/wishlist" className="relative text-gray-600 hover:text-blue-600 transition-colors">
                <Heart size={22} />
              </Link>
              
              <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                <ShoppingBag size={22} />
                {isMounted && cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-4 border-l pl-6 border-gray-200">
            {/* Location Block */}
            <button onClick={fetchLocation} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-200">
              <MapPin size={20} className="text-gray-700" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-gray-500 font-medium leading-none">
                  {location ? 'Deliver to' : 'Location not set'}
                </span>
                <span className="text-[13px] font-bold text-[#2874f0] leading-tight">
                  {location ? location : 'Select delivery location'} &rsaquo;
                </span>
              </div>
            </button>

            {!isMounted ? null : user ? (
              <div className="relative group cursor-pointer z-50">
                <div className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                  <span className="text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                
                {/* Dropdown Menu (on hover) - Logged In */}
                <div className="absolute top-full right-0 w-52 bg-white border border-gray-100 shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                     <div className="p-2 flex flex-col">
                        {(user.role === 'ADMIN' || user.role === 'STAFF') ? (
                          <>
                            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm text-blue-700 bg-blue-50 font-semibold hover:bg-blue-100 rounded mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg> Admin Dashboard
                            </Link>
                            <Link href="/?preview=true" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
                              <Globe size={16} className="text-gray-400" /> Preview Website
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
                              <UserIcon size={16} className="text-gray-400" /> My Profile
                            </Link>
                            <Link href="/account?tab=orders" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
                              <ShoppingBag size={16} className="text-gray-400" /> Orders
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded">
                              <Heart size={16} className="text-gray-400" /> Wishlist
                            </Link>
                          </>
                        )}
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded text-left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        Logout
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="relative group cursor-pointer z-50">
                <button 
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <UserIcon size={20} />
                  <span className="text-sm font-medium">Login</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                
                {/* Dropdown Menu (on hover) - Logged Out */}
                <div className="absolute top-full left-0 w-60 bg-white border border-gray-100 shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                   <div className="flex items-center justify-between p-4">
                      <span className="text-sm font-medium text-gray-700">New customer?</span>
                      <button onClick={() => openAuthModal('register')} className="text-sm font-bold text-blue-600 hover:underline">Sign Up</button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Tier: Navigation Menu */}
      <div className="border-t border-gray-100 hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-12 flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
          <Link href="/deals" className="hover:text-blue-600 transition-colors">Deals</Link>
        </div>
      </div>
    </header>
  );
}
