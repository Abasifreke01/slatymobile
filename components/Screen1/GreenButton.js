import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { SharedStyle } from "../utils/SharedStyles";

const GreenButton = ({ text, onPress }) => (
  <TouchableOpacity
    style={[SharedStyle.button, SharedStyle.greenButton]}
    onPress={onPress}
  >
    <Text style={SharedStyle.greenButtonText}>{text}</Text>
  </TouchableOpacity>
);

export default GreenButton;

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 8, // Rounded corners for a modern look
//     alignItems: "center",
//   },
//   text: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default GreenButton;
