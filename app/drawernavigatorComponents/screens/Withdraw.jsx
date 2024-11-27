import { View, Text, Pressable, TextInput, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../data/colors'

const Withdraw = () => {
    return (
        <SafeAreaView style={styles.container}>
          <Pressable style={styles.pressable}><Text style={styles.firstText}>Account Details</Text></Pressable>
        <Text style={styles.noteText}>Note: Payments are made at the end of every month</Text>
        <View>
          <Text style={styles.label}>Account number</Text>
          <TextInput style={styles.textInput} placeholder='2048 0567 8012 3421'  placeholderTextColor={colors.grey}></TextInput>
          <Text  style={styles.label}>Account name</Text>
          <TextInput style={styles.textInput} placeholder='Abasi Enobong Mark' editable={false}  placeholderTextColor={colors.grey} ></TextInput>
          <Text style={styles.label}>Bank</Text>
          <TextInput style={styles.textInputlast} placeholder='Kuda' placeholderTextColor={colors.grey}></TextInput>
          <View>
    <Text style={{color:colors.greyMist, fontSize:12, marginHorizontal:25}}>Save bank for future use</Text>
          </View>
        </View>
        <Pressable style={styles.pressableTwo}><Text style={styles.firstText}>Save for payment</Text></Pressable>
        </SafeAreaView>
      )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:colors.charcoalBlack,
    padding:20
  },
  firstText:{
    color:colors.pureWhite,
    fontSize:20
  },
  pressable:{
    backgroundColor:colors.tealGlow,
    margin:20,
    padding:10,
    alignItems:"center",
    borderRadius:10
  },
  noteText:{
    color:colors.pureWhite,
    fontSize:11,
    textAlign:"right",
    marginHorizontal:20
  },
  label:{
    color:colors.pureWhite,
    fontSize:20,
    marginVertical:20,
    marginHorizontal:20
  },
  textInput:{
    backgroundColor:colors.obsidianBlack,
    padding:15,
    borderRadius:5,
    marginHorizontal:10
  },
  pressableTwo:{
    backgroundColor:colors.tealGlow,
    margin:20,
    padding:10,
    alignItems:"center",
    borderRadius:10,
    marginHorizontal:40,
    marginTop:30
  },
  textInputlast:{
    backgroundColor:colors.obsidianBlack,
    padding:15,
    borderRadius:5,
    marginRight:230,
    marginBottom:30,
    marginHorizontal:20
  }
})
export default Withdraw