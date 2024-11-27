import {  Image, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native'
import React from 'react'
import colors from '../data/colors'
const reminderImg = require('../assets/reminder.png')
const Schedule2 = () => {
  return (<>
  <SafeAreaView style={styles.container}>
  <Image source={reminderImg} style={styles.img}/>
      <Pressable style={styles.pressable}><Text style={styles.text}>Schedule A Class</Text></Pressable>
      <Pressable style={styles.pressable}><Text style={styles.text}>View Appointments</Text></Pressable>
  </SafeAreaView>
  </>
  )
}
const styles = StyleSheet.create({
container:{
  flex:1,
  backgroundColor:colors.charcoalBlack,
  alignItems:"center"
},
img:{
  flex:0.75,
  resizeMode:"contain",
  width:400,
  marginLeft:40
},
pressable:{
  paddingHorizontal:120,
  marginTop:20,
  borderRadius:30,
  backgroundColor:colors.tealGlow,
  padding:20
},
text:{
  color:colors.pureWhite
}
})
export default Schedule2