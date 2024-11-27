import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawernavigator from './Drawernavigator';
import { NavigationIndependentTree } from '@react-navigation/native';
// Import your screens here
import HomeScreen from './screens/HomeScreen'; 
import DetailScreen from './screens/DetailScreen'; 
import Onboarding2 from './screens/Onboarding2';
import Dashboard from './screens/Dashboard';
import FindTutor from './screens/FindTutor';
import LiveClasses from './screens/LiveClasses'; 
import Connect from './screens/Connect'; 
import Personal from './screens/Personal'; 
import Login from './screens/Login';
import Loginsocial from './screens/Loginsocial';
import Accept from './screens/Accept';
import Registersocial from './screens/Registersocial';
import Tutorsprofile from './screens/Tutorsprofile';
import Reachtutor from './screens/Reachtutor';
import Task from './screens/Task';
import Communities from './screens/Communities';
import Messages from './screens/Messages';
import VideoCall from './screens/VideoCall'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(3);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'black',
          borderRadius: 15,
          height: 90,
        },
      }}
    >
      {[
        { name: "Home", component: Dashboard, icon: require('../assets/images/ion_home-outline.png') },
        { name: "Find Tutor", component: FindTutor, icon: require('../assets/images/icon-park-outline_find.png') },
        { name: "Live Classes", component: LiveClasses, icon: require('../assets/images/ri_live-line.png') },
        { name: "Connect", component: Connect, icon: require('../assets/images/heroicons-outline_chat-alt.png') },
        { name: "Personal", component: Personal, icon: require('../assets/images/iconamoon_profile-bold.png') },
      ].map(({ name, component, icon }) => (
        <Tab.Screen 
          key={name} 
          name={name} 
          component={component} 
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Image
                  source={icon}
                  style={[styles.iconStyle, { tintColor: focused ? '#1DE9B6' : '#748c94' }]}
                />
                {name === "Connect" && unreadMessagesCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
                  </View>
                )}
                <Text style={[styles.iconText, { color: focused ? '#1DE9B6' : '#748c94' }]}>{name}</Text>
              </View>
            ),
          }} 
        />
      ))}
    </Tab.Navigator>
  );
};

const App = () => { 
  return ( 
    <GestureHandlerRootView style={{ flex: 1 }}> 
    <NavigationIndependentTree>
      <NavigationContainer>      
        <Stack.Navigator initialRouteName='HomeScreen'> 
          <Stack.Screen name='Main' component={MyTabs} options={{ headerShown: false }} />
          <Stack.Screen name='Drawer' component={Drawernavigator} options={{ headerShown: false }} />
          <Stack.Screen name='Login' component={Login} /> 
          <Stack.Screen name='Loginsocial' component={Loginsocial} />
          <Stack.Screen name='Accept' component={Accept} />
          <Stack.Screen name='Registersocial' component={Registersocial} />
          <Stack.Screen name='Tutorsprofile' component={Tutorsprofile} />
          <Stack.Screen name='Reachtutor' component={Reachtutor} />
          <Stack.Screen name='Task' component={Task} />
          <Stack.Screen name='Communities' component={Communities} />
          <Stack.Screen name='Messages' component={Messages} />   
          <Stack.Screen name='VideoCall' component={VideoCall} />
          <Stack.Screen name='HomeScreen' component={HomeScreen} /> 
          <Stack.Screen name='Detail' component={DetailScreen} /> 
          <Stack.Screen name='Onboarding2' component={Onboarding2}/>
        </Stack.Navigator> 
      </NavigationContainer> 
    </NavigationIndependentTree>
    </GestureHandlerRootView> 
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default App;
