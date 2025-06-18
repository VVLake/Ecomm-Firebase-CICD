export const loadCartFromSession = () => {
  try {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart from sessionStorage:', error);
    return [];
  }
};

export const saveCartToSession = (cart) => {
  try {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to sessionStorage:', error);
  }
};
