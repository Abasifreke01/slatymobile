import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';

const livepic = require("../../assets/images/ri_live-line.png");

const LiveClasses = () => {
  const navigation = useNavigation();
  const [classLink, setClassLink] = useState('');

  const handleJoinClass = () => {
    if (!classLink.trim()) {
      Alert.alert("Input Required", "Please enter a Class ID or paste a link.");
      return;
    }

    if (!auth.currentUser) {
      Alert.alert("Authentication Required", "Please log in to join a class.");
      return;
    }

    // Attempt to extract linkId from a full URL if provided
    let linkId = classLink.trim();
    if (linkId.includes("linkId=")) {
      const parts = linkId.split("linkId=");
      linkId = parts[1].split("&")[0];
    } else if (linkId.includes("/")) {
      // Handle simple path-based IDs if needed
      const parts = linkId.split("/");
      linkId = parts[parts.length - 1];
    }

    navigation.navigate('Classpayment', {
      linkId: linkId,
      studentId: auth.currentUser.uid,
      email: auth.currentUser.email
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={livepic} style={styles.liveIcon} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Class ID or Link</Text>
        <TextInput
          placeholder="Paste link or enter ID here"
          placeholderTextColor="#aaa"
          value={classLink}
          onChangeText={setClassLink}
          style={styles.input}
        />
        <Text style={styles.hint}>Enter the link shared by your tutor to proceed to payment and join the class.</Text>

        <TouchableOpacity style={styles.joinBtn} onPress={handleJoinClass}>
          <Text style={styles.joinBtnText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  liveIcon: {
    width: 60,
    height: 60,
    tintColor: '#1DE9B6',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DE9B6',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#252525',
    color: 'white',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  hint: {
    color: '#888',
    fontSize: 13,
    marginBottom: 25,
    lineHeight: 18,
  },
  joinBtn: {
    backgroundColor: '#1DE9B6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinBtnText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LiveClasses;
