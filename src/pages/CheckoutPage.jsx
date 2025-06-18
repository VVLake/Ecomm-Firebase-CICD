import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../utils/orderService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const [user] = useAuthState(auth);

  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Calculate display total using "count" as the quantity
  const displayTotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.count) || 0;
    return sum + price * quantity;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to place an order.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use count for quantity in totalPrice calculation
      const totalPrice = cartItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.count) || 0;
        return sum + price * quantity;
      }, 0);
      const safeTotalPrice = Number.isFinite(totalPrice) ? totalPrice : 0;

      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        products: cartItems,
        totalPrice: safeTotalPrice,
      };

      await placeOrder(orderData);

      dispatch(clearCart());
      sessionStorage.removeItem('cart');
      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (success) {
    return (
      <div style={styles.successContainer}>
        <h2>🎉 Checkout Complete!</h2>
        <p>Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Enter Payment Details</h2>

      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          { label: 'Name on Card', name: 'name', type: 'text' },
          { label: 'Card Number', name: 'cardNumber', type: 'text', maxLength: 16 },
          { label: 'Expiration Date', name: 'expiration', type: 'text', placeholder: 'MM/YY' },
          { label: 'CVV', name: 'cvv', type: 'text', maxLength: 4 },
        ].map(({ label, name, type, maxLength, placeholder }) => (
          <div key={name} style={styles.formGroup}>
            <label htmlFor={name} style={styles.label}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              maxLength={maxLength}
              placeholder={placeholder || ''}
              value={formData[name]}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        ))}

        <div style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>
          Order Total: ${Number.isFinite(displayTotal) ? displayTotal.toFixed(2) : '0.00'}
        </div>

        <button
          type="submit"
          style={{
            ...styles.payButton,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      <div style={styles.cancelButtonContainer}>
        <button
          onClick={handleCancel}
          style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem' }}
        >
          Cancel and Go Back to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '480px',
    margin: '3rem auto',
    padding: '2rem 2.5rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    marginBottom: '2rem',
    color: '#222',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.8rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#555',
    fontSize: '1rem',
  },
  input: {
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.25s ease',
  },
  payButton: {
    marginTop: '2rem',
    padding: '0.85rem',
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(76,175,80,0.6)',
    transition: 'background-color 0.3s ease',
  },
  cancelButtonContainer: {
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  successContainer: {
    marginTop: '4rem',
    textAlign: 'center',
    color: '#27ae60',
    fontSize: '1.5rem',
    fontWeight: '700',
  }
};

export default CheckoutPage;