'use client';
import { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

const slideImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop"
];

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const searchParams = useSearchParams();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg) showToast(msg, 'info');
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return showToast('Enter email and password');
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
      if (res.data.user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        router.push('/');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Login failed');
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 font-semibold hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" className="w-full bg-[#0d6efd] text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors mt-2 text-sm">
              Login
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 font-medium">or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex justify-center items-center gap-2 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
              <span className="text-[#1e293b] font-semibold text-sm">Google</span>
            </button>
            <button className="flex justify-center items-center gap-2 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors">
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
