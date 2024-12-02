import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerIcon}>
        <View style={styles.iconBase} />
      </View>
      <Text style={styles.headerText}>Host Class</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "#1F1E25", // Dark background for the header
  },
  headerIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#E6F6F4", // Light color for the icon
    borderRadius: 12, // Circular icon
    justifyContent: "center",
    alignItems: "center",
  },
  iconBase: {
    width: 12,
    height: 2,
    backgroundColor: "#1F1E25", // Matches the header's background
  },
  headerText: {
    color: "#FFFFFF", // White text color
    fontSize: 22,
    fontWeight: "500",
    lineHeight: 28,
    wordWrap: "break-word",
  },
});

export default CustomHeader;
