
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";



const firebaseConfig = {

  apiKey: "AIzaSyDPBsvdov3n52VW9Ik53ZHx5tooJv18tYk",
  authDomain: "first-firebase-87ec2.firebaseapp.com",
  projectId: "first-firebase-87ec2",
  storageBucket: "first-firebase-87ec2.firebasestorage.app",
  messagingSenderId: "412355905066",
  appId: "1:412355905066:web:1e0cf57e49f9c182d6a553",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db };
