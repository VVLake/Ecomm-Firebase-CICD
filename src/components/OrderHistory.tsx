import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fetchUserOrders } from '../utils/orderService';
import { Timestamp } from 'firebase/firestore';

interface ProductInOrder {
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: Timestamp | null | undefined;
  products: ProductInOrder[];
  totalPrice: number | null | undefined;
}

const OrderHistory: React.FC = () => {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserOrders(user.uid);
        setOrders(data);
        // Debug: Log returned data to inspect structure
        console.log('Loaded orders:', data);
      } catch (err: any) {
        setError('Failed to load orders: ' + (err.message || JSON.stringify(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <div>Loading orders...</div>;
  if (!user) return <div>Please log in to see your order history.</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Your Order History</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orders.map(order => (
          <li
            key={order.id}
            style={{
              border: '1px solid #ccc',
              marginBottom: '1rem',
              padding: '1rem',
              cursor: 'pointer',
              backgroundColor: selectedOrder?.id === order.id ? '#f0f8ff' : 'white',
            }}
            onClick={() => setSelectedOrder(order)}
          >
            <strong>Order ID:</strong> {order.id} <br />
            <strong>Date:</strong>{' '}
            {order.createdAt instanceof Timestamp
              ? order.createdAt.toDate().toLocaleString()
              : 'Unknown'}{' '}
            <br />
            <strong>Total:</strong> $
            {Number.isFinite(order.totalPrice)
              ? order.totalPrice!.toFixed(2)
              : '0.00'}
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <h3>Order Details</h3>
          <button onClick={() => setSelectedOrder(null)} style={{ marginBottom: '1rem' }}>
            Close Details
          </button>
          <ul>
            {(selectedOrder.products || []).map((product, index) => (
              <li key={index}>
                {product.title} - ${product.price.toFixed(2)} x {product.quantity}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total Price: </strong>$
            {Number.isFinite(selectedOrder.totalPrice)
              ? selectedOrder.totalPrice!.toFixed(2)
              : '0.00'}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;