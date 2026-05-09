// app/screens/Communities.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function Communities({ navigation }) {
  const [communities, setCommunities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      setCommunities([]);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'communities'), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(data);
    }, (error) => {
      if (auth.currentUser) console.error("Error listening to communities:", error);
    });

    return unsubscribe;
  }, [auth.currentUser]);

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
    <View style={styles.communityRow}>
      {/* Left Column: Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>members</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>active</Text>
        </View>
      </View>

      {/* Main Column: Content */}
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Messages', { roomId: item.id, name: item.name })}
        >
          <Text style={styles.communityName}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={styles.description} numberOfLines={2}>
          Welcome to the {item.name} community. Share resources, ask questions, and collaborate with your peers!
        </Text>

        {/* Tags */}
        <View style={styles.tagContainer}>
          <View style={styles.tag}><Text style={styles.tagText}>#education</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>#slaty</Text></View>
        </View>

        {/* Bottom Metadata: Owner/Date */}
        <View style={styles.metadataRow}>
          <View style={styles.ownerInfo}>
            <View style={styles.avatarPlaceholder} />
            <Text style={styles.ownerText}>Owner: {item.ownerId?.substring(0, 5) || "User"}</Text>
            <Text style={styles.timeText}> • {new Date((item.createdAt?.seconds * 1000) || Date.now()).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.header}>All Communities</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.createBtnText}>Create Community</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Filter by community name..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={communities}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No communities found.</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

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
  container: { flex: 1, backgroundColor: '#151320', padding: 16 },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  header: { fontSize: 26, color: 'white', fontWeight: 'bold' },
  searchBar: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#1f1c2f',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    borderWidth: 1,
    borderColor: '#333',
  },
  communityRow: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  statsContainer: {
    width: 70,
    alignItems: 'flex-end',
    marginRight: 15,
    gap: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
  },
  communityName: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#00877433',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#1DE9B6',
    fontSize: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 6,
    borderRadius: 6,
  },
  avatarPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: '#555',
    borderRadius: 4,
    marginRight: 6,
  },
  ownerText: {
    color: '#3498db',
    fontSize: 12,
  },
  timeText: {
    color: '#999',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
  },
  empty: { color: 'gray', textAlign: 'center', marginTop: 20 },
  createBtn: { backgroundColor: '#1DE9B6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
  createBtnText: { color: 'black', textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: '#1f1c2f', padding: 25, borderRadius: 12, width: '85%', borderWidth: 1, borderColor: '#333' },
  modalTitle: { fontSize: 22, color: 'white', marginBottom: 15, fontWeight: 'bold' },
  input: { backgroundColor: '#151320', borderColor: '#333', borderWidth: 1, padding: 12, borderRadius: 8, color: 'white', marginBottom: 15 },
  modalButton: { backgroundColor: '#1DE9B6', padding: 12, borderRadius: 8 },
  modalButtonText: { textAlign: 'center', color: '#000', fontWeight: 'bold' },
  cancelText: { textAlign: 'center', marginTop: 15, color: '#e74c3c', fontWeight: 'bold' },
});
