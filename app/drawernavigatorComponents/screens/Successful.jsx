import {Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import React from 'react'
import colors from '../data/colors'
const rocket = require('../assets/Saly-43.png')
const Successful = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color:colors.tealGlow}}>Let's Go</Text>
      <Image source={rocket}/>
      <Text  style={{color:colors.pureWhite}}>Personalizing your journey...</Text>
      <Image/>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"space-around",
        alignItems:"center",
        padding:20,
        paddingBottom:50,
        backgroundColor:colors.charcoalBlack
    }
})
export default Successful