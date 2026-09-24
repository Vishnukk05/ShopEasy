"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  payment?: {
    status: string;
    provider: string;
  };
}

const orderStatuses = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED"
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/order');
      setOrders(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Payment</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                <td className="p-4">
                  <div className="font-medium">{order.user?.name}</div>
                  <div className="text-sm text-gray-500">{order.user?.email}</div>
                </td>
                <td className="p-4">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${order.payment?.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.payment?.status || 'PENDING'}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm bg-white"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
