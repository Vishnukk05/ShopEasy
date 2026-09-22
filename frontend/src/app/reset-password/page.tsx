'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromLink = searchParams.get('token');  // OTP from the email link
  const userIdFromLink = searchParams.get('userId'); // userId from the email link

  const [otp, setOtp] = useState(tokenFromLink || ''); // pre-fill if came from link
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [userId] = useState(userIdFromLink || '');
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // If page opened without token or userId in URL → invalid
  if (!userIdFromLink && !tokenFromLink) {
    return (
      <div className="bg-[#eef2f6] min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            This password reset link is invalid or has expired.<br/>
            Please request a new one from the login page.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-[#2874f0] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a5cbd] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return showToast('Enter the OTP from your email');
    if (!newPassword) return showToast('Enter a new password');
    if (newPassword !== confirmPassword) return showToast('Passwords do not match');
    if (newPassword.length < 6) return showToast('Password must be at least 6 characters');

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        userId,
        otp: otp.trim(),
        newPassword
      });
      showToast('Password reset successful! Redirecting to login...', 'success');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to reset password. OTP may have expired.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#eef2f6] min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white text-sm flex items-center gap-3 ${
          toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
        }`}>
          {toast.type === 'success' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#2874f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-[26px] font-bold text-[#1e293b] mb-2 tracking-tight">Reset Your Password</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enter the OTP from your email{tokenFromLink ? ' (pre-filled from your link)' : ''}<br/>and create a new password.
          </p>
        </div>

        {/* Info Banner when came from link */}
        {tokenFromLink && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
            <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 text-xs font-medium">OTP has been pre-filled from your reset link. Just set your new password below.</p>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          {/* OTP Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">OTP Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP from email"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm tracking-widest font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-enter your new password"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2874f0] hover:bg-[#1a5cbd] text-white font-semibold py-3.5 rounded-lg transition-colors text-sm shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Resetting...
              </>
            ) : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#eef2f6]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
