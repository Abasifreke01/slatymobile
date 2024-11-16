import { View, Text, Image, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const hamburger = require("../../assets/images/material-symbols_menu-rounded.png");
const samplepic1 = require("../../assets/images/3d_avatar_12.png");
const samplepic2 = require("../../assets/images/3d_avatar_16.png");
const samplepic3 = require("../../assets/images/24.png");
const samplepic4 = require("../../assets/images/3d_avatar_16.png");

const connections = [
  { id: '1', name: 'University Of Benin 016 group', image: samplepic1, message: 'Hey, how are you?', time: '10:30 AM', unread: 3 },
  { id: '2', name: 'Akwa Ibom State University 020 group', image: samplepic2, message: 'Are we still on for today?', time: '9:15 AM', unread: 0 },
  { id: '3', name: 'Business Management Department Nigeria', image: samplepic3, message: 'Let’s catch up!', time: 'Yesterday', unread: 1 },
  { id: '4', name: 'David', image: samplepic4, message: 'Can you send me the files?', time: '1:05 PM', unread: 5 },
];

export default function Communities({ navigation }) {
  const [activeTab, setActiveTab] = useState('chats');

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
    navigation.navigate('Connect'); // Navigate to Connect screen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connections</Text>
        <Image source={hamburger} style={styles.hamburgerIcon} />
      </View>
      
      {/* Search Bar */}
      <TextInput 
        style={styles.searchBar}
        placeholder="Search Connections"
        placeholderTextColor="#aaa"
      />

      {/* Chats and Communities Section */}
      <View style={styles.chatsCommunitiesContainer}>
        <TouchableOpacity onPress={goToChats} style={styles.tab}>
          <Text style={[styles.sectionTitle, activeTab === 'chats' && styles.activeTab]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToCommunities} style={styles.tab}>
          <Text style={[styles.communityTitle, activeTab === 'communities' && styles.activeTab]}>Communities</Text>
        </TouchableOpacity>
      </View>
      
      {/* Active Tab Indicator */}
      <View style={styles.activeTabIndicator}>
        <View style={[styles.activeTabLine, { backgroundColor: activeTab === 'chats' ? '#1DE9B6' : 'white' }]} />
        <View style={[styles.activeTabLine, { backgroundColor: activeTab === 'communities' ? '#1DE9B6' : 'white' }]} />
      </View>

      {/* Space between sections */}
      <View style={styles.spacing} />

      <FlatList
        data={connections}
        renderItem={renderConnection}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
});
