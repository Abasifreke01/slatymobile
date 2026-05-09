// screens/VideoCall.js
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoCall = ({ route }) => {
  const { callTime, roomName } = route.params || {};

  // Construct Jitsi URL
  // If roomName is provided, use it. Otherwise generate one or use a default.
  // For a unique room based on time, we might want to sanitize the string.
  // Fallback to 'SlatyClassDefault' if nothing is provided.
  const meetingRoom = roomName || (callTime ? `SlatyClass_${callTime.replace(/[^a-zA-Z0-9]/g, '')}` : 'SlatyTutorClass');
  const jitsiUrl = `https://meet.jit.si/${meetingRoom}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1DE9B6" />
          </View>
        )}
      // Permission requests like Camera/Microphone are handled automatically by the OS on Android 
      // if declared in AndroidManifest.xml and user grants them.
      // For WebView specifically, we might need onPermissionRequest on newer Android versions,
      // but react-native-webview handles standard permissions relatively well.
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default VideoCall;
