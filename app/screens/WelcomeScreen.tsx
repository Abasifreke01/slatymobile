import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/images/loginlogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Choose how you want to continue</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('StackLogin')} // Using StackLogin to avoid conflict with TutorLogin if needed, checking index.tsx screen name
                >
                    <Text style={styles.buttonText}>Login as Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.tutorButton]}
                    onPress={() => navigation.navigate('TutorLogin')}
                >
                    <Text style={styles.buttonText}>Login as Tutor</Text>
                </TouchableOpacity>

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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 100,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#15A581',
        width: '100%',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    tutorButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#15A581',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
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
        color: '#15A581',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
});

export default WelcomeScreen;
