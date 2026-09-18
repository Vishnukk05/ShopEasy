import { Truck, Map, Calendar, Package } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Fast, reliable, and transparent shipping options to get your gear to you when you need it.</p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12">
        
        {/* Shipping Methods Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Truck size={24} className="text-blue-600" />
              Delivery Options
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="p-4 md:p-6 font-semibold">Shipping Method</th>
                  <th className="p-4 md:p-6 font-semibold">Estimated Delivery</th>
                  <th className="p-4 md:p-6 font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="p-4 md:p-6 font-medium">Standard Shipping</td>
                  <td className="p-4 md:p-6">3-5 Business Days</td>
                  <td className="p-4 md:p-6">Free (Orders over ₹1999)<br/><span className="text-gray-500 text-sm">₹99 for orders under ₹1999</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 md:p-6 font-medium">Express Delivery</td>
                  <td className="p-4 md:p-6">1-2 Business Days</td>
                  <td className="p-4 md:p-6">₹299</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-medium">Same-Day Delivery <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded ml-2 font-bold">NEW</span></td>
                  <td className="p-4 md:p-6">By 9 PM today <br/><span className="text-gray-500 text-sm">If ordered before 1 PM</span></td>
                  <td className="p-4 md:p-6">₹499 (Metro cities only)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Map size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Service Areas</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We currently ship to over 15,000 PIN codes across India. Same-Day and Express delivery options are limited to select Tier-1 and Tier-2 cities.
            </p>
            <p className="text-gray-600 leading-relaxed">
              International shipping is not currently available.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Package size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Order Tracking</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              As soon as your order is dispatched, you will receive an email and SMS with your tracking link. You can also track your package directly from your <Link href="/account/orders" className="text-blue-600 hover:underline">Orders</Link> page.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
