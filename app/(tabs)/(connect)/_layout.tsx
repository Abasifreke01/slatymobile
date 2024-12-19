import { StyleSheet, Text, View } from 'react-native'
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs'
import React from 'react'
import { withLayoutContext } from 'expo-router'
import { NavigationContainer } from '@react-navigation/native'; 
import HomeScreen from './chats'
import TabTwoScreen from './communities'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
// import each from '../(each)/each'

const Tab = createMaterialTopTabNavigator();



export default function _layout() {
  return(
  <GestureHandlerRootView>
    <NavigationContainer>
 <Tab.Navigator screenOptions={{
  swipeEnabled: true,
  tabBarStyle: {
    backgroundColor: '#151320'
  },
  tabBarBounces: true,

 }}>
  <Tab.Screen name='chats' component={HomeScreen} options={{
    tabBarBadge: (() => <Text>7</Text> ),
    tabBarActiveTintColor: '#1DE9B6',
    tabBarInactiveTintColor: 'gray',
    tabBarIndicatorStyle:{
      backgroundColor: '#1DE9B6',
      height: 2,
      borderRadius: 5,
      marginTop: 2,
      marginBottom: 3,
    },
    title: 'Chats',
  }}/>
  <Tab.Screen name='communities' component={TabTwoScreen}
  options={{

    tabBarBadge: (() => <Text>7</Text> ),
    tabBarActiveTintColor: '#1DE9B6',
    tabBarInactiveTintColor: 'black',
    tabBarIndicatorStyle:{
      backgroundColor: '#1DE9B6',
      height: 2,
      borderRadius: 5,
      marginTop: 2,
      marginBottom: 3,
    },
    title: 'Communities',
  }}
  />

 </Tab.Navigator>
 </NavigationContainer>
  </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({})