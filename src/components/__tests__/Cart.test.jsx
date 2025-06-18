// Cart.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Cart';

import * as redux from 'react-redux';

describe('Cart Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
  });

  test('renders empty cart message when no items', () => {
    jest.spyOn(redux, 'useSelector').mockReturnValue([]);

    render(<Cart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('renders cart items and total price', () => {
    const items = [
      { id: '1', title: 'Product 1', price: 10, count: 2, image: 'img1.jpg' },
      { id: '2', title: 'Product 2', price: 5, count: 1, image: 'img2.jpg' },
    ];
    jest.spyOn(redux, 'useSelector').mockReturnValue(items);

    render(<Cart />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Total: $25.00')).toBeInTheDocument(); // (10*2) + (5*1)
  });

  test('increments item quantity when "+" clicked', () => {
    const items = [{ id: '1', title: 'Product 1', price: 10, count: 1, image: 'img1.jpg' }];
    jest.spyOn(redux, 'useSelector').mockReturnValue(items);

    render(<Cart />);

    const incrementBtn = screen.getByText('+');
    fireEvent.click(incrementBtn);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cart/addToCart',
      payload: items[0],
    });
  });

  test('decrements item quantity when "-" clicked and count > 1', () => {
    const items = [{ id: '1', title: 'Product 1', price: 10, count: 2, image: 'img1.jpg' }];
    jest.spyOn(redux, 'useSelector').mockReturnValue(items);

    render(<Cart />);

    const decrementBtn = screen.getByText('-');
    fireEvent.click(decrementBtn);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cart/decrementCount',
      payload: '1',
    });
  });

  test('removes item when "-" clicked and count = 1', () => {
    const items = [{ id: '1', title: 'Product 1', price: 10, count: 1, image: 'img1.jpg' }];
    jest.spyOn(redux, 'useSelector').mockReturnValue(items);

    render(<Cart />);

    const decrementBtn = screen.getByText('-');
    fireEvent.click(decrementBtn);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cart/removeFromCart',
      payload: '1',
    });
  });

  test('removes item when "Remove" button clicked', () => {
    const items = [{ id: '1', title: 'Product 1', price: 10, count: 1, image: 'img1.jpg' }];
    jest.spyOn(redux, 'useSelector').mockReturnValue(items);

    render(<Cart />);

    const removeBtn = screen.getByText(/remove/i);
    fireEvent.click(removeBtn);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cart/removeFromCart',
      payload: '1',
    });
  });

  test('clears cart when "Clear Cart" button clicked', () => {
    const items = [{ id: '1', title: 'Product 1', price: 10, count: 1, image: 'img1.jpg' }];
    jest.spyOn(redux, 'useSelector').mockReturnValue(items);

    render(<Cart />);

    const clearBtn = screen.getByText(/clear cart/i);
    fireEvent.click(clearBtn);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'cart/clearCart' });
  });
});
