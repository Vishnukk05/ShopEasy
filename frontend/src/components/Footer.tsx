'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Globe, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4 overflow-visible">
              <img src="/logo.jpg" alt="ShopEasy Logo" className="h-16 md:h-20 w-auto mix-blend-multiply object-contain scale-[1.3] origin-left" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your one-stop destination for everything easy. Quality products, secure payments, and fast delivery guaranteed.
            </p>
            <div className="flex gap-4 text-gray-400">
              <Globe size={20} className="hover:text-blue-600 cursor-pointer" />
              <Mail size={20} className="hover:text-blue-400 cursor-pointer" />
              <MessageSquare size={20} className="hover:text-pink-600 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/products" className="hover:text-blue-600">Products</Link></li>
              <li><Link href="/categories" className="hover:text-blue-600">Categories</Link></li>
              <li><Link href="/deals" className="hover:text-blue-600">Deals</Link></li>
              <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Customer Care</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/account/orders" className="hover:text-blue-600">My Orders</Link></li>
              <li><Link href="/returns" className="hover:text-blue-600">Returns</Link></li>
              <li><Link href="/shipping" className="hover:text-blue-600">Shipping Info</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
              <li><Link href="/support" className="hover:text-blue-600">Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">
              Subscribe to get the latest offers and updates.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
              <button className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 ShopEasy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

