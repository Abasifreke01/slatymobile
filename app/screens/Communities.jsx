// app/screens/Communities.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export default function Communities({ navigation }) {
  const [communities, setCommunities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'communities'), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(data);
    });

    return unsubscribe;
  }, []);

  const handleCreateCommunity = async () => {
    if (!newCommunityName.trim()) return Alert.alert("Name required", "Enter a community name.");

    await addDoc(collection(db, 'communities'), {
      name: newCommunityName.trim(),
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setNewCommunityName('');
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.communityItem}
      onPress={() => navigation.navigate('Messages', { roomId: item.id, name: item.name })}
    >
      <Text style={styles.communityText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Communities</Text>

      <FlatList
        data={communities}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No communities found.</Text>}
      />

      <TouchableOpacity style={styles.createBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.createBtnText}>+ Create Community</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Community</Text>
            <TextInput
              placeholder="Enter name..."
              style={styles.input}
              value={newCommunityName}
              onChangeText={setNewCommunityName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleCreateCommunity}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', padding: 16 },
  header: { fontSize: 24, color: 'white', marginBottom: 10 },
  communityItem: { backgroundColor: '#1DE9B6', padding: 16, borderRadius: 8, marginVertical: 8 },
  communityText: { color: 'black', fontSize: 18 },
  empty: { color: 'gray', textAlign: 'center', marginTop: 20 },
  createBtn: { backgroundColor: '#1AD4A6', padding: 14, borderRadius: 8, marginTop: 20 },
  createBtnText: { color: 'black', textAlign: 'center', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 10 },
  modalButton: { backgroundColor: '#1DE9B6', padding: 10, borderRadius: 6 },
  modalButtonText: { textAlign: 'center', color: '#000' },
  cancelText: { textAlign: 'center', marginTop: 10, color: 'red' },
});
