// screens/VideoCall.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

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
    // Example: Integrate with your video call SDK here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Call</Text>
      <Text style={styles.timeText}>Call scheduled at: {callTime}</Text>
      <Button title="Join Call" onPress={handleJoinCall} />
      {/* Here you can integrate your video call UI component */}
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

export default VideoCall;
