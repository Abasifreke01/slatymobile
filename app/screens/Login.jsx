import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const learn = require("../../assets/images/image 3 onboarding.png"); // Learn image

function Login({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Learn Image in the center */}
        <Image source={learn} style={styles.logo} />

        {/* Dark button as an overlay on the top right */}
        <TouchableOpacity
          style={styles.learnButton}
          onPress={() => navigation.navigate('Loginsocial')}
          accessible={true}
          accessibilityLabel="Go to login screen"
        >
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Start your journey</Text>
        
        {/* Spacer between texts */}
        <View style={styles.spacer} />
        
        {/* Spacer between texts */}
        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Registersocial')}>
          <Text style={styles.buttonText}>Create an account</Text>
        </TouchableOpacity>

        {/* Second button below the first */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Loginsocial')}>
        
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(171, 148, 227)', // Background color of the screen
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
  learnButton: {
    position: 'absolute',
    top: 10, // Position from the top
    right: 10, // Position from the right
    zIndex: 1, // Ensure it stays on top of other elements
  },
  bottomContainer: {
    backgroundColor: 'black', // Set background color to black
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20, // Curved radius on the top left
    borderTopRightRadius: 20, // Curved radius on the top right
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  spacer: {
    height: 20, // Adjust this value for spacing
  },
  button: {
    backgroundColor: '#15A581', // Create an account button color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'black', // Dark color for the second button
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10, // Space between buttons
    alignItems: 'center',
    borderWidth: 2, // Border width
    borderColor: '#15A581', // Light green border color
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: 'white', // Change text color to white
    fontSize: 16,
    textAlign: 'center',
  },
  bottomText: {
    color: 'white', // Change text color to white
    fontSize: 26,
  },
});

export default Login;
