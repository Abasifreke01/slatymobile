import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native';

const attach = require("../../assets/images/attach.png");
const send = require("../../assets/images/send.png");
const emoji = require("../../assets/images/emoji.png");
const microphone = require("../../assets/images/microphone.png");

export default function Messages({ route }) {
  const { name } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Date.now().toString(), text: newMessage },
      ]);
      setNewMessage('');
      Keyboard.dismiss(); // Dismiss the keyboard
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages with {name}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Auto-scroll to bottom
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={() => {/* Handle attach action */}} style={styles.iconContainer}>
          <Image source={attach} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {/* Handle emoji action */}} style={styles.iconContainer}>
          <Image source={emoji} style={styles.icon} />
        </TouchableOpacity>
        
        {newMessage.length === 0 ? (
          <TouchableOpacity onPress={() => {/* Handle microphone action */}} style={styles.iconContainer}>
            <Image source={microphone} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSendMessage} style={styles.iconContainer}>
            <Image source={send} style={styles.sendIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  messageList: {
    flexGrow: 1,
    marginBottom: 10,
  },
  messageContainer: {
    backgroundColor: '#1DE9B6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  messageText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#1AD4A6',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 50, // Space for icons on the left
    paddingRight: 50, // Space for the icon on the right
    backgroundColor: 'black',
    color: 'white',
  },
  iconContainer: {
    marginHorizontal: 5, // Space between icons
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});
