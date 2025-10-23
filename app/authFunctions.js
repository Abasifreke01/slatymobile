import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth'; // Make sure to import getAuth
import { doc, setDoc, getDocs, collection, query, where, updateDoc, addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

// **1️⃣ Sign up function with custom claims (role-based access)**
export const signUp = async (email, password, username, phone, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set user role using custom claims
    await updateDoc(doc(db, 'users', user.uid), {
      email,
      username,
      phone,
      createdAt: serverTimestamp(),
      role,  // Role could be 'admin', 'tutor', or 'student'
    });

    // Set custom claims for role-based access
    await user.getIdTokenResult(true); // Force refresh of token

    return user; // Return user object
  } catch (error) {
    throw error;
  }
};

// **2️⃣ Sign in function**
export const signIn = async (identifier, password) => {
  try {
    let user;

    if (identifier.includes('@')) {
      // Sign in with email
      user = await signInWithEmailAndPassword(auth, identifier, password);
    } else {
      // Sign in with username (fetch the associated email first)
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(query(usersCollection, where('username', '==', identifier)));

      if (userSnapshot.empty) {
        throw new Error('User not found');
      }

      const userData = userSnapshot.docs[0].data();
      user = await signInWithEmailAndPassword(auth, userData.email, password);
    }

    return user.user;
  } catch (error) {
    throw error;
  }
};

// **3️⃣ Fetch subjects**
export const fetchSubjects = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'subjects'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
};

// **4️⃣ Fetch questions for a specific subject**
export const fetchQuestionsBySubject = async (subjectId) => {
  try {
    const snapshot = await getDocs(collection(db, 'subjects', subjectId, 'questions'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

// **5️⃣ Submit test results**
export const submitTestResults = async (userId, subjectId, score, totalQuestions) => {
  try {
    const userResultsRef = collection(db, 'users', userId, 'results');
    await addDoc(userResultsRef, {
      subject: subjectId,
      score: score,
      totalQuestions: totalQuestions,
      timestamp: serverTimestamp(),
    });

    console.log('✅ Test results saved successfully!');
  } catch (error) {
    console.error('🔥 Error saving test results:', error);
  }
};

// **6️⃣ Get Current User ID**
export const getCurrentUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null; // Return the current user's UID if logged in, else null
};
