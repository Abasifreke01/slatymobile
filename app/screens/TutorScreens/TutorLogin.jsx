import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function TutorLogin() {
    const navigation = useNavigation();
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // ✅ Check if user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().role === 'tutor') {
                        // Navigation is handled by index.tsx
                    }
                } catch (err) {
                    console.log('Error checking user role:', err);
                }
            }
            setCheckingAuth(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        setError('');
        if (!identifier || !password) {
            setError('Please enter both email/username and password.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setLoading(true);

        try {
            let userCredential;
            let uid;
            let userDocRef;

            if (emailPattern.test(identifier)) {
                // Login via email
                userCredential = await signInWithEmailAndPassword(auth, identifier, password);
                uid = userCredential.user.uid;
                userDocRef = doc(db, 'users', uid);
            } else {
                // Login via username (assuming usernames are stored as document IDs)
                const usernameDoc = await getDoc(doc(db, 'users', identifier));
                if (!usernameDoc.exists()) {
                    setError('User not found.');
                    return;
                }
                const email = usernameDoc.data().email;
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                uid = userCredential.user.uid;
                userDocRef = doc(db, 'users', uid);
            }

            // Fetch user profile
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                setError('User profile not found.');
                return;
            }

            const userData = userDoc.data();
            if (userData.role !== 'tutor') {
                setError('Access denied. Only tutors can sign in here.');
                return;
            }

            // ✅ Success: index.tsx will navigate based on role

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        navigation.navigate('TutorRegister');
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    // ✅ Show loading while checking auth state
    if (checkingAuth) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#15A581" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Image source={require('../../../assets/images/loginlogo.png')} style={styles.logo} />
                <Text style={styles.title}>Login to your account</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TextInput
                    style={[styles.input, isEmailFocused && styles.inputFocused]}
                    placeholder="Email or Username"
                    placeholderTextColor="#ffffff"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    value={identifier}
                    onChangeText={setIdentifier}
                />

                <View style={styles.forgotPasswordContainer}>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={[styles.input, isPasswordFocused && styles.inputFocused]}
                    placeholder="Password"
                    placeholderTextColor="#ffffff"
                    secureTextEntry
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    value={password}
                    onChangeText={setPassword}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#15A581" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>Sign in with password</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>
                        Don’t have an account?
                        <Text onPress={handleSignUp} style={styles.signUpLink}> Sign up</Text>
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>By continuing, you agree to our</Text>
                    <View style={styles.linkRow}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://slatyweb.blogspot.com/2026/03/slatys-terms-of-service-privacy-policy.html')}>
                            <Text style={styles.link}>Terms of Service</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerText}> and </Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://slatyweb.blogspot.com/2026/03/slatys-terms-of-service-privacy-policy.html')}>
                            <Text style={styles.link}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    innerContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 20,
    },
    logo: {
        width: 350,
        height: 100,
        marginBottom: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#152428',
        borderRadius: 12,
        paddingHorizontal: 10,
        color: '#ffffff',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputFocused: {
        borderColor: '#16dd89',
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 15,
    },
    forgotPasswordText: {
        color: '#16dd89',
        fontSize: 14,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#15A581',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
    },
    signUpText: {
        color: '#ffffff',
        fontSize: 14,
    },
    signUpLink: {
        color: '#16dd89',
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff0000',
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        width: '100%',
    },
    footerText: {
        color: '#777',
        fontSize: 12,
    },
    linkRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        color: '#16dd89',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
});
