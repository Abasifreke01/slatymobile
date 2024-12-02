import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

function TransparentButton({
  text = "Upload A Recorded Class",
  onPress,
  buttonStyle,
  textStyle,
}) {
  return (
    <TouchableOpacity
      style={[styles.recordedClassButton, buttonStyle]} // Combine default and custom styles
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recordedClassButton: {
    height: 40,
    marginHorizontal: 40,
    marginTop: 20,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#16DD89", // Green border
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#E6F6F4", // Light text color
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: 0.1,
    paddingHorizontal: 10, // Ensures proper alignment
  },
});

export default TransparentButton;
