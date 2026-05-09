import { db } from "./firebaseConfig";
import { 
  collection, doc, writeBatch, getDocs, query, where, deleteDoc 
} from "firebase/firestore";

// Generates a searchable hash of the question
const generateQuestionHash = (questionText, choices) => {
  return `${questionText}-${choices.join(",")}`.toLowerCase();
};

// SAFE MAXIMUM FIRESTORE WRITE PER BATCH
const MAX_BATCH_SIZE = 400;

// Upload function with auto-batching
export const addSubjectsAndQuestions = async (subjects) => {
  console.log("🔥 Starting Firestore upload...");

  try {
    for (const [subjectName, questions] of Object.entries(subjects)) {

      console.log(`📌 Uploading subject: ${subjectName}`);

      const subjectRef = doc(db, "subjects", subjectName);
      const questionsCollectionRef = collection(subjectRef, "questions");

      // STEP 1 — REMOVE DUPLICATES ALREADY IN FIRESTORE
      for (const q of questions) {
        const qHash = generateQuestionHash(q.question, q.choices);

        const qQuery = query(
          questionsCollectionRef,
          where("questionHash", "==", qHash)
        );

        const snapshot = await getDocs(qQuery);

        if (!snapshot.empty) {
          console.log(`🗑️ Removing duplicates for: ${q.question}`);
          for (const docSnap of snapshot.docs) {
            await deleteDoc(docSnap.ref);
          }
        }
      }

      // STEP 2 — ADD QUESTIONS IN SAFE CHUNKS
      for (let i = 0; i < questions.length; i += MAX_BATCH_SIZE) {
        const chunk = questions.slice(i, i + MAX_BATCH_SIZE);
        const batch = writeBatch(db);

        // Ensure subject exists
        batch.set(subjectRef, { name: subjectName }, { merge: true });

        chunk.forEach((q) => {
          const qHash = generateQuestionHash(q.question, q.choices);
          const qRef = doc(questionsCollectionRef);

          batch.set(qRef, {
            ...q,
            questionHash: qHash,
          });
        });

        console.log(`🚚 Uploading batch of ${chunk.length} questions...`);
        await batch.commit();
      }

      console.log(`✅ Completed upload for subject: ${subjectName}`);
    }

    console.log("🎉 ALL questions uploaded successfully!");

  } catch (error) {
    console.error("🔥 Upload ERROR:", error);
  }
};
