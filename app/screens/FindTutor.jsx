import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig'; // Firebase config
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const tutorpic = require("../../assets/images/monogram.png");
const addtutor = require("../../assets/images/button pri.png");

export default function FindTutor() {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');

  const subjects = [
    'English', 'Physics', 'Thermodynamics',
    'Biology', 'Mathematics', 'Chemistry',
    'History', 'Art', 'Computer Science',
    'Economics'
  ];

  const [realTutors, setRealTutors] = React.useState([]);

  React.useEffect(() => {
    let unsubscribeSnapshot = () => { };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      unsubscribeSnapshot(); // Clear any previous snapshot listener
      if (user) {
        const tutorsQuery = query(collection(db, 'users'), where('role', '==', 'tutor'));
        unsubscribeSnapshot = onSnapshot(tutorsQuery, (snapshot) => {
          const tutorsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRealTutors(tutorsList);
        }, (error) => {
          // Only log if we still have a user (prevents logout noise)
          if (auth.currentUser) {
            console.error("Error fetching tutors:", error);
          }
        });
      } else {
        setRealTutors([]);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const filteredTutors = realTutors.filter(tutor => {
    const searchLower = search.toLowerCase();
    return (
      (tutor.name && tutor.name.toLowerCase().includes(searchLower)) ||
      (tutor.username && tutor.username.toLowerCase().includes(searchLower)) ||
      (tutor.specialization && tutor.specialization.toLowerCase().includes(searchLower))
    );
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TextInput
            onChangeText={setSearch}
            value={search}
            placeholder="Search for tutors or specializations..."
            placeholderTextColor="#888"
            style={styles.searchBar}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonContainer}>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject}
                style={styles.button}
                onPress={() => setSearch(subject)}
              >
                <Text style={styles.buttonText}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tutor List */}
        {filteredTutors.map((tutor) => (
          <View key={tutor.id} style={styles.tutorSection}>
            <Image
              source={tutor.profilePicture ? { uri: tutor.profilePicture } : tutorpic}
              style={styles.tutorImage}
            />
            <View style={styles.tutorInfo}>
              <Text style={styles.tutorName}>{tutor.name || tutor.username || "Tutor"}</Text>
              <Text style={styles.tutorSubject}>{tutor.specialization || "Science Tutor"}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              console.log(`Navigating to TutorsProfile for ${tutor.username}`);
              navigation.navigate('Tutorsprofile', { tutorId: tutor.id });
            }}>
              <Image source={addtutor} style={styles.addTutorImage} accessibilityLabel="Add Tutor" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  textcon: {
    padding: 20,
    color: 'white',
    fontSize: 24,
  },
  container: {
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 50,
    borderColor: '#1DE9B6',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    backgroundColor: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    borderColor: '#1DE9B6',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: 'rgba(29, 233, 182, 0.1)',
  },
  buttonText: {
    color: '#1DE9B6',
    fontSize: 16,
  },
  tutorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  tutorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  tutorInfo: {
    flex: 1,
    marginLeft: 15,
  },
  tutorName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tutorSubject: {
    color: 'white',
    fontSize: 14,
  },
  addTutorImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});
