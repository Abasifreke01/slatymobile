// screens/LiveClasses.js
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LiveClasses = () => {
  const navigation = useNavigation();
  const callTime = "2024-10-15T10:00:00"; // Example call time in ISO format

  useEffect(() => {
    const checkCallTime = setInterval(() => {
      const now = new Date();
      const scheduledTime = new Date(callTime);

      if (now >= scheduledTime) {
        clearInterval(checkCallTime); // Stop the timer
        navigation.navigate('VideoCall', { callTime: callTime }); // Navigate to VideoCall screen
      }
    }, 1000); // Check every second

    return () => clearInterval(checkCallTime); // Cleanup on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Classes</Text>
      <Text style={styles.timeText}>Next class starts at: {new Date(callTime).toLocaleString()}</Text>
      <Button title="Join Now" onPress={() => navigation.navigate('VideoCall', { callTime })} />
    </View>
  );
};

const VideoCall = ({ route }) => {
  const { callTime } = route.params || {};

  if (!callTime) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: No call time provided.</Text>
      </View>
    );
  }

  const handleJoinCall = () => {
    // Logic to initiate or join the video call goes here
    console.log('Joining video call...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Call</Text>
      <Text style={styles.timeText}>Call scheduled at: {callTime}</Text>
      <Button title="Join Call" onPress={handleJoinCall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    color: '#1DE9B6',
  },
  timeText: {
    fontSize: 16,
    color: 'white',
    marginVertical: 20,
  },
});

export default LiveClasses;
