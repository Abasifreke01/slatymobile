import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment } from 'react';
import './global.css';

export default function RootLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" />
    //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    // </Stack>
    <Fragment>
      <Slot />
      <StatusBar style="light" />
    </Fragment>
  );
}
