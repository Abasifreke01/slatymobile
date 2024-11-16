import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from './firebaseConfig'; // Import Firestore correctly
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Sign up function
export const signUp = async (email, password, username, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user information in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      username,
      phone,
      createdAt: serverTimestamp(), // Use server timestamp
    });

    return user; // Return user object
  } catch (error) {
    throw error; // Propagate error for handling in the UI
  }
};

// Sign in function
export const signIn = async (identifier, password) => {
  try {
    let user;

    // Check if the identifier is an email or username
    if (identifier.includes('@')) {
      // It's an email
      user = await signInWithEmailAndPassword(auth, identifier, password);
    } else {
      // It's a username; fetch the user document
      const userSnapshot = await getDoc(doc(db, 'users', identifier));
      if (!userSnapshot.exists()) {
        throw new Error('User not found');
      }
      const userData = userSnapshot.data();
      const email = userData.email;

      // Now sign in with the found email
      user = await signInWithEmailAndPassword(auth, email, password);
    }

    return user.user; // Return user object
  } catch (error) {
    throw error; // Propagate error for handling in the UI
  }
};
