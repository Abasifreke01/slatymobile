import Button from '../../../components/TutorComponents/Button';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, Platform, Switch, Text, View } from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MoneyIcon from '../../../components/TutorComponents/MoneyIcon';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { fetchTasks } from '../../authFunctions';
import { useNavigation } from '@react-navigation/native';

const TutorFindTopics = () => {
    const navigation = useNavigation();
    const [checked, setChecked] = useState(false);
    const [listings, setListings] = useState<any[]>([]);

    React.useEffect(() => {
        const loadListings = async () => {
            const data = await fetchTasks();
            // Filter out tasks that are already accepted
            const availableTasks = data.filter((task: any) => task.status !== 'accepted' && !task.acceptedBy);
            setListings(availableTasks);
        };
        loadListings();
    }, []);

    const { bottom } = useSafeAreaInsets();
    return (
        <SafeAreaView className="flex-1 bg-[#151320]">
            <View className="flex-1">
                <View className="flex-row justify-between gap-4 px-4">
                    <Feather name="chevron-left" size={24} color="#E6F6F4" onPress={() => navigation.goBack()} />
                    <View className="flex-row gap-4">
                        <MaterialCommunityIcons name="refresh" size={24} color="#E6F6F4" />
                        <Feather name="bell" size={24} color="#E6F6F4" />
                    </View>
                </View>
                <View className="my-2">
                </View>
                <View className="my-5 w-3/4 flex-row items-center gap-2">
                    <Button className="w-full flex-row items-center justify-center gap-2 rounded-none bg-[#086D6440]">
                        <Text className="text-white">Filters</Text>
                        <AntDesign name="filter" size={24} color="#E6F6F4" />
                    </Button>
                    <Button className="w-full flex-row items-center justify-center gap-2 rounded-none bg-[#086D6440]">
                        <Text className="text-white">Quick Apply</Text>
                        <MaterialCommunityIcons
                            name="clock-time-ten-outline"
                            size={24}
                            color="#E6F6F4"
                        />
                    </Button>
                </View>
                <View className="px-4">
                    <View className="my-2 flex-row items-center justify-between gap-4">
                        <Text
                            nativeID="preferences"
                            className="text-center text-lg text-[#E8FDF8]"
                            onPress={() => {
                                setChecked((prev) => !prev);
                            }}
                        >
                            Save your search preferences
                        </Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#B0E4DD' }}
                            thumbColor={checked ? '#7A797B' : '#E8FDF8'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={setChecked}
                            value={checked}
                            nativeID="preferences"
                        />
                    </View>
                    <FlatList
                        className="mt-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom:
                                Platform.OS === 'ios' ? bottom + 120 : bottom + 230,
                        }}
                        data={listings}
                        renderItem={({ item }) => (
                            <View
                                key={item.key}
                                className="mb-4 rounded-xl border border-[#16DD89] bg-[#201c2e] p-6"
                            >
                                <View className="flex-row items-center justify-between gap-4">
                                    <LinearGradient
                                        colors={item.gradient || ['#16DD89', '#69EB9C', '#C3FAB0']}
                                        style={{ borderRadius: 100 }}
                                    >
                                        <View className="h-12 w-12 items-center justify-center">
                                            <Text className="text-3xl font-bold">
                                                {item.avatar_text || (item.name ? item.name[0] : 'T')}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                    <View className="flex-1">
                                        <Text className="text-2xl font-semibold text-white">
                                            {item.name || item.className || 'Untitled Task'}
                                        </Text>
                                        <Text className="text-[#E8FDF8]">{item.institution || item.category || 'General'}</Text>
                                    </View>
                                    <View className="flex-row gap-4">
                                        <Feather name="heart" size={20} color="#1AD4A6" />
                                        <Feather name="share-2" size={20} color="#1AD4A6" />
                                    </View>
                                </View>
                                <View className="mb-4 mt-8 gap-3">
                                    <View className="flex-row items-center gap-2">
                                        <MaterialCommunityIcons
                                            name="clock-time-ten-outline"
                                            size={20}
                                            color="#1AD4A6"
                                        />
                                        <Text className="text-[#E8FDF8]">{item.duration || 'Flexible'}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <MoneyIcon color="#1AD4A6" />
                                        <Text className="text-[#E8FDF8]">N {item.amount || item.price || '0'}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-lg text-white">{item.description || item.desc || 'No description provided'}</Text>
                                    <Button
                                        className="mt-6 w-full items-center"
                                        onPress={() => (navigation as any).navigate('TaskDetails', { task: item })}
                                    >
                                        <Text className="font-semibold text-white">Apply</Text>
                                    </Button>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default TutorFindTopics;
