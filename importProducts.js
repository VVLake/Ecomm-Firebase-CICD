import { readFile } from 'fs/promises';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

// Load service account JSON
const loadServiceAccount = async () => {
  const file = await readFile('./firebase-service-account.json', 'utf-8');
  return JSON.parse(file);
};

const importProducts = async () => {
  const serviceAccount = await loadServiceAccount();

  initializeApp({
    credential: cert(serviceAccount),
  });

  const db = getFirestore();

  const res = await fetch('https://fakestoreapi.com/products');
  const products = await res.json();

  const batch = db.batch();
  const productsCollection = db.collection('products');

  products.forEach((product) => {
    const docRef = productsCollection.doc(); // auto-ID
    batch.set(docRef, product);
  });

  await batch.commit();
  console.log('✅ Products imported into Firestore successfully!');
};

importProducts().catch((err) => {
  console.error('❌ Failed to import products:', err.message);
});
