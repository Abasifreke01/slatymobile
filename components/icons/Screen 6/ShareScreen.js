import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, StyleSheet } from "react-native";

const ScreenShareComponent = () => {
  return (
    <View style={styles.container}>
      {/* Main Sharing Area */}
      <View style={styles.sharingArea}>
        <Text style={styles.waitingText}>...waiting for your upload.</Text>
        <AntDesign name="loading1" size={24} color="#1DE9B6" />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerOption}>
          <View style={styles.optionBackgroundDocs}>
            <Text style={styles.optionText}>Docs</Text>
            <MaterialCommunityIcons
              name="file-document"
              size={24}
              color="black"
            />
          </View>
        </View>
        <View style={styles.footerOption}>
          <View style={styles.optionBackgroundAudio}>
            <Text style={styles.optionText}>Audio</Text>
            <MaterialCommunityIcons
              name="music-circle-outline"
              size={24}
              color="black"
            />
          </View>
        </View>
        <View style={styles.footerOption}>
          <View style={styles.optionBackgroundImage}>
            <Text style={styles.optionText}>Image</Text>
            <MaterialCommunityIcons
              name="folder-image"
              size={24}
              color="black"
            />
          </View>
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
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    height: 32,
    position: "absolute",
    width: "100%",
  },
  statusBarElement: {
    width: 30,
    height: 9,
    backgroundColor: "#E6F6F4",
  },
  statusIcons: {
    flexDirection: "row",
    gap: 8,
  },
  icon: {
    width: 18,
    height: 18,
    backgroundColor: "#E6F6F4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 40,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: 8,
    height: 12,
    backgroundColor: "#E6F6F4",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    width: 24,
    height: 24,
    backgroundColor: "white",
  },
  sharingArea: {
    flex: 1,
    marginHorizontal: 27,
    marginVertical: 92,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1DE9B6",
    justifyContent: "center",
    alignItems: "center",
  },
  waitingText: {
    color: "#1DE9B6",
    fontSize: 11,
    marginBottom: 10,
  },
  loadingCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1DE9B6",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 26,
    marginHorizontal: 29,
    borderColor: "#1DE9B6",
    borderWidth: 1,
    borderStyle: "solid",
    padding: 20,
    borderRadius: 18,
  },
  footerOption: {
    alignItems: "center",
  },
  optionBackgroundDocs: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#69EB9C",
    justifyContent: "center",
    alignItems: "center",
  },
  optionBackgroundAudio: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8187FD",
    justifyContent: "center",
    alignItems: "center",
  },
  optionBackgroundImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F7C993",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 11,
    color: "#003B33",
  },
});

export default ScreenShareComponent;
