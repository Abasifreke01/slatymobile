import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const HostClass = () => {
  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <View style={styles.topNavIconContainer}>
          <View style={styles.topNavIcon}></View>
          <View style={styles.topNavIcons}>
            <View style={styles.iconOne}></View>
            <View style={styles.iconTwo}>
              <View style={styles.iconSegment} />
              <View style={styles.iconSegment} />
              <View style={styles.iconSegment} />
              <View style={styles.iconSegment} />
            </View>
            <View style={styles.iconThree}>
              <View style={styles.iconThreeBase} />
              <View style={styles.iconThreeExtra}></View>
            </View>
          </View>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <TouchableOpacity>
          <View style={styles.backIconContainer}>
            <View style={styles.backIcon}></View>
          </View>
        </TouchableOpacity>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Host Class</Text>
        </View>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>General Mathematics Class</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.liveClassButton}>
        <Text style={styles.liveClassText}>Live Class</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadClassButton}>
        <Text style={styles.uploadClassText}>Upload A Recorded Class</Text>
      </TouchableOpacity>

      {/* Image */}
      <Image
        style={styles.image}
        source={{ uri: "https://via.placeholder.com/482x321" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 800,
    backgroundColor: "#151320",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  topNav: {
    position: "absolute",
    width: 358,
    height: 32,
    paddingLeft: 16,
    paddingRight: 16,
    left: 1,
    top: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topNavIconContainer: {
    width: 24,
    height: 24,
    left: 131,
    top: 733,
    position: "absolute",
  },
  topNavIcon: {
    width: 30.55,
    height: 8.99,
    backgroundColor: "#E6F6F4",
  },
  topNavIcons: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 3.07,
  },
  iconOne: {
    width: 18,
    height: 18,
    position: "relative",
  },
  iconTwo: {
    width: 18,
    height: 18,
    position: "relative",
  },
  iconSegment: {
    position: "absolute",
    width: 2,
    backgroundColor: "#E6F6F4",
  },
  iconThree: {
    width: 18.75,
    height: 18.75,
    position: "relative",
  },
  iconThreeBase: {
    width: 15.62,
    height: 10.94,
    position: "absolute",
    left: 1.56,
    top: 3.91,
    backgroundColor: "#E6F6F4",
  },
  iconThreeExtra: {
    width: 7.5,
    height: 6,
    position: "absolute",
    left: 4.25,
    top: 6.38,
    backgroundColor: "#E6F6F4",
  },
  titleContainer: {
    position: "absolute",
    left: 17,
    top: 33,
    flexDirection: "row",
    alignItems: "center",
  },
  backIconContainer: {
    width: 24,
    height: 24,
    position: "relative",
  },
  backIcon: {
    width: 7.41,
    height: 12,
    position: "absolute",
    left: 8.3,
    top: 6,
    backgroundColor: "#E6F6F4",
  },
  titleTextContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    color: "white",
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "500",
    lineHeight: 28,
    wordWrap: "break-word",
  },
  subtitleContainer: {
    position: "absolute",
    width: 360,
    padding: 10,
    left: 0,
    top: 94,
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
  liveClassButton: {
    height: 40,
    left: 41,
    top: 573,
    position: "absolute",
    backgroundColor: "#15A581",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  liveClassText: {
    textAlign: "center",
    color: "#E6F6F4",
    fontSize: 16,
    fontFamily: "Roboto",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  uploadClassButton: {
    height: 40,
    left: 41,
    top: 634,
    position: "absolute",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#16DD89",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  uploadClassText: {
    textAlign: "center",
    color: "#E6F6F4",
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  image: {
    width: 482,
    height: 321,
    left: -63,
    top: 197,
    position: "absolute",
  },
});

export default HostClass;
