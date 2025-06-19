import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, addToCart } from './cartSlice';

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
      dispatch(removeFromCart(product.id));
    }
  };

  // Clear the entire cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return <p>Your cart is empty</p>;
  }

  const totalPrice = items.reduce((total, item) => total + item.price * item.count, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
            <p>${item.price}</p>
            <p>Quantity: {item.count}</p>
            <button onClick={() => handleIncrement(item)}>+</button>
            <button onClick={() => handleDecrement(item)}>-</button>
            <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${totalPrice.toFixed(2)}</p>
      <button onClick={handleClearCart}>Clear Cart</button>
    </div>
  );
};

export default Cart;