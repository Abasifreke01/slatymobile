import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const photo = require("../photo/avatar-pic.png");

const HostClassScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>General Mathematics Class</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image style={styles.placeholderImage} source={photo} />
      </View>

      {/* Button to navigate to AboutClassScreen */}
      <TouchableOpacity
        style={styles.greenButton}
        onPress={() => navigation.navigate("AboutClass")} // Navigates to AboutClassScreen
      >
        <Text style={styles.greenButtonText}>Live Class</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.transparentButton}>
        <Text style={styles.transparentButtonText}>
          Upload a recorded class
        </Text>
      </TouchableOpacity>
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

  subtitleContainer: {
    position: "absolute",
    width: 390,
    padding: 10,
    left: 0,
    top: 9,
    borderTopWidth: 1,
    borderTopColor: "#16DD89",
    borderBottomWidth: 1,
    borderBottomColor: "#16DD89",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  subtitleText: {
    color: "#0C624C",
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "500",
    lineHeight: 28,
    wordWrap: "break-word",
  },
  imageContainer: {
    marginBottom: 30,
  },

  placeholderImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 482 / 321, // Maintain original aspect ratio
    borderRadius: 10,
  },
  greenButton: {
    backgroundColor: "#16DD89",
    width: "90%", // Match button width with screen
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#15A581",
  },
  greenButtonText: {
    textAlign: "center",
    color: "#E6F6F4",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  transparentButton: {
    width: "90%", // Match width with Start Class button
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#16DD89",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  transparentButtonText: {
    textAlign: "center",
    color: "#E6F6F4",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

export default HostClassScreen;
