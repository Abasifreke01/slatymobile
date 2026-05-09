import React, { useState, useEffect, memo, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUserId, fetchCompletedTasksByTutor } from '../../authFunctions';
import MoneyIcon from '../../../components/TutorComponents/MoneyIcon';
import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


const PayoutFooter = memo(({ userId }: { userId: string }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const loadPaymentDetails = async () => {
            if (!userId) return;
            setLoadingDetails(true);
            try {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setAccountNumber(data.accountNumber || '');
                    setAccountName(data.accountName || '');
                    setBankName(data.bankName || '');
                }
            } catch (error) {
                console.error("Error loading payment details:", error);
            } finally {
                setLoadingDetails(false);
            }
        };
        loadPaymentDetails();
    }, [userId]);

    const handleSave = async () => {
        if (!accountNumber || !accountName || !bankName) {
            Alert.alert("Missing Information", "Please fill in all fields");
            return;
        }

        setIsSaving(true);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                accountNumber,
                accountName,
                bankName,
                paymentDetailsUpdated: new Date()
            });
            Alert.alert("Success", "Payment details updated successfully");
        } catch (error) {
            console.error("Error saving payment details:", error);
            Alert.alert("Error", "Failed to save payment details");
        } finally {
            setIsSaving(false);
        }
    };

    if (loadingDetails) return <ActivityIndicator size="small" color="#1AD4A6" className="my-10" />;

    return (
        <View className="mt-6 mb-10 px-4">
            <Text className="text-white text-xl font-bold mb-4">Payout Method</Text>
            <View className="bg-[#201c2e] p-6 rounded-2xl border border-[#1AD4A6]/10">
                <Text className="text-gray-400 mb-2 ml-1">Account Number</Text>
                <TextInput
                    className="bg-[#151320] text-white p-4 rounded-xl mb-4 border border-[#1AD4A6]/10"
                    placeholder="Enter Account Number"
                    placeholderTextColor="#555"
                    keyboardType="numeric"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                />

                <Text className="text-gray-400 mb-2 ml-1">Account Name</Text>
                <TextInput
                    className="bg-[#151320] text-white p-4 rounded-xl mb-4 border border-[#1AD4A6]/10"
                    placeholder="Enter Account Name"
                    placeholderTextColor="#555"
                    value={accountName}
                    onChangeText={setAccountName}
                />

                <Text className="text-gray-400 mb-2 ml-1">Bank Name</Text>
                <TextInput
                    className="bg-[#151320] text-white p-4 rounded-xl mb-6 border border-[#1AD4A6]/10"
                    placeholder="Enter Bank Name"
                    placeholderTextColor="#555"
                    value={bankName}
                    onChangeText={setBankName}
                />

                <TouchableOpacity
                    className={`bg-[#1AD4A6] p-4 rounded-xl items-center ${isSaving ? 'opacity-70' : ''}`}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
});

const TutorPayments = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [completedTasks, setCompletedTasks] = useState<any[]>([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const userId = getCurrentUserId();
        if (!userId) return;

        setLoading(true);
        try {
            // Fetch completed tasks
            const tasks = await fetchCompletedTasksByTutor(userId);
            setCompletedTasks(tasks);

            // Calculate total earnings (80% for tutor)
            const total = tasks.reduce((sum: number, task: any) => {
                const amount = parseFloat(task.amount || task.price || '0');
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            setTotalEarnings(total * 0.8); // Tutor gets 80%
        } catch (error) {
            console.error("Error loading payment data:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = useCallback(() => (
        <View className="mb-8 rounded-3xl bg-[#1AD4A6] p-8 items-center shadow-lg shadow-[#1AD4A6]/20">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20 mb-4">
                <MoneyIcon color="white" width={32} height={32} />
            </View>
            <Text className="text-white/80 text-lg mb-1">Your Earnings (80%)</Text>
            <Text className="text-white text-5xl font-bold">N {totalEarnings.toLocaleString()}</Text>
            <Text className="text-white/60 text-xs mt-2 italic">A 20% processing fee is applied</Text>
        </View>
    ), [totalEarnings]);

    const renderFooter = useCallback(() => <PayoutFooter userId={getCurrentUserId() || ''} />, []);

    const renderEmpty = useCallback(() => (
        <View className="flex-1 items-center justify-center py-20">
            <MaterialCommunityIcons name="wallet-outline" size={64} color="#666" />
            <Text className="mt-4 text-gray-400 text-lg text-center">
                No completed tasks yet.{"\n"}Accept and finish tasks to earn!
            </Text>
        </View>
    ), []);

    const renderItem = useCallback(({ item }: { item: any }) => {
        const fullAmount = parseFloat(item.amount || item.price || '0');
        const tutorShare = fullAmount * 0.8;

        return (
            <View className="mb-4 rounded-2xl bg-[#201c2e] p-5 border border-[#1AD4A6]/10">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-lg font-bold text-white flex-1 mr-2" numberOfLines={1}>
                        {item.name || item.className || 'Untitled Task'}
                    </Text>
                    <Text className="text-[#1AD4A6] font-bold text-lg">
                        N {tutorShare.toLocaleString()}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Feather name="calendar" size={14} color="#666" />
                        <Text className="ml-1 text-gray-400 text-xs">
                            {item.completedAt ? new Date(item.completedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                    <Text className="text-gray-500 text-[10px]">
                        Total: N {fullAmount.toLocaleString()} (20% fee)
                    </Text>
                </View>
            </View>
        );
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#151320]">
            <View className="flex-row items-center justify-between px-4 py-2">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={20}
                >
                    <Feather name="chevron-left" size={28} color="#E6F6F4" />
                </TouchableOpacity>
                <View style={{ width: 28 }} />
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#1AD4A6" />
                </View>
            ) : (
                <FlatList
                    data={completedTasks}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                />
            )}
        </SafeAreaView>
    );
};

export default TutorPayments;
