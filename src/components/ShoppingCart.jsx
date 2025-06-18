import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCount, clearCart } from '../features/cart/cartSlice';

const ShoppingCart = () => {
  const location = useLocation();
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.count, 0)
    .toFixed(2);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleCountChange = (id, newCount) => {
    const count = parseInt(newCount);
    if (!isNaN(count) && count > 0) {
      dispatch(updateCount({ id, count }));
    }
  };

  // Only show empty cart message on the Home page
  if (cartItems.length === 0 && location.pathname === "/") {
    return <div>Your cart is empty.</div>;
  }

  // Don't show anything if cart is empty and not on home page
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Shopping Cart</h2>
      <ul style={styles.list}>
        {cartItems.map(item => (
          <li key={item.id} style={styles.listItem}>
            <img src={item.image} alt={item.title} style={styles.image} />
            <div style={styles.itemDetails}>
              <p style={styles.title}>{item.title}</p>
              <p style={styles.price}>${item.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.count}
              onChange={(e) => handleCountChange(item.id, e.target.value)}
              style={styles.quantityInput}
            />
            <button
              onClick={() => handleRemove(item.id)}
              style={styles.removeButton}
              aria-label={`Remove ${item.title} from cart`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div style={styles.summary}>
        <p><strong>Total Items:</strong> {totalCount}</p>
        <p><strong>Total Price:</strong> ${totalPrice}</p>
      </div>
      <div style={styles.buttonsContainer}>
        <button onClick={handleClear} style={{ ...styles.button, ...styles.clearButton }}>
          🗑️ Clear Cart
        </button>
        <button onClick={handleProceedToCheckout} style={{ ...styles.button, ...styles.checkoutButton }}>
          ✅ Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    backgroundColor: '#fff',
    padding: '1.8rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1.8rem',
    color: '#222',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1.5rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    padding: '0.8rem 0',
    borderBottom: '1px solid #eee',
  },
  image: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  itemDetails: {
    flex: '1',
  },
  title: {
    margin: 0,
    fontWeight: '600',
    fontSize: '1.1rem',
    color: '#333',
  },
  price: {
    margin: '0.2rem 0 0',
    color: '#666',
    fontSize: '0.9rem',
  },
  quantityInput: {
    width: '60px',
    padding: '0.4rem',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#f44336',
    border: 'none',
    color: 'white',
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease',
  },
  summary: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#222',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.8rem',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  button: {
    flex: 1,
    padding: '0.85rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: 'none',
    transition: 'background-color 0.3s ease',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  checkoutButton: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  emptyMessage: {
    maxWidth: '600px',
    margin: '4rem auto',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#777',
    textAlign: 'center',
  },
};

export default ShoppingCart;