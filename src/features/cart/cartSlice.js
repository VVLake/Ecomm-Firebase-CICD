import { createSlice } from '@reduxjs/toolkit';
import { loadCartFromSession, saveCartToSession } from '../../utils/sessionStorage';

const initialState = {
  items: loadCartFromSession() || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.count += 1;
      } else {
        state.items.push({ ...product, count: 1 });
      }
      saveCartToSession(state.items);
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveCartToSession(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCartToSession(state.items);
    },
    decrementCount(state, action) {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item.id === productId);
      if (existingItem && existingItem.count > 1) {
        existingItem.count -= 1;
      }
      saveCartToSession(state.items);
    },
    updateCount(state, action) {
      const { id, count } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem && count > 0) {
        existingItem.count = count;
      }
      saveCartToSession(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, decrementCount, updateCount } = cartSlice.actions;
export default cartSlice.reducer;