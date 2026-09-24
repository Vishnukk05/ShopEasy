"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function InventoryPage() {
  const [inventories, setInventories] = useState<any[]>([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdjust = async (id: string, qty: number, reason: string) => {
    try {
      await api.post(`/inventory/${id}/adjust`, { quantityChange: qty, reason });
      fetchInventory();
    } catch (e) {
      alert("Error adjusting stock");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <table className="w-full text-left bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">Product / Variant</th>
            <th className="p-4">Current Stock</th>
            <th className="p-4">Reserved</th>
            <th className="p-4">Low Threshold</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((inv: any) => (
            <tr key={inv.id} className="border-t">
              <td className="p-4">
                {inv.product?.name || inv.variant?.name || 'Unknown'} 
                {inv.variant && ` (SKU: ${inv.variant.sku})`}
              </td>
              <td className="p-4 font-bold">{inv.quantity}</td>
              <td className="p-4">{inv.reservedQuantity}</td>
              <td className="p-4">{inv.lowStockThreshold}</td>
              <td className="p-4 flex gap-2">
                <button onClick={() => handleAdjust(inv.id, 1, 'RESTOCK')} className="bg-green-500 text-white px-2 py-1 rounded text-sm">+1</button>
                <button onClick={() => handleAdjust(inv.id, -1, 'SALE')} className="bg-red-500 text-white px-2 py-1 rounded text-sm">-1</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
