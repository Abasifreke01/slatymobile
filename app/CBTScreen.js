import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, StyleSheet } from 'react-native';
import { fetchSubjects, fetchQuestionsBySubject } from './authFunctions'; // Import necessary functions
import { addSubjectsAndQuestions } from './addSubjects'; // Ensure this is the correct import path

const CBTScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [answers, setAnswers] = useState({}); // Track selected answers
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  // Add subjects and questions to Firestore on initial load
  useEffect(() => {
    const initializeData = async () => {
      console.log("🚀 Adding subjects and questions to Firestore...");
      await addSubjectsAndQuestions(); // Add subjects and questions to Firestore

      const subjectsData = await fetchSubjects(); // Fetch subjects after adding them
      if (subjectsData.length === 0) {
        console.log("No subjects found, please check the Firestore data.");
      } else {
        setSubjects(subjectsData); // Populate subjects in state
      }
    };

    initializeData(); // Call to populate data on mount
  }, []);

  // Shuffle function to randomize the order of questions
  const shuffleQuestions = (questions) => {
    const shuffledQuestions = [...questions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    return shuffledQuestions;
  };

  // Fetch questions for a subject when it's selected
  const selectSubject = async (subjectId) => {
    console.log("Selected Subject ID:", subjectId); // Log selected subject ID for debugging
    const questionsData = await fetchQuestionsBySubject(subjectId);
    console.log('Questions Data:', questionsData); // Log the fetched questions
    if (questionsData.length === 0) {
      console.log("No questions found for the selected subject.");
    } else {
      const shuffledQuestions = shuffleQuestions(questionsData).slice(0, 20); // Shuffle and take the first 20 questions
      setQuestions(shuffledQuestions);
      setSelectedSubject(subjectId);
    }
  };

  // Handle answer selection and track the answer
  const handleAnswerSelection = (questionId, selectedAnswer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  // Submit test results and show the results in a popup
  const handleSubmitTest = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    // Calculate the score
    questions.forEach((question) => {
      const selectedAnswer = answers[question.id];
      if (selectedAnswer === question.correctAnswer) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    });

    setCorrectAnswers(correctCount);
    setIncorrectAnswers(incorrectCount);
    setIsModalVisible(true); // Show the modal with the results
  };

  // Render the modal with the test results
  const renderModal = () => (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Test Results</Text>
          <Text style={styles.modalText}>Correct Answers: {correctAnswers}</Text>
          <Text style={styles.modalText}>Incorrect Answers: {incorrectAnswers}</Text>
          <Text style={styles.modalText}>Total Questions: {questions.length}</Text>
          <Button title="Close" onPress={() => setIsModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ padding: 20, backgroundColor: 'black', flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Choose a Subject</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name ? item.name.toString() : "Unnamed Subject"}
            onPress={() => selectSubject(item.id)}
            color="purple"
          />
        )}
      />

      {selectedSubject && (
        <>
          <Text style={{ marginTop: 20, fontSize: 18, color: 'white' }}>Questions:</Text>
          <FlatList
            data={questions}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={{ marginVertical: 15 }}>
                <Text style={{ color: 'white' }}>{index + 1}. {item.question}</Text>
                {item.choices.map((choice, choiceIndex) => (
                  <View key={choiceIndex} style={{ marginVertical: 5 }}>
                    <Button
                      title={choice ? choice.toString() : "No Answer"}
                      onPress={() => handleAnswerSelection(item.id, choice)}
                      disabled={answers[item.id]} // Disable once answer is selected
                      color={answers[item.id] === choice ? (choice === item.correctAnswer ? 'green' : 'red') : 'blue'}
                    />
                  </View>
                ))}
              </View>
            )}
          />
          <View style={styles.submitButtonContainer}>
            <Button
              title="Submit Test"
              onPress={handleSubmitTest}
              color="purple" // Set the button color
            />
          </View>
        </>
      )}

      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 5,
  },
  submitButtonContainer: {
    marginTop: 20, // Ensure it's spaced correctly
    alignItems: 'center', // Center align the button
  },
});

export default CBTScreen;
