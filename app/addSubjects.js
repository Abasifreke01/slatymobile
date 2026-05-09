import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  writeBatch,
  getDocs
} from "firebase/firestore";

// 🔥 Generate hash for duplicate detection
const generateQuestionHash = (question, choices) => {
  if (!question || !choices) return "";
  return `${question.trim()}-${choices.map(c => c.trim()).join(",")}`.toLowerCase();
};

/*
======================================================================
  MAIN FUNCTION: uploadOrUpdateQuestions(subjectName, questionsArray)
======================================================================
*/

export const uploadOrUpdateQuestions = async (subjectName, questionsArray) => {

  // 🚨 PROTECT AGAINST BAD DATA
  if (!Array.isArray(questionsArray)) {
    console.log("❌ ERROR: questionsArray is NOT an array!");
    console.log("Received:", questionsArray);
    return;
  }

  if (questionsArray.length === 0) {
    console.log("❌ ERROR: No questions provided in questionsArray.");
    return;
  }

  try {
    console.log(`🚀 Processing subject: ${subjectName}`);

    const subjectRef = doc(db, "subjects", subjectName);
    const questionsRef = collection(subjectRef, "questions");

    // STEP 1 — Load all existing questions
    const existingSnapshot = await getDocs(questionsRef);

    let existingHashes = {};
    existingSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.questionHash) {
        existingHashes[data.questionHash] = {
          id: docSnap.id,
          ...data
        };
      }
    });

    console.log(`📌 Existing questions: ${Object.keys(existingHashes).length}`);

    // STEP 2 — Build incoming questions with hash
    const incoming = questionsArray.map((q) => ({
      ...q,
      questionHash: generateQuestionHash(q.question, q.choices)
    }));

    // STEP 3 — Chunk into batches of 300
    const chunkSize = 300;
    const chunks = [];

    for (let i = 0; i < incoming.length; i += chunkSize) {
      chunks.push(incoming.slice(i, i + chunkSize));
    }

    console.log(`📦 Total chunks: ${chunks.length}`);

    // STEP 4 — Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const batch = writeBatch(db);

      chunks[i].forEach((q) => {
        const exists = existingHashes[q.questionHash];

        if (!exists) {
          // NEW — Add question
          const newRef = doc(questionsRef);
          batch.set(newRef, q);
        } else {
          // CHECK IF IT NEEDS UPDATE
          const updated =
            exists.question !== q.question ||
            JSON.stringify(exists.choices) !== JSON.stringify(q.choices) ||
            exists.correctAnswer !== q.correctAnswer;

          if (updated) {
            const updateRef = doc(questionsRef, exists.id);
            batch.update(updateRef, q);
            console.log(`♻️ Updated: ${q.question}`);
          }
        }
      });

      console.log(`📤 Uploading chunk ${i + 1}/${chunks.length}`);
      await batch.commit();
      console.log(`✅ Chunk ${i + 1} complete`);
    }

    console.log("🎉 ALL QUESTIONS PROCESSED SUCCESSFULLY!");

  } catch (err) {
    console.error("🔥 Upload error:", err);
  }
};
