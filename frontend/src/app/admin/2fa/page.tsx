'use client';

import React, { useState } from 'react';

export default function Admin2FAPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generate2FA = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/2fa/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming authorization token is managed by some auth library or fetch wrapper
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } else {
        setMessage(data.message || 'Failed to generate 2FA');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('2FA successfully enabled!');
        setQrCode(null);
        setSecret(null);
        setToken('');
      } else {
        setMessage(data.message || 'Invalid token');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Two-Factor Authentication</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {!qrCode && (
        <div>
          <p className="mb-4 text-gray-700">Protect your admin account with two-factor authentication.</p>
          <button
            onClick={generate2FA}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Setup 2FA'}
          </button>
        </div>
      )}

      {qrCode && (
        <div className="bg-white p-6 rounded shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          <p className="mb-4 text-gray-600">Scan this QR code with your authenticator app (e.g. Google Authenticator, Authy).</p>
          
          <div className="flex justify-center mb-6">
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 border" />
          </div>
          
          {secret && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Or enter this secret manually:</p>
              <code className="bg-gray-100 p-2 rounded block text-center font-mono text-sm">{secret}</code>
            </div>
          )}

          <form onSubmit={verify2FA}>
            <label className="block mb-2 text-sm font-medium text-gray-700">Enter Verification Code</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. 123456"
              maxLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading || token.length < 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify and Enable'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
