import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig'; // Adjust import based on your project structure
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore'; // Ensure this import if using Firestore

export default function Loginsocial({ navigation }) {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [identifier, setIdentifier] = useState(''); // Use identifier for email/username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignIn = async () => {
    if (!identifier || !password) {
      setError('Please enter both email/username and password.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(identifier)) {
      // It's an email
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, identifier, password);
        navigation.navigate('Main');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Try to fetch user by username
      try {
        const userDoc = await getDoc(doc(db, 'users', identifier));
        if (!userDoc.exists()) {
          setError('User not found.');
          return;
        }
        const userData = userDoc.data();
        const email = userData.email;

        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('Main');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Registersocial');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={require('../../assets/images/loginlogo.png')} style={styles.logo} />
        <Text style={styles.title}>Login to your account</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, isEmailFocused && styles.inputFocused]}
          placeholder="Email or Username"
          placeholderTextColor="#ffffff"
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          value={identifier}
          onChangeText={setIdentifier}
        />

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, isPasswordFocused && styles.inputFocused]}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          value={password}
          onChangeText={setPassword}
        />

        {loading ? ( // Show loading indicator
          <ActivityIndicator size="large" color="#15A581" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign in with password</Text>
          </TouchableOpacity>
        )}

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don’t have an account? 
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}> Sign up</Text>
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#16dd89',
    fontSize: 14,
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
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 14,
  },
  signUpLink: {
    color: '#16dd89',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 10,
  },
});
