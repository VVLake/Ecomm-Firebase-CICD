// src/components/__tests__/ProductCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { Provider } from 'react-redux';
import store from '../../store';

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 19.99,
  description: 'This is a test product',
  image: 'test.jpg',
};

test('renders product card and triggers add to cart', () => {
  render(
    <Provider store={store}>
      <ProductCard product={mockProduct} />
    </Provider>
  );

  expect(screen.getByText(/test product/i)).toBeInTheDocument();
  expect(screen.getByText(/\$19.99/)).toBeInTheDocument();

  const addButton = screen.getByRole('button', { name: /add to cart/i });
  fireEvent.click(addButton);
  // No assertion needed here unless you mock dispatch — this just ensures the click doesn't break
});
