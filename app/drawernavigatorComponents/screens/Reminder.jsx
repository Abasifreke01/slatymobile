import { Text, Pressable, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../data/colors'
const reminder = require('../assets/reminder.png')
const Reminder = () => {
  return (
    <SafeAreaView style={styles.container}>
        <Image source={reminder}/>
      <Pressable style={styles.pressable}><Text style={{color:colors.pureWhite}}>Next</Text></Pressable>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"space-around",
backgroundColor:colors.charcoalBlack
    },
    pressable:{
        backgroundColor:colors.tealGlow,
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:40,
        padding:20
    }
})
export default Reminder