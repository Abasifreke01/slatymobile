import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import colors from '../data/colors';

const Schedule3 = () => {
  const [activeButton, setActiveButton] = useState(null);

  const handlePress = (buttonId) => {
    setActiveButton(buttonId); 
  };

  const styler = (buttonId) =>
    activeButton === buttonId ? styles.activeText : styles.inactiveText;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.pressable} onPress={() => handlePress('Task')}>
            <Text style={styler('Task')}>Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pressable} onPress={() => handlePress('Calendar1')}>
            <Text style={styler('Calendar1')}>Calendar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoalBlack,
  },
  headerContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomColor: colors.greyMist,
    // justifyContent:"space-between"
  },
  activeText: {
    borderBottomColor: colors.emeraldGlow,
    borderBottomWidth: 3,
    paddingVertical: 20,
    color: 'white',
    paddingHorizontal:70,
    
  },
  inactiveText: {
    paddingVertical: 20,
    color: 'gray',
  },
  pressable:{
    flex:0.5,
    justifyContent:"center",
    alignItems:"center"
  }
});

export default Schedule3;
