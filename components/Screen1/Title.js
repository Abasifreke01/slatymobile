import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Title = () => {
  return (
    <View style={styles.subtitleContainer}>
      <Text style={styles.subtitleText}>General Mathematics Class</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitleContainer: {
    position: "absolute",
    width: 400,
    padding: 10,
    left: 0,
    top: -40,
    borderTopWidth: 1,
    borderTopColor: "#16DD89",
    borderBottomWidth: 1,
    borderBottomColor: "#16DD89",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
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
});
export default Title;
