import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig'; // Adjust the path as necessary
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function Registersocial({ navigation }) {
  const google = require("../../assets/images/google icon.png");
  const facebook = require("../../assets/images/facebook icon.png");
  const apple = require("../../assets/images/appleslogo.png");

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSignUp = async () => {
    if (!email || !phone || !username || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const phonePattern = /^[0-9]{10,15}$/; // Example pattern for phone numbers
    if (!phonePattern.test(phone)) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    if (password.length < 6) { // Example password length check
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true); // Start loading

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User signed up:', user);

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        phone,
        username,
        createdAt: serverTimestamp(),
      });

      navigation.navigate('Dashboard'); // Navigate to the Dashboard screen
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already in use. Please use a different email.');
      } else {
        setErrorMessage(error.message);
      }
      console.error('Error signing up:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Loginsocial');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../assets/images/loginlogo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Create New Account</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          style={[styles.input, isEmailFocused && styles.inputFocused]}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />
        <TextInput
          style={[styles.input, isPhoneFocused && styles.inputFocused]}
          placeholder="Phone number"
          placeholderTextColor="#ffffff"
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setIsPhoneFocused(true)}
          onBlur={() => setIsPhoneFocused(false)}
        />
        <TextInput
          style={[styles.input, isUsernameFocused && styles.inputFocused]}
          placeholder="Username"
          placeholderTextColor="#ffffff"
          value={username}
          onChangeText={setUsername}
          onFocus={() => setIsUsernameFocused(true)}
          onBlur={() => setIsUsernameFocused(false)}
        />
        <TextInput
          style={[styles.input, isPasswordFocused && styles.inputFocused]}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#15A581" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account? 
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}> Log in</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  innerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 100,
    marginBottom: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#152428',
    borderRadius: 12,
    paddingHorizontal: 10,
    color: '#ffffff',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#16dd89',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#15A581',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  loginText: {
    color: '#ffffff',
    fontSize: 14,
  },
  loginLink: {
    color: '#16dd89',
    fontWeight: 'bold',
  },
});

export default Registersocial;
