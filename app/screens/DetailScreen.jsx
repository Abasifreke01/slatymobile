import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const dark = require("../../assets/images/Button-dark.png"); // Dark button image
const learn = require("../../assets/images/learn.png"); // Learn image

function DetailScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Learn Image in the center */}
        <Image source={learn} style={styles.logo} />

        {/* Dark button as an overlay on the top right */}
        <TouchableOpacity
          style={styles.learnButton}
          onPress={() => navigation.navigate('Login')}
          accessible={true}
          accessibilityLabel="Go to login screen"
        >
          <Image source={dark} style={styles.darkLogo} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Learning Made Easy</Text>
        
        {/* Spacer between texts */}
        <View style={styles.spacer} />

        <Text style={styles.bottomTextsecond}>
          With SLATY you can find solutions to all your academic needs
        </Text>
        
        {/* Spacer between texts */}
        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding2')}
        >
          <Text style={styles.buttonText}>Next</Text>
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
  darkLogo: {
    width: 50, // Adjust the size of the dark button image
    height: 50, // Maintain aspect ratio
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
    backgroundColor: '#15A581', // Updated button color
    paddingVertical: 10, // Increased vertical padding for a longer button
    paddingHorizontal: 30, // Horizontal padding
    borderRadius: 20, // Increased border radius for a curved button
    marginTop: 10, // Space between button and text
    alignItems: 'center', // Center text in the button
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  bottomText: {
    color: 'white', // Change text color to white
    fontSize: 26,
  },
  bottomTextsecond: {
    color: 'white', // Change text color to white
    fontSize: 16,
    textAlign: 'center', // Center the second text
  },
});

export default DetailScreen;
