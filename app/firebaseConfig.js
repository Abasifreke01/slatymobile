// firebaseConfig.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // For Firebase Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAmYKjuVdz6Fzz3fxT9jztPsppZCt-3Lzc',
  authDomain: 'slaty-b383b.firebaseapp.com',
  projectId: 'slaty-b383b',
  storageBucket: 'slaty-b383b.appspot.com',
  messagingSenderId: '461836331622',
  appId: '1:461836331622:android:af1cc9b9474fdef3655ba7',
};

// ✅ Prevent multiple initializations
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Firestore only once
const db = getFirestore(app);

// ✅ Initialize Firebase Auth with React Native Persistence
const auth = getApps().length === 0 
  ? initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  : getAuth(app);

// ✅ Initialize Firebase Storage
const storage = getStorage(app);

export { app, auth, db, storage };
