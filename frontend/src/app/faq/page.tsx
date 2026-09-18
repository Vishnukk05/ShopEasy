import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        { q: "How long will it take to get my order?", a: "Standard shipping takes 3-5 business days. Express delivery takes 1-2 business days. You can view all options on our Shipping page." },
        { q: "Can I change my shipping address after placing an order?", a: "You can change your shipping address within 1 hour of placing the order by going to your Orders page. After that, the order is locked for processing." },
        { q: "Do you ship internationally?", a: "Currently, we only ship within India. We are working on expanding our delivery network globally." }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        { q: "What is your return policy?", a: "We offer a 30-day return policy for most unused items in their original packaging. Please see our Returns page for a list of non-returnable items." },
        { q: "How long does it take to process a refund?", a: "Once we receive your returned item, refunds are processed within 48 hours. It may take 3-5 business days for the funds to appear in your bank account." },
      ]
    },
    {
      category: "Products & Warranty",
      questions: [
        { q: "Are your products authentic?", a: "Yes, 100%. We source all our products directly from the brands or their authorized distributors." },
        { q: "Do products come with a warranty?", a: "All electronics come with a standard 1-year manufacturer's warranty unless otherwise stated on the product page." },
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-12 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
            <HelpCircle size={32} className="-rotate-12" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Find answers to common questions about orders, shipping, returns, and more.</p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-12">
        {faqs.map((group, idx) => (
          <div key={idx} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{group.category}</h2>
            <div className="space-y-4">
              {group.questions.map((faq, fIdx) => (
                <details key={fIdx} className="group bg-white border border-gray-200 rounded-lg [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-gray-900">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-12 text-center p-8 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">If you couldn't find the answer you're looking for, our team is here to help.</p>
          <Link href="/contact" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
