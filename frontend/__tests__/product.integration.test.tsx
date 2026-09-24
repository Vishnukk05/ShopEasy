import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDetailsPage from '@/app/product/[id]/page';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';

// Mock Next.js dependencies
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('@/lib/axios');

describe('Product Details Page - Integration', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Headphone',
    description: 'Test description',
    price: '99.99',
    originalPrice: null,
    rating: 4.5,
    stockQuantity: 10,
    category: { name: 'Electronics' },
    images: ['/test.jpg'],
    variants: [
      {
        id: 'v1',
        name: 'Black',
        price: '99.99',
        attributes: { color: 'Black' },
        inventory: { quantity: 10 }
      },
      {
        id: 'v2',
        name: 'White',
        price: '109.99',
        attributes: { color: 'White' },
        inventory: { quantity: 0 } // Out of stock!
      }
    ]
  };

  beforeEach(() => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockProduct });
    useCartStore.setState({ items: [] });
  });

  it('renders product details and selects default variant', async () => {
    render(<ProductDetailsPage />);
    
    // Wait for product to load
    await screen.findAllByText('Test Headphone');
    
    // Verify default variant is selected (Black, 99.99)
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('10 in stock')).toBeInTheDocument();
  });

  it('updates price and stock when variant is changed, prevents out-of-stock cart add', async () => {
    render(<ProductDetailsPage />);
    
    await screen.findAllByText('Test Headphone');

    // Click on White variant
    const whiteBtn = screen.getByText('White');
    fireEvent.click(whiteBtn);

    // Verify price updated
    expect(screen.getByText('$109.99')).toBeInTheDocument();
    
    // Verify out of stock text
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();

    // Verify Add to Cart is disabled
    const addToCartBtn = screen.getByText('Add to Cart');
    expect(addToCartBtn).toBeDisabled();
  });
});
