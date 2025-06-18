// src/utils/productService.js

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Reference to the "products" collection
const productsRef = collection(db, 'products');

// Fetch all products (Read)
export const fetchAllProducts = async () => {
  try {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch a single product by ID
export const fetchProductById = async (productId) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    return productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Create a new product (Add)
export const addProduct = async (productData) => {
  try {
    const newProductRef = await addDoc(productsRef, productData);
    // Return the new product with its id
    return { id: newProductRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId, updatedData) => {
  try {
    const productDocRef = doc(db, 'products', productId);
    await updateDoc(productDocRef, updatedData);
    // Optionally return the updated product
    return { id: productId, ...updatedData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const productDocRef = doc(db, 'products', productId);
    await deleteDoc(productDocRef);
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};