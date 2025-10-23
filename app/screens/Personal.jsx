import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp';
const IMGUR_CLIENT_ID = '3dd41ae85c850c8'; // Your client ID

const Personal = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Not logged in', 'Please log in to access profile.');
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || '');
          setEmail(userData.email || currentUser.email);
          setPhoneNumber(userData.phoneNumber || '');
          setProfilePicture(userData.profilePicture || null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted || !cameraPermission.granted) {
      Alert.alert('Permissions required', 'Please allow camera and gallery access.');
      return;
    }

    Alert.alert(
      'Select Image Source',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled) {
              setProfilePicture(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });

            if (!result.canceled) {
              setProfilePicture(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const uploadToImgur = async () => {
    if (!profilePicture || profilePicture.startsWith('http')) return profilePicture;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: profilePicture,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data && data.data.link) {
        return data.data.link;
      } else {
        throw new Error('Failed to upload image to Imgur');
      }
    } catch (error) {
      console.error('Imgur upload error:', error);
      Alert.alert('Upload Failed', 'Unable to upload image to Imgur.');
      return null;
    }
  };

  const handleRemoveProfilePicture = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { profilePicture: null });

      setProfilePicture(null);
      Alert.alert('Removed', 'Profile picture has been deleted.');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      Alert.alert('Error', 'Could not delete profile picture.');
    }
  };

  const handleUpdateProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Not logged in', 'You must be logged in to update your profile.');
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const uploadedImageURL = await uploadToImgur();

      await updateDoc(userRef, {
        name,
        email,
        phoneNumber,
        profilePicture: uploadedImageURL,
      });

      if (email && email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      if (password.length >= 6) {
        await updatePassword(currentUser, password);
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal</Text>

      <TouchableOpacity onPress={handleImagePicker} style={styles.profilePictureContainer}>
        <Image
          source={{ uri: profilePicture || DEFAULT_AVATAR }}
          style={styles.profilePicture}
        />
      </TouchableOpacity>

      {profilePicture && profilePicture !== DEFAULT_AVATAR && (
        <TouchableOpacity onPress={handleRemoveProfilePicture}>
          <Text style={styles.removeText}>Remove Profile Picture</Text>
        </TouchableOpacity>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.detailText}>Name: {name}</Text>
        <Text style={styles.detailText}>Email: {email}</Text>
        <Text style={styles.detailText}>Phone: {phoneNumber}</Text>

        <TextInput
          style={[styles.input, focusedField === 'name' && styles.activeInput]}
          placeholder="Update Name"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
        <TextInput
          style={[styles.input, focusedField === 'password' && styles.activeInput]}
          placeholder="Update Password"
          secureTextEntry
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
        />
        <TextInput
          style={[styles.input, focusedField === 'phone' && styles.activeInput]}
          placeholder="Update Phone Number"
          placeholderTextColor="#ccc"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onFocus={() => setFocusedField('phone')}
          onBlur={() => setFocusedField(null)}
        />
        <TextInput
          style={[styles.input, focusedField === 'email' && styles.activeInput]}
          placeholder="Update Email Address"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
        />

        {loading ? (
          <ActivityIndicator color="#1DE9B6" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 10,
    alignSelf: 'center',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  removeText: {
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
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
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Personal;
