// app/screens/Messages.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { auth, db, storage } from '../firebaseConfig';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, serverTimestamp, updateDoc, doc, increment,
  where, getDocs, getDoc
} from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Messages() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { roomId, name, type } = params || {}; // type: 'chats' or 'communities'

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const flatListRef = useRef();
  const typingTimeout = useRef(null);

  const parentCollection = type === 'chats' ? 'privateChats' : 'communities';

  // Real-time message listener
  useEffect(() => {
    if (!roomId || !auth.currentUser) return;

    // Fetch current user data for sending info
    const fetchUserData = async () => {
      try {
        if (!auth.currentUser) return;
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        if (auth.currentUser) console.error("Error fetching user data in messages:", error);
      }
    };
    fetchUserData();

    // Fetch chat data/participants for unread logic
    const fetchChatData = async () => {
      try {
        if (!auth.currentUser) return;
        const docSnap = await getDoc(doc(db, parentCollection, roomId));
        if (docSnap.exists()) {
          setChatData(docSnap.data());
        }
      } catch (error) {
        if (auth.currentUser) console.error("Error fetching chat data:", error);
      }
    };
    fetchChatData();

    // Clear unread count when entering the room
    const clearUnread = async () => {
      try {
        if (!auth.currentUser) return;
        const updateObj = {};
        if (type === 'chats') {
          updateObj[`unread_${auth.currentUser.uid}`] = 0;
        } else {
          updateObj.unread = 0;
        }
        await updateDoc(doc(db, parentCollection, roomId), updateObj);
      } catch (error) {
        if (auth.currentUser) console.error("Error clearing unread count:", error);
      }
    };
    clearUnread();

    const messagesRef = collection(db, parentCollection, roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter out messages from blocked users
      const blockedUsers = userData?.blockedUsers || [];
      const filteredData = data.filter(msg => !blockedUsers.includes(msg.senderId));
      setMessages(filteredData);
    }, (error) => {
      if (auth.currentUser) console.error("Error listening to messages:", error);
    });

    return unsubscribe;
  }, [roomId, type, userData?.blockedUsers, auth.currentUser]);

  const handleReport = async (item) => {
    Alert.alert(
      "Report Message",
      "Are you sure you want to report this message for violating our community guidelines?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          onPress: async () => {
            try {
              await addDoc(collection(db, 'reports'), {
                reportedBy: auth.currentUser.uid,
                messageId: item.id,
                messageText: item.text || item.imageUrl || "Media",
                senderId: item.senderId,
                roomId: roomId,
                roomType: type,
                createdAt: serverTimestamp(),
                status: 'pending'
              });
              Alert.alert("Thank You", "Your report has been submitted for admin review.");
            } catch (error) {
              console.error("Report error:", error);
              Alert.alert("Error", "Could not submit report.");
            }
          }
        }
      ]
    );
  };

  const handleBlock = async (item) => {
    if (item.senderId === auth.currentUser.uid) return;

    Alert.alert(
      "Block User",
      `Are you sure you want to block ${item.senderName}? You will no longer see their messages.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              const userRef = doc(db, 'users', auth.currentUser.uid);
              const currentBlocked = userData?.blockedUsers || [];
              if (!currentBlocked.includes(item.senderId)) {
                await updateDoc(userRef, {
                  blockedUsers: [...currentBlocked, item.senderId]
                });
                setUserData(prev => ({ ...prev, blockedUsers: [...currentBlocked, item.senderId] }));
                Alert.alert("Blocked", "User has been blocked.");
              }
            } catch (error) {
              console.error("Block error:", error);
              Alert.alert("Error", "Could not block user.");
            }
          }
        }
      ]
    );
  };

  const showModerationOptions = (item) => {
    if (item.senderId === auth.currentUser.uid) return;
    Alert.alert(
      "Moderation Options",
      `Choose an action for ${item.senderName || 'this user'}.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Report Message", onPress: () => handleReport(item) },
        { text: "Block User", style: "destructive", onPress: () => handleBlock(item) },
      ]
    );
  };

  const startPrivateChat = async (otherUser) => {
    if (otherUser.id === auth.currentUser.uid) return;

    const fallbackName = otherUser.name || "Learner_" + otherUser.id?.substring(0, 4);
    const fallbackImage = otherUser.image || null;

    try {
      // 1. Check if chat already exists
      const q = query(
        collection(db, 'privateChats'),
        where('participants', 'array-contains', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      let existingChat = snapshot.docs.find(doc => doc.data().participants.includes(otherUser.id));

      if (existingChat) {
        navigation.navigate('Messages', {
          roomId: existingChat.id,
          name: fallbackName,
          type: 'chats'
        });
      } else {
        // 2. Create new chat
        const newChatRef = await addDoc(collection(db, 'privateChats'), {
          participants: [auth.currentUser.uid, otherUser.id],
          status: 'active',
          otherUserName: fallbackName,
          otherUserPhoto: fallbackImage,
          lastMessageAt: serverTimestamp(),
          message: 'Chat started'
        });
        navigation.navigate('Messages', {
          roomId: newChatRef.id,
          name: fallbackName,
          type: 'chats'
        });
      }
    } catch (error) {
      console.error("Error starting private chat:", error);
      Alert.alert("Error", "Could not start chat.");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, parentCollection, roomId, 'messages'), {
      text: input.trim(),
      senderId: auth.currentUser.uid,
      senderName: userData?.name || userData?.username || "Learner",
      senderImage: userData?.profilePicture || null,
      createdAt: serverTimestamp(),
      type: 'text',
    });

    const updateObj = {
      message: input.trim(),
      lastMessageAt: serverTimestamp()
    };

    if (type === 'chats' && chatData?.participants) {
      const otherId = chatData.participants.find(uid => uid !== auth.currentUser.uid);
      if (otherId) {
        updateObj[`unread_${otherId}`] = increment(1);
      }
    } else if (type === 'communities') {
      updateObj.unread = increment(1);
    }

    await updateDoc(doc(db, parentCollection, roomId), updateObj);
    setInput('');
  };

  const startVideoCall = async () => {
    if (type !== 'chats') {
      Alert.alert("Feature unavailable", "Video calls are only available in private sessions.");
      return;
    }

    const meetingRoom = `Slaty_Call_${roomId}`;

    // Send a message indicating class started
    await addDoc(collection(db, parentCollection, roomId, 'messages'), {
      text: "Live Class Started",
      senderId: auth.currentUser.uid,
      senderName: userData?.name || "Tutor",
      createdAt: serverTimestamp(),
      type: 'call',
      roomName: meetingRoom
    });

    navigation.navigate('VideoCall', { roomName: meetingRoom });
  };

  const handleTyping = (text) => {
    setInput(text);
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
  };

  const finishGuidance = async () => {
    Alert.alert(
      "Finish Guidance",
      "Are you sure you want to end this tutoring session? This will close the chat for both of you.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Finish",
          onPress: async () => {
            try {
              await updateDoc(doc(db, parentCollection, roomId), {
                status: 'closed',
                message: 'Session Ended',
                lastMessageAt: serverTimestamp(),
              });

              await addDoc(collection(db, parentCollection, roomId, 'messages'), {
                text: "🏁 The tutor has finished providing guidance. This session is now closed.",
                senderId: 'system',
                senderName: 'System',
                createdAt: serverTimestamp(),
                type: 'system',
              });

              setChatData(prev => ({ ...prev, status: 'closed' }));
              Alert.alert("Success", "Guidance finished and chat closed.");
            } catch (error) {
              console.error("Error closing session:", error);
              Alert.alert("Error", "Could not close session.");
            }
          }
        }
      ]
    );
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
      <View style={[styles.messageWrapper, isMine ? styles.myWrapper : styles.theirWrapper]}>
        {!isMine && (
          <TouchableOpacity
            onPress={() => startPrivateChat({ id: item.senderId, name: item.senderName, image: item.senderImage })}
            style={styles.avatarTouch}
          >
            {item.senderImage ? (
              <Image source={{ uri: item.senderImage }} style={styles.chatAvatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </TouchableOpacity>
        )}

        <View style={styles.bubbleColumn}>
          {!isMine && (
            <View style={styles.senderHeader}>
              <Text style={styles.senderNameLabel}>{item.senderName}</Text>
              {!isMine && (
                <TouchableOpacity onPress={() => showModerationOptions(item)} style={styles.moreOptionsBtn}>
                  <Text style={styles.moreOptionsText}>⋮</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <TouchableOpacity
            onLongPress={() => {
              if (isMine) return;
              showModerationOptions(item);
            }}
            style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
          >
            {item.type === 'image' ? (
              <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
            ) : item.type === 'call' ? (
              <View style={styles.callBubble}>
                <Text style={styles.callText}>🎥 Live Class Started</Text>
                {chatData?.status !== 'closed' ? (
                  <TouchableOpacity
                    style={styles.joinButton}
                    onPress={() => navigation.navigate('VideoCall', { roomName: item.roomName })}
                  >
                    <Text style={styles.joinText}>Join Now</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={{ color: '#666', fontSize: 12 }}>Session Ended</Text>
                )}
              </View>
            ) : item.type === 'system' ? (
              <Text style={styles.systemMessageText}>{item.text}</Text>
            ) : (
              <Text style={[styles.messageText, isMine && styles.myMessageText]}>{item.text}</Text>
            )}
          </TouchableOpacity>
        </View>
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{name || 'Chat'}</Text>

        <View style={styles.headerActions}>
          {type === 'chats' && chatData?.status === 'active' && auth.currentUser.uid === chatData.tutorId && (
            <TouchableOpacity onPress={finishGuidance} style={styles.finishBtn}>
              <Text style={styles.finishBtnText}>Finish</Text>
            </TouchableOpacity>
          )}

          {type === 'chats' && chatData?.status !== 'closed' ? (
            <>
              <TouchableOpacity onPress={startVideoCall} style={styles.videoBtn}>
                <Text style={styles.videoIcon}>📹</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const otherParticipantId = chatData?.participants?.find(uid => uid !== auth.currentUser.uid);
                  if (otherParticipantId) {
                    showModerationOptions({
                      senderId: otherParticipantId,
                      senderName: name
                    });
                  } else {
                    Alert.alert("Moderation", "Use the message bubble options to report or block users in this community.");
                  }
                }}
                style={styles.moreHeaderBtn}
              >
                <Text style={styles.moreHeaderIcon}>⋮</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && chatData?.status !== 'closed' && <Text style={styles.typing}>Typing...</Text>}
      {uploading && <ActivityIndicator size="small" color="#1DE9B6" />}

      {
        type === 'chats' && chatData?.status === 'closed' ? (
          <View style={styles.closedSessionNotice}>
            <Text style={styles.closedSessionText}>This session has ended. To continue, please make a new payment from the tutor's profile.</Text>
          </View>
        ) : (
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
              <Text style={[styles.icon, { color: input.trim() ? '#1DE9B6' : '#666' }]}>➤</Text>
            </TouchableOpacity>
          </View>
        )
      }
    </View >
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingTop: 40, // Account for status bar
  },
  messageWrapper: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 4,
    width: '100%',
  },
  myWrapper: {
    justifyContent: 'flex-end',
  },
  theirWrapper: {
    justifyContent: 'flex-start',
  },
  avatarTouch: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  chatAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#333',
  },
  avatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#444',
  },
  bubbleColumn: {
    maxWidth: '75%',
  },
  senderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    width: '100%',
  },
  senderNameLabel: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
  moreOptionsBtn: {
    paddingHorizontal: 8,
  },
  moreOptionsText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: '#1DE9B6',
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    color: 'white',
    fontSize: 15,
  },
  myMessageText: {
    color: 'black',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#fff',
    backgroundColor: '#252525',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  iconWrap: { padding: 5 },
  iconText: { fontSize: 20, color: '#1DE9B6' },
  typing: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
    paddingLeft: 20,
    marginBottom: 5,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    padding: 5,
    width: 40,
  },
  backIcon: {
    color: '#1DE9B6',
    fontSize: 24,
  },
  videoBtn: {
    padding: 5,
    width: 35,
    alignItems: 'flex-end',
  },
  videoIcon: {
    fontSize: 22,
  },
  moreHeaderBtn: {
    padding: 5,
    width: 35,
    alignItems: 'flex-end',
  },
  moreHeaderIcon: {
    color: '#1DE9B6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  finishBtn: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 8,
  },
  finishBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closedSessionNotice: {
    backgroundColor: '#333',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  closedSessionText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 14,
  },
  systemMessageText: {
    color: '#aaa',
    fontStyle: 'italic',
    fontSize: 13,
    textAlign: 'center',
  },
  callBubble: {
    alignItems: 'center',
    padding: 5,
  },
  callText: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#1DE9B6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  joinText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
