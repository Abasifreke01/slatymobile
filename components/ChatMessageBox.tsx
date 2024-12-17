import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import { isSameDay, isSameUser } from 'react-native-gifted-chat/lib/utils';
import {Colors} from '@/constants/Colors';

type ChatMessageBoxProps = {
  setReplyOnSwipeOpen: (message: IMessage) => void;
  updateRowRef: (ref: any) => void;
} & MessageProps<IMessage>;

const ChatMessageBox = ({
  setReplyOnSwipeOpen,
  updateRowRef,
  ...props
}: ChatMessageBoxProps) => {
  const [message, setMessage] = useState('');

  const isNextMyMessage =
    props.currentMessage &&
    props.nextMessage &&
    isSameUser(props.currentMessage, props.nextMessage) &&
    isSameDay(props.currentMessage, props.nextMessage);

  const renderRightAction = (progressAnimatedValue: Animated.AnimatedInterpolation<any>) => {
    const size = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 100],
      outputRange: [0, 1, 1],
    });
    const trans = progressAnimatedValue.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 12, 20],
    });

    return (
      <Animated.View
        style={[
          styles.swipeContainer,
          { transform: [{ scale: size }, { translateX: trans }] },
          isNextMyMessage ? styles.defaultBottomOffset : styles.bottomOffsetNext,
          props.position === 'right' && styles.leftOffsetValue,
        ]}>
        <View style={styles.replyImageWrapper}>
          <MaterialCommunityIcons name="reply-circle" size={26} color={Colors.gray} />
        </View>
      </Animated.View>
    );
  };

  const onSwipeOpenAction = () => {
    if (props.currentMessage) {
      setReplyOnSwipeOpen({ ...props.currentMessage });
    }
  };

  const handleRecord = () => {
    console.log('Recording...');
    // Implement audio recording functionality
  };

  const handleShareDocument = () => {
    console.log('Opening document picker...');
    // Implement document sharing functionality
  };

  const handleSendMessage = () => {
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Existing swipeable message */}
      <Swipeable
        ref={updateRowRef}
        friction={2}
        rightThreshold={40}
        renderLeftActions={renderRightAction}
        onSwipeableWillOpen={onSwipeOpenAction}>
        <Message {...props} />
      </Swipeable>

      {/* New message input */}
      <View style={styles.messageInputContainer}>
        <TouchableOpacity onPress={handleShareDocument} style={styles.iconButton}>
          <Ionicons name="document-outline" size={24} color="#00FFA3" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Message"
          placeholderTextColor="#00FFA3"
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity onPress={handleRecord} style={styles.iconButton}>
          <MaterialCommunityIcons name="microphone-outline" size={24} color="#00FFA3" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSendMessage} style={styles.iconButton}>
          <Ionicons name="send" size={24} color="#00FFA3" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#221F1E', // Matches the dark theme
  },
  swipeContainer: {
    width: 40,
  },
  replyImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultBottomOffset: {
    marginBottom: 2,
  },
  bottomOffsetNext: {
    marginBottom: 10,
  },
  leftOffsetValue: {
    marginLeft: 16,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 25,
    margin: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    color: '#00FFA3',
    marginHorizontal: 10,
    fontSize: 16,
  },
  iconButton: {
    padding: 8,
  },
});

export default ChatMessageBox;
