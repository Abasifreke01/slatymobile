import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ChatRoom = () => {
  return (
    <View style={styles.container}>
      {/* Chat Messages */}
      <View style={styles.chatContainer}>
        <View style={styles.messageSent}>
          <View style={styles.messageContentSent}>
            <Text style={styles.messageText}>Good morning everyone.</Text>
            <Text style={styles.messageTime}>1:30PM</Text>
          </View>
        </View>
        <View style={styles.message}>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>Glad to be here.</Text>
            <Text style={styles.messageTime}>1:32PM</Text>
          </View>
        </View>
        <View style={styles.message}>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>
              Happy to be here.
              {"\n"}I can’t hear the audio clearly.
            </Text>
            <Text style={styles.messageTime}>1:32PM</Text>
          </View>
        </View>

        <View style={styles.message}>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>Good morning ma.</Text>
            <Text style={styles.messageTime}>1:32PM</Text>
          </View>
        </View>
      </View>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.innerContainer}>
          {/* Left Icon */}
          <TouchableOpacity style={styles.iconLeft}>
            <FontAwesome name="smile-o" size={20} color="#1AD4A6" />
          </TouchableOpacity>

          {/* Message Input */}
          <TextInput
            style={styles.inputField}
            placeholder="Message"
            placeholderTextColor="#108064"
          />

          {/* Right Icons */}
          <View style={styles.iconRightContainer}>
            <TouchableOpacity style={styles.iconRight}>
              <Fontisto name="paperclip" size={24} color="#1AD4A6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconRight}>
              <MaterialCommunityIcons
                name="microphone-settings"
                size={24}
                color="#1AD4A6"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1E25",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  chatContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 375,
    backgroundColor: "#9BA0FC",
    borderRadius: 20,
    padding: 10,
    marginBottom: 30,
  },
  message: {
    marginBottom: 20,
    alignSelf: "flex-start",
    width: "auto",
    maxWidth: "80%",
  },
  messageContent: {
    backgroundColor: "#0C624C",
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageSent: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  messageContentSent: {
    backgroundColor: "#0C624C",
    borderRadius: 12,
    borderBottomRightRadius: 0,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Roboto",
    fontWeight: "700",
    flexShrink: 1,
  },
  messageTime: {
    color: "#B0E4DD",
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "600",
    marginLeft: 10,
  },
  inputContainer: {
    width: "100%",
    paddingBottom: 20,
  },
  innerContainer: {
    width: "100%",
    height: 48,
    backgroundColor: "#151320",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1AD4A6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconLeft: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  inputField: {
    flex: 1,
    height: "100%",
    marginLeft: 16,
    color: "#E6F6F4",
    fontSize: 13,
    fontFamily: "Roboto",
  },
  iconRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconRight: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default ChatRoom;
