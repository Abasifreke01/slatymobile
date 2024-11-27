// CustomDrawerContent.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const profileImg = require("../assets/profile.png");
const logoutImg = require ('../assets/logout.png')
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <View>
        <Image
          source={profileImg}
          style={styles.profileImage}
          />
          </View>
          <View style={{gap:5}}>
        <Text style={styles.name}>Jonny Doe</Text>
        <Text style={styles.email}>@johndoe45</Text>
          </View>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={() => alert('Logging out')}>
        <Image source={logoutImg}/>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection:"row",
borderBottomWidth:2,
borderColor:"white",
marginRight:80,
marginBottom:40,
gap:5,
alignItems:"center"
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#fff',
  },
  logoutButton: {
    padding: 15,
    flexDirection:"row",
    gap:20,
    alignItems:"center"

  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold'
  },
});

export default CustomDrawerContent;
