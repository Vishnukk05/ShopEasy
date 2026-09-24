"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function CustomerAccountDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Fetch profile, addresses, orders, sessions
    api.get('/account/me').then(res => setProfile(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">My Account</h1>
      
      {/* Feature #12: Saved Addresses */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
        <div className="text-gray-600">Default Shipping Address UI Goes Here...</div>
      </section>

      {/* Feature #12: Order History, Tracking, Invoices */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Order History & Tracking</h2>
        <div className="text-gray-600">Order Timeline and Download Invoice PDF Links Go Here...</div>
      </section>

      {/* Feature #12: Review History */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">My Reviews</h2>
        <div className="text-gray-600">List of published product reviews...</div>
      </section>

      {/* Feature #12: Session Management */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-red-600">Security & Sessions</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded">
          Logout of All Devices
        </button>
      </section>
    </div>
  );
}
