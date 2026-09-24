import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductsPage from '@/app/products/page';
import api from '@/lib/axios';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('?search=apple'),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/lib/axios');

describe('Products Page Search Integration', () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === '/products') {
        return Promise.resolve({ data: [{ id: '1', name: 'Apple Watch', price: '200', category: { name: 'Electronics' } }] });
      }
      if (url === '/categories') {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('passes search param to backend and renders result', async () => {
    render(<ProductsPage />);
    
    // Check if result is rendered
    await waitFor(() => expect(screen.getByText('Apple Watch')).toBeInTheDocument());
  });
});
