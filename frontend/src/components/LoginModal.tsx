'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const slideImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop"
];

export default function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen, setAuth, authModalMode, openAuthModal } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isForgotSent, setIsForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Inline error/success alert
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const isLogin = authModalMode === 'login';
  const isRegister = authModalMode === 'register';
  const isForgotPassword = authModalMode === 'forgotPassword';

  const showAlert = (message: string, type: 'error' | 'success' = 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isLoginModalOpen) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isLoginModalOpen]);

  // Reset state when mode changes
  useEffect(() => {
    setAlert(null);
    setIsForgotSent(false);
    setEmailOrPhone('');
    setEmail('');
    setPassword('');
    setName('');
  }, [authModalMode]);

  if (!isMounted || !isLoginModalOpen) return null;

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) return showAlert('Enter your email or phone number');
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password', { emailOrPhone });
      setIsForgotSent(true);
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to send reset link', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        if (!email || !password) { showAlert('Enter email and password'); return; }
        const res = await api.post('/auth/login', { email, password });
        setAuth(res.data.user, res.data.token);
        setLoginModalOpen(false);
        if (res.data.user.role === 'ADMIN' || res.data.user.role === 'STAFF') {
          window.location.href = '/admin';
        }
      } else if (isRegister) {
        if (!name || !email || !password) { showAlert('Please fill in all fields'); return; }
        const res = await api.post('/auth/register', { name, email, password });
        setAuth(res.data.user, res.data.token);
        setLoginModalOpen(false);
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Action failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 font-sans p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative flex flex-col md:flex-row w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] md:h-[600px] transition-all">
        
        {/* Close Buttons */}
        <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition-colors hidden md:block">
          <X size={24} />
        </button>
        <button onClick={() => setLoginModalOpen(false)} className="absolute top-4 right-4 z-[110] md:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition-colors">
          <X size={20} />
        </button>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white z-10 relative overflow-y-auto">
          <div className="mb-6">
            <img src="/logo.jpg" alt="ShopEasy Logo" className="h-16 w-auto mb-5 object-contain" />
            <h1 className="text-[26px] font-bold text-[#1e293b] mb-1 tracking-tight">
              {isLogin ? 'Welcome Back' : isRegister ? 'Create Account' : 'Forgot Password?'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Login to your account' : isRegister ? 'Join us and start shopping' : "We'll send a reset link & OTP to your email"}
            </p>
          </div>

          {/* Inline Alert */}
          {alert && (
            <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm font-medium mb-4 ${
              alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {alert.type === 'error' ? <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> : <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />}
              {alert.message}
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {isForgotPassword ? (
            isForgotSent ? (
              /* ✅ Success State */
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Email Sent!</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    A reset link and OTP code have been sent to<br/>
                    <span className="font-semibold text-blue-600">{emailOrPhone}</span>
                  </p>
                  <p className="text-gray-400 text-xs mt-2">Click the link in the email to reset your password.</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setLoginModalOpen(false); router.push('/login'); }}
                  className="w-full bg-[#2874f0] hover:bg-[#1a5cbd] text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              /* Email Input Form */
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Email address or Phone number"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Sending...</> : 'Send Reset Link & OTP'}
                </button>
                <button type="button" onClick={() => openAuthModal('login')} className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm">
                  Back to Login
                </button>
              </form>
            )
          ) : (
            /* LOGIN / REGISTER Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input type="text" placeholder="Full Name" className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input type="email" placeholder="Email address" className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input type="password" placeholder="Password" className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" onClick={() => openAuthModal('forgotPassword')} className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</button>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-2 disabled:opacity-70 flex items-center justify-center gap-2">
                {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Please wait...</> : (isLogin ? 'Log in' : 'Create Account')}
              </button>
            </form>
          )}

          {!isForgotPassword && (
            <p className="mt-6 text-center text-sm text-gray-500 font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => openAuthModal(isLogin ? 'register' : 'login')} className="text-blue-600 font-bold hover:underline">
                {isLogin ? 'Register' : 'Log in'}
              </button>
            </p>
          )}
        </div>

        {/* Right Side: Image Slideshow */}
        <div className="hidden md:block md:w-1/2 relative bg-gray-900 overflow-hidden">
          {slideImages.map((src, index) => (
            <img key={src} src={src} alt="Shopping background" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} />
          ))}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 p-12 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-sm">Shop Smarter<br/>Live Better.</h2>
            <p className="text-gray-200 font-medium text-base drop-shadow-sm">Quality products<br/>for a brighter tomorrow.</p>
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
