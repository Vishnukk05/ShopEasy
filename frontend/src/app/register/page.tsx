'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';

const slideImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop",  // Clothing store rack
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop", // Woman shopping bags
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=1200&fit=crop" // Packages/Delivery
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    alert('Registration successful! Please login.');
  };

  return (
    <div className="bg-[#eef2f6] min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex max-w-[1000px] w-full min-h-[600px]">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white z-10">
          <div className="mb-8">
            <img src="/logo.jpg" alt="ShopEasy Logo" className="h-16 w-auto mb-6 rounded-lg shadow-sm object-contain" />
            <h1 className="text-[32px] font-bold text-[#1e293b] mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-500 text-sm">Join us and start shopping today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                placeholder="Confirm Password" 
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="w-full bg-[#0d6efd] text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors mt-4 text-sm shadow-md shadow-blue-500/20">
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="text-[#0d6efd] font-bold hover:underline">Log in</Link>
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
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-sm">Your Shopping<br/>Journey Starts Here.</h2>
            <p className="text-gray-200 font-medium text-lg drop-shadow-sm">Join thousands of happy<br/>customers today.</p>
            
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
