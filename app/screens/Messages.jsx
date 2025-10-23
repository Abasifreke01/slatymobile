// app/screens/Messages.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db, auth, storage } from './firebaseConfig';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, serverTimestamp
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Messages() {
  const { params } = useRoute();
  const { roomId, name } = params || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();
  const typingTimeout = useRef(null);

  // Real-time message listener
  useEffect(() => {
    if (!roomId) return;

    const messagesRef = collection(db, 'communities', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
    });

    return unsubscribe;
  }, [roomId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'communities', roomId, 'messages'), {
      text: input.trim(),
      senderId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      type: 'text',
    });

    setInput('');
  };

  const handleTyping = (text) => {
    setInput(text);
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.cancelled) {
      setUploading(true);
      const response = await fetch(result.uri);
      const blob = await response.blob();
      const filename = `chatImages/${roomId}/${Date.now()}.jpg`;
      const imageRef = ref(storage, filename);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'communities', roomId, 'messages'), {
        imageUrl: downloadURL,
        senderId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        type: 'image',
      });

      setUploading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isMine = item.senderId === auth.currentUser.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.myMessage : styles.theirMessage
        ]}
      >
        {item.type === 'image' ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
    );
  };

  if (!roomId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', fontSize: 16 }}>Chat room not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name || 'Community Chat'}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && <Text style={styles.typing}>Typing...</Text>}
      {uploading && <ActivityIndicator size="small" color="#1DE9B6" />}

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={pickImage} style={styles.iconWrap}>
          <Text style={styles.icon}>📎</Text>
        </TouchableOpacity>

        <TextInput
          value={input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          onChangeText={handleTyping}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSend} style={styles.iconWrap}>
          <Text style={styles.icon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: '75%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1DE9B6',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: { color: '#fff' },
  image: { width: 200, height: 200, borderRadius: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 10,
    borderRadius: 30,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    color: '#fff',
    paddingHorizontal: 10,
  },
  iconWrap: { paddingHorizontal: 5 },
  icon: { fontSize: 20, color: '#1DE9B6' },
  typing: {
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 5,
    marginLeft: 5,
  },
});
