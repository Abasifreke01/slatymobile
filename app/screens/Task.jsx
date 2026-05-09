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
import { Paystack } from 'react-native-paystack-webview';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export default function Task() {
  const [activeField, setActiveField] = useState(null);
  const [learnerType, setLearnerType] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: '',
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

  const paystackRef = React.useRef();

  const handlePaymentSuccess = async (response) => {
    const reference = response.reference;
    // setShowWebView(false); // Library handles its own closing usually, or use ref

    // Ensure we have a user before writing
    let currentUser = auth.currentUser;
    if (!currentUser) {
      try {
        const cred = await signInAnonymously(auth);
        currentUser = cred.user;
      } catch (e) {
        console.error("Auth recovery failed", e);
        Alert.alert("Authentication Failed", "Could not sign in anonymously. Please enable Anonymous Auth in Firebase Console.");
        return;
      }
    }

    try {
      await addDoc(collection(db, 'task'), {
        ...form,
        learnerType,
        paymentReference: reference,
        amountPaid: parseFloat(form.amount),
        status: 'pending', // or 'open'
        createdAt: serverTimestamp(),
        userEmail: currentUser?.email || form.email,
        userId: currentUser?.uid,
      });
      Alert.alert('✅ Payment Successful', `Reference: ${reference}\nTask posted to task list.`);
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('⚠️ Payment Successful', `Reference: ${reference}\nBut failed to post to task list.\nUser: ${currentUser?.uid}\nError: ${error.message}`);
    }
  };

  const universityFields = [
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

  const otherFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'amount', label: 'Amount (₦)', keyboardType: 'numeric' },
    { key: 'description', label: 'Description/Title', multiline: true, height: 100 },
  ];

  const getFields = () => {
    switch (learnerType) {
      case 'general': return otherFields;
      case 'university': return universityFields;
      case 'secondary': return otherFields;
      default: return [];
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>Fill the form appropriately where needed</Text>

      <Text style={styles.label}>Task Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={learnerType}
          onValueChange={(itemValue) => setLearnerType(itemValue)}
          style={styles.picker}
          dropdownIconColor="white"
        >
          <Picker.Item label="Select Task Category..." value="" />
          <Picker.Item label="General" value="general" />
          <Picker.Item label="University" value="university" />
          <Picker.Item label="Secondary" value="secondary" />
        </Picker>
      </View>

      {learnerType ? getFields().map(({ key, label, keyboardType, multiline, height }) => (
        <TextInput
          key={key}
          style={[
            styles.input,
            activeField === key && styles.activeInput,
            multiline && { height: height || 100, textAlignVertical: 'top' }
          ]}
          placeholder={label}
          placeholderTextColor="#B0B0B0"
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          value={form[key]}
          onChangeText={(text) => handleChange(key, text)}
          onFocus={() => handleFocus(key)}
          onBlur={handleBlur}
        />
      )) : null}



      <TouchableOpacity
        style={styles.continueButton}
        onPress={async () => {
          if (!form.email || !form.amount || !form.name) {
            Alert.alert('Missing Fields', 'Please enter at least name, email and amount.');
            return;
          }

          // Ensure user is authenticated before payment
          if (!auth.currentUser) {
            try {
              setLoadingWebView(true); // Show loading while signing in
              await signInAnonymously(auth);
            } catch (error) {
              console.error("Anonymous Auth Error:", error);
              setLoadingWebView(false);
              Alert.alert('Authentication Error', 'Could not sign in anonymously. Please log in or contact support.\n' + error.message);
              return;
            }
          }

          setLoadingWebView(false);
          paystackRef.current.startTransaction();
        }}
      >
        <Text style={styles.buttonText}>Pay with Paystack</Text>
      </TouchableOpacity>

      <Paystack
        paystackKey="pk_live_08caf03794fe0f0fd91a9b9107f9026b31f50b4a"
        amount={parseFloat(form.amount)}
        billingEmail={form.email || "student@slaty.com"}
        activityIndicatorColor="#15A581"
        onCancel={() => {
          Alert.alert('❌ Payment Cancelled', 'You cancelled the transaction.');
        }}
        onSuccess={handlePaymentSuccess}
        ref={paystackRef}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'flex-start',
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
    marginBottom: 10,
  },
  label: {
    color: '#07f59e',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#152428',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    color: '#07f59e',
    backgroundColor: '#152428',
  },
  input: {
    height: 50,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#152428',
    color: '#07f59e',
    paddingHorizontal: 10,
    marginBottom: 15,
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
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
