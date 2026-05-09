import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const StickyHeader = () => {
    const navigation = useNavigation<any>();

    return (
        <View className="sticky flex-row items-center justify-between bg-[#151320] p-4">
            <Text className="text-xl font-semibold text-white">My Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TutorFindTopics')}>
                <Text className="text-[#1DE9B6]">View all</Text>
            </TouchableOpacity>
        </View>
    );
};

export default StickyHeader;
