import React, { useState } from 'react';
import { View, StyleSheet, Text, Image,TextInput,KeyboardAvoidingView, ScrollView, SafeAreaView, TouchableOpacity,Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Subject from '../data/coursedata.json';
import colors from "../data/colors"
const information = require("../assets/information.png")
const Edit = () => {
  const [file, setFile]= useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeInput, setActiveInput] = useState(null)
  const handleFocus = (inputId) => {
    setActiveInput(inputId); // Set active input field
  };

  const styler = (inputId) =>
    activeInput === inputId ? styles.activeInput : styles.input;
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*", // All file types
      });
      if (!res.canceled) {
        const fileData = res.assets ? res.assets[0] : res; 
        setFile(fileData); // Save the file details to state
      } else {
        console.log("File picker canceled");
      }
    } catch (err) {
      console.error("Error picking file:", err);
    }
  };
  // States for dropdowns
  const [dropdown1, setDropdown1] = useState({ open: false, value: null, items: [{ label: '1 Year', value: '1 Year' }, { label: '2 Years', value: '2 Years' }] });
  const [dropdown2, setDropdown2] = useState({ open: false, value: null, items: [{ label: 'Option 1', value: 'Option 1' }, { label: 'Option 2', value: 'Option 2' }] });
  const [dropdown3, setDropdown3] = useState({ open: false, value: null, items: [{ label: 'Choice A', value: 'Choice A' }, { label: 'Choice B', value: 'Choice B' }] });
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };
  return (<>
  {!modalVisible && (
    <SafeAreaView style={styles.container}>
      <View style={{marginHorizontal:20, marginRight:10}}>
      <Text style={{color:"white", fontSize:14, marginVertical:20, marginTop:0}}>Tell us about yourself to higher your opportunities for a great job</Text>
      <Text style={{fontWeight:"bold", color:"white", fontSize:20, marginBottom:5}}>Personal Information</Text>
      <View style={{flexDirection:"row"}}>
        <Image source={information} style={{marginHorizontal:10, marginVertical:2, height:20, width:20}}/>
        <Text style={{fontSize:12, color:"#15a581", marginBottom:40}}>This information will be <Text style={{fontWeight:"bold", color:"#1DE9B6"}}>shown</Text> to students</Text>
      </View>
      <KeyboardAvoidingView>
        <Text style={styles.label}>First Name</Text>
        <TextInput 
        onFocus={() => handleFocus("first")}
        style={styler("first")} 
        placeholder="John" 
        placeholderTextColor={"color:rgba(155, 155, 155, 0.5)"} />
        <Text style={styles.label}>Last Name</Text>
        <TextInput 
        onFocus={() => handleFocus("second")}
        style={styler("second")} 
        placeholder="Doe"
        placeholderTextColor={"color:rgba(155, 155, 155, 0.5)"}/>
        <Text style={styles.label}>Additional Name (optional)</Text>
        <TextInput 
        onFocus={() => handleFocus("third")}
        style={styler("third")} 
        placeholder="Dr. Math" 
        placeholderTextColor={"color:rgba(155, 155, 155, 0.5)"} />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput 
        onFocus={() => handleFocus("fourth")}
        style={styler("fourth")} 
        placeholder="+234 810 123 4567" 
        placeholderTextColor={"color:rgba(155, 155, 155, 0.5)"} />
        <Text style={styles.label}>Email Address</Text>
        <TextInput 
        onFocus={() => handleFocus("fifth")}
        style={styler("fifth")}
        placeholder="drmath@gmail.com" 
        placeholderTextColor={"color:rgba(155, 155, 155, 0.5)"} />
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}><Text style={{color:"white"}}>Next</Text></TouchableOpacity>
      </KeyboardAvoidingView>
      </View>
      </SafeAreaView>)}
      {modalVisible && (

          <SafeAreaView style={styles.container}>
            <View style={{marginHorizontal:20, marginRight:10}}>
              <Text style={{color:"white", fontSize:14, marginVertical:20, marginTop:0}}>Tell us about yourself to higher your opportunities for a great job</Text>
              <Text style={{fontWeight:"bold", color:"white", fontSize:20, marginBottom:5}}>Additional Information</Text>
              <View style={{flexDirection:"row"}}>
              <Image source={information} style={{marginHorizontal:10, marginVertical:2, height:20, width:20}}/>
                <Text style={{fontSize:12, color:"#15a581", marginBottom:40}}>This information will be <Text style={{fontWeight:"bold", color:"#1DE9B6"}}>hidden</Text> to students</Text>
              </View>
              <View>
                <Text style={styles.label}>Work Experience</Text>
                <DropDownPicker
                  open={dropdown1.open}
                  value={dropdown1.value}
                  items={dropdown1.items}
                  setOpen={(open) => setDropdown1((prev) => ({ ...prev, open }))}               
                  setValue={(value) => setDropdown1((prev) => ({ ...prev, value }))}
                  setItems={(items) => setDropdown1((prev) => ({ ...prev, items }))}
                  style={[styles.dropdown, { zIndex: 3, elevation: 3 }]}
                  placeholder={dropdown1.value ? dropdown1.value : "year 1"}
                  placeholderStyle={{color:"rgba(155, 155, 155, 0.5)", marginHorizontal:20, padding:15}}
                  arrowIconStyle={{tintColor:"white"}}
                />
                <Text style={styles.label}>English Level</Text>
                <DropDownPicker
                  open={dropdown2.open}
                  value={dropdown2.value}
                  items={dropdown2.items}
                  setOpen={(open) => {
                    setDropdown2((prev) => ({ ...prev, open })); // Assuming `setDropdown1` manages the dropdown's state
                  }}
                  setValue={(value) => setDropdown2((prev) => ({ ...prev, value }))}
                  setItems={(items) => setDropdown2((prev) => ({ ...prev, items }))}
                  style={[styles.dropdown, { zIndex: 2, elevation: 3 }]}
                  placeholder="Advanced"
                  placeholderStyle={{color:"rgba(155, 155, 155, 0.5)", marginHorizontal:20, padding:15,}}
                  arrowIconStyle={{tintColor:"white"}}
                />
                <Text style={styles.label}>Skills/Interest</Text>
                <DropDownPicker
                  open={dropdown3.open}
                  value={dropdown3.value}
                  items={dropdown3.items}
                  setOpen={(open) => {
                    setDropdown3((prev) => ({ ...prev, open })); // Assuming `setDropdown1` manages the dropdown's state
              }}
                  setValue={(value) => setDropdown3((prev) => ({ ...prev, value }))}
                  setItems={(items) => setDropdown3((prev) => ({ ...prev, items }))}
                  style={[styles.dropdown, { zIndex: 1, elevation: 3 }]}
                  placeholder=""
                  placeholderStyle={{color:"#fcfc25", marginHorizontal:20, padding:15}}
                  arrowIconStyle={{tintColor:"white"}}
                />
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:20, marginRight:-30}}>
    {Subject.courses.map((course, index) => (
      <View key={index} style={[styles.courseItem, { marginRight: 8 }]}>
        <Text style={styles.courses}>{course}</Text>
      </View>
    ))}
  </ScrollView>
