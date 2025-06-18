import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, addToCart } from '../features/cart/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  // Increment quantity (reuse addToCart action to add one more of the product)
  const handleIncrement = (product) => {
    dispatch(addToCart(product));
  };

  // Decrement quantity, remove item if count goes below 1
  const handleDecrement = (product) => {
    if (product.count > 1) {
      // Create an action to decrease count (you'll need to add this reducer)
      dispatch({ type: 'cart/decrementCount', payload: product.id });
    } else {
      // Remove item if count is 1 and user clicks decrement
      dispatch(removeFromCart(product.id));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.count, 0);

  if (items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Your Shopping Cart</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: '1rem',
              borderBottom: '1px solid #ccc',
              paddingBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{ width: 80, height: 80, objectFit: 'contain' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{item.title}</h3>
              <p style={{ margin: '0 0 0.5rem' }}>Price: ${item.price.toFixed(2)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => handleDecrement(item)}>-</button>
                <span>{item.count}</span>
                <button onClick={() => handleIncrement(item)}>+</button>
              </div>
              <p style={{ marginTop: '0.5rem' }}>
                Subtotal: ${(item.price * item.count).toFixed(2)}
              </p>
            </div>
            <button onClick={() => handleRemove(item.id)} style={{ height: 30 }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      <button onClick={handleClear} style={{ marginRight: 10 }}>
        Clear Cart
      </button>
      <button
        onClick={() => alert('Checkout functionality coming soon!')}
        style={{ backgroundColor: 'green', color: 'white' }}
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;
