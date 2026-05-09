import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Linking,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
// @ts-ignore
import { auth, db } from "../../firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { getCurrentUserId, fetchAcceptedTasks } from "../../authFunctions";
import TutorListItem from "../../../components/TutorComponents/TutorListItem";
import EmptyActivityList from "../../../components/TutorComponents/EmptyActivityList";

// Images
const profileImg = require("../../../assets/images/profileimg.png");
const bookImg = require("../../../assets/images/rectangle.png");
const carousel = require("../../../assets/images/Carousel-dark.png");
const edit = require("../../../assets/images/bx_edit.png");
const bar = require("../../../assets/images/Group 74.png");
const add = require("../../../assets/images/add.png");
const share = require("../../../assets/images/share.png");
const hamburgerIcon = require("../../../assets/images/hamburger.png");

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp';
const IMGUR_CLIENT_ID = '3dd41ae85c850c8';

const TutorPersonal = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);
    const [specialization, setSpecialization] = useState("Science Tutor");
    const [charge, setCharge] = useState("0");
    const [about, setAbout] = useState("Hello, I am a student passionate about everything that involves calculations.");
    const [modalVisible, setModalVisible] = useState(false);
    const [editField, setEditField] = useState<'specialization' | 'about' | 'charge' | 'password'>('specialization');
    const [tempValue, setTempValue] = useState('');
    const [displayName, setDisplayName] = useState("Tutor");
    const [handle, setHandle] = useState("@tutor");
    const [profilePicture, setProfilePicture] = useState(DEFAULT_AVATAR);
    const [loading, setLoading] = useState(false);
    const [acceptedTasks, setAcceptedTasks] = useState<any[]>([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot = () => { };

        const subscribeToUserData = (user: any) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setDisplayName(data.name || data.username || "Tutor");
                        setHandle(`@${data.username || "tutor"}`);
                        setSpecialization(data.specialization || "Science Tutor");
                        setCharge(data.charge || "0");
                        setAbout(data.about || "Hello, I am a student passionate about everything that involves calculations.");
                        setProfilePicture(data.profilePicture || DEFAULT_AVATAR);
                    } else {
                        console.log("No such user document!");
                    }
                }, (error: any) => {
                    if (auth.currentUser) {
                        console.error("Error listening to user data:", error);
                    }
                });
            } else {
                setDisplayName("Tutor");
                setHandle("@tutor");
            }
        };

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            unsubscribeSnapshot();
            subscribeToUserData(user);
        });

        // Fetch accepted tasks for My Activity
        const loadActivity = async () => {
            const userId = getCurrentUserId();
            if (userId) {
                try {
                    const tasks = await fetchAcceptedTasks(userId);
                    setAcceptedTasks(tasks);
                } catch (error) {
                    console.error("Error fetching activity:", error);
                }
            }
            setActivityLoading(false);
        };
        loadActivity();

        return () => {
            unsubscribeAuth();
            unsubscribeSnapshot();
        };
    }, []);

    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted || !cameraPermission.granted) {
            Alert.alert('Permissions required', 'Please allow camera and gallery access.');
            return;
        }

        Alert.alert(
            'Select Image Source',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 1,
                        });

                        if (!result.canceled) {
                            await handleUpdateProfilePicture(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: 'Gallery',
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 1,
                        });

                        if (!result.canceled) {
                            await handleUpdateProfilePicture(result.assets[0].uri);
                        }
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const uploadToImgur = async (uri: string) => {
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: uri,
                type: 'image/jpeg',
                name: 'profile.jpg',
            } as any);

            const response = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
                },
                body: formData,
            });

            const data = await response.json();
            return data.success && data.data && data.data.link ? data.data.link : null;
        } catch (error) {
            console.error('Imgur upload error:', error);
            return null;
        }
    };

    const handleUpdateProfilePicture = async (uri: string) => {
        const user = auth.currentUser;
        if (!user) return;

        setLoading(true);
        const uploadedImageURL = await uploadToImgur(uri);

        if (uploadedImageURL) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, { profilePicture: uploadedImageURL });
            } catch (error) {
                console.error("Error updating profile picture:", error);
                Alert.alert('Error', 'Could not save profile picture.');
            }
        } else {
            Alert.alert('Upload Failed', 'Unable to upload image.');
        }
        setLoading(false);
    };

    const openEditModal = (field: 'specialization' | 'about' | 'charge', currentVal: string) => {
        setEditField(field);
        setTempValue(currentVal);
        setModalVisible(true);
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            if (editField === 'password') {
                if (tempValue.length < 6) {
                    Alert.alert("Error", "Password must be at least 6 characters long.");
                    return;
                }
                await updatePassword(user, tempValue);
                Alert.alert("Success", "Password updated successfully!");
                setModalVisible(false);
                return;
            }

            const userRef = doc(db, 'users', user.uid);
            const updateData: any = {};
            updateData[editField] = tempValue;
            await updateDoc(userRef, updateData);
            setModalVisible(false);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert("Error", "This operation is sensitive and requires recent authentication. Please log out and log back in again.");
            } else {
                Alert.alert("Error", "Failed to update profile.");
            }
        }
    };

    const handleLogout = () => {
        auth.signOut();
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "To permanently delete your account and associated data, please complete our deletion request form. This ensures we process your request securely and completely.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Open Form",
                    onPress: () => {
                        Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSfgZ3XLTukZ1OdsfZyYDa1hg_LIFokG4k12SD6ajBLkBZjxNw/viewform?usp=header');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Pressable onPress={() => setMenuVisible(true)} hitSlop={15}>
                        <Image source={hamburgerIcon} style={{ width: 24, height: 24, tintColor: 'white' }} />
                    </Pressable>

                    <Modal
                        visible={menuVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setMenuVisible(false)}
                    >
                        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                            <View style={styles.menuOverlay}>
                                <View style={[styles.dropdownMenu, {
                                    position: 'absolute',
                                    top: insets.top + 60,
                                    left: 20,
                                    zIndex: 1000
                                }]}>
                                    <TouchableOpacity
                                        style={styles.menuItemBtn}
                                        onPress={() => {
                                            setMenuVisible(false);
                                            navigation.navigate('Notifications');
                                        }}
                                    >
                                        <Text style={styles.menuItemText}>Notifications</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.menuItemBtn}
                                        onPress={() => {
                                            setMenuVisible(false);
                                            openEditModal('password', '');
                                        }}
                                    >
                                        <Text style={styles.menuItemText}>Change Password</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.menuItemBtn}
                                        onPress={() => {
                                            setMenuVisible(false);
                                            navigation.navigate('Payment');
                                        }}
                                    >
                                        <Text style={styles.menuItemText}>Payments</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.menuItemBtn, { borderBottomWidth: 0 }]}
                                        onPress={() => {
                                            setMenuVisible(false);
                                            handleLogout();
                                        }}
                                    >
                                        <Text style={[styles.menuItemText, { color: '#FF5252' }]}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContainer,
                        { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 150 }
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Header */}
                    <View style={styles.headerSection}>
                        <View style={styles.profileRow}>
                            <View style={styles.profileInfo}>
                                <Text style={[styles.whiteText, styles.nameText]}>{displayName}</Text>
                                <Text style={[styles.whiteText, styles.emailText]}>{handle}</Text>
                                <Text style={[styles.greenText, styles.roleText]}>{specialization}</Text>
                                <View style={styles.chargeRow}>
                                    <Text style={styles.chargeText}>Charge: ₦{charge}</Text>
                                    <Pressable onPress={() => openEditModal('charge', charge)} hitSlop={10}>
                                        <Image source={edit} style={styles.miniEditIcon} />
                                    </Pressable>
                                </View>
                            </View>
                            <Pressable onPress={handleImagePicker} disabled={loading}>
                                <View>
                                    <Image source={{ uri: profilePicture }} style={styles.avatarImg} />
                                    {loading && (
                                        <View style={styles.loaderOverlay}>
                                            <ActivityIndicator color="#1DE9B6" />
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        </View>

                        <Pressable
                            style={styles.specializationTab}
                            onPress={() => openEditModal('specialization', specialization)}
                        >
                            <Text style={styles.whiteText}>{specialization}</Text>
                            <Image source={edit} />
                        </Pressable>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.whiteText, styles.sectionTitle]}>About</Text>
                            <Pressable onPress={() => openEditModal('about', about)} hitSlop={10}>
                                <Image source={edit} style={styles.miniEditIcon} />
                            </Pressable>
                        </View>
                        <View style={styles.aboutCard}>
                            <Text style={styles.aboutText}>{about}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.whiteText}>My Activity</Text>
                            <Pressable>
                                <Text style={styles.greenText}>View all</Text>
                            </Pressable>
                        </View>
                        {activityLoading ? (
                            <ActivityIndicator color="#1DE9B6" />
                        ) : acceptedTasks.length > 0 ? (
                            acceptedTasks.slice(0, 3).map((item) => (
                                <TutorListItem
                                    key={item.key || item.id}
                                    item={item}
                                    onPress={() => navigation.navigate('TaskDetails', { task: item })}
                                />
                            ))
                        ) : (
                            <EmptyActivityList />
                        )}
                    </View>

                    {/* Compliance Feature */}
                    <TouchableOpacity style={styles.complianceLink} onPress={handleDeleteAccount}>
                        <Text style={styles.complianceText}>Delete Account</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Update Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Update {editField}</Text>
                                <TextInput
                                    style={[styles.modalInput, editField === 'about' && { height: 120, textAlignVertical: 'top' }]}
                                    value={tempValue}
                                    onChangeText={setTempValue}
                                    placeholder={`Enter ${editField}`}
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    multiline={editField === 'about'}
                                    secureTextEntry={editField === 'password'}
                                    keyboardType={editField === 'charge' ? 'numeric' : 'default'}
                                />
                                <View style={styles.modalButtons}>
                                    <Pressable
                                        style={[styles.modalBtn, styles.cancelBtn]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.whiteText}>Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.modalBtn, styles.saveBtn]}
                                        onPress={handleSave}
                                    >
                                        <Text style={styles.whiteText}>Save</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#151320",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "transparent",
    },
    backArrow: { color: "white", fontSize: 24 },
    headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
    logoutBtn: { color: "#FF5252", fontSize: 16 },
    menuOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    dropdownMenu: {
        backgroundColor: "#1f1c2f",
        borderRadius: 12,
        padding: 5,
        marginTop: 10,
        width: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    menuItemBtn: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomColor: "rgba(255,255,255,0.05)",
        borderBottomWidth: 1,
    },
    menuItemText: {
        color: "white",
        fontSize: 15,
    },
    chargeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 8,
    },
    chargeText: {
        color: '#1DE9B6',
        fontSize: 14,
        fontWeight: '600',
    },
    miniEditIcon: {
        width: 14,
        height: 14,
        opacity: 0.8,
    },
    scrollContainer: {
        paddingHorizontal: 20,
    },
    headerSection: {
        marginBottom: 20,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    profileInfo: {
        flex: 1,
        paddingRight: 10,
    },
    avatarImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    nameText: { fontWeight: "bold", fontSize: 24 },
    emailText: { fontSize: 13, opacity: 0.7 },
    roleText: { fontSize: 14, marginTop: 8, fontWeight: '600' },
    schoolText: { fontSize: 12, marginTop: 4, opacity: 0.8 },
    specializationTab: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1f1c2f",
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        backgroundColor: "#1f1c2f",
        borderRadius: 20,
        padding: 25,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        elevation: 10,
    },
    modalTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    modalInput: {
        backgroundColor: "#151320",
        borderRadius: 10,
        padding: 15,
        color: "white",
        fontSize: 16,
        marginBottom: 25,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 15,
    },
    modalBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    cancelBtn: {
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    saveBtn: {
        backgroundColor: "#1DE9B6",
    },
    actionRow: {
        flexDirection: "row",
        marginBottom: 25,
        gap: 15,
    },
    addBtn: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1.5,
        backgroundColor: "transparent",
        padding: 12,
        borderColor: "#1DE9B6",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    shareBtn: {
        width: 50,
        backgroundColor: "#1DE9B6",
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        justifyContent: 'center',
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    aboutCard: {
        padding: 20,
        backgroundColor: "#1f1c2f",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    aboutText: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 14,
        lineHeight: 20,
    },
    activityCard: {
        borderRadius: 15,
        padding: 15,
        overflow: 'hidden',
    },
    activityContent: {
        flexDirection: "row",
        alignItems: 'center',
    },
    activityImg: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    activityInfo: {
        flex: 1,
    },
    progressBar: {
        marginTop: 8,
        width: '100%',
        height: 8,
        resizeMode: 'contain',
    },
    coursesWrapper: {
        width: '100%',
    },
    carouselImg: {
        width: '100%',
        height: 200,
        resizeMode: "cover",
        borderRadius: 15,
    },
    whiteText: { color: "white" },
    greenText: { color: "#1DE9B6" },
    boldText: { fontWeight: 'bold', fontSize: 16 },
    subText: { fontSize: 12, opacity: 0.7 },
    tinyText: { fontSize: 10, marginTop: 4, opacity: 0.6 },
    complianceLink: {
        marginTop: 40,
        paddingBottom: 20,
        alignItems: 'center',
    },
    complianceText: {
        color: '#FF5252',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
});

export default TutorPersonal;
