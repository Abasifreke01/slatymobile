import {
  View, Text, Image, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Modal
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig'; // Firebase config
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';

// Static image assets
const cartpicture = require("../../assets/images/typcn_shopping-cart.png");
const notificationpic = require("../../assets/images/Vector.png");
const solveimg = require("../../assets/images/Saly-25.png");
const booksimg = require("../../assets/images/3d-view-books-cartoon-style 1.png");
const progressimg = require("../../assets/images/Rectangle 604.png");
const trending = require("../../assets/images/trending.png");

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp';

const TOPICS = [
  "React", "HTML", "CSS", "Angular", "Javascript", "Python", "Data Structures",
  "Algorithms", "Calculus", "Physics", "Chemistry", "Biology", "History",
  "Economics", "Machine Learning", "AI", "Web Dev", "App Dev", "Cyber Security",
  "Cloud Computing", "UI/UX Design", "Database", "Node.js", "Java", "C++",
  "Marketing", "Psychology", "Sociology", "Philosophy", "Statistics"
];

const TOPIC_COLORS = ['#E9760B', '#69EB9C', '#AB9DFB', '#EEEE68', '#1DE9B6', '#FF6B6B', '#4D96FF', '#6BCB77'];

export default function Dashboard() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(DEFAULT_AVATAR);
  const [unreadCount, setUnreadCount] = useState(0);
  const [randomTopics, setRandomTopics] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    // Pick 4 random topics
    const shuffled = [...TOPICS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4).map((topic, index) => ({
      name: topic,
      color: TOPIC_COLORS[index % TOPIC_COLORS.length]
    }));
    setRandomTopics(selected);
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot = () => { };
    let unsubscribeUnread = () => { };

    const subscribeToUserData = (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsername(data.name || data.username || '');
            setProfilePicture(data.profilePicture || DEFAULT_AVATAR);
          }
        }, (error) => {
          if (auth.currentUser) console.error("Error listening to user data:", error);
        });
      }
    };

    const subscribeToUnreadTasks = (user) => {
      if (user) {
        const q = query(
          collection(db, 'task'),
          where('userId', '==', user.uid),
          where('status', '==', 'completed'),
          where('isRead', '==', false)
        );
        unsubscribeUnread = onSnapshot(q, (snapshot) => {
          setUnreadCount(snapshot.size);
        }, (error) => {
          if (auth.currentUser) console.error("Error listening to unread tasks:", error);
        });
      }
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      unsubscribeSnapshot();
      unsubscribeUnread();
      if (user) {
        subscribeToUserData(user);
        subscribeToUnreadTasks(user);
      } else {
        setUsername('');
        setProfilePicture(DEFAULT_AVATAR);
        setUnreadCount(0);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
      unsubscribeUnread();
    };
  }, []);

  const handleTopicPress = (topic) => {
    setSelectedTopic(topic);
    setModalVisible(true);
  };

  const navigateToLiveClass = () => {
    setModalVisible(false);
    navigation.navigate('Find Tutor');
  };

  const navigateToTask = () => {
    setModalVisible(false);
    navigation.navigate('Task');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <View style={styles.topContainer}>
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Personal')}>
              <Image source={{ uri: profilePicture }} style={styles.imageStyle} />
            </TouchableOpacity>
            <Text style={styles.textStyle}>Hello, {username || 'User'}!</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image source={cartpicture} style={styles.iconStyle} />
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <View>
                <Image source={notificationpic} style={styles.iconStyle} />
                {unreadCount > 0 && <View style={styles.redDot} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.barsContainer}>
          <TouchableOpacity
            style={styles.solveBar}
            onPress={() => navigation.navigate('Task')}
          >
            <Image source={solveimg} style={styles.solveImage} />
            <Text style={styles.solveText}>Solve a Problem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.problemBar}
            onPress={() => navigation.navigate('CBTScreen')}
          >
            <Image source={booksimg} style={styles.booksImage} />
            <Text style={styles.booksText}>JAMB/ CBT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityLabel}>My Activity</Text>
          <Text style={styles.topRightText}>Your Progress</Text>
        </View>

        <View style={styles.generalMathsContainer}>
          <View style={styles.generalMathsBar}>
            <Image source={progressimg} style={styles.progressImage} />
            <Text style={styles.generalMathsText}>General Mathematics</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar} />
            </View>
          </View>
        </View>

        <Text style={styles.popularCoursesText}>Popular</Text>

        <View style={styles.newBarsContainer}>
          {randomTopics.length >= 4 && (
            <>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  style={[styles.newBar, { backgroundColor: randomTopics[0].color }]}
                  onPress={() => handleTopicPress(randomTopics[0])}
                >
                  <Text style={styles.barText}>{randomTopics[0].name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.newBar, { backgroundColor: randomTopics[1].color }]}
                  onPress={() => handleTopicPress(randomTopics[1])}
                >
                  <Text style={styles.barText}>{randomTopics[1].name}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  style={[styles.newBar, { backgroundColor: randomTopics[2].color }]}
                  onPress={() => handleTopicPress(randomTopics[2])}
                >
                  <Text style={styles.barText}>{randomTopics[2].name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.newBar, { backgroundColor: randomTopics[3].color }]}
                  onPress={() => handleTopicPress(randomTopics[3])}
                >
                  <Text style={styles.barText}>{randomTopics[3].name}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTopic}>Topic: {selectedTopic?.name}</Text>
              <Text style={styles.modalTitle}>How would you like to proceed?</Text>

              <TouchableOpacity style={styles.optionButton} onPress={navigateToLiveClass}>
                <View style={[styles.optionDot, { backgroundColor: '#1DE9B6' }]} />
                <Text style={styles.optionText}>I want a live class</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionButton} onPress={navigateToTask}>
                <View style={[styles.optionDot, { backgroundColor: '#AB9DFB' }]} />
                <Text style={styles.optionText}>I want to solve a task immediately</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Maybe later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.trendingContainer}>
          <Image source={trending} style={styles.trendingImage} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1DE9B6',
  },
  textStyle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  redDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'black',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  solveBar: {
    width: 156,
    height: 90,
    backgroundColor: '#B0E4DD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 10,
  },
  solveImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  solveText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  problemBar: {
    width: 156,
    height: 90,
    backgroundColor: '#B9A9FB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  booksImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  booksText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  activityLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topRightText: {
    color: '#aaa',
    fontSize: 12,
  },
  generalMathsContainer: {
    width: '100%',
    marginTop: 10,
  },
  generalMathsBar: {
    height: 90,
    backgroundColor: '#B3A8FB',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  progressImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  generalMathsText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  progressContainer: {
    width: '30%',
    height: 10,
    backgroundColor: '#e0e0df',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBar: {
    width: '30%',
    height: '100%',
    backgroundColor: '#3b5998',
  },
  popularCoursesText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  trendingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  trendingImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  newBarsContainer: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  newBar: {
    width: '48%',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1f1c2f',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTopic: {
    color: '#1DE9B6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  optionButton: {
    width: '100%',
    backgroundColor: '#2a273f',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },
  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#aaa',
    fontSize: 14,
  },
});
