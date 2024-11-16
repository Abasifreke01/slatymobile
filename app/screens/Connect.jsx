import { View, Text, Image, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState } from 'react';

const hamburger = require("../../assets/images/material-symbols_menu-rounded.png");
const samplepic1 = require("../../assets/images/3d_avatar_12.png");
const samplepic2 = require("../../assets/images/3d_avatar_16.png");
const samplepic3 = require("../../assets/images/24.png");
const samplepic4 = require("../../assets/images/3d_avatar_16.png");

const connections = [
  { id: '1', name: 'Alice', image: samplepic1, message: 'Hey, how are you?', time: '10:30 AM', unread: 3 },
  { id: '2', name: 'Bob', image: samplepic2, message: 'Are we still on for today?', time: '9:15 AM', unread: 0 },
  { id: '3', name: 'Charlie', image: samplepic3, message: 'Let’s catch up!', time: 'Yesterday', unread: 1 },
  { id: '4', name: 'David', image: samplepic4, message: 'Can you send me the files?', time: '1:05 PM', unread: 5 },
];

export default function Connect({ navigation }) {
  const [activeTab, setActiveTab] = useState('chats');
  const [modalVisible, setModalVisible] = useState(false);
  const [communityName, setCommunityName] = useState('');

  const renderConnection = ({ item }) => (
    <TouchableOpacity 
      style={styles.connectionContainer}
      onPress={() => navigation.navigate('Messages', { name: item.name })}
    >
      <Image source={item.image} style={styles.avatar} />
      <View style={styles.connectionInfo}>
        <Text style={styles.connectionName}>{item.name}</Text>
        <Text style={styles.connectionMessage}>{item.message}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const goToCommunities = () => {
    setActiveTab('communities');
    navigation.navigate('Communities');
  };

  const goToChats = () => {
    setActiveTab('chats');
  };

  const handleCreateCommunity = () => {
    // Logic to create community (e.g., API call)
    console.log(`Creating community: ${communityName}`);
    setCommunityName(''); // Clear the input
    setModalVisible(false); // Close the modal
  };

  return (
    <ScrollView style={styles.container}>
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
      />

      <View style={styles.chatsCommunitiesContainer}>
        <TouchableOpacity onPress={goToChats} style={styles.tab}>
          <Text style={[styles.sectionTitle, activeTab === 'chats' && styles.activeTab]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToCommunities} style={styles.tab}>
          <Text style={[styles.communityTitle, activeTab === 'communities' && styles.activeTab]}>Communities</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.activeTabIndicator}>
        <View style={[styles.activeTabLine, { backgroundColor: activeTab === 'chats' ? '#1DE9B6' : 'white' }]} />
        <View style={[styles.activeTabLine, { backgroundColor: activeTab === 'communities' ? '#1DE9B6' : 'white' }]} />
      </View>

      <View style={styles.spacing} />

      <FlatList
        data={connections}
        renderItem={renderConnection}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal for creating community */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  chatsCommunitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    width: '50%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  communityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  activeTab: {
    color: '#1DE9B6', // Change color when active
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
    height: 20, // Adjust this value to create more or less space
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
    fontSize: 18,
    color: 'white',
  },
  connectionMessage: {
    fontSize: 14,
    color: 'white',
  },
  messageTime: {
    fontSize: 12,
    color: '#aaa', // Lighter color for time
  },
  unreadBadge: {
    backgroundColor: '#1DE9B6', // Updated to your specified color
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
