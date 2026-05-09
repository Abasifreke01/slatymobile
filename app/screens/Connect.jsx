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
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const hamburger = require('../../assets/images/material-symbols_menu-rounded.png');
const samplepic1 = require('../../assets/images/3d_avatar_12.png');

export default function Connect() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('communities');
  const [modalVisible, setModalVisible] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [communities, setCommunities] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) {
      setCommunities([]);
      setPrivateChats([]);
      return;
    }

    // Listen for Communities
    const qComm = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
    const unsubscribeComm = onSnapshot(qComm, (snapshot) => {
      setCommunities(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }, (error) => {
      if (auth.currentUser) console.error("Error listening to community counts:", error);
    });

    // Listen for Private Chats
    const qChats = query(
      collection(db, 'privateChats'),
      where('participants', 'array-contains', auth.currentUser.uid)
    );
    const unsubscribeChats = onSnapshot(qChats, (snapshot) => {
      setPrivateChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }, (error) => {
      if (auth.currentUser) console.error("Error listening to private chat counts:", error);
    });

    return () => {
      unsubscribeComm();
      unsubscribeChats();
    };
  }, [auth.currentUser]);

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

  const filteredConnections = (activeTab === 'chats' ? privateChats : communities).filter(conn => {
    const name = activeTab === 'chats'
      ? (conn.otherUserName || 'Private Chat')
      : (conn.name || 'Community');
    return name.toLowerCase().includes(searchText.toLowerCase());
  });

  const renderConnection = ({ item }) => {
    const isChat = activeTab === 'chats';
    const displayName = isChat
      ? (item.otherUserName || 'Tutor')
      : (item.name || 'Community');
    const displayImage = isChat && item.otherUserPhoto
      ? { uri: item.otherUserPhoto }
      : samplepic1;

    if (!isChat) {
      // Stack Overflow UI for Communities
      return (
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
              onPress={() => navigation.navigate('Messages', {
                name: displayName,
                roomId: item.id,
                type: 'communities'
              })}
            >
              <Text style={styles.communityName}>{displayName}</Text>
            </TouchableOpacity>
            <Text style={styles.description} numberOfLines={2}>
              Welcome to the {displayName} community. Share resources, ask questions, and collaborate with your peers!
            </Text>

            {/* Tags */}
            <View style={styles.tagContainer}>
              <View style={styles.tag}><Text style={styles.tagText}>#education</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>#slaty</Text></View>
            </View>

            {/* Bottom Metadata */}
            <View style={styles.metadataRow}>
              <View style={styles.ownerInfo}>
                <View style={styles.avatarPlaceholder} />
                <Text style={styles.ownerText}>Owner: {item.ownerId?.substring(0, 5) || "User"}</Text>
                <Text style={styles.timeText}> • {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    // Default UI for Private Chats
    return (
      <TouchableOpacity
        style={styles.connectionContainer}
        onPress={() => navigation.navigate('Messages', {
          name: displayName,
          roomId: item.id,
          type: 'chats'
        })}
      >
        <Image source={displayImage} style={styles.avatar} />
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionName}>{displayName}</Text>
          <Text style={[styles.connectionMessage]} numberOfLines={1}>
            {item.message || 'Start a conversation'}
          </Text>
        </View>
        {((isChat && item[`unread_${auth.currentUser?.uid}`] > 0)) && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>
              {item[`unread_${auth.currentUser?.uid}`]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
    backgroundColor: '#151320',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
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
    height: 45,
    backgroundColor: '#1f1c2f',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    color: 'white',
    borderWidth: 1,
    borderColor: '#333',
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
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
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
  // Stack Overflow Style Additions
  communityRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: '#1f1c2f',
    padding: 25,
    borderRadius: 12,
    width: '85%',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  modalInput: {
    height: 45,
    backgroundColor: '#151320',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    color: 'white',
  },
});
