import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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

  const tutors = [
    { name: "Adamu Matthew", subject: "Economics" },
    { name: "Phillips Daniels", subject: "Thermodynamics" },
    { name: "Jane Doe", subject: "Biology" },
    { name: "Adamu Matthew", subject: "Economics" },
    { name: "Phillips Daniels", subject: "Thermodynamics" },
    { name: "Jane Doe", subject: "Biology" },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.textcon}>Find Tutor</Text>
        
        <View style={styles.container}>
          <TextInput
            onChangeText={setSearch}
            value={search}
            placeholder="Search for tutors..."
            placeholderTextColor="#888"
            style={styles.searchBar}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buttonContainer}>
            {subjects.map((subject) => (
              <TouchableOpacity key={subject} style={styles.button}>
                <Text style={styles.buttonText}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tutor List */}
        {tutors.map((tutor, index) => (
          <View key={index} style={styles.tutorSection}>
            <Image source={tutorpic} style={styles.tutorImage} />
            <View style={styles.tutorInfo}>
              <Text style={styles.tutorName}>{tutor.name}</Text>
              <Text style={styles.tutorSubject}>{tutor.subject}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              console.log(`Navigating to TutorsProfile for ${tutor.name}`);
              navigation.navigate('Tutorsprofile'); // Ensure the route name matches
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
