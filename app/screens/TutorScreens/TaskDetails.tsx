import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../../components/TutorComponents/Button';
import MoneyIcon from '../../../components/TutorComponents/MoneyIcon';
import { acceptTask, getCurrentUserId, completeTask } from '../../authFunctions';

const TaskDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { task } = route.params as { task: any };
    const { bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [solutionLink, setSolutionLink] = useState('');

    const isAccepted = task.status === 'accepted';
    const isCompleted = task.status === 'completed';

    const handleAccept = async () => {
        const userId = getCurrentUserId();
        if (!userId) {
            Alert.alert("Error", "You must be logged in to accept tasks.");
            return;
        }

        setLoading(true);
        const result = await acceptTask(task.key, userId);
        setLoading(false);

        if (result.success) {
            Alert.alert("Success", "Task accepted! You can find it in your activity.", [
                { text: "OK", onPress: () => navigation.navigate('TutorDashboard' as never) }
            ]);
        } else {
            Alert.alert("Error", result.error || "Failed to accept task.");
        }
    };

    const handleComplete = async () => {
        if (!solutionLink.trim()) {
            Alert.alert("Error", "Please provide a link to the solution (e.g., Google Drive link).");
            return;
        }

        // Basic URL validation
        if (!solutionLink.startsWith('http')) {
            Alert.alert("Error", "Please enter a valid URL starting with http or https.");
            return;
        }

        setLoading(true);
        try {
            // Mark as completed in Firestore with the link
            const result = await completeTask(task.key, solutionLink.trim(), "Google Drive Link");

            if (result.success) {
                Alert.alert("Success", "Task marked as completed and link shared!", [
                    { text: "OK", onPress: () => navigation.navigate('TutorDashboard' as never) }
                ]);
            } else {
                Alert.alert("Error", result.error || "Failed to complete task.");
            }
        } catch (error: any) {
            console.error("Error during task completion:", error);
            Alert.alert("Error", error.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#151320]">
            <View className="flex-row items-center justify-between px-4 py-2">
                <Feather name="chevron-left" size={24} color="#E6F6F4" onPress={() => navigation.goBack()} />
                <Text className="text-xl font-bold text-white">Task Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: bottom + 120 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6 items-center">
                    <LinearGradient
                        colors={task.gradient || ['#16DD89', '#69EB9C', '#C3FAB0']}
                        style={{ borderRadius: 100, padding: 4 }}
                    >
                        <View className="h-24 w-24 items-center justify-center rounded-full bg-[#151320]">
                            <Text className="text-5xl font-bold text-white">
                                {task.avatar_text || (task.name ? task.name[0] : 'T')}
                            </Text>
                        </View>
                    </LinearGradient>
                    <Text className="mt-4 text-3xl font-bold text-white text-center">
                        {task.name || task.className || 'Untitled Task'}
                    </Text>
                    <View className="mt-2 rounded-full bg-[#1AD4A6]/10 px-4 py-1">
                        <Text className="text-lg text-[#1AD4A6] font-semibold uppercase">
                            {task.status || 'Pending'}
                        </Text>
                    </View>
                </View>

                <View className="mb-6 rounded-2xl bg-[#201c2e] p-6 border border-[#1AD4A6]/20">
                    <View className="mb-4 flex-row items-center gap-4">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#086D6440]">
                            <MaterialCommunityIcons name="clock-time-ten-outline" size={24} color="#1AD4A6" />
                        </View>
                        <View>
                            <Text className="text-sm text-gray-400">Duration</Text>
                            <Text className="text-lg font-semibold text-white">{task.duration || 'Flexible'}</Text>
                        </View>
                    </View>

                    <View className="mb-4 flex-row items-center gap-4">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#086D6440]">
                            <MoneyIcon color="#1AD4A6" />
                        </View>
                        <View>
                            <Text className="text-sm text-gray-400">Budget</Text>
                            <Text className="text-lg font-semibold text-white">N {task.amount || task.price || '0'}</Text>
                        </View>
                    </View>

                    {(task.deadline || task.createdAt) && (
                        <View className="flex-row items-center gap-4">
                            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#086D6440]">
                                <Feather name="calendar" size={24} color="#1AD4A6" />
                            </View>
                            <View>
                                <Text className="text-sm text-gray-400">Date</Text>
                                <Text className="text-lg font-semibold text-white">
                                    {task.deadline || (task.createdAt ? new Date(task.createdAt.seconds * 1000).toLocaleDateString() : '')}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <View className="mb-6">
                    <Text className="mb-3 text-xl font-bold text-white">Description</Text>
                    <Text className="text-lg leading-6 text-gray-300">
                        {task.description || task.desc || 'No description provided for this task.'}
                    </Text>
                </View>

                {task.requirements && (
                    <View className="mb-6">
                        <Text className="mb-3 text-xl font-bold text-white">Requirements</Text>
                        <Text className="text-lg leading-6 text-gray-300">{task.requirements}</Text>
                    </View>
                )}

                {isAccepted && (
                    <View className="mt-4 mb-6">
                        <Text className="mb-3 text-xl font-bold text-white">Share Solution Link</Text>
                        <View className="rounded-2xl border border-[#1AD4A6] bg-[#201c2e] px-4 py-2">
                            <TextInput
                                className="text-white text-base"
                                placeholder="Paste Google Drive or Resource link here"
                                placeholderTextColor="#666"
                                value={solutionLink}
                                onChangeText={setSolutionLink}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <Text className="mt-2 text-xs text-gray-400">
                            Ensure the link is accessible to the student.
                        </Text>
                    </View>
                )}

                {isCompleted && task.sharedFileUrl && (
                    <View className="mt-4 mb-6">
                        <Text className="mb-3 text-xl font-bold text-white">Shared Solution</Text>
                        <View className="rounded-2xl bg-[#201c2e] p-4 border border-[#1AD4A6]/20">
                            <Text className="text-[#1AD4A6] font-semibold mb-2">Resource Link Provided</Text>
                            <Text className="text-gray-300 mb-2" numberOfLines={1}>{task.sharedFileUrl}</Text>
                            <Text className="text-gray-400 text-sm">Task completed on {task.completedAt ? new Date(task.completedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View
                className="absolute bottom-0 left-0 right-0 bg-[#151320] px-6 py-4"
                style={{ paddingBottom: bottom + 20 }}
            >
                {!isCompleted && (
                    <Button
                        className={`w-full items-center justify-center py-4 rounded-xl ${isAccepted ? 'bg-[#1DE9B6]' : 'bg-[#1AD4A6]'}`}
                        onPress={isAccepted ? handleComplete : handleAccept}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-xl font-bold text-white">
                                {isAccepted ? 'Mark as Completed' : 'Accept Task'}
                            </Text>
                        )}
                    </Button>
                )}
            </View>
        </SafeAreaView>
    );
};

export default TaskDetails;
