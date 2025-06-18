// src/utils/orderService.ts

import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';

// ---- Interfaces ----

export interface ProductInOrder {
  title: string;
  price: number;
  quantity: number;
  // Add any other product fields you store in an order
}

export interface OrderData {
  userId: string; // changed from userEmail to userId
  products: ProductInOrder[];
  totalPrice: number;
  // Don't include createdAt here, it's set automatically
}

export interface Order extends OrderData {
  id: string;
  createdAt: Timestamp | null; // Will be null if not set yet
}

// ---- Place an order ----

export const placeOrder = async (orderData: OrderData): Promise<string> => {
  try {
    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// ---- Fetch all orders for a specific user by userId (UID) ----

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      orders.push({
        id: doc.id,
        userId: data.userId,
        products: data.products,
        totalPrice: data.totalPrice,
        createdAt: data.createdAt ?? null,
      });
    });
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};