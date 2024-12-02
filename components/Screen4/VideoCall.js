import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import { FontAwesome } from "@expo/vector-icons";
const videoCallProp = require("../photo/Video-Call-Prop.png");

const VideoCallScreen = () => {
  return (
    <View style={styles.container}>
      {/* Main Image */}
      <Image source={videoCallProp} style={styles.mainImage} />

      {/* Options */}
      <View style={styles.options}>
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
            30 Others{" "}
            <Entypo name="chevron-small-right" size={18} color="white" />
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <FontAwesome name="microphone" size={24} color="red" />
        <View style={styles.circle}>
          <View style={styles.mediumCircle} />
        </View>
        <View style={styles.circle}>
          <View style={styles.ring} />
        </View>
        <View style={styles.circle}>
          <View style={styles.largeCircle} />
        </View>
        <View style={styles.circle}>
          <View style={styles.redBar} />
        </View>
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
  mainImage: {
    width: 305,
    height: 483,
    borderRadius: 18,
    alignSelf: "center",
    marginTop: 20,
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
    paddingHorizontal: 10,
  },
  optionText: {
    color: "#0C4234",
    fontSize: 22,
    fontWeight: "500",
  },
  moreOptions: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreOptionsText: {
    fontSize: 11,
    color: "white",
    textAlign: "center",
  },
  dropdownArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 3.7,
    borderRightWidth: 3.7,
    borderTopWidth: 6,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#E6F6F4",
    marginTop: 4,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  circle: {
    width: 39,
    height: 39,
    backgroundColor: "rgba(8, 109, 100, 0.40)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  mediumCircle: {
    width: 22,
    height: 18,
    backgroundColor: "#1DE9B6",
  },
  ring: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#1DE9B6",
    borderRadius: 100,
  },
  largeCircle: {
    width: 20,
    height: 20,
    backgroundColor: "#1DE9B6",
  },
  redBar: {
    width: 23.77,
    height: 8.93,
    backgroundColor: "#FF4546",
  },
});

export default VideoCallScreen;
