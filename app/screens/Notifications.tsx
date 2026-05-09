import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { markTasksAsRead } from '../authFunctions';

const Notifications = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const user = auth.currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch completed tasks for this student
                const q = query(
                    collection(db, 'task'),
                    where('userId', '==', user.uid),
                    where('status', '==', 'completed')
                );
                const snapshot = await getDocs(q);
                const completedTasks = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort by completedAt manually if Firestore composite index is missing
                completedTasks.sort((a: any, b: any) =>
                    (b.completedAt?.seconds || 0) - (a.completedAt?.seconds || 0)
                );

                setNotifications(completedTasks);

                // Mark as read once fetched
                if (completedTasks.length > 0) {
                    await markTasksAsRead(user.uid);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View className="mb-4 rounded-2xl bg-[#152428] p-5 border border-[#1AD4A6]/20">
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#1AD4A6]/10">
                        <Feather name="check-circle" size={20} color="#1AD4A6" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-white">{item.name || item.className || 'Task Completed'}</Text>
                        <Text className="text-xs text-gray-400">
                            {item.completedAt ? new Date(item.completedAt.seconds * 1000).toLocaleString() : 'Just now'}
                        </Text>
                    </View>
                </View>
            </View>

            <Text className="text-gray-300 mb-4">
                Your task has been completed by your tutor. You can now download the solution below.
            </Text>

            {item.sharedFileUrl && (
                <TouchableOpacity
                    onPress={() => Linking.openURL(item.sharedFileUrl)}
                    className="flex-row items-center justify-center gap-2 rounded-xl bg-[#1AD4A6] py-3"
                >
                    <Feather name="external-link" size={18} color="white" />
                    <Text className="font-bold text-white">Access Solution Link</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-row items-center px-6 py-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Feather name="chevron-left" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#1AD4A6" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center mt-20">
                            <MaterialCommunityIcons name="bell-off-outline" size={64} color="#333" />
                            <Text className="mt-4 text-gray-500 text-lg">No notifications yet</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default Notifications;
