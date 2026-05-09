// app/ClassPayment.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";

export default function ClassPayment({ route, navigation }) {
  const { linkId, studentId, email } = route.params || {};

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [reference, setReference] = useState(null);
  const [showClass, setShowClass] = useState(false);
  const [retries, setRetries] = useState(0);

  const webViewRef = useRef(null);
  const classWebViewRef = useRef(null);

  /* ---------------- INIT PAYMENT ---------------- */
  useEffect(() => {
    if (!linkId || !studentId || !email) {
      Alert.alert("Error", "Missing payment details");
      navigation.goBack();
      return;
    }

    const initPayment = async () => {
      try {
        const response = await fetch(
          "https://slaty-backend.vercel.app/api/init-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkId, studentId, email }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setPaymentUrl(data.authorizationUrl);
          setReference(data.reference);
        } else {
          throw new Error(data.error || "Payment init failed");
        }
      } catch (err) {
        console.error("Init payment error:", err);
        Alert.alert("Error", "Unable to initialize payment");
        navigation.goBack();
      }
    };

    initPayment();
  }, []);

  /* ---------------- PAYMENT HANDLER ---------------- */
  const handlePaymentNavigation = async (navState) => {
    const { url } = navState;

    // ❌ Cancelled
    if (url.includes("paystack.com/close")) {
      Alert.alert("Cancelled", "Payment was cancelled");
      navigation.goBack();
      return;
    }

    // ✅ Success
    if (url.includes("paystack.com/pay")) {
      try {
        const verifyRes = await fetch(
          "https://slaty-backend.vercel.app/api/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference, linkId, studentId }),
          }
        );

        const result = await verifyRes.json();

        if (result.success) {
          setShowClass(true); // 🚀 switch to Jitsi WebView
        } else {
          throw new Error("Verification failed");
        }
      } catch (err) {
        console.error("Verify error:", err);
        Alert.alert("Error", "Payment verification failed");
        navigation.goBack();
      }
    }
  };

  /* ---------------- AUTO RECONNECT ---------------- */
  useEffect(() => {
    if (!showClass) return;

    if (retries >= 3) {
      Alert.alert(
        "Connection failed",
        "Unable to reconnect to the class."
      );
      navigation.goBack();
      return;
    }

    const interval = setInterval(() => {
      classWebViewRef.current?.reload();
      setRetries((r) => r + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [showClass, retries]);

  /* ---------------- CALL TIMEOUT (1 HOUR) ---------------- */
  useEffect(() => {
    if (!showClass) return;

    const timeout = setTimeout(() => {
      Alert.alert("Session ended", "Class time has ended");
      navigation.goBack();
    }, 60 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [showClass]);

  /* ---------------- JITSI CONFIG ---------------- */
  const roomUrl = `https://meet.jit.si/Slaty-${linkId}-student
    #config.startWithAudioMuted=true
    &config.startWithVideoMuted=true
    &config.disableDeepLinking=true
    &config.enableWelcomePage=false
    &interfaceConfig.TOOLBAR_BUTTONS=microphone,camera,hangup,fullscreen`;

  const injectedJS = `
    document.addEventListener('conferenceLeft', () => {
      window.ReactNativeWebView.postMessage('hangup');
    });
    true;
  `;

  /* ---------------- LOADING ---------------- */
  if (!paymentUrl && !showClass) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16DD89" />
        <Text style={styles.loadingText}>Initializing payment…</Text>
      </View>
    );
  }

  /* ---------------- PAYMENT WEBVIEW ---------------- */
  if (!showClass) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <View style={{ width: 40 }} />
        </View>
        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handlePaymentNavigation}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit={false}
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  /* ---------------- JITSI CLASS WEBVIEW ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <WebView
        ref={classWebViewRef}
        source={{ uri: roomUrl }}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
        androidLayerType="hardware"
        injectedJavaScript={injectedJS}
        onMessage={(event) => {
          if (event.nativeEvent.data === "hangup") {
            navigation.goBack();
          }
        }}
        startInLoadingState
        scalesPageToFit={false}
        style={{ flex: 1 }}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#151320",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    width: 40,
  },
  backIcon: {
    color: '#1DE9B6',
    fontSize: 24,
  },
});
