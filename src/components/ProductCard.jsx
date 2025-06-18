// src/components/__tests__/ProductCard.test.jsx
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

test('renders product details and calls onAddToCart', () => {
  const mockAddToCart = jest.fn();

  render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

  // Check for product content
  expect(screen.getByText(/test product/i)).toBeInTheDocument();
  expect(screen.getByText(/\$19.99/)).toBeInTheDocument();
  expect(screen.getByText(/test category/i)).toBeInTheDocument();
  expect(screen.getByText(/this is a test product/i)).toBeInTheDocument();
  expect(screen.getByText(/4.5/i)).toBeInTheDocument();

  // Simulate clicking "Add to Cart"
  const addButton = screen.getByRole('button', { name: /add to cart/i });
  fireEvent.click(addButton);

  // Assert the callback was called with the correct product
  expect(mockAddToCart).toHaveBeenCalledTimes(1);
  expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
});
