import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAmYKjuVdz6Fzz3fxT9jztPsppZCt-3Lzc',
  authDomain: 'slaty-b383b.firebaseapp.com',
  projectId: 'slaty-b383b',
  storageBucket: 'slaty-b383b.appspot.com',
  messagingSenderId: '461836331622',
  appId: '1:461836331622:android:af1cc9b9474fdef3655ba7',
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Auth with Persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
