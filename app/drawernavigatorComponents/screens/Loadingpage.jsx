import {Image, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../data/colors'
const loadingImg = require('../assets/Saly-22.png')
const Loadingpage = () => {
  return (
    <SafeAreaView style={styles.container}>
     <Image source={loadingImg}/>
     <Text>Your page is loading</Text>
     <Image/>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container:{
flex:1,
padding:20,
alignItems:"center",
justifyContent:"center",
color:colors.charcoalBlack
}})
export default Loadingpage