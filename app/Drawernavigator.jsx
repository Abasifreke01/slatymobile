import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { View, Text, Image, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screen imports
import Myaccount from './drawernavigatorComponents/screens/MyAccount';
import Verification from './drawernavigatorComponents/screens/Verification';
import Schedules from './drawernavigatorComponents/screens/Schedules';
import Alert from './drawernavigatorComponents/screens/Alert';
import Payments from './drawernavigatorComponents/screens/Payments';
import SavedCourses from './drawernavigatorComponents/screens/SavedCourses';
import MarketPlaces from './drawernavigatorComponents/screens/MarketPlaces';
import Support from './drawernavigatorComponents/screens/Support';
import Settings from './drawernavigatorComponents/screens/Settings';
import Profile from './drawernavigatorComponents/screens/profile';
import Edit from './drawernavigatorComponents/screens/Edit';
import ContactInfo from './drawernavigatorComponents/screens/ContactInfo';
import ShareProfile from './drawernavigatorComponents/screens/ShareProfile';
import EditMenu from './drawernavigatorComponents/screens/EditMenu';
import Transaction from './drawernavigatorComponents/screens/Transaction';
import colors from './drawernavigatorComponents/data/colors';
import Withdraw from './drawernavigatorComponents/screens/Withdraw';
import Schedule2 from './drawernavigatorComponents/screens/Schedule2';
import Schedule3 from './drawernavigatorComponents/screens/Schedule3';
import { LinearGradient } from "expo-linear-gradient"

// Assets
const accountImg = require('./drawernavigatorComponents/assets/account.png');
const verificationImg = require('./drawernavigatorComponents/assets/Verification.png');
const schedulesImg = require('./drawernavigatorComponents/assets/schedule.png');
const alertImg = require('./drawernavigatorComponents/assets/notification.png');
const paymentImg = require('./drawernavigatorComponents/assets/payment.png');
const savedCoursesImg = require('./drawernavigatorComponents/assets/heart.png');
const marketImg = require('./drawernavigatorComponents/assets/marketplace.png');
const settingImg = require('./drawernavigatorComponents/assets/setting.png');
const supportImg = require('./drawernavigatorComponents/assets/support.png');
const menuIcon = require('./drawernavigatorComponents/assets/icon.png');
const menu = require('./drawernavigatorComponents/assets/menu.png');
const alertIcon = require('./drawernavigatorComponents/assets/notification.png')

// Navigators
const Drawer = createDrawerNavigator();

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [toggleEdit, setToggleEdit]= useState(false)

const handleToggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setToggleEdit((prev) => !prev);
};
 return (
      <Drawer.Navigator
        drawerContent={(props) => <Profile {...props} />}
        screenOptions={({ navigation }) => ({
          drawerStyle: {
            backgroundColor: '#151320',
          },
          headerStyle: {
            backgroundColor: '#151320',
          },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#4a90e2',
          drawerInactiveTintColor: 'white',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={styles.menuIcon}
            >
              <Image source={menuIcon} style={{height:16, width:10}} />
            </TouchableOpacity>
          ),
        })}
      >
        <Drawer.Screen
          name="My Account"
          component={Myaccount}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={accountImg} />
                <Text style={styles.text}>My Account</Text>
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <TouchableOpacity onPress={handleToggleEdit}>
                  <Image source={menu} style={{ width: 30, marginRight: 35 }} />
                </TouchableOpacity>
                {toggleEdit && <EditMenu style={styles.edit} />}
              </View>
            ),
            
          }}
        />
        <Drawer.Screen
          name="Verification"
          component={Verification}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={verificationImg} />
                <Text style={styles.text}>Verification</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Schedules"
          component={Schedules}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={schedulesImg} />
                <Text style={styles.text}>Schedules</Text>
              </View>
            ),
            headerTintColor:"#333",
            headerBackground:  () => (
              <LinearGradient
              colors={["#9BA0FC", "#CEB0FA"]}
              style={styles.linear}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 12 }}
            >
    
            </LinearGradient>
            )
          }}
        />
        <Drawer.Screen
          name="Alert"
          component={Alert}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={alertImg} />
                <Text style={styles.text}>Alert</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Payments"
          component={Payments}
          options={({ navigation }) => ({
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={paymentImg} />
                <Text style={styles.text}>Payments</Text>
              </View>
            ),
            headerLeft: () => (
              <View>
                <Image/>
                <Text style={{color:colors.pureWhite, marginHorizontal:20, fontWeight:"bold", fontSize:20}}>Hello, Jonny!</Text>
              </View>
            ),
            headerTitle:"",
            headerRight: ()=>(
              <TouchableOpacity
              onPress={() => navigation.navigate("Alert")}
              style={styles.menuIcon}
            >
              <Text style={styles.notificationCount}>3</Text>
              <Image source={alertIcon} style={{height:30, width:30}} />
            </TouchableOpacity>
            )
          })}
        />
        <Drawer.Screen
          name="Saved Courses"
          component={SavedCourses}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={savedCoursesImg} />
                <Text style={styles.text}>Saved Courses</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Market Places"
          component={MarketPlaces}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={marketImg} />
                <Text style={styles.text}>Market Places</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={settingImg} />
                <Text style={styles.text}>Settings</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Support"
          component={Support}
          options={{
            drawerLabel: () => (
              <View style={styles.iconsContainer}>
                <Image source={supportImg} />
                <Text style={styles.text}>Support</Text>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="Edit Profile"
          component={Edit}
          options={({ navigation }) => ({
            drawerLabel: () => null,
            drawerItemStyle: { display: 'none' },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Alert")}
                style={styles.menuIcon}
              >
                <Image source={alertIcon} style={{height:30, width:30}} />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen
          name="Share Profile"
          component={ShareProfile}
          options={{
            drawerLabel: () => null,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="Contact Info"
          component={ContactInfo}
          options={{
            drawerLabel: () => null,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="Transactions Details"
          component={Transaction}
          options={{
            drawerLabel: () => null,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="Payment Details"
          component={Withdraw}
          options={{
            drawerLabel: () => null,
            drawerItemStyle: { display: 'none' },
          }}
        // />
        // <Drawer.Screen
        //   name="Payment Details"
        //   component={Schedule2}
        //   options={{
        //     drawerLabel: () => null,
        //     drawerItemStyle: { display: 'none' },
        //   }}
        // />
        // <Drawer.Screen
        //   name="Payment Details"
        //   component={Schedule3}
        //   options={{
        //     drawerLabel: () => null,
        //     drawerItemStyle: { display: 'none' },
        //   }}
        />
      
      </Drawer.Navigator>
    
  );

}

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
  menuIcon: {
    marginHorizontal: 25,
  },
  edit:{
   
  },
  notificationCount:{
    position:"absolute",
    right:0,
    borderWidth:1,
    height:15,
    width:15,
    borderRadius:50,
    backgroundColor:colors.red,
    color:"black",
    top:0,
    fontSize:8,
    zIndex:1,
    textAlign:'center',
    fontWeight:"bold",
    elevation:10
  },
  linear:{flex:1}
});

