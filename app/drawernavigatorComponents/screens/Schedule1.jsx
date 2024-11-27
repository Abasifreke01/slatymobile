import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../data/colors";

const reminderImg = require("../assets/reminder.png");
const arrowImg = require("../assets/arrowdown.png");

const Schedule1 = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [activeInput, setActiveInput] = useState(null); // Tracks which input is active

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false); // Close picker after selection
    setDate(currentDate);
  };

  const showPicker = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  const currTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const currDate = date.toLocaleDateString();

  const handleFocus = (inputId) => {
    setActiveInput(inputId); // Set active input field
  };

  const styler = (inputId) =>
    activeInput === inputId ? styles.activeInput : styles.input;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#9BA0FC", "#CEB0FA"]}
        style={styles.container}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.imageContainer}>
          <Image source={reminderImg} style={styles.image} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Schedule Class</Text>
          <Text style={styles.subHeader}>
            Enter details of the Class Schedule
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name of Class</Text>
            <TextInput
              onFocus={() => handleFocus("first")}
              style={styler("first")}
              placeholder="Mathematics Class"
            />

            <Text style={styles.label}>Select a Date</Text>
            <View>
              <TextInput
                onFocus={() => handleFocus("second")}
                style={styler("second")}
                value={currDate}
                editable={false}
              />
              <Pressable
                style={styles.button}
                onPress={() => showPicker("date")}
              >
               <Image style={styles.buttonText} source={arrowImg}/>
              </Pressable>
            </View>

            <Text style={styles.label}>Select a Time</Text>
            <View>
              <TextInput
                onFocus={() => handleFocus("third")}
                style={styler("third")}
                value={currTime}
                editable={false}
              />
              <Pressable
                style={styles.button}
                onPress={() => showPicker("time")}
              >
               <Image style={styles.buttonText} source={arrowImg}/>
                
              </Pressable>
            </View>
          </View>

          {show && (
            <DateTimePicker
              value={date}
              mode={mode}
              display="default"
              onChange={onChange}
            />
          )}

          <Pressable style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    zIndex: 0,
    flex: 0.3,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  contentContainer: {
    backgroundColor: colors.obsidianBlack,
    elevation: 10,
    zIndex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flex: 0.7,
    padding: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: colors.pureWhite,
  },
  subHeader: {
    fontSize: 15,
    color: colors.pureWhite,
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
    padding: 20,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "600",
    color: colors.pureWhite,
    marginHorizontal: 35,
  },
  input: {
    borderWidth: 1,
    borderRadius: 15,
    height: 55,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: colors.inputGreen,
    marginHorizontal: 10,
    borderColor: colors.inputGreen,
  },
  activeInput: {
    borderWidth: 1,
    borderRadius: 15,
    height: 55,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    marginHorizontal: 10,
    backgroundColor: colors.inputGreen,
    borderColor: colors.emeraldGlow,
  },
  button: {
    position: "absolute",
    elevation: 10,
    top: 7,
    right: 30,
  },
  buttonText: {
    height:10,
    width:15,
    marginVertical:20
  },
  continueButton: {
    backgroundColor: colors.greyMist,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 40,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Schedule1;
