import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16 font-sans">
      <div className="max-w-[800px] mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About ShopMate</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Welcome to ShopMate, your ultimate destination for quality products at unbeatable prices. 
          We believe that shopping should be seamless, secure, and enjoyable. That's why we've 
          curated a collection of premium items spanning electronics, fashion, home goods, and more.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed mb-12">
          Founded in 2026, ShopMate is committed to delivering a brighter tomorrow by offering 
          products that make your life smarter and happier. Enjoy 24/7 support, easy returns, 
          and lightning-fast shipping.
        </p>
        <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
