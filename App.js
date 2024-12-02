import React from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HostClassScreen from "./components/Screen1/HomeScreen"; // Ensure correct import path
import AboutClassScreen from "./components/Screen2/AboutScreen"; // Ensure correct import path
import WaitingRoomScreen from "./components/Screen3/WaitingRoom";
import VideoCallScreen from "./components/Screen4/VideoCall";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={style.appBackground}>
        {/* Add the StatusBar */}
        <StatusBar
          barStyle={Platform.OS === "ios" ? "light-content" : "light-content"} // Light content for both platforms
          backgroundColor="#1F1E25" // Set background color for Android
          translucent={false} // Ensure proper spacing on Android
        />

        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#1F1E25" },
            headerTintColor: "#ffffff", // Set text color
          }}
        >
          <Stack.Screen
            name="Home"
            component={HostClassScreen}
            options={{
              title: "Host Class", // Set the name to "Host Class"
            }}
          />
          <Stack.Screen
            name="AboutClass"
            component={AboutClassScreen}
            options={{
              title: "Host Class", // Set the name to "Host Class"
            }}
          />

          <Stack.Screen
            name="WaitingRoom"
            component={WaitingRoomScreen}
            options={{
              title: "Waiting Room", // Set the name to "Waiting Room"
              animation: "slide_from_right",
            }}
          />

          <Stack.Screen
            name="VideoCall"
            component={VideoCallScreen} // Import and add your VideoCallScreen here
            options={{
              title: "Host Class",
              animation: "slide_from_right", // Optional animation
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