</View>
<View style={styles.filePicker}>
      {!file && <Text style={{ color: "white" ,marginLeft:20}}>Upload your CV</Text>}
      {file && <Text style={{ color: "white", marginLeft:20 }}> File Name: {truncateText (file.name, 10)}</Text>}
      <Pressable onPress={pickFile}>
        <Text style={{ color: "white", fontSize: 18, fontWeight:"bold", marginRight:20 }}>+</Text>
      </Pressable>
    </View>
                <TouchableOpacity style={styles.button} onPress={() => {setModalVisible(false); setFile(null)}}><Text style={{color:"white"}}>Finish</Text></TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
      
      )}
      </>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151320",
    padding: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    color: '#fff',
    marginHorizontal:40
  },
  input: {
    backgroundColor: colors.inputGreen,
    borderColor: colors.inputGreen,
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    paddingHorizontal:40,
    elevation:10
  },
  activeInput:{
    backgroundColor: colors.inputGreen,
    borderColor: colors.emeraldGlow,
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    paddingHorizontal:40,
    elevation:10,
  
  borderWidth:3
  },
  dropdown: {
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor:"#0c4234",
  },
  courses:{
    borderWidth:1,
    padding:10,
    borderRadius:40,
    paddingHorizontal:25,
    color:"#15a581",
    borderColor:"#1DE9B6",
    elevation:10,
    fontWeight:"bold"
  },
  button:{
    borderRadius:30,
    borderWidth:1,
    padding:15,
    alignItems:"center",
    backgroundColor:"#15a581",
    marginTop:50,
    elevation:10
  },
  filePicker:{
   borderWidth:3,
    justifyContent:"space-between",
    padding: 10,
    borderColor:"#15a581",
    flexDirection:"row",
    borderRadius:20,
    marginVertical:20,
    elevation:10,
    backgroundColor:"#0c4234"
  },
  lastInput:{
    borderWidth:3,
    borderColor:"#15a581",

  }
});

export default Edit;
