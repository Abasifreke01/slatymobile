import { View, Image, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const AcceptImage = require("../../assets/images/Group 14.png");

export default function Accept() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Main'); // Navigate to the Main tab navigator
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, [navigation]);

  return (
    <SafeAreaView style={styles.viewStyles}>
      <Text style={styles.textStyle}>Successful!</Text>
      <Image source={AcceptImage} style={styles.imageStyle} />
      <Text style={styles.textStylesecond}>
        You will be directed to your dashboard in a few seconds.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  textStyle: {
    fontSize: 40,
    color: '#97F5DD',
    textAlign: 'center',
  },
  textStylesecond: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  imageStyle: {
    width: 450,
    height: 450,
    marginVertical: 20,
  },
});
