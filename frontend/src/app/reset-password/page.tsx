'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return showToast('Invalid or missing reset token');
    if (newPassword !== confirmPassword) return showToast('Passwords do not match');
    if (newPassword.length < 6) return showToast('Password must be at least 6 characters');

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      showToast('Password reset successful! Redirecting to login...', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  if (!token) {
    return (
      <div className="bg-[#eef2f6] min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">The password reset link is invalid or missing the token.</p>
          <button onClick={() => router.push('/login')} className="bg-[#2874f0] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1a5cbd]">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eef2f6] min-h-screen flex items-center justify-center p-4 font-sans">
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex max-w-md w-full p-10 flex-col justify-center">
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-bold text-[#1e293b] mb-2 tracking-tight">Create New Password</h1>
          <p className="text-gray-500 text-sm">Enter your new password below</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <input 
              type="password" 
              placeholder="New password" 
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Confirm new password" 
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#2874f0] hover:bg-[#1a5cbd] text-white font-semibold py-3.5 rounded-lg transition-colors text-sm shadow-md"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#eef2f6]">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
