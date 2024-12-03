import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
const slaty = require("../photo/WaitingRoom - Slaty.png");

const WaitingRoomScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to VideoCallScreen after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate("VideoCall");
    }, 1000);

    // Clear timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Main Content Box */}
      <View style={styles.mainBox}></View>

      {/* Placeholder Image */}
      <Image style={styles.placeholderImage} source={slaty} />

      {/* Class Title */}
      <View style={styles.classTitleContainer}>
        <Text style={styles.classTitleText}>General Mathematics Class</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Starting Meeting</Text>
        <View style={styles.footerIcon}>
          <AntDesign name="loading1" size={24} color="#1DE9B6" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1E25", // Dark background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mainBox: {
    width: 335,
    height: 581,
    backgroundColor: "#151320",
    borderRadius: 18,
    borderColor: "#1DE9B6",
    borderWidth: 1,
    position: "absolute",
    left: 40,
    top: 18,
  },
  placeholderImage: {
    width: 335,
    height: 89,
    position: "absolute",
    left: 40,
    top: 268,
  },
  classTitleContainer: {
    position: "absolute",
    width: 360,
    padding: 10,
    top: 604,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  classTitleText: {
    color: "white",
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "600",
    lineHeight: 28,
  },
  footer: {
    position: "absolute",
    height: 52,
    padding: 4,
    top: 670,
    alignItems: "center",
  },
  footerText: {
    color: "#1DE9B6",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "400",
    lineHeight: 16,
  },
  footerIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerIconInner: {
    width: 18,
    height: 18,
    backgroundColor: "#1DE9B6",
    borderRadius: 99,
  },
});

export default WaitingRoomScreen;
