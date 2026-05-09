import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, updateDoc, addDoc, runTransaction } from 'firebase/firestore';
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

// **7️⃣ Fetch Task Listings**
export const fetchTasks = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'task'));
    return snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching task listings:', error);
    return [];
  }
};
// **8️⃣ Accept a task atomically**
export const acceptTask = async (taskId, tutorId) => {
  try {
    const taskDocRef = doc(db, 'task', taskId);

    await runTransaction(db, async (transaction) => {
      const taskDoc = await transaction.get(taskDocRef);
      if (!taskDoc.exists()) {
        throw new Error("Task does not exist!");
      }

      const taskData = taskDoc.data();
      if (taskData.status === 'accepted' || taskData.acceptedBy) {
        throw new Error("Task already accepted by another tutor.");
      }

      // Update task status and set acceptedBy field
      transaction.update(taskDocRef, {
        status: 'accepted',
        acceptedBy: tutorId,
        acceptedAt: serverTimestamp(),
      });
    });

    console.log('✅ Task accepted successfully!');
    return { success: true };
  } catch (error) {
    console.error('🔥 Error accepting task:', error.message);
    return { success: false, error: error.message };
  }
};

// **9️⃣ Fetch Accepted Tasks for a Tutor**
export const fetchAcceptedTasks = async (tutorId) => {
  try {
    const q = query(collection(db, 'task'), where('acceptedBy', '==', tutorId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching accepted tasks:', error);
    return [];
  }
};
// **10️⃣ Mark Task as Completed**
export const completeTask = async (taskId, sharedFileUrl, sharedFileName) => {
  try {
    const taskDocRef = doc(db, 'task', taskId);
    await updateDoc(taskDocRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      sharedFileUrl,
      sharedFileName,
      isRead: false, // Mark as unread for the student
    });
    console.log('✅ Task marked as completed!');
    return { success: true };
  } catch (error) {
    console.error('🔥 Error completing task:', error);
    return { success: false, error: error.message };
  }
};

// **11️⃣ Fetch Completed Tasks for a Tutor**
export const fetchCompletedTasksByTutor = async (tutorId) => {
  try {
    const q = query(
      collection(db, 'task'),
      where('acceptedBy', '==', tutorId),
      where('status', '==', 'completed')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    return [];
  }
};

// **12️⃣ Fetch Unread Completed Tasks Count**
export const fetchUnreadCompletedTasksCount = async (userId) => {
  try {
    const q = query(
      collection(db, 'task'),
      where('userId', '==', userId),
      where('status', '==', 'completed'),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching unread tasks count:', error);
    return 0;
  }
};

// **13️⃣ Mark all completed tasks as read for a student**
export const markTasksAsRead = async (userId) => {
  try {
    const q = query(
      collection(db, 'task'),
      where('userId', '==', userId),
      where('status', '==', 'completed'),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);

    // Update each document
    const promises = snapshot.docs.map(doc =>
      updateDoc(doc.ref, { isRead: true })
    );
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error('Error marking tasks as read:', error);
    return { success: false };
  }
};
