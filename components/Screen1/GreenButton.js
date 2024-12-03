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
