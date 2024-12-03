import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";

const videoCallProp = require("../photo/Video-Call-Prop.png");

const VideoCallScreen = () => {
  const navigation = useNavigation();
  const [isMicOn, setIsMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [showImages, setShowImages] = useState(false); // State to toggle between options and images

  // Array of emojis to show
  const emojis = ["😂", "❤", "👏", "✋", "👍"];

  return (
    <View style={styles.container}>
      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image source={videoCallProp} style={styles.mainImage} />

        {/* Call-End Icon */}
        <MaterialIcons
          name="call-end"
          size={38}
          color="red"
          style={styles.callEndIcon}
        />
      </View>

      {/* Options or Images */}
      <View style={styles.options}>
        {showImages ? (
          // Render Emojis Section
          <View style={styles.imageRow}>
            {emojis.map((emoji, index) => (
              <Text key={index} style={styles.emoji}>
                {emoji}
              </Text>
            ))}
          </View>
        ) : (
          // Render Options Section
          <>
            {["A", "M", "G", "L"].map((text, index) => (
              <LinearGradient
                key={index}
                colors={
                  text === "M" ? ["#8187FD", "#CEB0FA"] : ["#9BA0FC", "#CEB0FA"]
                }
                style={styles.gradientBackground}
              >
                <Text style={styles.optionText}>{text}</Text>
              </LinearGradient>
            ))}
            <View style={styles.moreOptions}>
              <Text style={styles.moreOptionsText}>
                30 {"\n"}Others
                <Entypo name="chevron-small-right" size={18} color="white" />
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Toggle Microphone Icon */}
        <TouchableOpacity
          onPress={() => setIsMicOn((prev) => !prev)}
          style={styles.circle}
        >
          <FontAwesome
            name={isMicOn ? "microphone" : "microphone-slash"}
            size={25}
            color={isMicOn ? "#1DE9B6" : "red"}
          />
        </TouchableOpacity>

        {/* Navigate to ChatRoom */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Chat")}
          style={styles.circle}
        >
          <Ionicons name="chatbox" size={25} color="#1DE9B6" />
        </TouchableOpacity>

        {/* Navigate to ShareScreen */}
        <TouchableOpacity onPress={() => navigation.navigate("ScreenShare")}>
          <View style={styles.circle}>
            <MaterialIcons name="screen-share" size={25} color="#1DE9B6" />
          </View>
        </TouchableOpacity>

        {/* Emoji Controls */}
        <TouchableOpacity onPress={() => setShowImages((prev) => !prev)}>
          <View style={styles.circle}>
            <FontAwesome5 name="smile-beam" size={25} color="#1DE9B6" />
          </View>
        </TouchableOpacity>

        {/* Other Icons */}
        <TouchableOpacity
          onPress={() => setSpeakerOn((prev) => !prev)}
          style={styles.circle}
        >
          <Feather
            name={speakerOn ? "volume-2" : "volume-x"}
            size={25}
            color={speakerOn ? "#1DE9B6" : "red"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1E25",
    justifyContent: "space-between",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    marginTop: 20,
  },
  mainImage: {
    width: 305,
    height: 483,
    borderRadius: 18,
  },
  callEndIcon: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 6,
    borderRadius: 25,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 27,
  },
  gradientBackground: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    color: "#0C4234",
    fontSize: 22,
    fontWeight: "500",
  },
  moreOptions: {
    width: 74,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  moreOptionsText: {
    fontSize: 11,
    color: "white",
    textAlign: "center",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  emoji: {
    fontSize: 40,
    marginHorizontal: 10,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 80,
  },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(8, 109, 100, 0.40)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VideoCallScreen;
