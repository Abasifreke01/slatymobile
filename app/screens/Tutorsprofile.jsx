import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const tutorpic = require("../../assets/images/Frame 26082857.png");
const messageIcon = require("../../assets/images/heroicons-outline_chat-alt.png");
const connectIcon = require("../../assets/images/mdi_account-plus-outline.png");
const coursepic = require("../../assets/images/Rectangle 636.png");
const liveclasspic = require("../../assets/images/Rectangle 637.png");

export default function TutorsProfile() {
  const navigation = useNavigation();

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

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.messageButton} onPress={() => navigation.navigate('Reachtutor')}>
          <Image source={messageIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate('Reachtutor')}>
          <Image source={connectIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
      </View>

      {/* About Section with Dark Purple Background */}
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>About</Text>
        <Text style={styles.aboutText}>
          Hello, I am an educator passionate about everything that involves calculations.
          My goal is to help students get the best grades in their tests and exams.
          Cheers!
        </Text>
      </View>

      {/* Activities Section */}
      <View style={styles.activitiesContainer}>
        <Text style={styles.activitiesTitle}>Activities</Text>
        <View style={styles.activitiesRow}>
          <View style={styles.activityItem}>
            <Image source={coursepic} style={styles.activityImage} />
            <Text style={styles.activityText}>Courses</Text>
          </View>
          <View style={styles.activityItem}>
            <Image source={liveclasspic} style={styles.activityImage} />
            <Text style={styles.activityText}>Live Classes</Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Reachtutor')}>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: '#008774',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008774',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  aboutContainer: {
    marginTop: 20,
    backgroundColor: '#1F1C2F',
    padding: 15,
    borderRadius: 10,
  },
  aboutTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutText: {
    color: '#B0A3C0',
    fontSize: 14,
    marginTop: 5,
  },
  activitiesContainer: {
    marginTop: 20,
    backgroundColor: '#1F1C2F',
    padding: 15,
    borderRadius: 10,
  },
  activitiesTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  activityItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  activityText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  continueButton: {
    backgroundColor: '#008774',
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
