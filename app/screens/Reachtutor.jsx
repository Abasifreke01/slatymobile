import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Paystack } from 'react-native-paystack-webview';
import { db, auth } from '../firebaseConfig';
import {
  collection, query, where, getDocs, addDoc,
  serverTimestamp, doc, getDoc, setDoc, updateDoc, increment
} from 'firebase/firestore';

const tutorpic = require("../../assets/images/Frame 26082857.png");

export default function Reachtutor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tutorId, name, specialization, about, charge, profilePicture } = route.params || {};

  const displayImage = profilePicture ? { uri: profilePicture } : tutorpic;

  const paystackRef = React.useRef();


  const handlePaymentSuccess = async (response) => {
    const reference = response.reference;
    // setShowWebView(false);

    if (!tutorId) {
      Alert.alert('✅ Payment Successful', `Reference: ${reference}`);
      navigation.navigate('Home');
      return;
    }

    try {
      const myId = auth.currentUser.uid;
      // Deterministic chat ID logic (same as Tutorsprofile.jsx)
      const chatId = [myId, tutorId].sort().join('_');
      const chatRef = doc(db, 'privateChats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        const mySnap = await getDoc(doc(db, 'users', myId));
        const myData = mySnap.data() || {};

        await setDoc(chatRef, {
          participants: [myId, tutorId],
          tutorId: tutorId,
          status: 'active',
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp(),
          message: 'Booking confirmed',
          [`name_${myId}`]: myData.name || myData.username || 'Student',
          [`photo_${myId}`]: myData.profilePicture || null,
          [`name_${tutorId}`]: name || 'Tutor',
          [`photo_${tutorId}`]: profilePicture || null,
          [`unread_${myId}`]: 0,
          [`unread_${tutorId}`]: 1, // Notify tutor
        });
      } else {
        // Update existing chat
        await updateDoc(chatRef, {
          status: 'active',
          tutorId: tutorId,
          lastMessageAt: serverTimestamp(),
          message: 'Booking confirmed',
          [`unread_${tutorId}`]: increment(1),
        });
      }

      // Add automated message
      await addDoc(collection(db, 'privateChats', chatId, 'messages'), {
        text: `✅ Booking confirmed for ₦${charge}. Reference: ${reference}. I'm ready for our session!`,
        senderId: myId,
        senderName: auth.currentUser.displayName || "Student",
        senderImage: auth.currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        type: 'text',
      });

      Alert.alert('✅ Payment Successful', `You have booked ${name}. Redirecting to chat...`);
      navigation.navigate('Messages', {
        roomId: chatId,
        name: name,
        type: 'chats'
      });
    } catch (err) {
      console.error("Post-payment error:", err);
      Alert.alert('✅ Payment Successful', `Reference: ${reference}\nBut failed to open chat.`);
      navigation.navigate('Home');
    }
  };

  const handleContinue = () => {
    if (!charge || charge === "0") {
      Alert.alert("Invalid Amount", "This tutor has not set a charge yet.");
      return;
    }
    paystackRef.current.startTransaction();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor's Profile</Text>
      <View style={styles.profileContainer}>
        <Image source={displayImage} style={styles.tutorpic} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name || "Adamu Matthew"}</Text>
          <Text style={styles.subject}>Subject: {specialization || "Economics"}</Text>
          <Text style={styles.bio}>
            {about || "Experienced tutor with a passion for teaching Economics and helping students succeed."}
          </Text>
        </View>
      </View>

      {/* Total Section */}
      <View style={styles.totalContainer}>
        <View style={styles.line} />
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>₦{charge || "0"}</Text>
        </View>
        <View style={styles.line} />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Pay ₦{charge}</Text>
      </TouchableOpacity>

      <Paystack
        paystackKey="pk_live_08caf03794fe0f0fd91a9b9107f9026b31f50b4a"
        amount={parseFloat(charge)}
        billingEmail={auth.currentUser?.email || "student@slaty.com"}
        activityIndicatorColor="#1DE9B6"
        onCancel={() => {
          Alert.alert('❌ Payment Cancelled', 'You cancelled the transaction.');
        }}
        onSuccess={handlePaymentSuccess}
        ref={paystackRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tutorpic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subject: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  bio: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center', // Center align the total section
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: 'white', // Color of the line
    marginVertical: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  totalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#15A581', // Updated button color
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
