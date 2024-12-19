import ChatMessageBox from '@/components/ChatMessageBox';
import ReplyMessageBar from '@/components/ReplyMessageBar';
import {Colors} from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, View , Image, Text} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import avatar5 from '@/assets/images/3d_avatar_24-1.png';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import messageData from '@/assets/data/messages.json';

const Each = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);

  useEffect(() => {
    setMessages([
      ...messageData.map((message) => {
        return {
          _id: message.id,
          text: message.msg,
          createdAt: new Date(message.date),
          user: {
            _id: message.from,
            name: message.from ? 'You' : 'Bob',
          },
        };
      }),
      {
        _id: 0,
        system: true,
        text: 'All your base are belong to us',
        createdAt: new Date(),
        user: {
          _id: 0,
          name: 'Bot',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages: any[]) => GiftedChat.append(previousMessages, messages));
  }, []);

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{ backgroundColor: Colors.background }}
      renderActions={() => (
        <View style={{ height: 44, justifyContent: 'center', alignItems: 'center', left: 5 }}>
          <Ionicons name="add" color={Colors.primary} size={28} />
        </View>
      )}
    />
  )

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  // useEffect(() => {
  //   if (replyMessage && swipeableRowRef.current) {
  //     swipeableRowRef.current.close();
  //     swipeableRowRef.current = null;
  //   }
  // }, [replyMessage]);

  return (
    // <ImageBackground
    //   source={require('@/assets/images/pattern.png')}
    //   style={{
    //     flex: 1,
    //     backgroundColor: Colors.background,
    //     marginBottom: insets.bottom,
    //   }}>
    
    <GiftedChat
    messages={messages}
    onSend={(messages: any) => onSend(messages)}
    onInputTextChanged={setText}
    user={{
      _id: 1,
    }}
    renderSystemMessage={(props) => (
      <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
    )}
    bottomOffset={insets.bottom}
    renderAvatar={null}
    maxComposerHeight={100}
    textInputProps={styles.composer}
    renderBubble={(props) => (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: '#000', // Default text color for sent messages
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0', // Standard background for received messages
          },
          right: {
            backgroundColor: '#fff', // Standard background for sent messages
          },
        }}
      />
    )}
    renderSend={(props) => (
      <View
        style={{
          height: 44,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          paddingHorizontal: 14,
        }}>
          {text !== '' && (
            <Send
              {...props}
              containerStyle={{
                justifyContent: 'center',
              }}>
              <Ionicons name="send" color={Colors.primary} size={28} />
            </Send>
          )}
      </View>
    )}
    renderInputToolbar={renderInputToolbar}
    renderChatFooter={() => (
      replyMessage && (
        <ReplyMessageBar clearReply={() => setReplyMessage(null)} message={replyMessage} />
      )
    )}
    onLongPress={(context, message) => setReplyMessage(message)}
    renderMessage={(props) => (
      <ChatMessageBox
        {...props}
        setReplyOnSwipeOpen={setReplyMessage}
        updateRowRef={updateRowRef}
      />
    )}
  />
);
};

const styles = StyleSheet.create({
  composer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
});

export default Each;
