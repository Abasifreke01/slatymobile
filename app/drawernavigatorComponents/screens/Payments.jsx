import { View, Text, Pressable, StyleSheet, ScrollView,Image } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import React from 'react'
import colors from '../data/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import arrowUp from "../assets/Arrow 3.png"
const Payments = () => {
  const navigation = useNavigation()
  return (
   
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceSection}>
        <View>
          <View style={styles.balance}>
        <Text style={[styles.green, {fontSize:30, fontWeight:"bold"}]}>N90,000</Text>
        <Text style={[styles.grey,{textTransform:"uppercase",fontSize:8, marginLeft:20, marginTop:5}]}>Available Balance</Text>
        </View>
        </View>
        <View style={styles.type}>
          <Pressable style={styles.topUp}><Image source={arrowUp}/><Text style={[styles.whitetext,{fontSize:20, alignItems:"center", gap:"20"} ]}>Top up</Text></Pressable>
          <Pressable onPress={() => navigation.navigate("Payment Details")} style={styles.withdraw}><Text style={[styles.whitetext,{fontSize:20, marginRight:40}]}>Withdraw</Text></Pressable>
        </View>
      </View>
      <ScrollView style={styles.transactionContainer}>
        <Pressable style={styles.open}></Pressable>
        <View>
          <View style={styles.transaction}>
          <Text style={[styles.whitetext, {fontWeight:"bold", fontSize:20}]}>Transactions</Text>
          <Pressable><Text style={[styles.grey, {textDecorationLine:"underline"}]}>see all</Text></Pressable>
          </View>
          <View style={styles.paymentContainer}>
          <View style={styles.paymentInfo}>
            <View>
            <Text style={styles.whitetext}>received</Text>
            <Text style={styles.whitetext}>date</Text>
            </View>
            <Text style={styles.green}>amount</Text>
          </View>
          <View style={styles.paymentInfo}>
            <View>
            <Text style={styles.whitetext}>received</Text>
            <Text style={styles.whitetext}>date</Text>
            </View>
            <Text style={styles.green}>amount</Text>
          </View>
          <View style={styles.paymentInfo}>
            <View>
            <Text style={styles.whitetext}>received</Text>
            <Text style={styles.whitetext}>date</Text>
            </View>
            <Text style={{color:colors.red}}>amount</Text>
          </View>
          <View style={styles.paymentInfo}>
            <View>
            <Text style={styles.whitetext}>received</Text>
            <Text style={styles.whitetext}>date</Text>
            </View>
            <Text style={styles.green}>amount</Text>
          </View>
          <View style={styles.paymentInfo}>
            <View>
            <Text style={styles.whitetext}>received</Text>
            <Text style={styles.whitetext}>date</Text>
            </View>
            <Text style={styles.green}>amount</Text>
          </View>
          </View>
        </View>
      </ScrollView>
     
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
green:{
  color:colors.tealGlow,
},
balanceSection:{
  // alignItems:"center",
  flex:0.30,
  zIndex:0
},
grey:{
  color:colors.grey,
},
container:{
  flex:1,
  backgroundColor:colors.charcoalBlack
},
transactionContainer:{
  backgroundColor:colors.obsidianBlack,
  elevation:10,
  zIndex:1,
  borderTopRightRadius:25,
  borderTopLeftRadius:25,
  borderColor:colors.obsidianBlack,
  flex:0.7,
  padding:20
  // marginVertical:20
},
open:{
  backgroundColor:colors.tealGlow,
  height:3,
  marginHorizontal:150,
  borderRadius:10
},
transaction:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginVertical:40,
  alignItems:"flex-end"
},
paymentInfo:{
  flexDirection:"row",
  justifyContent:"space-between",
  marginRight:1,
  borderBottomWidth:1,
  borderBottomColor:colors.grey,
  padding:5,
  alignItems:"center"
},
type:{
  flexDirection:"row",
  backgroundColor:colors.obsidianBlack,
  height:50,
  marginVertical:30,
  borderRadius:5,
  elevation:10,
  marginHorizontal:40
},
topUp:{
  backgroundColor:colors.tealGlow,
  flex:1,
  borderRadius:5,
  zIndex:1,
  elevation:3,
  alignItems:"center",
  justifyContent:"cen",
  gap:30,
  paddingHorizontal:20,
  flexDirection:"row"
  
},
withdraw:{
  flex:1,
   alignItems:"center",
  justifyContent:"space-around"
},
whitetext:{color:colors.pureWhite},
balance:{
  marginHorizontal:160,
  marginVertical:5
},
paymentContainer:{
  flexDirection:"column",
  justifyContent:"space-evenly",
  gap:30
}
})

export default Payments