import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { WebView } from "react-native-webview";
import { Camera } from "expo-camera";

const BACKEND_URL = "https://slaty-backend.vercel.app/api";

const TutorHostClass = () => {
    const [className, setClassName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [shareLink, setShareLink] = useState(null);
    const [startClass, setStartClass] = useState(false);

    // For now, hardcoding tutorId (replace with Firebase Auth user.uid)
    const tutorId = "TUTOR_UID_EXAMPLE";

    const handleCreateLink = async () => {
        if (!className || !amount) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending request to:", `${BACKEND_URL}/create-link`);
            const response = await fetch(`${BACKEND_URL}/create-link`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorId,
                    classId: className.trim().replace(/\s+/g, "-").toLowerCase(),
                    amount: parseInt(amount, 10),
                }),
            });

            const rawText = await response.text();
            console.log("Response status:", response.status);
            console.log("Raw response body:", rawText);

            // Check for HTTP errors first
            if (!response.ok) {
                try {
                    const errData = JSON.parse(rawText);
                    throw new Error(errData.error || `Server Error: ${response.status}`);
                } catch {
                    throw new Error(`Server Error: ${rawText}`);
                }
            }

            let data;
            try {
                data = JSON.parse(rawText);
            } catch (e) {
                console.error("❌ JSON Parse Error:", e);
                throw new Error(`Invalid server response: ${rawText}`);
            }

            if (data.error) {
                Alert.alert("Error", data.error);
            } else if (data.link || data.deepLink) {   // ✅ unified
                setShareLink(data.link || data.deepLink);
            } else {
                Alert.alert("Error", "Unexpected server response");
                console.log("Unexpected response:", data);
            }
        } catch (err) {
            console.error("Create class error:", err);
            const errorMessage = err instanceof Error ? err.message : "Something went wrong creating link";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (shareLink) {
            await Clipboard.setStringAsync(shareLink);
            Alert.alert("Copied!", "Link copied to clipboard.");
        }
    };

    const shareLinkHandler = async () => {
        if (shareLink && (await Sharing.isAvailableAsync())) {
            await Sharing.shareAsync(shareLink);
        }
    };

    const classId = className.trim().replace(/\s+/g, "-").toLowerCase();
    // const tutorRoomUrl = "https://www.google.com";
    // RESTORED PRODUCTION URL
    const tutorRoomUrl = `https://meet.jit.si/slaty-${classId}#config.disableDeepLinking=true&config.prejoinPageEnabled=false`;

    if (startClass) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#151320" }} edges={['top', 'bottom']}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: "#151320",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setStartClass(false)}
                        style={{
                            backgroundColor: "#ef4444",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "bold" }}>End Class</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <WebView
                        source={{ uri: tutorRoomUrl }}
                        userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        opacity={0.99}
                        androidLayerType="hardware" // WebRTC requires hardware acceleration
                        style={{ flex: 1 }}
                        containerStyle={{ flex: 1 }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                        mediaCapturePermissionGrantType="grant" // Grant camera/mic permissions to WebView
                        injectedJavaScript={`
              window.open = function(url) {
                window.location.href = url;
              };
            `}
                        javaScriptCanOpenWindowsAutomatically={true}
                        onShouldStartLoadWithRequest={(request) => {
                            // Force all navigation to stay in the WebView
                            return true;
                        }}
                        renderLoading={() => (
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#151320' }}>
                                <ActivityIndicator size="large" color="#ffffff" />
                                <Text style={{ color: 'white', marginTop: 10 }}>Loading Class Room...</Text>
                            </View>
                        )}
                        onLoadStart={() => console.log(`WebView loading URL`)}
                        onLoadEnd={() => console.log("WebView loaded URL")}
                        onError={(e) => {
                            console.warn('WebView error: ', e.nativeEvent);
                            Alert.alert('WebView Error', e.nativeEvent.description || 'Unknown error');
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-[#151320] p-6">


            <Text className="text-white mb-2">Class Name</Text>
            <TextInput
                placeholder="Enter class name"
                placeholderTextColor="#aaa"
                value={className}
                onChangeText={setClassName}
                className="bg-white/10 text-white p-3 rounded-xl mb-4"
            />

            <Text className="text-white mb-2">Amount (₦)</Text>
            <TextInput
                placeholder="Enter amount"
                placeholderTextColor="#aaa"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="bg-white/10 text-white p-3 rounded-xl mb-6"
            />

            <TouchableOpacity
                onPress={handleCreateLink}
                disabled={loading}
                className="bg-blue-600 p-4 rounded-xl items-center"
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-bold">Generate Link</Text>
                )}
            </TouchableOpacity>

            {/* START CLASS (TUTOR) */}
            <TouchableOpacity
                onPress={async () => {
                    if (!className) {
                        Alert.alert("Error", "Please enter a class name to start");
                        return;
                    }

                    // Request permissions before starting
                    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
                    const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();

                    if (cameraStatus !== 'granted' || micStatus !== 'granted') {
                        Alert.alert("Error", "Camera and Microphone permissions are required to start a class.");
                        return;
                    }

                    setStartClass(true);
                }}
                style={{
                    backgroundColor: "#16a34a",
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 16,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.2)",
                }}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
                    Start Class (Tutor)
                </Text>
            </TouchableOpacity>

            {shareLink && (
                <View className="mt-6 p-4 bg-white/10 rounded-xl">
                    <Text className="text-white mb-2">Your Shareable Link:</Text>
                    <Text selectable className="text-blue-400 underline">
                        {shareLink}
                    </Text>

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity
                            onPress={copyToClipboard}
                            className="bg-green-600 p-3 rounded-lg flex-1 mr-2 items-center"
                        >
                            <Text className="text-white">Copy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={shareLinkHandler}
                            className="bg-purple-600 p-3 rounded-lg flex-1 ml-2 items-center"
                        >
                            <Text className="text-white">Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default TutorHostClass;
