import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth
import { collection, query, onSnapshot, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

// Import your screens
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import Onboarding2 from './screens/Onboarding2';
import ForgotPassword from './screens/ForgotPassword';
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
import CBTScreen from './CBTScreen';
import Classpayment from './screens/ClassPayment';
import AdminUploadScreen from './AdminUploadScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import TutorLogin from './screens/TutorScreens/TutorLogin';
import TutorRegister from './screens/TutorScreens/TutorRegister';
import TutorTabs from './screens/TutorScreens/TutorTabs';
import TaskDetails from './screens/TutorScreens/TaskDetails';
import TutorPayments from './screens/TutorScreens/TutorPayments';

import Notifications from './screens/Notifications';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [communityUnread, setCommunityUnread] = useState(0);
  const [chatsUnread, setChatsUnread] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listener for Communities
    const qComm = query(collection(db, 'communities'));
    const unsubscribeComm = onSnapshot(qComm, (snapshot) => {
      const commUnread = snapshot.docs.reduce((acc, doc) => acc + (doc.data().unread || 0), 0);
      setCommunityUnread(commUnread);
    }, (error) => {
      if (auth.currentUser) console.error("Error listening to community unread counts:", error);
    });

    // Listener for Private Chats
    const currentUid = auth.currentUser.uid;
    const qChats = query(
      collection(db, 'privateChats'),
      where('participants', 'array-contains', currentUid)
    );
    const unsubscribeChats = onSnapshot(qChats, (snapshot) => {
      const chatsUnread = snapshot.docs.reduce((acc, doc) => {
        const count = doc.data()[`unread_${currentUid}`] || 0;
        return acc + count;
      }, 0);
      setChatsUnread(chatsUnread);
    }, (error) => {
      if (auth.currentUser) console.error("Error listening to private chat unread counts:", error);
    });

    return () => {
      unsubscribeComm();
      unsubscribeChats();
    };
  }, [auth.currentUser]);

  useEffect(() => {
    setUnreadMessagesCount(communityUnread + chatsUnread);
  }, [communityUnread, chatsUnread]);

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
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authenticatedUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
        setUser(authenticatedUser);
      } else {
        setUser(null);
        setUserRole(null);
      }
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <Image source={require('../assets/images/loginlogo.png')} style={{ width: 300, height: 100 }} resizeMode="contain" />
      </View>
    );
  }

  const linking = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        Classpayment: 'classpayment',
      },
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer independent={true} linking={linking}>
        <Stack.Navigator>
          {user ? (
            // Authenticated Screens
            <>
              {userRole === 'tutor' ? (
                <Stack.Screen name='TutorTabs' component={TutorTabs} options={{ headerShown: false }} />
              ) : (
                <Stack.Screen name='Main' component={MyTabs} options={{ headerShown: false }} />
              )}
              <Stack.Screen name='Tutorsprofile' component={Tutorsprofile} options={{ headerShown: false }} />
              <Stack.Screen name='Reachtutor' component={Reachtutor} options={{ headerShown: false }} />
              <Stack.Screen name='Task' component={Task} options={{ headerShown: false }} />
              <Stack.Screen name='Communities' component={Communities} options={{ headerShown: false }} />
              <Stack.Screen name='Messages' component={Messages} options={{ headerShown: false }} />
              <Stack.Screen name='VideoCall' component={VideoCall} options={{ headerShown: false }} />
              <Stack.Screen name='Detail' component={DetailScreen} options={{ headerShown: false }} />
              <Stack.Screen name='TaskDetails' component={TaskDetails} options={{ headerShown: false }} />
              <Stack.Screen name='Notifications' component={Notifications} options={{ headerShown: false }} />
              <Stack.Screen name='Payment' component={TutorPayments} options={{ headerShown: false }} />
              <Stack.Screen name='Accept' component={Accept} options={{ headerShown: false }} />
              <Stack.Screen name='Personal' component={Personal} options={{ headerShown: false }} />
              <Stack.Screen name='Classpayment' component={Classpayment} options={{ headerShown: false }} />
            </>
          ) : (
            // Unauthenticated Screens
            <>
              <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name='StackLogin' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='TutorLogin' component={TutorLogin} options={{ headerShown: false }} />
              <Stack.Screen name='Loginsocial' component={Loginsocial} options={{ headerShown: false }} />
              <Stack.Screen name='Registersocial' component={Registersocial} options={{ headerShown: false }} />
              <Stack.Screen name='TutorRegister' component={TutorRegister} options={{ headerShown: false }} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
              <Stack.Screen name='Onboarding2' component={Onboarding2} options={{ headerShown: false }} />
            </>
          )}

          {/* Admin or Always accessible */}
          <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name='CBTScreen' component={CBTScreen} options={{ headerShown: false }} />
          <Stack.Screen name='AdminUploadScreen' component={AdminUploadScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
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
