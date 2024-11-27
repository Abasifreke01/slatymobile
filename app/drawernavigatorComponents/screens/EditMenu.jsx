import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const EditMenu = () => {
  const navigation = useNavigation()
    return (
        <View style={styles.edit}>
            <Pressable style={styles.Pressable} onPress={() => navigation.navigate("Edit Profile")} ><Text style={styles.text}>Edit Profile</Text></Pressable>
            <Pressable style={styles.Pressable} onPress={() => navigation.navigate("Contact Info")}><Text style={styles.text}>Contact Info</Text></Pressable>
            <Pressable style={styles.Pressable} onPress={()=> navigation.jumpTo("Share Profile")}><Text style={styles.text}>Share Profile</Text></Pressable>
            <Pressable style={styles.Pressable} onPress={()=> navigation.jumpTo("Settings")}><Text style={styles.text}>Settings</Text></Pressable>
        </View>
    );
};
const styles = StyleSheet.create({ 
    edit:{
    backgroundColor: "#1f1c2f",
    position: 'absolute',
    zIndex: 1,
    top: 45,
    right: 35,
    height: 270,
    width: 260,
    borderRadius: 10,
    elevation: 5,
    padding: 10,
  }, 
  Pressable:{
    marginVertical:16,
    marginHorizontal:5

  },
  text:{
    color:"white",
    fontSize:16
  }

})
export default EditMenu;
