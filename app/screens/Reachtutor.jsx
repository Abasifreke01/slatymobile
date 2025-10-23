import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const tutorpic = require("../../assets/images/Frame 26082857.png");

export default function TutorsProfile() {
  const navigation = useNavigation(); // Hook to access navigation

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor's Profile</Text>
      <View style={styles.profileContainer}>
        <Image source={tutorpic} style={styles.tutorpic} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Adamu Matthew</Text>
          <Text style={styles.subject}>Subject: Economics</Text>
          <Text style={styles.bio}>
            Experienced tutor with a passion for teaching Economics and helping students succeed.
          </Text>
        </View>
      </View>

      {/* Total Section */}
      <View style={styles.totalContainer}>
        <View style={styles.line} />
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>$20</Text>
        </View>
        <View style={styles.line} />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tutorpic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subject: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  bio: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center', // Center align the total section
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: 'white', // Color of the line
    marginVertical: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  totalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#15A581', // Updated button color
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
