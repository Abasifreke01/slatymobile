import { View, Button, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const logo = require("../../assets/images/logo.png");

function HomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Detail');
    }, 5000); // 5000 ms = 5 second

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} />
        {/* Optional: You can keep the button here for manual navigation */}
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  button: {
    position: 'absolute',
    bottom: 90, // Adjust this value as needed
  },
});

export default HomeScreen;
