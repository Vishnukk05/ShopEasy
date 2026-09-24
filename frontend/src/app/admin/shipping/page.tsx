'use client';

import React, { useEffect, useState } from 'react';

interface TrackingEvent {
  id: string;
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
}

interface Shipment {
  id: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status: string;
  order: {
    user: {
      name: string;
      email: string;
    };
  };
  events: TrackingEvent[];
}

export default function ShippingAdminPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/shipping');
      if (!response.ok) throw new Error('Failed to fetch shipments');
      const data = await response.json();
      setShipments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/shipping/${selectedShipmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status || undefined,
          trackingNumber: trackingNumber || undefined,
          carrier: carrier || undefined,
          location: location || undefined,
          description: description || undefined
        })
      });

      if (!response.ok) throw new Error('Failed to update shipment');
      
      // Reset form & refresh
      setSelectedShipmentId(null);
      setStatus('');
      setTrackingNumber('');
      setCarrier('');
      setLocation('');
      setDescription('');
      
      fetchShipments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const selectShipment = (s: Shipment) => {
    setSelectedShipmentId(s.id);
    setStatus(s.status);
    setTrackingNumber(s.trackingNumber || '');
    setCarrier(s.carrier || '');
  };

  if (loading) return <div className="p-8">Loading shipments...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shipping Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipments</h2>
          <div className="space-y-4">
            {shipments.map(s => (
              <div 
                key={s.id} 
                className={`p-4 border rounded shadow-sm cursor-pointer ${selectedShipmentId === s.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => selectShipment(s)}
              >
                <div className="flex justify-between">
                  <span className="font-medium">Order ID: {s.orderId.substring(0, 8)}...</span>
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded">{s.status}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Customer: {s.order?.user?.name || 'Unknown'} ({s.order?.user?.email || 'N/A'})
                </div>
                {(s.trackingNumber || s.carrier) && (
                  <div className="text-sm text-gray-600 mt-1">
                    {s.carrier} - {s.trackingNumber}
                  </div>
                )}
                {s.events && s.events.length > 0 && (
                  <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                    Latest event: {s.events[s.events.length - 1].status} 
                    {s.events[s.events.length - 1].location && ` at ${s.events[s.events.length - 1].location}`}
                  </div>
                )}
              </div>
            ))}
            {shipments.length === 0 && <p className="text-gray-500">No shipments found.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Update Shipment</h2>
          {selectedShipmentId ? (
            <form onSubmit={handleUpdate} className="bg-white p-6 rounded border shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full border rounded p-2" 
                  value={status} 
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2" 
                  value={carrier} 
                  onChange={e => setCarrier(e.target.value)} 
                  placeholder="e.g. FedEx, UPS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2" 
                  value={trackingNumber} 
                  onChange={e => setTrackingNumber(e.target.value)} 
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-gray-800 mb-2">Add Tracking Event (Optional)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full border rounded p-2" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                      placeholder="e.g. Sort Facility, New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input 
                      type="text" 
                      className="w-full border rounded p-2" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="e.g. Package arrived at facility"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
              >
                Update Shipment
              </button>
            </form>
          ) : (
            <div className="p-8 border border-dashed rounded text-center text-gray-500">
              Select a shipment to update its status
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
