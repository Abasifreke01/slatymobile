import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const hamburger = require('../../assets/images/material-symbols_menu-rounded.png');
const samplepic1 = require('../../assets/images/3d_avatar_12.png');

export default function Connect() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('chats');
  const [modalVisible, setModalVisible] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCommunities(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  const handleCreateCommunity = async () => {
    if (!communityName.trim()) return;
    try {
      await addDoc(collection(db, 'communities'), {
        name: communityName.trim(),
        createdAt: serverTimestamp(),
        message: 'Welcome to your new community!',
        image: null, // Optional default value
        unread: 0,
      });
      setCommunityName('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const filteredConnections = communities.filter(conn =>
    conn.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderConnection = ({ item }) => (
    <TouchableOpacity
      style={styles.connectionContainer}
      onPress={() => navigation.navigate('Messages', { name: item.name, communityId: item.id })}
    >
      <Image source={samplepic1} style={styles.avatar} />
      <View style={styles.connectionInfo}>
        <Text style={styles.connectionName}>{item.name}</Text>
        <Text style={[styles.connectionMessage]}>
          {item.message || 'Start a conversation'}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={filteredConnections}
        renderItem={renderConnection}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Connections</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={hamburger} style={styles.hamburgerIcon} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchBar}
              placeholder="Search Connections"
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={setSearchText}
            />

            <View style={styles.chatsCommunitiesContainer}>
              <TouchableOpacity onPress={() => setActiveTab('chats')} style={styles.tab}>
                <Text style={[styles.sectionTitle, activeTab === 'chats' && styles.activeTab]}>Chats</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setActiveTab('communities');
                navigation.navigate('Communities');
              }} style={styles.tab}>
                <Text style={[styles.sectionTitle, activeTab === 'communities' && styles.activeTab]}>Communities</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activeTabIndicator}>
              <View
                style={[
                  styles.activeTabLine,
                  { backgroundColor: activeTab === 'chats' ? '#1DE9B6' : 'white' },
                ]}
              />
              <View
                style={[
                  styles.activeTabLine,
                  { backgroundColor: activeTab === 'communities' ? '#1DE9B6' : 'white' },
                ]}
              />
            </View>

            <View style={styles.spacing} />
          </>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Community</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter community name"
              value={communityName}
              onChangeText={setCommunityName}
            />
            <Button title="Create" onPress={handleCreateCommunity} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  hamburgerIcon: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  searchBar: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  chatsCommunitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tab: {
    width: '50%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  activeTab: {
    color: '#1DE9B6',
  },
  activeTabIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 2,
    marginBottom: 10,
  },
  activeTabLine: {
    width: '50%',
    height: 2,
  },
  spacing: {
    height: 10,
  },
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  connectionMessage: {
    fontSize: 14,
    color: '#aaa',
  },
  unreadBadge: {
    backgroundColor: '#1DE9B6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
