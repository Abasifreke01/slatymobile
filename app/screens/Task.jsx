import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function Task() {
  const [activeField, setActiveField] = useState(null);

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Task</Text>
      <Text style={styles.subtitle}>Fill the form appropriately where needed</Text>
      
      {['Name', 'Registration Number', 'School', 'Faculty', 'Department', 'Task', 'Course', 'Course Code', 'Name of Supervisor/Lecturer', 'Timeline', 'Description/Title'].map((field, index) => (
        <TextInput
          key={index}
          style={[
            styles.input,
            activeField === field && styles.activeInput,
          ]}
          placeholder={field}
          placeholderTextColor="#B0B0B0"
          onFocus={() => handleFocus(field)}
          onBlur={handleBlur}
        />
      ))}

      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20, // Spacing between title and input fields
  },
  input: {
    height: 50,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#152428', // Background color
    color: '#013220', // Text color inside the input
    paddingHorizontal: 10,
    marginBottom: 25, // Increased spacing between input fields
  },
  activeInput: {
    borderColor: '#E6F6F4', // Border color when active
  },
  continueButton: {
    backgroundColor: '#15A581', // Updated button color
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white', // Changed text color to white for better contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
});
