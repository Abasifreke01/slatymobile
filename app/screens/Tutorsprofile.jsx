import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { doc, onSnapshot, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const tutorpic = require("../../assets/images/Frame 26082857.png");
const messageIcon = require("../../assets/images/heroicons-outline_chat-alt.png");
const connectIcon = require("../../assets/images/mdi_account-plus-outline.png");
const coursepic = require("../../assets/images/Rectangle 636.png");
const liveclasspic = require("../../assets/images/Rectangle 637.png");

export default function TutorsProfile() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { tutorId } = params || {};

  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState(null); // 'specialization', 'about', 'charge'
  const [tempValue, setTempValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!tutorId) return;

    const unsubscribe = onSnapshot(doc(db, 'users', tutorId), (docSnap) => {
      if (docSnap.exists()) {
        setTutorData(docSnap.data());
      }
      setLoading(false);
    }, (error) => {
      if (auth.currentUser) {
        console.error("Error fetching tutor profile:", error);
      }
    });

    return unsubscribe;
  }, [tutorId]);

  const startChat = async () => {
    if (!auth.currentUser || !tutorId || !tutorData) return;

    const myId = auth.currentUser.uid;
    // Deterministic chat ID for 1-on-1
    const chatId = [myId, tutorId].sort().join('_');
    const chatRef = doc(db, 'privateChats', chatId);

    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      // Fetch my data for the chat metadata
      const mySnap = await getDoc(doc(db, 'users', myId));
      const myData = mySnap.data() || {};

      await setDoc(chatRef, {
        participants: [myId, tutorId],
        tutorId: tutorId,
        status: 'active',
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        message: 'Started a conversation',
        // Store metadata to make Connect.jsx display easier
        [`name_${myId}`]: myData.name || myData.username || 'Student',
        [`photo_${myId}`]: myData.profilePicture || null,
        [`name_${tutorId}`]: tutorData.name || tutorData.username || 'Tutor',
        [`photo_${tutorId}`]: tutorData.profilePicture || null,
        [`unread_${myId}`]: 0,
        [`unread_${tutorId}`]: 0,
      });
    }

    navigation.navigate('Messages', {
      roomId: chatId,
      name: tutorData.name || tutorData.username || 'Tutor',
      type: 'chats'
    });
  };

  const openEditModal = (field, currentVal) => {
    setEditField(field);
    setTempValue(currentVal || '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!auth.currentUser || auth.currentUser.uid !== tutorId) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', tutorId);
      const updateData = {};
      if (editField === 'charge') {
        updateData.charge = tempValue;
      } else if (editField === 'about') {
        updateData.about = tempValue;
      } else if (editField === 'specialization') {
        updateData.specialization = tempValue;
      }

      await setDoc(userRef, updateData, { merge: true });
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const isOwnProfile = auth.currentUser?.uid === tutorId;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1DE9B6" />
      </View>
    );
  }

  if (!tutorData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 18 }}>Tutor not found.</Text>
      </View>
    );
  }

  const displayName = tutorData.name || tutorData.username || "Adamu Matthew";
  const displaySpecialization = tutorData.specialization || "Economics";
  const displayAbout = tutorData.about || "Hello, I am an educator passionate about everything that involves calculations. My goal is to help students get the best grades in their tests and exams. Cheers!";
  const displayBio = displayAbout;
  const displayCharge = tutorData.charge || "0";
  const displayImage = tutorData.profilePicture ? { uri: tutorData.profilePicture } : tutorpic;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor's Profile</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <Image source={displayImage} style={styles.tutorpic} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{displayName}</Text>
            <View style={styles.editableRow}>
              <Text style={styles.subject}>Subject: {displaySpecialization}</Text>
              {isOwnProfile && (
                <TouchableOpacity onPress={() => openEditModal('specialization', displaySpecialization)}>
                  <AntDesign name="edit" size={16} color="#1DE9B6" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.chargeContainer}>
              <Text style={styles.chargeLabel}>Charge:</Text>
              <Text style={styles.chargeValue}>₦{displayCharge}</Text>
              {isOwnProfile && (
                <TouchableOpacity onPress={() => openEditModal('charge', displayCharge)}>
                  <AntDesign name="edit" size={16} color="#1DE9B6" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.bio}>{displayBio}</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.messageButton} onPress={startChat}>
            <Image source={messageIcon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* About Section with Dark Purple Background */}
        <View style={styles.aboutContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.aboutTitle}>About</Text>
            {isOwnProfile && (
              <TouchableOpacity onPress={() => openEditModal('about', displayAbout)}>
                <AntDesign name="edit" size={18} color="#1DE9B6" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.aboutText}>{displayAbout}</Text>
        </View>

        {/* Activities Section */}
        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>Activities</Text>
          <View style={styles.activitiesRow}>
            <View style={styles.activityItem}>
              <Image source={liveclasspic} style={styles.activityImage} />
              <Text style={styles.activityText}>Live Classes</Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        {!isOwnProfile && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Reachtutor', {
              tutorId: tutorId,
              name: displayName,
              specialization: displaySpecialization,
              about: displayAbout,
              charge: displayCharge,
              profilePicture: tutorData.profilePicture
            })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TextInput
              style={[styles.modalInput, editField === 'about' && { height: 100, textAlignVertical: 'top' }]}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={`Enter ${editField}`}
              placeholderTextColor="#999"
              multiline={editField === 'about'}
              keyboardType={editField === 'charge' ? 'numeric' : 'default'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: 5,
  },
  editableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chargeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  chargeLabel: {
    color: '#B0A3C0',
    fontSize: 14,
    marginRight: 5,
  },
  chargeValue: {
    color: '#1DE9B6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: '#008774',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008774',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  aboutContainer: {
    marginTop: 20,
    backgroundColor: '#1F1C2F',
    padding: 15,
    borderRadius: 10,
  },
  aboutTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutText: {
    color: '#B0A3C0',
    fontSize: 14,
    marginTop: 5,
  },
  activitiesContainer: {
    marginTop: 20,
    backgroundColor: '#1F1C2F',
    padding: 15,
    borderRadius: 10,
  },
  activitiesTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  activityItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  activityText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  continueButton: {
    backgroundColor: '#008774',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1F1C2F',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  modalInput: {
    backgroundColor: '#151320',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  saveBtn: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#008774',
    minWidth: 70,
    alignItems: 'center',
  },
  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
