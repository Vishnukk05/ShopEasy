import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  image: string;
  category: string;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: '12999', originalPrice: '16999', discount: '23% OFF', rating: 120, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop', category: 'Electronics' },
  { id: '2', name: 'Smart Watch', price: '4999', originalPrice: '5999', discount: '17% OFF', rating: 98, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300&h=300&fit=crop', category: 'Fashion' },
  { id: '3', name: 'Running Shoes', price: '2199', originalPrice: '2999', discount: '27% OFF', rating: 76, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&h=300&fit=crop', category: 'Sports' },
  { id: '4', name: 'Backpack', price: '1499', originalPrice: '1999', discount: '25% OFF', rating: 54, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', category: 'Fashion' },
];

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('products') || JSON.stringify(initialProducts)) : initialProducts,
  
  addProduct: (product) => set((state) => {
    const newProduct = { ...product, id: Date.now().toString() };
    const updated = [...state.products, newProduct];
    localStorage.setItem('products', JSON.stringify(updated));
    return { products: updated };
  }),
  
  updateProduct: (id, productUpdate) => set((state) => {
    const updated = state.products.map(p => p.id === id ? { ...p, ...productUpdate } : p);
    localStorage.setItem('products', JSON.stringify(updated));
    return { products: updated };
  }),
  
  deleteProduct: (id) => set((state) => {
    const updated = state.products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(updated));
    return { products: updated };
  })
}));

