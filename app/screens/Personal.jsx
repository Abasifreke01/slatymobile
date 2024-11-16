import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const [name, setName] = useState('John Doe'); // Initial name
  const [password, setPassword] = useState(''); // Placeholder for password
  const [phoneNumber, setPhoneNumber] = useState('123-456-7890'); // Initial phone number
  const [email, setEmail] = useState('john.doe@example.com'); // Initial email
  const [profilePicture, setProfilePicture] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleDeleteAccount = () => {
    alert('Account deleted');
  };

  const handleUpdateProfile = () => {
    alert('Profile updated');
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal</Text>

      <TouchableOpacity onPress={handleImagePicker} style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <Text style={styles.profilePictureText}>Upload Profile Picture</Text>
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        {/* Display initial details */}
        <Text style={styles.detailText}>Name: {name}</Text>
        <Text style={styles.detailText}>Email: {email}</Text>
        <Text style={styles.detailText}>Phone: {phoneNumber}</Text>

        <TextInput
          style={[styles.input, focusedField === 'name' && styles.activeInput]}
          placeholder="Update Name"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
        />
        <TextInput
          style={[styles.input, focusedField === 'password' && styles.activeInput]}
          placeholder="Update Password"
          secureTextEntry
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          onFocus={() => handleFocus('password')}
          onBlur={handleBlur}
        />
        <TextInput
          style={[styles.input, focusedField === 'phone' && styles.activeInput]}
          placeholder="Update Phone Number"
          placeholderTextColor="#ccc"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onFocus={() => handleFocus('phone')}
          onBlur={handleBlur}
        />
        <TextInput
          style={[styles.input, focusedField === 'email' && styles.activeInput]}
          placeholder="Update Email Address"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccount}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#1DE9B6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profilePictureText: {
    color: '#1DE9B6',
  },
  inputContainer: {
    flex: 1,
  },
  detailText: {
    color: 'white',
    marginBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#222',
    borderColor: 'transparent',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: 'white',
  },
  activeInput: {
    borderColor: '#1DE9B6',
  },
  button: {
    backgroundColor: 'transparent',
    borderColor: '#1DE9B6',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteAccount: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Profile;
