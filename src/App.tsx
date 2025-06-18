import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './components/Login';
import NavBar from './components/NavBar';
import ShoppingCart from './components/ShoppingCart';
import CheckoutPage from './pages/CheckoutPage';
import AuthForm from './components/AuthForm';
import Profile from './pages/Profile';
import OrderHistory from './components/OrderHistory';
import { saveCartToSession } from './utils/sessionStorage';
import './App.css';

// Helper wrapper to use hooks outside of Router
function LayoutWithCart({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const cartItems = useSelector((state: { cart: { items: any[] } }) => state.cart.items);

  useEffect(() => {
    saveCartToSession(cartItems);
  }, [cartItems]);

  // Hide cart on login page
  const hideCart = location.pathname === "/login";

  return (
    <div>
      <NavBar />
      <main>{children}</main>
      {!hideCart && (
        <aside>
          <ShoppingCart />
        </aside>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWithCart>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </LayoutWithCart>
    </Router>
  );
}

export default App;