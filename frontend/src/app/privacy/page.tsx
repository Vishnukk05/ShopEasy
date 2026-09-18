export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="mb-10 border-b border-gray-100 pb-6 text-center">
             <h1 className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
             <p className="text-gray-500 text-sm">Last updated: September 18, 2026</p>
          </div>

          <div className="space-y-8 text-gray-600 leading-relaxed text-[15px]">
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                At ShopMate ("we", "our", or "us"), we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your data when you visit our website or make a purchase from us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="mb-3">We collect several different types of information for various purposes to provide and improve our service to you:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-800">Personal Data:</strong> Name, email address, phone number, shipping and billing address.</li>
                <li><strong className="text-gray-800">Payment Data:</strong> Credit card details, UPI IDs, and other payment information (processed securely through our payment gateways).</li>
                <li><strong className="text-gray-800">Usage Data:</strong> Information about how you interact with our website, browser type, IP address, and time spent on pages.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-3">We use the collected data for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process and fulfill your orders, including shipping and returns.</li>
                <li>To communicate with you regarding order updates, offers, and promotions.</li>
                <li>To improve our website functionality and customer experience.</li>
                <li>To detect, prevent, and address technical issues or fraudulent activities.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Sharing Your Information</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share your data with trusted service providers (such as logistics partners and payment processors) strictly for the purpose of fulfilling your orders and operating our business. These third parties are obligated to maintain the confidentiality and security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. You can manage your account details by logging into your profile. If you wish to permanently delete your account and associated data, please contact our support team or use the "Delete Account" option in your Profile Settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us by email at <a href="mailto:privacy@shopmate.com" className="text-blue-600 hover:underline">privacy@shopmate.com</a> or visit our Help Center.
              </p>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}

