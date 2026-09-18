'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Plus, Edit, Trash2, Search, X, Folder, Image as ImageIcon, MessageSquare, Send, CheckCircle, Power } from 'lucide-react';

interface Product { id: string; name: string; description: string; price: number; originalPrice: number | null; rating: number | null; stockQuantity: number; categoryId: string; category: { name: string }; images: string[]; }
interface Category { id: string; name: string; imageUrl?: string; }
interface User { id: string; name: string; email: string; role: string; createdAt: string; }
interface Banner { id: string; title: string; imageUrl: string; isActive: boolean; createdAt: string; }
interface Ticket { id: string; subject: string; message: string; status: string; createdAt: string; }
interface Campaign { id: string; subject: string; message: string; sentAt: string; }

export default function AdminPage() {
  const { user, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Custom Alerts & Confirms
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);

  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  // Product Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', originalPrice: '', rating: '', stockQuantity: '', categoryId: '', images: '' });

  // Category Form
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', imageUrl: '' });

  // Banner Form
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [bannerFormData, setBannerFormData] = useState({ title: '', imageUrl: '' });

  // Campaign Form
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  const [campaignFormData, setCampaignFormData] = useState({ subject: '', message: '' });

  const fetchData = () => {
    api.get('/products').then(res => setProducts(res.data)).catch(() => {});
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {});
    api.get('/admin/users').then(res => setUsersList(res.data)).catch(() => {});
    api.get('/admin/banners').then(res => setBanners(res.data)).catch(() => {});
    api.get('/admin/tickets').then(res => setTickets(res.data)).catch(() => {});
    api.get('/admin/campaigns').then(res => setCampaigns(res.data)).catch(() => {});
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [user]);

  // --- Handlers ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        price: parseFloat(formData.price), 
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10), 
        slug: formData.name.toLowerCase().replace(/ /g, '-'),
        images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      showToast('Product saved!', 'success');
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', originalPrice: '', rating: '', stockQuantity: '', categoryId: '', images: '' });
      fetchData();
    } catch (err: any) { 
      showToast(err.response?.data?.message || 'Failed to save product.', 'error'); 
    }
  };

  const handleProductDelete = async (id: string) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this product?',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${id}`);
          fetchData();
          showToast('Product deleted!', 'success');
        } catch (err: any) {
          showToast(err.response?.data?.message || 'Failed to delete product.', 'error');
        }
      }
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        name: categoryFormData.name, 
        slug: categoryFormData.name.toLowerCase().replace(/ /g, '-'),
        imageUrl: categoryFormData.imageUrl 
      };
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      showToast('Category saved!', 'success');
      setIsCategoryFormOpen(false);
      setEditingCategoryId(null);
      setCategoryFormData({ name: '', imageUrl: '' });
      fetchData();
    } catch (err: any) { 
      showToast(err.response?.data?.message || 'Failed to save category.', 'error'); 
    }
  };

  const handleCategoryDelete = async (id: string) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this category?',
      onConfirm: async () => {
        try {
          await api.delete(`/categories/${id}`);
          fetchData();
          showToast('Category deleted!', 'success');
        } catch (err: any) {
          showToast(err.response?.data?.message || 'Failed to delete category. It might have associated products.', 'error');
        }
      }
    });
  };

  const handleDeleteUser = async (id: string) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this user?',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/users/${id}`);
          fetchData();
          showToast('User deleted!', 'success');
        } catch (err: any) {
          showToast('Failed to delete user.', 'error');
        }
      }
    });
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/banners', bannerFormData);
      setIsBannerFormOpen(false);
      setBannerFormData({ title: '', imageUrl: '' });
      fetchData();
      showToast('Banner saved!', 'success');
    } catch (err: any) {
      showToast('Failed to save banner.', 'error');
    }
  };

  const handleBannerDelete = async (id: string) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this banner?',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/banners/${id}`);
          fetchData();
          showToast('Banner deleted!', 'success');
        } catch (err: any) {
          showToast('Failed to delete banner.', 'error');
        }
      }
    });
  };

  const handleResolveTicket = async (id: string) => {
    await api.put(`/admin/tickets/${id}/resolve`);
    fetchData();
  };

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/campaigns', campaignFormData);
      showToast('Marketing email dispatched to all users successfully!', 'success');
      setIsCampaignFormOpen(false);
      setCampaignFormData({ subject: '', message: '' });
      fetchData();
    } catch (err: any) {
      showToast('Failed to dispatch marketing email.', 'error');
    }
  };

  if (!isMounted) return null;

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-md w-full text-center">
           <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
           <p className="text-gray-600">You must be an Admin to view this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-opacity duration-300 ${toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Confirm Dialog Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDialog(null)} className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition-colors">Cancel</button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Dark Navy Sidebar */}
      <div className="w-64 bg-[#0f172a] text-white shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="text-blue-400" /> Admin Panel
          </h2>
        </div>
        <nav 
          className="flex-1 py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
            { id: 'products', icon: <Package size={20}/>, label: 'Products' },
            { id: 'categories', icon: <Folder size={20}/>, label: 'Categories' },
            { id: 'users', icon: <Users size={20}/>, label: 'Customers' },
            { id: 'banners', icon: <ImageIcon size={20}/>, label: 'Offers / Banners' },
            { id: 'tickets', icon: <MessageSquare size={20}/>, label: 'Support Tickets' },
            { id: 'campaigns', icon: <Send size={20}/>, label: 'Marketing Emails' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveMenu(item.id)} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-white/5 transition-colors ${activeMenu === item.id ? 'bg-white/10 text-blue-400 border-r-4 border-blue-400' : 'text-gray-400'}`}>
              {item.icon} <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
          <div className="p-6 border-t border-white/10 text-sm text-gray-400 space-y-4">
            <div>
              Logged in as <span className="font-bold text-white">{user?.name}</span>
            </div>
            <button 
              onClick={() => {
                logout();
                window.location.href = '/';
              }} 
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-full"
            >
              <Power size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-gray-800 capitalize">{activeMenu.replace('-', ' ')} Management</h1>
        </header>

        {/* Scrollable Content */}
        <main 
          className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          
          {/* DASHBOARD PREVIEW MODULE */}
          {activeMenu === 'dashboard' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Website Live Preview</h2>
                <a href="/" target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">Open in new tab &nearr;</a>
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[700px]">
                <iframe src="/?preview=true" className="w-full h-full border-0 absolute inset-0" title="Website Preview" />
              </div>
            </div>
          )}

          {/* PRODUCTS MODULE */}
          {activeMenu === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">All Products</h2>
                <button onClick={() => { setEditingId(null); setFormData({ name: '', description: '', price: '', originalPrice: '', rating: '', stockQuantity: '', categoryId: '', images: '' }); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              {isFormOpen && (
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-6 relative">
                  <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2"><X size={20} /></button>
                  <h3 className="text-lg font-bold mb-4 text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"><option value="">Select...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Price ($)</label><input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label><input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="Leave empty if no discount" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock</label><input type="number" required value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label><input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="e.g. 4.5" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label><input type="text" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="https://..., https://..." /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-20"></textarea></div>
                    <div className="md:col-span-2"><button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium">Save</button></div>
                  </form>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold"><th className="p-4 pl-6 w-20">Image</th><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Rating</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="p-4 pl-6">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <img src="/logo.jpg" alt="fallback" className="w-12 h-12 object-cover rounded" />
                          )}
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          <div>{product.name}</div>
                          <div className="text-xs text-gray-500 font-normal truncate max-w-[200px] mt-1">{product.description || 'No description'}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">${product.price}</div>
                          {product.originalPrice && <div className="text-xs text-red-400 line-through">${product.originalPrice}</div>}
                        </td>
                        <td className="p-4">{product.rating ? `${product.rating} ★` : '-'}</td>
                        <td className="p-4">{product.stockQuantity}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => { 
                            setEditingId(product.id); 
                            setFormData({ 
                              name: product.name, 
                              description: product.description || '', 
                              price: String(product.price), 
                              originalPrice: product.originalPrice ? String(product.originalPrice) : '', 
                              rating: product.rating ? String(product.rating) : '', 
                              stockQuantity: String(product.stockQuantity), 
                              categoryId: product.categoryId,
                              images: product.images ? product.images.join(', ') : ''
                            }); 
                            setIsFormOpen(true); 
                          }} className="p-1.5 text-blue-500 hover:text-blue-600 mr-2"><Edit size={16}/></button>
                          <button onClick={() => handleProductDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES MODULE */}
          {activeMenu === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                <button onClick={() => { setEditingCategoryId(null); setCategoryFormData({ name: '', imageUrl: '' }); setIsCategoryFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} /> Add Category</button>
              </div>
              {isCategoryFormOpen && (
                <form onSubmit={handleCategorySubmit} className="bg-white p-6 border rounded-xl flex flex-col gap-4">
                  <div className="flex gap-4">
                    <input type="text" required value={categoryFormData.name} onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })} placeholder="Category Name" className="flex-1 border p-2 rounded-md"/>
                    <input type="url" value={categoryFormData.imageUrl || ''} onChange={e => setCategoryFormData({ ...categoryFormData, imageUrl: e.target.value })} placeholder="Image URL (optional)" className="flex-1 border p-2 rounded-md"/>
                    <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md">Save</button>
                  </div>
                </form>
              )}
              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm divide-y">
                  <thead><tr className="bg-gray-50 text-xs uppercase text-gray-500"><th className="p-4 w-20">Image</th><th className="p-4">Name</th><th className="p-4 text-right">Actions</th></tr></thead>
                  <tbody className="divide-y">{categories.map(c => <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-4">{c.imageUrl ? <img src={c.imageUrl} className="w-12 h-12 rounded object-cover" alt="" /> : <img src="/logo.jpg" className="w-12 h-12 rounded object-cover" alt="fallback logo" />}</td>
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingCategoryId(c.id); setCategoryFormData({ name: c.name, imageUrl: c.imageUrl || '' }); setIsCategoryFormOpen(true); }} className="text-blue-500 mr-3"><Edit size={16}/></button>
                      <button onClick={() => handleCategoryDelete(c.id)} className="text-red-500"><Trash2 size={16}/></button>
                    </td>
                  </tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS MODULE */}
          {activeMenu === 'users' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">All Customers</h2>
              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm divide-y">
                  <thead><tr className="bg-gray-50 text-xs uppercase text-gray-500"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr></thead>
                  <tbody className="divide-y">{usersList.map(u => <tr key={u.id} className="hover:bg-gray-50"><td className="p-4 font-medium">{u.name}</td><td className="p-4">{u.email}</td><td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{u.role}</span></td><td className="p-4 text-right">{u.role !== 'ADMIN' && <button onClick={() => handleDeleteUser(u.id)} className="text-red-500"><Trash2 size={16}/></button>}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* BANNERS MODULE */}
          {activeMenu === 'banners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Promotional Banners</h2>
                <button onClick={() => setIsBannerFormOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus size={16} /> Upload Offer Banner</button>
              </div>
              {isBannerFormOpen && (
                <form onSubmit={handleBannerSubmit} className="bg-white p-6 border rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm mb-1">Banner Title</label><input type="text" required value={bannerFormData.title} onChange={e => setBannerFormData({...bannerFormData, title: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. Summer Sale 50% OFF" /></div>
                  <div><label className="block text-sm mb-1">Image URL</label><input type="url" required value={bannerFormData.imageUrl} onChange={e => setBannerFormData({...bannerFormData, imageUrl: e.target.value})} className="w-full border p-2 rounded" placeholder="https://..." /></div>
                  <div className="md:col-span-2"><button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md">Save Banner</button></div>
                </form>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map(b => (
                  <div key={b.id} className="bg-white border rounded-xl overflow-hidden relative group">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-32 object-cover" />
                    <div className="p-4"><h3 className="font-bold">{b.title}</h3></div>
                    <button onClick={() => handleBannerDelete(b.id)} className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TICKETS MODULE */}
          {activeMenu === 'tickets' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Support Tickets & Feedback</h2>
              <div className="space-y-4">
                {tickets.length === 0 ? <p className="text-gray-500">No support tickets found.</p> : tickets.map(t => (
                  <div key={t.id} className={`bg-white border p-6 rounded-xl ${t.status === 'RESOLVED' ? 'opacity-60' : 'border-l-4 border-l-blue-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{t.subject}</h3>
                      {t.status === 'OPEN' ? <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold">OPEN</span> : <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">RESOLVED</span>}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{t.message}</p>
                    {t.status === 'OPEN' && (
                      <button onClick={() => handleResolveTicket(t.id)} className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded hover:bg-green-100 font-medium">
                        <CheckCircle size={16} /> Mark as Resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CAMPAIGNS MODULE */}
          {activeMenu === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Email Marketing Campaigns</h2>
                <button onClick={() => setIsCampaignFormOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Send size={16} /> New Email Blast</button>
              </div>
              {isCampaignFormOpen && (
                <form onSubmit={handleCampaignSubmit} className="bg-white p-6 border rounded-xl flex flex-col gap-4">
                  <div><label className="block text-sm mb-1">Email Subject</label><input type="text" required value={campaignFormData.subject} onChange={e => setCampaignFormData({...campaignFormData, subject: e.target.value})} className="w-full border p-2 rounded" placeholder="BIG Diwali Sale Starts Now!" /></div>
                  <div><label className="block text-sm mb-1">Message Body</label><textarea required rows={4} value={campaignFormData.message} onChange={e => setCampaignFormData({...campaignFormData, message: e.target.value})} className="w-full border p-2 rounded" placeholder="Dear user, get 50% off..."></textarea></div>
                  <div><button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md">Send to All Users</button></div>
                </form>
              )}
              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm divide-y">
                  <thead><tr className="bg-gray-50 text-xs uppercase text-gray-500"><th className="p-4">Subject</th><th className="p-4">Sent At</th></tr></thead>
                  <tbody className="divide-y">{campaigns.map(c => <tr key={c.id} className="hover:bg-gray-50"><td className="p-4 font-medium">{c.subject}</td><td className="p-4 text-gray-500">{new Date(c.sentAt).toLocaleString()}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}
