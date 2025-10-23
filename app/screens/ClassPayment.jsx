// app/ClassPayment.jsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function ClassPayment({ route, navigation }) {
  const { classId, studentId, amount } = route.params || {};
  const [paymentUrl, setPaymentUrl] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (!classId || !studentId || !amount) {
      Alert.alert("Error", "Missing payment details");
      navigation.goBack();
      return;
    }

    // Call backend to generate Paystack checkout URL
    const initPayment = async () => {
      try {
        const response = await fetch("https://slaty-backend.vercel.app/api/init-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId, studentId, amount }),
        });
        const data = await response.json();

        if (data.success && data.authorization_url) {
          setPaymentUrl(data.authorization_url);
        } else {
          Alert.alert("Error", "Failed to initialize payment");
          navigation.goBack();
        }
      } catch (err) {
        console.error("Payment init error:", err);
        Alert.alert("Error", "Could not connect to payment server");
        navigation.goBack();
      }
    };

    initPayment();
  }, []);

  const handleWebViewNav = async (navState) => {
    const { url } = navState;

    // Detect Paystack redirect
    if (url.includes("paystack.com/close")) {
      Alert.alert("Cancelled", "Payment was cancelled");
      navigation.goBack();
    }

    if (url.includes("verify-payment")) {
      try {
        const params = new URLSearchParams(url.split("?")[1]);
        const reference = params.get("reference");

        // Verify payment with backend
        const verify = await fetch("https://slaty-backend.vercel.app/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, studentId, classId }),
        });
        const result = await verify.json();

        if (result.success) {
          Alert.alert("Success", "You are enrolled in this class!");
          navigation.replace("Classroom", { classId });
        } else {
          Alert.alert("Error", "Payment verification failed");
          navigation.goBack();
        }
      } catch (err) {
        console.error("Verify error:", err);
        Alert.alert("Error", "Something went wrong verifying payment");
        navigation.goBack();
      }
    }
  };

  if (!paymentUrl) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16DD89" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading payment...</Text>
      </View>
    );
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleWebViewNav}
      startInLoadingState
      renderLoading={() => (
        <ActivityIndicator
          size="large"
          color="#16DD89"
          style={{ marginTop: 20 }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#151320",
    alignItems: "center",
    justifyContent: "center",
  },
});
