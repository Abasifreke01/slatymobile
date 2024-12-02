import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const MicActive = ({ size = 30, color = "currentColor" }) => {
  return <FontAwesome name="microphone" size={size} color={color} />;
};

export default MicActive;
