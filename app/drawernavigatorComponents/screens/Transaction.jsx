import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import React from 'react'
import colors from '../data/colors'
const bankImg = require('../assets/bank.png')
const Transaction = () => {
  return (<>
    <SafeAreaView style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={bankImg} style={{zIndex:3, top:-5, elevation:3,height:40,
          width:40, resizeMode:"contain"}}/>
      </View>
    <View style={styles.amountContainer}>
      <View style={styles.textContainer}>
      <Text style={{fontSize:30, color:colors.tealGlow}}>amount</Text>
      <Text style={{color:colors.grey}}>payment status</Text>
      </View>
    </View>
    <View style={styles.transactionContainer}>
       <View style={styles.flexContainer}>
      <Text style={[styles.grey, styles.correcta]}>Transaction Type</Text>
      <Text style={[styles.white, styles.correct]}>Transaction Type</Text>
       </View>
       <View style={styles.flexContainer}>
      <Text style={[styles.grey, styles.correcta]}>Sender</Text>
      <Text style={[styles.white, styles.correct]}>Sender name</Text>
       </View>
       <View  style={styles.flexContainer}>
      <Text style={[styles.grey, styles.correcta]}>Amount</Text>
      <Text style={[styles.green, styles.correct]}>amount</Text>
       </View>
    </View>
    <View style={styles.receiverContainer}>
    <View  style={styles.flexContainer}>
      <Text style={[styles.grey, styles.correcta]}>Receiver</Text>
      <Text style={[styles.white, styles.correct]}>receiver name</Text>
       </View>
       <View style={styles.flexContainer}>
      <Text style={[styles.grey, styles.correcta]}>Date</Text>
      <Text style={[styles.white, styles.correct]}>date</Text>
       </View>
       <View style={styles.flexContainer}>
      <Text style={[styles.grey, styles.correcta]}>Related Job</Text>
      <Text style={[styles.white, styles.correct]}>related job</Text>
       </View>
       <View style={styles.flexContainer}>
      <Text style={[styles.grey, styles.correcta]}>Payment Status</Text>
      <Text style={[styles.white, styles.correct]}>payment status</Text>
       </View>
    </View>
    </SafeAreaView>
  </>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:15,
    backgroundColor:colors.charcoalBlack
  },
   grey:{
    color:colors.grey,
    fontSize:12
   },
   white:{
color:colors.pureWhite,
fontWeight:"bold",
fontSize:12,

   },
   green:{
    color:colors.tealGlow
   },
   amountContainer:{
    // justifyContent:"center",
    flex:0.12,
    backgroundColor:colors.obsidianBlack,
    borderRadius:10,
    marginVertical:10,
    // textAlign:"center",
    paddingHorizontal:150,
    paddingVertical:20
  
   },
   transactionContainer:{
    flex:0.25,
    backgroundColor:colors.obsidianBlack,
    justifyContent:"center",
    gap:10,
    borderRadius:10,
    marginVertical:10,
    textAlign:"center",
    paddingHorizontal:15,
   },
   receiverContainer:{
    flex:0.35,
    backgroundColor:colors.obsidianBlack,
    marginVertical:20,
    justifyContent:"center",
    gap:10,
    borderRadius:10,
    textAlign:"center",
    paddingHorizontal:15
   },
   flexContainer:{
    flexDirection:"row",
    marginHorizontal:10,
    marginVertical:15,
   },
correct:{
  flex:0.6
},
correcta:{
  flex:0.4
},
imgContainer:{
  backgroundColor:colors.obsidianBlack,
  position:"asolute",
  zIndex:3,
  height:70,
  width:70,
  borderRadius:50,
  top:30,
  padding:20,
  marginHorizontal:180,
  alignItems:"center"
},
textContainer:{
alignItems:"flex-start"
}

})
export default Transaction