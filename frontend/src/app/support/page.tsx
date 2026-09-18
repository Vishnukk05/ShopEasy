import { FileText, Truck, RefreshCw, Mail, Search, MessageSquare, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const categories = [
    {
      title: "Orders & Shipping",
      description: "Track your packages, understand shipping policies, and check delivery speeds.",
      icon: <Truck size={28} />,
      link: "/shipping",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: "Returns & Refunds",
      description: "Learn how to initiate a return, what items are eligible, and refund timelines.",
      icon: <RefreshCw size={28} />,
      link: "/returns",
      color: "bg-green-50 text-green-600 border-green-100"
    },
    {
      title: "FAQs & Guides",
      description: "Browse frequently asked questions, product guides, and technical help.",
      icon: <FileText size={28} />,
      link: "/faq",
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      title: "Contact Support",
      description: "Send us a message and our support team will get back to you within 24 hours.",
      icon: <Mail size={28} />,
      link: "/contact",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">How can we help you today?</h1>
          <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
            Search our knowledge base or browse categories below to find the answers you need.
          </p>
          
          <div className="relative max-w-2xl mx-auto group">
            <input 
              type="text" 
              placeholder="Search for articles, guides, or help topics..."
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-lg pl-14 shadow-sm"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={24} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors hidden sm:block">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Categories */}
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.link} className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Alternative Contact Section */}
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-20">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">If you couldn't find what you were looking for, our support specialists are available around the clock.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:18001234567" className="flex items-center justify-center gap-2 bg-[#f8fafc] border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                <PhoneCall size={20} className="text-blue-600" />
                1800-123-4567
              </a>
              <Link href="/contact" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <MessageSquare size={20} />
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
