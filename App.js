import React from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HostClassScreen from "./components/Screen1/HomeScreen";
import AboutClassScreen from "./components/Screen2/AboutScreen";
import WaitingRoomScreen from "./components/Screen3/WaitingRoom";
import VideoCallScreen from "./components/Screen4/VideoCall";
import ScreenShareComponent from "./components/icons/Screen 6/ShareScreen";
import ChatRoom from "./components/Screen 5/Chat";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={style.appBackground}>
        {/* Add the StatusBar */}
        <StatusBar
          barStyle={Platform.OS === "ios" ? "light-content" : "light-content"}
          backgroundColor="#1F1E25"
          translucent={false}
        />

        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#1F1E25" },
            headerTintColor: "#ffffff",
            animation: "fade_from_bottom", // Smoother transitions for all screens
          }}
        >
          {/* Host Class */}
          <Stack.Screen
            name="Home"
            component={HostClassScreen}
            options={{
              title: "Host Class",
            }}
          />

          {/* About Class */}
          <Stack.Screen
            name="AboutClass"
            component={AboutClassScreen}
            options={{
              title: "About Class",
            }}
          />

          {/* Waiting Room */}
          <Stack.Screen
            name="WaitingRoom"
            component={WaitingRoomScreen}
            options={{
              title: "Waiting Room",
              animation: "slide_from_right",
            }}
          />

          {/* Video Call */}
          <Stack.Screen
            name="VideoCall"
            component={VideoCallScreen}
            options={{
              title: "Live Classes",
              animation: "slide_from_right",
              headerRight: () => (
                <Ionicons
                  name="menu-outline"
                  size={30}
                  color="white"
                  style={{ marginRight: 15 }}
                  onPress={() => console.log("Menu Pressed")}
                />
              ),
            }}
          />

          {/* Chat Room */}
          <Stack.Screen
            name="Chat"
            component={ChatRoom}
            options={{
              title: "Chatroom",
              animation: "slide_from_bottom",
              headerRight: () => (
                <Ionicons
                  name="menu-outline"
                  size={30}
                  color="white"
                  style={{ marginRight: 15 }}
                  onPress={() => console.log("Menu Pressed")}
                />
              ),
            }}
          />

          {/* Screen Share */}
          <Stack.Screen
            name="ScreenShare"
            component={ScreenShareComponent}
            options={{
              title: "Screen Share",
              animation: "fade_from_bottom",
              headerRight: () => (
                <Ionicons
                  name="menu-outline"
                  size={30}
                  color="white"
                  style={{ marginRight: 15 }}
                  onPress={() => console.log("Menu Pressed")}
                />
              ),
            }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

const style = StyleSheet.create({
  appBackground: {
    flex: 1,
    backgroundColor: "#1F1E25",
  },
});

export default App;
