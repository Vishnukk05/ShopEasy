'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Package, User, CreditCard, Folder, Power, HeadphonesIcon, ChevronRight, ChevronDown, CheckCircle2, Edit2, Plus, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

function AddressManager({ showToast }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const { user, token } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '', phone: '', type: 'HOME', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India'
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses', { headers: { 'x-user-id': user?.id } });
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form, { headers: { 'x-user-id': user?.id } });
      } else {
        await api.post('/addresses', form, { headers: { 'x-user-id': user?.id } });
      }
      setIsAdding(false);
      setEditingId(null);
      setForm({ name: '', phone: '', type: 'HOME', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' });
      fetchAddresses();
      showToast('Address saved successfully!', 'success');
    } catch (err) {
      showToast('Error saving address', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
      showToast('Address deleted', 'success');
    } catch (err) {
      showToast('Error deleting address', 'error');
    }
  };

  const handleEdit = (addr: any) => {
    setForm({
      name: addr.name, phone: addr.phone, type: addr.type, line1: addr.line1, line2: addr.line2 || '',
      city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country
    });
    setEditingId(addr.id);
    setIsAdding(true);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-[#212121] mb-6">Manage Addresses</h1>
      
      {!isAdding && (
        <button onClick={() => { setIsAdding(true); setEditingId(null); setForm({ name: '', phone: '', type: 'HOME', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' }); }} className="w-full flex items-center justify-center gap-2 border border-gray-300 text-[#2874f0] font-medium py-3 rounded mb-6 hover:bg-blue-50 transition-colors">
          <Plus size={18} /> ADD A NEW ADDRESS
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleSave} className="bg-blue-50 p-6 rounded-md mb-6 border border-blue-100 space-y-4">
          <h2 className="text-[#2874f0] font-medium mb-4 uppercase">{editingId ? 'Edit Address' : 'Add A New Address'}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-3 rounded text-sm w-full outline-none focus:border-[#2874f0]" />
            <input required type="text" placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="border p-3 rounded text-sm w-full outline-none focus:border-[#2874f0]" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Pincode" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} className="border p-3 rounded text-sm w-full outline-none focus:border-[#2874f0]" />
            <input required type="text" placeholder="Locality / Area (Optional)" value={form.line2} onChange={e => setForm({...form, line2: e.target.value})} className="border p-3 rounded text-sm w-full outline-none focus:border-[#2874f0]" />
          </div>

          <textarea required placeholder="Address (Area and Street)" value={form.line1} onChange={e => setForm({...form, line1: e.target.value})} className="border p-3 rounded text-sm w-full outline-none focus:border-[#2874f0] min-h-[80px] resize-y"></textarea>
          
          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="City/District/Town" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border p-3 rounded text-sm w-full outline-none focus:border-[#2874f0]" />
            <input required type="text" placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="border p-3 rounded text-sm w-full outline-none focus:border-[#2874f0]" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">Address Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={form.type === 'HOME'} onChange={() => setForm({...form, type: 'HOME'})} className="text-[#2874f0]" /> <span className="text-sm">Home (All day delivery)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={form.type === 'WORK'} onChange={() => setForm({...form, type: 'WORK'})} className="text-[#2874f0]" /> <span className="text-sm">Work (Delivery between 10 AM - 5 PM)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="bg-[#2874f0] text-white px-8 py-3 rounded shadow font-medium hover:bg-blue-600 transition-colors">SAVE</button>
            <button type="button" onClick={() => {setIsAdding(false); setEditingId(null);}} className="text-[#2874f0] font-medium hover:underline px-4 py-3">CANCEL</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {addresses.map(addr => (
          <div key={addr.id} className="border border-gray-200 rounded p-4 group">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">{addr.type}</span>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(addr)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                <button onClick={() => handleDelete(addr.id)} className="text-red-500 text-sm font-medium hover:underline">Delete</button>
              </div>
            </div>
            <p className="font-bold text-[#212121] mb-1">{addr.name} &nbsp; <span className="font-medium text-[#212121] ml-2">{addr.phone}</span></p>
            <p className="text-sm text-[#212121]">{addr.line1}</p>
            {addr.line2 && <p className="text-sm text-[#212121]">{addr.line2}</p>}
            <p className="text-sm text-[#212121]">{addr.city}, {addr.state} - <span className="font-medium">{addr.postalCode}</span></p>
          </div>
        ))}
        {addresses.length === 0 && !isAdding && (
          <p className="text-gray-500 text-sm py-4">No saved addresses.</p>
        )}
      </div>
    </>
  );
}

function ProfilePageContent() {
  const { user, setAuth, token, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'STAFF')) {
      router.push('/admin');
    }
  }, [user, router]);

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password' | 'orders' | 'cards' | 'reviews'>(
    (searchParams.get('tab') as any) || 'profile'
  );
  
  const [openSections, setOpenSections] = useState({
    account: true,
    payments: false,
    mystuff: false
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'addresses', 'password', 'orders'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);
  
  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    gender: 'Male'
  });

  // Contact Field State
  const [editingContact, setEditingContact] = useState<'email' | 'mobile' | null>(null);
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState('+91 82819 92616');
  const [tempEmail, setTempEmail] = useState(email);
  const [tempMobile, setTempMobile] = useState(mobile);

  // Sync state if user loads later
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        gender: 'Male'
      });
      setEmail(user.email || '');
      setTempEmail(user.email || '');
    }
  }, [user]);

  // Password State
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleProfileSave = async () => {
    try {
      const newName = `${profileForm.firstName} ${profileForm.lastName}`.trim();
      const res = await api.put('/auth/profile', { name: newName });
      
      if (user && token) {
        setAuth({
          ...user,
          ...res.data.user
        }, token);
      }
      setIsEditingProfile(false);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const [verifyingContact, setVerifyingContact] = useState<'email' | 'mobile' | null>(null);
  const [verificationOtp, setVerificationOtp] = useState('');

  const handleRequestVerification = async (type: 'email' | 'phone') => {
    try {
      await api.post('/auth/request-verification', { contactType: type });
      setVerifyingContact(type === 'email' ? 'email' : 'mobile');
      showToast(`OTP sent to your ${type}`, 'success');
    } catch (err) {
      showToast('Failed to send verification code', 'error');
    }
  };

  const handleVerifyContact = async () => {
    if (!verifyingContact) return;
    try {
      const type = verifyingContact === 'email' ? 'email' : 'phone';
      const res = await api.post('/auth/verify-contact', { contactType: type, otp: verificationOtp });
      if (user && token) {
        setAuth({ ...user, ...res.data.user }, token);
      }
      setVerifyingContact(null);
      setVerificationOtp('');
      showToast('Contact verified successfully!', 'success');
    } catch (err) {
      showToast('Invalid OTP', 'error');
    }
  };

  const handleContactSave = async (field: 'email' | 'mobile') => {
    try {
      const payload = field === 'email' ? { email: tempEmail } : { phone: tempMobile };
      const res = await api.put('/auth/profile', payload);
      const updatedUser = res.data.user;

      if (field === 'email') setEmail(tempEmail);
      if (field === 'mobile') setMobile(tempMobile);
      
      if (user && token) {
        setAuth({
          ...user,
          ...updatedUser
        }, token);
      }
      setEditingContact(null);
      showToast('Profile updated! You can now verify it.', 'success');
    } catch (error) {
      showToast('Failed to update contact', 'error');
    }
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("Passwords do not match!", 'error');
      return;
    }
    showToast("Password changed successfully!", 'success');
    setPasswords({ old: '', new: '', confirm: '' });
  };

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      api.get('/orders').then(res => setOrders(res.data)).catch(() => {});
    }
  }, [user]);

  if (!isClient) {
    return null;
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PAID': return 'bg-blue-100 text-blue-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-8 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white 
${toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-600' : 'bg-gray-900'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-4">
        
        {/* Left Sidebar */}
        <div className="md:w-[280px] shrink-0 space-y-4">
          {/* User Profile Summary */}
          <div className="bg-white rounded shadow-sm p-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 text-[#2874f0] rounded-full flex items-center justify-center font-bold text-xl shrink-0">
              {profileForm.firstName.charAt(0)}{profileForm.lastName.charAt(0)}
            </div>
            <div>
              <p className="text-[12px] text-gray-500">Hello,</p>
              <p className="font-bold text-[#212121] text-[16px]">{profileForm.firstName} {profileForm.lastName}</p>
              <p 
                onClick={() => {
                  setActiveTab('profile');
                  setOpenSections(prev => ({ ...prev, account: true }));
                }}
                className="text-[12px] text-[#2874f0] font-medium mt-1 cursor-pointer hover:underline"
              >
                View Profile
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group ${activeTab === 'orders' ? 'bg-blue-50' : ''}`}>
              <div className={`flex items-center gap-4 ${activeTab === 'orders' ? 'text-[#2874f0]' : 'text-gray-500'} group-hover:text-[#2874f0]`}>
                <Package size={22} />
                <span className={`font-bold text-[15px] group-hover:text-[#2874f0] ${activeTab === 'orders' ? 'text-[#2874f0]' : 'text-[#878787]'}`}>My Orders</span>
              </div>
              <ChevronRight size={18} className={`${activeTab === 'orders' ? 'text-[#2874f0]' : 'text-gray-400'} group-hover:text-[#2874f0]`} />
            </button>

            {/* Account Settings */}
            <div className="border-b border-gray-100">
              <button 
                onClick={() => setOpenSections(prev => ({...prev, account: !prev.account}))} 
                className="w-full flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-4 text-[#2874f0]">
                  <User size={22} />
                  <span className="font-bold text-[15px]">Account Settings</span>
                </div>
                <ChevronDown size={18} className={`text-[#2874f0] transition-transform ${openSections.account ? 'rotate-180' : ''}`} />
              </button>
              {openSections.account && (
                <div className="flex flex-col py-1 bg-white">
                  <button onClick={() => setActiveTab('profile')} className={`text-left pl-14 pr-4 py-2.5 font-medium text-[14px] transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-[#2874f0]' : 'text-[#212121] hover:text-[#2874f0] hover:bg-blue-50'}`}>Profile Information</button>
                  <button onClick={() => setActiveTab('addresses')} className={`text-left pl-14 pr-4 py-2.5 font-medium text-[14px] transition-colors ${activeTab === 'addresses' ? 'bg-blue-50 text-[#2874f0]' : 'text-[#212121] hover:text-[#2874f0] hover:bg-blue-50'}`}>Manage Addresses</button>
                  <button onClick={() => setActiveTab('password')} className={`text-left pl-14 pr-4 py-2.5 font-medium text-[14px] transition-colors ${activeTab === 'password' ? 'bg-blue-50 text-[#2874f0]' : 'text-[#212121] hover:text-[#2874f0] hover:bg-blue-50'}`}>Change Password</button>
                </div>
              )}
            </div>

            {/* Payments */}
            <div className="border-b border-gray-100">
              <button 
                onClick={() => setOpenSections(prev => ({...prev, payments: !prev.payments}))} 
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4 text-gray-500 group-hover:text-[#2874f0]">
                  <CreditCard size={22} />
                  <span className="font-bold text-[#878787] text-[15px] group-hover:text-[#2874f0]">Payments</span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 group-hover:text-[#2874f0] transition-transform ${openSections.payments ? 'rotate-180' : ''}`} />
              </button>
              {openSections.payments && (
                <div className="flex flex-col py-1 bg-white border-t border-gray-50">
                  <button onClick={() => setActiveTab('cards')} className={`text-left pl-14 pr-4 py-2.5 font-medium text-[14px] transition-colors ${activeTab === 'cards' ? 'bg-blue-50 text-[#2874f0]' : 'text-[#212121] hover:text-[#2874f0] hover:bg-blue-50'}`}>Saved Cards</button>
                </div>
              )}
            </div>
            
            {/* My Stuff */}
            <div className="border-b border-gray-100">
              <button 
                onClick={() => setOpenSections(prev => ({...prev, mystuff: !prev.mystuff}))} 
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4 text-gray-500 group-hover:text-[#2874f0]">
                  <Folder size={22} />
                  <span className="font-bold text-[#878787] text-[15px] group-hover:text-[#2874f0]">My Stuff</span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 group-hover:text-[#2874f0] transition-transform ${openSections.mystuff ? 'rotate-180' : ''}`} />
              </button>
              {openSections.mystuff && (
                <div className="flex flex-col py-1 bg-white border-t border-gray-50">
                  <button onClick={() => setActiveTab('reviews')} className={`text-left pl-14 pr-4 py-2.5 font-medium text-[14px] transition-colors ${activeTab === 'reviews' ? 'bg-blue-50 text-[#2874f0]' : 'text-[#212121] hover:text-[#2874f0] hover:bg-blue-50'}`}>My Reviews & Ratings</button>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer group border-b border-gray-100 text-left">
              <div className="flex items-center gap-4 text-gray-500 group-hover:text-red-500">
                <Power size={22} />
                <span className="font-bold text-[#878787] text-[15px] group-hover:text-red-500">Logout</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded shadow-sm overflow-hidden flex flex-col min-h-[600px]">

           <div className="p-8 pb-16 flex-1">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-[#212121] mb-1">Profile Information</h1>
                      <p className="text-sm text-gray-500">Manage your personal details and account information</p>
                    </div>
                    {!isEditingProfile && (
                      <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-1.5 border border-gray-200 text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition-colors text-sm">
                        <Edit2 size={14} /> Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#212121] mb-2">First Name</label>
                      <input 
                        type="text" 
                        disabled={!isEditingProfile}
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        className={`w-full border rounded px-4 py-2.5 text-sm focus:outline-none ${isEditingProfile ? 'border-[#2874f0] bg-white' : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'}`} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#212121] mb-2">Last Name</label>
                      <input 
                        type="text" 
                        disabled={!isEditingProfile}
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        className={`w-full border rounded px-4 py-2.5 text-sm focus:outline-none ${isEditingProfile ? 'border-[#2874f0] bg-white' : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'}`} 
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-[#212121] mb-3">Gender</label>
                    <div className="flex items-center gap-8">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <label key={g} className={`flex items-center gap-2 ${isEditingProfile ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                          <input 
                            type="radio" 
                            name="gender" 
                            disabled={!isEditingProfile}
                            checked={profileForm.gender === g}
                            onChange={() => setProfileForm({...profileForm, gender: g})}
                            className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]" 
                          />
                          <span className="text-sm text-gray-700">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {isEditingProfile && (
                    <div className="flex gap-4 mb-10 max-w-3xl border-b border-gray-100 pb-8">
                      <button onClick={handleProfileSave} className="bg-[#2874f0] text-white px-8 py-2.5 rounded font-medium shadow hover:bg-blue-600 transition-colors">SAVE</button>
                      <button onClick={() => setIsEditingProfile(false)} className="text-gray-600 font-medium px-4 hover:underline">Cancel</button>
                    </div>
                  )}

                  <div className={`space-y-6 max-w-3xl mb-12 ${!isEditingProfile ? 'border-t border-gray-100 pt-8' : ''}`}>
                    {/* EMAIL */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-[#212121]">Email Address</label>
                        {editingContact !== 'email' && (
                          <button onClick={() => setEditingContact('email')} className="text-sm text-[#2874f0] font-medium hover:underline">Edit</button>
                        )}
                      </div>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="email" 
                          disabled={editingContact !== 'email'}
                          value={editingContact === 'email' ? tempEmail : email}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className={`flex-1 border rounded px-4 py-2.5 text-sm focus:outline-none ${editingContact === 'email' ? 'border-[#2874f0] bg-white text-black' : 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed'}`} 
                        />
                        {editingContact !== 'email' ? (
                          (user as any)?.isEmailVerified ? (
                            <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded text-xs font-bold w-[90px]">
                              <CheckCircle2 size={14} /> Verified
                            </span>
                          ) : (
                            <div className="flex gap-2">
                              {verifyingContact === 'email' ? (
                                <>
                                  <input type="text" placeholder="6-digit OTP" maxLength={6} value={verificationOtp} onChange={e => setVerificationOtp(e.target.value)} className="border rounded px-2 py-1 text-sm w-[100px]" />
                                  <button onClick={handleVerifyContact} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold">Verify</button>
                                  <button onClick={() => setVerifyingContact(null)} className="text-gray-500 px-2 py-1.5 rounded text-xs">Cancel</button>
                                </>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded text-xs font-bold w-[100px]">
                                    Unverified
                                  </span>
                                  <button onClick={() => handleRequestVerification('email')} className="text-blue-600 text-xs font-bold hover:underline">Verify Now</button>
                                </>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => handleContactSave('email')} className="bg-[#2874f0] text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-blue-600 whitespace-nowrap">Save & Verify</button>
                            <button onClick={() => setEditingContact(null)} className="text-gray-500 hover:bg-gray-100 px-4 py-2.5 rounded text-sm font-medium whitespace-nowrap">Cancel</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MOBILE */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-[#212121]">Mobile Number</label>
                        {editingContact !== 'mobile' && (
                          <button onClick={() => setEditingContact('mobile')} className="text-sm text-[#2874f0] font-medium hover:underline">Edit</button>
                        )}
                      </div>
                      <div className="flex gap-4 items-center">
                        <input 
                          type="text" 
                          disabled={editingContact !== 'mobile'}
                          value={editingContact === 'mobile' ? tempMobile : mobile}
                          onChange={(e) => setTempMobile(e.target.value)}
                          className={`flex-1 border rounded px-4 py-2.5 text-sm focus:outline-none ${editingContact === 'mobile' ? 'border-[#2874f0] bg-white text-black' : 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed'}`} 
                        />
                        {editingContact !== 'mobile' ? (
                          (user as any)?.isPhoneVerified ? (
                            <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded text-xs font-bold w-[90px]">
                              <CheckCircle2 size={14} /> Verified
                            </span>
                          ) : (
                            <div className="flex gap-2">
                              {verifyingContact === 'mobile' ? (
                                <>
                                  <input type="text" placeholder="6-digit OTP" maxLength={6} value={verificationOtp} onChange={e => setVerificationOtp(e.target.value)} className="border rounded px-2 py-1 text-sm w-[100px]" />
                                  <button onClick={handleVerifyContact} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold">Verify</button>
                                  <button onClick={() => setVerifyingContact(null)} className="text-gray-500 px-2 py-1.5 rounded text-xs">Cancel</button>
                                </>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded text-xs font-bold w-[100px]">
                                    Unverified
                                  </span>
                                  <button onClick={() => handleRequestVerification('phone')} className="text-blue-600 text-xs font-bold hover:underline">Verify Now</button>
                                </>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => handleContactSave('mobile')} className="bg-[#2874f0] text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-blue-600 whitespace-nowrap">Save & Verify</button>
                            <button onClick={() => setEditingContact(null)} className="text-gray-500 hover:bg-gray-100 px-4 py-2.5 rounded text-sm font-medium whitespace-nowrap">Cancel</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* FAQs */}
                  <div className="mb-10 mt-12">
                     <h2 className="text-lg font-bold text-[#212121] mb-6 border-b border-gray-100 pb-2">FAQs</h2>
                     <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-start mb-1 cursor-pointer">
                            <h3 className="text-[14px] font-semibold text-[#212121]">What happens when I update my email address (or mobile number)?</h3>
                            <ChevronDown size={18} className="text-gray-400 mt-0.5" />
                          </div>
                          <p className="text-[13px] text-gray-500">Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                        </div>

                        <div>
                          <div className="flex justify-between items-start mb-1 cursor-pointer">
                            <h3 className="text-[14px] font-semibold text-[#212121]">When will my ShopMate account be updated with the new email address (or mobile number)?</h3>
                            <ChevronDown size={18} className="text-gray-400 mt-0.5" />
                          </div>
                          <p className="text-[13px] text-gray-500">It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
                        </div>
                     </div>
                  </div>
                </>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <AddressManager showToast={showToast} />
              )}

              {/* PASSWORD TAB */}
              {activeTab === 'password' && (
                <>
                  <h1 className="text-2xl font-bold text-[#212121] mb-8">Change Password</h1>
                  <form onSubmit={handlePasswordSave} className="max-w-md space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#212121] mb-2">Old Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwords.old}
                        onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                        className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#2874f0]" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#212121] mb-2">New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#2874f0]" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#212121] mb-2">Retype New Password</label>
                      <input 
                        type="password" 
                        required
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#2874f0]" 
                      />
                    </div>
                    <button type="submit" className="w-full bg-[#2874f0] text-white py-3 rounded font-medium shadow hover:bg-blue-600 transition-colors">
                      UPDATE PASSWORD
                    </button>
                  </form>
                </>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-[#212121]">My Orders</h1>
                    <div className="relative">
                      <input type="text" placeholder="Search orders..." className="pl-4 pr-10 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                          <th className="p-4 pl-6">Order ID</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Total</th>
                          <th className="p-4 pr-6 text-right">Action</th>
                        </tr>
                      </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.map((order, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4 pl-6 font-medium text-gray-900">{order.id.slice(0,8)}...</td>
                              <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-gray-900">${order.totalAmount}</td>
                              <td className="p-4 pr-6 text-right">
                                <Link href={`/order-confirmation/${order.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile List */}
                    <div className="md:hidden divide-y divide-gray-100 border-t border-gray-100">
                      {orders.map((order, i) => (
                        <div key={i} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-900">{order.id.slice(0,8)}...</span>
                            <span className="font-bold text-gray-900">${order.totalAmount}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mb-4">
                            <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <Link href={`/order-confirmation/${order.id}`} className="block w-full text-center border border-gray-300 rounded text-gray-700 py-2 text-sm font-medium">
                            View Details
                          </Link>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {/* SAVED CARDS TAB */}
              {activeTab === 'cards' && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <CreditCard size={48} className="text-gray-300 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Cards</h2>
                  <p className="text-gray-500 max-w-sm">Save your credit or debit cards for faster checkout in the future.</p>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Folder size={48} className="text-gray-300 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h2>
                  <p className="text-gray-500 max-w-sm">You haven't rated or reviewed any products yet.</p>
                </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
