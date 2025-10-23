import { db } from "./firebaseConfig";  
import { collection, doc, setDoc, writeBatch, getDocs, query, where } from "firebase/firestore";  

// Updated structure of subjects with questions
const subjects = {  
  Math: [  
    {  
      question: "What is 2 + 2?",  
      choices: ["3", "4", "5", "6"],  
      correctAnswer: "4",  
    },  
    {  
      question: "Solve: 5 × 3",  
      choices: ["8", "12", "15", "20"],  
      correctAnswer: "15",  
    },  
    {  
      question: "What is 10 ÷ 2?",  
      choices: ["4", "5", "6", "8"],  
      correctAnswer: "5",  
    },  
    {  
      question: "What is 7 × 6?",  
      choices: ["36", "42", "48", "56"],  
      correctAnswer: "42",  
    }
  ],  
  Science: [  
    {  
      question: "What is H2O?",  
      choices: ["Oxygen", "Water", "Hydrogen", "Nitrogen"],  
      correctAnswer: "Water",  
    },  
    {  
      question: "What is the chemical symbol for Gold?",  
      choices: ["Ag", "Au", "Pb", "Fe"],  
      correctAnswer: "Au",  
    },  
    {  
      question: "What planet is closest to the sun?",  
      choices: ["Venus", "Earth", "Mercury", "Mars"],  
      correctAnswer: "Mercury",  
    },  
    {  
      question: "What is the atomic number of Oxygen?",  
      choices: ["8", "16", "12", "6"],  
      correctAnswer: "8",  
    },
  ],  
};

// Function to add subjects and questions to Firestore
export const addSubjectsAndQuestions = async () => {  
  const batch = writeBatch(db);  // Start a batch to group multiple writes

  try {  
    for (const [subjectName, questions] of Object.entries(subjects)) {  
      // Create a document for the subject
      const subjectRef = doc(db, "subjects", subjectName);  
      batch.set(subjectRef, { name: subjectName });  
      console.log(`🔥 Queued subject: ${subjectName}`);

      // Create a subcollection for questions
      const questionsCollectionRef = collection(subjectRef, "questions");

      for (const question of questions) {
        // Check if the question already exists
        const questionQuery = query(
          questionsCollectionRef,
          where("question", "==", question.question)
        );
        const querySnapshot = await getDocs(questionQuery);

        if (querySnapshot.empty) {
          // If the question does not exist, add it to the batch
          const questionRef = doc(questionsCollectionRef); // Auto-generate ID for questions
          batch.set(questionRef, {
            question: question.question,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
          });
          console.log(`✅ Queued question: ${question.question}`);
        } else {
          console.log(`❌ Duplicate question found: ${question.question}`);
        }
      }
    }

    // Commit all batch operations at once
    await batch.commit();
    console.log("✅ All subjects and questions added successfully!");  
  } catch (error) {  
    console.error("🔥 Error adding subjects and questions:", error.message);  
  }  
};
