import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db } from '../firebaseConfig'; // ensure your firebaseConfig exports db

// Fetch user data
export const fetchUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error('User profile not found');
  }
};

// Update user data
export const updateUserProfile = async (uid, updates) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);
};

// Delete user account and data
export const deleteUserAccount = async (user) => {
  const userRef = doc(db, 'users', user.uid);

  // Delete Firestore doc first
  await deleteDoc(userRef);

  // Then delete Firebase Auth user
  await deleteUser(user);
};
