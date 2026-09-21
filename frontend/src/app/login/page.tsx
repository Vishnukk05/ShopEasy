'use client';
import { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const slideImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop"
];

function LoginPageContent() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [useOtp, setUseOtp] = useState(true);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userIdForOtp, setUserIdForOtp] = useState('');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const searchParams = useSearchParams();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetOtpSent, setIsResetOtpSent] = useState(false);
  const [resetUserId, setResetUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) return showToast('Enter email or phone number');
    
    try {
      if (!isResetOtpSent) {
        const res = await api.post('/auth/forgot-password', { emailOrPhone });
        setResetUserId(res.data.userId);
        setIsResetOtpSent(true);
        showToast('Reset OTP sent!', 'success');
      } else {
        if (!otpCode || !newPassword) return showToast('Enter OTP and new password');
        await api.post('/auth/reset-password', { userId: resetUserId, otp: otpCode, newPassword });
        showToast('Password reset successfully! Please login.', 'success');
        setIsForgotPassword(false);
        setIsResetOtpSent(false);
        setOtpCode('');
        setNewPassword('');
        setPassword('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg) showToast(msg, 'info');
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const res = await api.post('/auth/oauth', { 
        provider: 'google', 
        providerId: decoded.sub, 
        email: decoded.email, 
        name: decoded.name 
      });
      setAuth(res.data.user, res.data.token);
      if (res.data.user.role === 'ADMIN' || res.data.user.role === 'STAFF') {
        window.location.href = '/admin';
      } else {
        router.push('/');
      }
    } catch (err: any) {
      showToast('Google login failed', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) return showToast('Enter email or phone number');

    const isEmail = emailOrPhone.includes('@');
    const payload = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    try {
      if (useOtp) {
        if (!isOtpSent) {
          // Request OTP
          const res = await api.post('/auth/login', { ...payload, requestOtp: true });
          setUserIdForOtp(res.data.userId);
          setIsOtpSent(true);
          showToast('OTP sent to your device', 'success');
        } else {
          // Verify OTP
          if (!otpCode) return showToast('Enter the OTP code');
          const res = await api.post('/auth/verify-otp', { userId: userIdForOtp, otp: otpCode });
          setAuth(res.data.user, res.data.token);
          if (res.data.user.role === 'ADMIN' || res.data.user.role === 'STAFF') {
            window.location.href = '/admin';
          } else {
            router.push('/');
          }
        }
      } else {
        // Password Login
        if (!password) return showToast('Enter password');
        const res = await api.post('/auth/login', { ...payload, password });
        setAuth(res.data.user, res.data.token);
        if (res.data.user.role === 'ADMIN' || res.data.user.role === 'STAFF') {
          window.location.href = '/admin';
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Login failed');
    }
  };

  const handleOAuth = async (provider: string) => {
    try {
      const res = await api.post('/auth/oauth', {
        provider,
        providerId: `mock_${provider}_id_${Math.random()}`,
        email: `mock_${provider}@example.com`,
        name: `Mock ${provider} User`
      });
      setAuth(res.data.user, res.data.token);
      router.push('/');
    } catch (err: any) {
      showToast('OAuth login failed');
    }
  };

  return (
    <div className="bg-[#eef2f6] min-h-screen flex items-center justify-center p-4 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-600' : 'bg-gray-900'}`}>
          {toast.message}
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex max-w-[1000px] w-full min-h-[600px]">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white z-10">
          <div className="mb-8">
            <img src="/logo.jpg" alt="ShopEasy Logo" className="h-16 w-auto mb-6 rounded-lg shadow-sm object-contain" />
            <h1 className="text-[32px] font-bold text-[#1e293b] mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Login to your account</p>
          </div>

          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <input 
                  type="text" 
                  placeholder="Email address or Phone number" 
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  disabled={isResetOtpSent}
                />
              </div>

              {isResetOtpSent && (
                <>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP" 
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <input 
                      type="password" 
                      placeholder="Enter new password" 
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end pt-1">
                <button type="button" onClick={() => setIsForgotPassword(false)} className="text-sm text-blue-600 font-semibold hover:underline">
                  Back to login
                </button>
              </div>

              <button type="submit" className="w-full bg-[#0d6efd] text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors mt-2 text-sm">
                {isResetOtpSent ? 'Reset Password' : 'Send Reset OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <input 
                  type="text" 
                  placeholder="Email address or Phone number" 
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  disabled={isOtpSent}
                />
              </div>
              
              {useOtp ? (
                isOtpSent && (
                  <div>
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP" 
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                )
              ) : (
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                {!useOtp ? (
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-blue-600 font-semibold hover:underline">
                    Forgot Password?
                  </button>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-600 font-medium">Remember me</span>
                  </label>
                )}
                {!isOtpSent && (
                  <button type="button" onClick={() => setUseOtp(!useOtp)} className="text-sm text-blue-600 font-semibold hover:underline">
                    {useOtp ? 'Login with Password' : 'Login with OTP'}
                  </button>
                )}
              </div>

              <button type="submit" className="w-full bg-[#0d6efd] text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors mt-2 text-sm">
                {useOtp && !isOtpSent ? 'Send OTP' : 'Login'}
              </button>
            </form>
          )}

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 font-medium">or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => showToast('Google login failed', 'error')}
                shape="rectangular"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
            <button onClick={() => handleOAuth('facebook')} className="flex justify-center items-center gap-2 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px"><path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/></svg>
              <span className="text-[#1e293b] font-semibold text-sm">Facebook</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Don't have an account? <Link href="/register" className="text-[#0d6efd] font-bold hover:underline">Register</Link>
          </p>
        </div>

        {/* Right Side: Image Slideshow */}
        <div className="hidden md:block md:w-1/2 relative bg-gray-900 overflow-hidden">
          {slideImages.map((src, index) => (
            <img 
              key={src}
              src={src}
              alt="Shopping background"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          {/* Uniform Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 p-14 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-sm">Shop Smarter<br/>Live Better.</h2>
            <p className="text-gray-200 font-medium text-lg drop-shadow-sm">Quality products<br/>for a brighter tomorrow.</p>
            
            {/* Slide Indicators */}
            <div className="flex gap-2 mt-8">
              {slideImages.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/40'}`}></div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <LoginPageContent />
    </Suspense>
  );
}
