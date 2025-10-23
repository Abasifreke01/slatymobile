import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function Task() {
  const [activeField, setActiveField] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: '5000',
    registrationNumber: '',
    school: '',
    faculty: '',
    department: '',
    task: '',
    course: '',
    courseCode: '',
    supervisor: '',
    timeline: '',
    description: '',
  });

  const [showWebView, setShowWebView] = useState(false);
  const [loadingWebView, setLoadingWebView] = useState(true);

  const handleFocus = (field) => setActiveField(field);
  const handleBlur = () => setActiveField(null);
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const getPaystackHTML = () => {
    const amountInKobo = parseFloat(form.amount) * 100;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Paystack Payment</title>
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <style>
          body { display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #444; }
        </style>
      </head>
      <body>
        <p>Loading Paystack...</p>
        <script>
          window.onload = function () {
            var handler = PaystackPop.setup({
              key: 'pk_live_08caf03794fe0f0fd91a9b9107f9026b31f50b4a',
              email: '${form.email}',
              amount: ${amountInKobo},
              currency: 'NGN',
              ref: 'REF' + Math.floor(Math.random() * 1000000000 + 1),
              callback: function(response) {
                window.ReactNativeWebView.postMessage('success:' + response.reference);
              },
              onClose: function() {
                window.ReactNativeWebView.postMessage('cancelled');
              }
            });
            handler.openIframe();
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;

    if (message.startsWith('success:')) {
      const reference = message.split(':')[1];
      setShowWebView(false);
      Alert.alert('✅ Payment Successful', `Reference: ${reference}`);
    } else if (message === 'cancelled') {
      setShowWebView(false);
      Alert.alert('❌ Payment Cancelled', 'You cancelled the transaction.');
    }
  };

  const formFields = [
    { key: 'name', label: 'Name' },
    { key: 'registrationNumber', label: 'Registration Number' },
    { key: 'school', label: 'School' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'department', label: 'Department' },
    { key: 'task', label: 'Task' },
    { key: 'course', label: 'Course' },
    { key: 'courseCode', label: 'Course Code' },
    { key: 'supervisor', label: 'Name of Supervisor/Lecturer' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'description', label: 'Description/Title' },
    { key: 'email', label: 'Email' },
    { key: 'amount', label: 'Amount (₦)', keyboardType: 'numeric' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Task</Text>
      <Text style={styles.subtitle}>Fill the form appropriately where needed</Text>

      {formFields.map(({ key, label, keyboardType }) => (
        <TextInput
          key={key}
          style={[styles.input, activeField === key && styles.activeInput]}
          placeholder={label}
          placeholderTextColor="#B0B0B0"
          keyboardType={keyboardType || 'default'}
          value={form[key]}
          onChangeText={(text) => handleChange(key, text)}
          onFocus={() => handleFocus(key)}
          onBlur={handleBlur}
        />
      ))}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          if (!form.email || !form.amount || !form.name) {
            Alert.alert('Missing Fields', 'Please enter at least name, email and amount.');
            return;
          }
          setLoadingWebView(true);
          setShowWebView(true);
        }}
      >
        <Text style={styles.buttonText}>Pay with Paystack</Text>
      </TouchableOpacity>

      {/* Paystack WebView Modal */}
      <Modal visible={showWebView} animationType="slide">
        <View style={{ flex: 1 }}>
          <View style={{ padding: 15, backgroundColor: '#000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Pay with Paystack</Text>
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>

          {loadingWebView && (
            <ActivityIndicator size="large" color="#15A581" style={{ marginTop: 20 }} />
          )}

          <WebView
            originWhitelist={['*']}
            source={{ html: getPaystackHTML() }}
            onMessage={handleWebViewMessage}
            onLoadEnd={() => setLoadingWebView(false)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onError={(event) => {
              console.error('WebView error:', event.nativeEvent);
              setShowWebView(false);
              Alert.alert('Error', 'Failed to load Paystack checkout.');
            }}
          />
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#152428',
    color: '#07f59e',
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  activeInput: {
    borderColor: '#E6F6F4',
  },
  continueButton: {
    backgroundColor: '#15A581',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
