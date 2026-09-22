'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { X, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

const slideImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop", // Woman shopping bags
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=1200&fit=crop", // Packages/Delivery
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop"  // Clothing store rack
];

export default function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen, setAuth, authModalMode, openAuthModal } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isResetOtpSent, setIsResetOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetUserId, setResetUserId] = useState('');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const isLogin = authModalMode === 'login';
  const isRegister = authModalMode === 'register';
  const isForgotPassword = authModalMode === 'forgotPassword';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoginModalOpen) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isLoginModalOpen]);

  if (!isMounted || !isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        if (!isResetOtpSent) {
          if (!emailOrPhone) return alert('Enter email or phone number');
          const res = await api.post('/auth/forgot-password', { emailOrPhone });
          if (res.data.type === 'phone') {
            setResetUserId(res.data.userId);
            setIsResetOtpSent(true);
            alert('OTP sent to your phone!');
          } else {
            alert('Password reset link sent to your email!');
            openAuthModal('login');
          }
        } else {
          if (!otpCode || !newPassword) return alert('Enter OTP and new password');
          await api.post('/auth/reset-password', { userId: resetUserId, otp: otpCode, newPassword });
          alert('Password reset successfully! Please login.');
          setIsResetOtpSent(false);
          setOtpCode('');
          setNewPassword('');
          openAuthModal('login');
        }
        return;
      }

      if (isLogin) {
        if (!email || !password) return alert('Enter email and password');
        const res = await api.post('/auth/login', { email, password });
        setAuth(res.data.user, res.data.token);
        setLoginModalOpen(false);
        if (res.data.user.role === 'ADMIN') {
          window.location.href = '/admin'; // Redirect strictly to admin
        }
      } else if (isRegister) {
        if (!name || !email || !password) return alert('Enter all fields');
        const res = await api.post('/auth/register', { name, email, password });
        setAuth(res.data.user, res.data.token);
        setLoginModalOpen(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 font-sans p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative flex flex-col md:flex-row w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] md:h-[600px] transition-all">
        
        {/* Close Button */}
        <button 
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition-colors hidden md:block"
        >
          <X size={24} />
        </button>
        <button 
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 z-[110] md:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white z-10 relative">
          <div className="mb-8">
            <img src="/logo.jpg" alt="ShopEasy Logo" className="h-20 md:h-24 w-auto mb-6 object-contain scale-[1.2] origin-left" />
            <h1 className="text-[28px] font-bold text-[#1e293b] mb-2 tracking-tight">
              {isLogin ? 'Welcome Back' : isRegister ? 'Create Account' : 'Reset Password'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Login to your account' : isRegister ? 'Join us and start shopping today' : 'Enter details to reset your password'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isForgotPassword ? (
              <>
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
                    disabled={isResetOtpSent}
                    required
                  />
                </div>

                {isResetOtpSent && (
                  <>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Enter 6-digit OTP" 
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="password" 
                        placeholder="Enter new password" 
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-2"
                >
                  {isResetOtpSent ? 'Verify & Reset' : 'Send Reset Link / OTP'}
                </button>
                <button 
                  type="button" 
                  onClick={() => openAuthModal('login')} 
                  className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm"
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                {!isLogin && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm mt-2"
                >
                  {isLogin ? 'Log in' : 'Create Account'}
                </button>
              </>
            )}
          </form>

          {!isForgotPassword && (
            <p className="mt-8 text-center text-sm text-gray-500 font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => openAuthModal(isLogin ? 'register' : 'login')} 
                className="text-blue-600 font-bold hover:underline"
              >
                {isLogin ? 'Register' : 'Log in'}
              </button>
            </p>
          )}
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
          
          <div className="relative z-10 p-12 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-sm">Shop Smarter<br/>Live Better.</h2>
            <p className="text-gray-200 font-medium text-base drop-shadow-sm">Quality products<br/>for a brighter tomorrow.</p>
            
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
