// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmYKjuVdz6Fzz3fxT9jztPsppZCt-3Lzc",
  authDomain: "slaty-b383b.firebaseapp.com",
  projectId: "slaty-b383b",
  storageBucket: "slaty-b383b.appspot.com",
  messagingSenderId: "461836331622",
  appId: "1:461836331622:android:af1cc9b9474fdef3655ba7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, app };
