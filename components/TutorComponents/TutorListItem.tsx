import { activityList } from './data';
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const TutorListItem = ({ item, onPress }: { item: any, onPress?: () => void }) => {
    const label = item.name || item.className || item.label || 'Untitled Task';
    const date = item.acceptedAt ? new Date(item.acceptedAt.seconds * 1000).toLocaleDateString() : (item.date || '');
    const time = item.duration || item.time || '';
    const status = item.status || 'Unknown';

    return (
        <TouchableOpacity
            className="my-2 rounded-xl border border-[#15A581] p-4"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="flex-row items-center justify-between">
                <Text className="text-xl font-semibold text-white">{label}</Text>
                <Text className="text-[#1DE9B6]">{date}</Text>
            </View>
            <View className="flex-row items-center justify-between">
                <Text className="text-[#E6F6F4]">{time}</Text>
                <Text className="text-[#1DE9B6]">{status}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default TutorListItem;
