import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 19.99,
  category: 'Test Category',
  description: 'This is a test product',
  image: 'test.jpg',
  rating: { rate: 4.5, count: 20 },
};

describe('ProductCard', () => {
  test('renders product details', () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    // Use byRole for headings to avoid ambiguity
    expect(screen.getByRole('heading', { name: /test product/i })).toBeInTheDocument();
    expect(screen.getByText(/\$19.99/)).toBeInTheDocument();
    expect(screen.getByText(/test category/i)).toBeInTheDocument();
    expect(screen.getByText(/this is a test product/i)).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
  });

  test('calls onAddToCart when button is clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});