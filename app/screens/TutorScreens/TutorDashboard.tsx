import Banner from '../../../components/TutorComponents/Banner';
import EmptyActivityList from '../../../components/TutorComponents/EmptyActivityList';
import TutorHeader from '../../../components/TutorComponents/Header';
import StickyHeader from '../../../components/TutorComponents/StickyHeader';
import TutorListItem from '../../../components/TutorComponents/TutorListItem';
import Button from '../../../components/TutorComponents/Button';
import { activityList } from '../../../components/TutorComponents/data';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useState, useEffect } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUserId, fetchAcceptedTasks } from '../../authFunctions';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const TutorDashboard = () => {
    const navigation = useNavigation<any>();
    const [showBanner, setShowBanner] = useState(true);
    const [acceptedTasks, setAcceptedTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        let unsubscribeSnapshot = () => { };

        const subscribeToUserData = (user: any) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                }, (error: any) => {
                    if (auth.currentUser) {
                        console.error("Error listening to user data in dashboard:", error);
                    }
                });
            }
        };

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            unsubscribeSnapshot();
            subscribeToUserData(user);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeSnapshot();
        };
    }, []);

    useEffect(() => {
        const loadActivity = async () => {
            const userId = getCurrentUserId();
            if (userId) {
                const tasks = await fetchAcceptedTasks(userId);
                setAcceptedTasks(tasks);
            }
            setLoading(false);
        };
        loadActivity();
    }, []);

    const hideBanner = () => setShowBanner(false);
    return (
        <SafeAreaView className="flex-1 bg-[#151320]">
            <View className="relative flex-1 px-4">
                {/* Header Section */}
                <TutorHeader userData={userData} />
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#1DE9B6" />
                    </View>
                ) : (
                    <FlatList
                        ListHeaderComponent={<StickyHeader />}
                        stickyHeaderIndices={[0]}
                        stickyHeaderHiddenOnScroll={false}
                        showsVerticalScrollIndicator={false}
                        data={acceptedTasks}
                        renderItem={({ item }) => (
                            <TutorListItem
                                item={item}
                                onPress={() => navigation.navigate('TaskDetails', { task: item })}
                            />
                        )}
                        ListEmptyComponent={<EmptyActivityList />}
                    />
                )}
                <View className="absolute bottom-0 left-0 right-0 z-10 items-center justify-center">
                    <Button className="w-max p-6 shadow-2xl">
                        <FontAwesome5 name="plus" size={24} color="white" />
                    </Button>
                </View>
                {/* Profile Banner */}
                {showBanner ? <Banner hideBanner={hideBanner} /> : null}
            </View>
        </SafeAreaView>
    );
};
export default TutorDashboard;
