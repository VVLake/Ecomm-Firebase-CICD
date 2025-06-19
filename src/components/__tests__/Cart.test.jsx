import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../../features/cart/Cart'; // adjust path if Cart is in a different location

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (cb) => mockSelector(cb),
}));

  test('renders empty cart message when no items', () => {
    mockSelector.mockReturnValueOnce([]); // empty cart

    render(<Cart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('renders cart items and total price', () => {
    const items = [
      { id: '1', title: 'Product 1', price: 10, count: 2, image: 'img1.jpg' },
      { id: '2', title: 'Product 2', price: 5, count: 1, image: 'img2.jpg' },
    ];
    mockSelector.mockReturnValueOnce(items);

    render(<Cart />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Total: $25.00')).toBeInTheDocument(); // (10*2) + (5*1)
  });

  test('increments item quantity when "+" clicked', () => {
    const items = [{ id: '1', title: 'Product 1', price: 10, count: 1, image: 'img1.jpg' }];
    mockSelector.mockReturnValueOnce(items);

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
    mockSelector.mockReturnValueOnce(items);

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
    mockSelector.mockReturnValueOnce(items);

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
    mockSelector.mockReturnValueOnce(items);

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
    mockSelector.mockReturnValueOnce(items);

    render(<Cart />);

    const clearBtn = screen.getByText(/clear cart/i);
    fireEvent.click(clearBtn);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'cart/clearCart' });
  });
