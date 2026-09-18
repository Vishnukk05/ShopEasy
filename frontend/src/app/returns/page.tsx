import { RefreshCw, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">We want you to be completely satisfied with your purchase. Learn about our hassle-free return process below.</p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">30-Day Returns</h3>
            <p className="text-gray-500 text-sm">Return any unused item in its original packaging within 30 days of delivery.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              <RefreshCw size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Free Return Shipping</h3>
            <p className="text-gray-500 text-sm">We provide prepaid return labels for all defective or incorrect items.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Instant Refunds</h3>
            <p className="text-gray-500 text-sm">Refunds are processed within 48 hours of receiving your returned item.</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 rounded-xl border border-gray-100 shadow-sm prose max-w-none text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return an Item</h2>
          <ol className="list-decimal pl-5 space-y-4 mb-10">
            <li><strong>Log into your account:</strong> Go to the <Link href="/account/orders" className="text-blue-600 hover:underline">Orders</Link> section of your profile.</li>
            <li><strong>Select the item:</strong> Find the order containing the item you wish to return and click "Request Return".</li>
            <li><strong>Print the label:</strong> A prepaid shipping label will be generated. Print it and attach it to your package.</li>
            <li><strong>Drop it off:</strong> Drop the package off at any authorized shipping partner location near you.</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Non-Returnable Items</h2>
          <p className="mb-4">Certain items cannot be returned due to hygiene or software licensing reasons, including:</p>
          <ul className="list-disc pl-5 space-y-2 mb-10">
            <li>Opened software or video games</li>
            <li>In-ear headphones and earbuds (if seal is broken)</li>
            <li>Personal care electronics (shavers, toothbrushes)</li>
            <li>Gift cards and downloadable products</li>
          </ul>

          <div className="bg-gray-50 rounded-lg p-6 flex items-start gap-4 mt-10">
            <HelpCircle className="text-gray-400 shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Need help with your return?</h4>
              <p className="text-sm">Our support team is available 24/7 to help you process your return. <Link href="/contact" className="text-blue-600 hover:underline font-medium">Contact Us</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
