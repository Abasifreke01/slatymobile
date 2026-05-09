// CBTScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { fetchSubjects, fetchQuestionsBySubject } from "./authFunctions";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CBTScreen = () => {
  const navigation = useNavigation();

  // ====== STATE ======
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [answers, setAnswers] = useState({}); // { questionId: selectedChoice }
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(900);
  const [progress, setProgress] = useState(0);

  const [reviewMode, setReviewMode] = useState(false);

  // admin hidden tap
  const [hiddenTapCount, setHiddenTapCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  let tapTimeout = null;

  // swipe / paging
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // swipe hint animation
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const hintAnim = useRef(new Animated.Value(0)).current; // 0..1

  // =====================================================
  // SECRET TAP HANDLER (admin)
  // =====================================================
  const handleSecretTap = () => {
    if (tapTimeout) clearTimeout(tapTimeout);
    setHiddenTapCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setShowAdmin(true);
        setHiddenTapCount(0);
        return 0;
      }
      tapTimeout = setTimeout(() => setHiddenTapCount(0), 4000);
      return newCount;
    });
  };

  // =====================================================
  // LOAD SUBJECTS
  // =====================================================
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectsData = await fetchSubjects();
        setSubjects(subjectsData || []);
      } catch (err) {
        console.error("fetchSubjects error:", err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  // =====================================================
  // TIMER
  // =====================================================
  useEffect(() => {
    if (!selectedSubject) return;
    setTimeLeft(900); // ensure reset when subject selected

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSubject]);

  // =====================================================
  // SHUFFLE QUESTIONS - Fisher-Yates
  // =====================================================
  const shuffleQuestions = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // =====================================================
  // SELECT SUBJECT -> fetch questions, shuffle, limit 30
  // =====================================================
  const selectSubject = async (subjectId) => {
    try {
      const fetched = await fetchQuestionsBySubject(subjectId);
      const fetchedArr = Array.isArray(fetched) ? fetched : [];
      if (fetchedArr.length === 0) {
        console.log("No questions found for subject:", subjectId);
        return;
      }

      const shuffled = shuffleQuestions(fetchedArr);
      const limited = shuffled.slice(0, 30);

      setQuestions(limited);
      setSelectedSubject(subjectId);
      setAnswers({});
      setProgress(0);
      setReviewMode(false);
      setCurrentIndex(0);

      // show swipe hint briefly
      setShowSwipeHint(true);
      Animated.sequence([
        Animated.timing(hintAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(hintAnim, { toValue: 0, duration: 600, delay: 2000, useNativeDriver: true }),
      ]).start(() => setShowSwipeHint(false));
    } catch (err) {
      console.error("selectSubject error:", err);
    }
  };

  // =====================================================
  // HANDLE ANSWER SELECTION (user can change answers any time)
  // =====================================================
  const handleAnswerSelection = (questionId, selectedAnswer) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: selectedAnswer };
      setProgress((Object.keys(updated).length / Math.max(questions.length, 1)) * 100);
      return updated;
    });
  };

  // =====================================================
  // SUBMIT TEST (calculate score & show modal)
  // =====================================================
  const handleSubmitTest = () => {
    let correct = 0;
    let incorrect = 0;

    questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === q.correctAnswer) correct++;
      else incorrect++;
    });

    setCorrectAnswers(correct);
    setIncorrectAnswers(incorrect);
    setIsModalVisible(true);
  };

  // =====================================================
  // RETAKE TEST
  // =====================================================
  const retakeTest = () => {
    setSelectedSubject(null);
    setQuestions([]);
    setAnswers({});
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setProgress(0);
    setReviewMode(false);
    setTimeLeft(900);
    setIsModalVisible(false);
    setCurrentIndex(0);
  };

  // =====================================================
  // ENABLE REVIEW MODE
  // =====================================================
  const enableReviewMode = () => {
    setReviewMode(true);
    setIsModalVisible(false);
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#6200ee"
        style={styles.loadingIndicator}
      />
    );
  }

  // =====================================================
  // RENDER DOTS INDICATOR
  // =====================================================
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {questions.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================
  return (
    <View style={styles.container}>
      {/* admin tap area */}
      <View style={{ height: 25, width: "100%" }} onTouchStart={handleSecretTap} />

      {/* admin button */}
      {showAdmin && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate("AdminUploadScreen")}
        >
          <Text style={styles.adminButtonText}>Admin Upload Panel</Text>
        </TouchableOpacity>
      )}

      {/* SUBJECT LIST */}
      {!selectedSubject && (
        <>
          <Text style={styles.header}>Choose a Subject</Text>
          <FlatList
            data={subjects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.subjectButton}
                onPress={() => selectSubject(item.id)}
              >
                <Text style={styles.subjectText}>{item.name || "No Name"}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        </>
      )}

      {/* SWIPEABLE CARDS */}
      {selectedSubject && (
        <>
          {/* timer + progress */}
          <View style={styles.topBar}>
            <View style={[styles.timerPill, timeLeft <= 60 ? { backgroundColor: "red" } : {}]}>
              <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${Math.round(progress)}%` }]} />
            </View>
          </View>

          {/* swipe hint */}
          {showSwipeHint && (
            <Animated.View
              style={[
                styles.swipeHint,
                {
                  opacity: hintAnim,
                  transform: [
                    {
                      translateY: hintAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-6, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.swipeHintText}>Swipe left or right to view more questions →</Text>
            </Animated.View>
          )}

          <FlatList
            ref={flatListRef}
            data={questions}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(ev) => {
              const page = Math.round(ev.nativeEvent.contentOffset.x / width);
              setCurrentIndex(page);
            }}
            renderItem={({ item, index }) => (
              <View style={[styles.cardContainer, { width }]}>
                <View style={styles.cardInner}>
                  <Text style={styles.cardQuestion}>
                    {index + 1}. {item.question}
                  </Text>

                  <View style={{ marginTop: 10 }}>
                    {item.choices.map((choice, idx) => {
                      const isSelected = answers[item.id] === choice;

                      return (
                        <TouchableOpacity
                          key={idx}
                          activeOpacity={0.85}
                          style={[
                            styles.choiceButton,
                            { backgroundColor: isSelected ? "green" : "#6200ee" },
                          ]}
                          onPress={() => handleAnswerSelection(item.id, choice)}
                        >
                          <Text style={styles.choiceText}>{choice}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          />

          {/* dots indicator */}
          {questions.length > 0 && renderDots()}

          {/* submit button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTest}>
            <Text style={styles.submitButtonText}>Submit Test</Text>
          </TouchableOpacity>
        </>
      )}

      {/* RESULTS MODAL */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Test Results</Text>
            <Text style={styles.modalScore}>Correct: {correctAnswers}</Text>
            <Text style={styles.modalScore}>Incorrect: {incorrectAnswers}</Text>
            <Text style={styles.modalScore}>Total: {questions.length}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={enableReviewMode}>
              <Text style={styles.modalButtonText}>Review Answers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: "green" }]} onPress={retakeTest}>
              <Text style={styles.modalButtonText}>Retake Test</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: "gray" }]} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* REVIEW MODE */}
      {reviewMode && (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const userAnswer = answers[item.id];
            return (
              <View key={item.id} style={styles.reviewItem}>
                <Text style={styles.reviewQuestion}>{index + 1}. {item.question}</Text>
                <Text style={styles.reviewYourAnswer}>Your Answer: {userAnswer || "Not answered"}</Text>
                <Text style={styles.reviewCorrectAnswer}>Correct Answer: {item.correctAnswer}</Text>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { fontSize: 24, fontWeight: "700", color: "#fff", marginTop: 10, alignSelf: "center" },
  loadingIndicator: { flex: 1, justifyContent: "center", backgroundColor: "#121212" },

  adminButton: { backgroundColor: "orange", padding: 12, borderRadius: 10, margin: 12, alignItems: "center" },
  adminButtonText: { color: "#fff", fontWeight: "700" },

  subjectButton: { backgroundColor: "#6200ee", padding: 14, marginHorizontal: 16, marginVertical: 8, borderRadius: 12, alignItems: "center" },
  subjectText: { color: "#fff", fontWeight: "700" },

  topBar: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  timerPill: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "green", borderRadius: 999, alignSelf: "flex-start", marginBottom: 8 },
  timerText: { color: "#fff", fontWeight: "700" },

  progressContainer: { height: 10, backgroundColor: "#333", borderRadius: 6, overflow: "hidden", marginTop: 6 },
  progressBar: { height: "100%", backgroundColor: "#6200ee" },

  swipeHint: { alignSelf: "center", marginVertical: 8, backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  swipeHintText: { color: "#fff", fontWeight: "600" },

  // card
  cardContainer: { height: "68%", justifyContent: "center" },
  cardInner: {
    backgroundColor: "#1f1f1f",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 18,
    minHeight: 220,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  cardQuestion: { color: "#fff", fontSize: 18, fontWeight: "600" },

  choiceButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "flex-start",
  },
  choiceText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  dotsContainer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: "#62c1ff" },
  inactiveDot: { backgroundColor: "#444" },

  submitButton: { backgroundColor: "#6200ee", marginHorizontal: 24, padding: 14, borderRadius: 12, alignItems: "center", marginTop: 14, marginBottom: 20 },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // modal
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalContent: { width: 320, backgroundColor: "#222", borderRadius: 12, padding: 18, alignItems: "center" },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 8 },
  modalScore: { color: "#fff", marginVertical: 4 },

  modalButton: { backgroundColor: "#6200ee", padding: 12, borderRadius: 10, marginTop: 10, width: "100%", alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "700" },

  // review
  reviewItem: { backgroundColor: "#1f1f1f", marginHorizontal: 16, marginVertical: 8, padding: 12, borderRadius: 12 },
  reviewQuestion: { color: "#fff", fontWeight: "700" },
  reviewYourAnswer: { color: "#ffcc00", marginTop: 6 },
  reviewCorrectAnswer: { color: "lightgreen", marginTop: 4 },
});

export default CBTScreen;
