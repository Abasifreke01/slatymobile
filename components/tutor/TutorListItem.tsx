import { activityList } from '@/app/(tabs)';
import React from 'react';
import { Text, View } from 'react-native';

const TutorListItem = ({ item }: { item: (typeof activityList)[number] }) => {
  return (
    <View className="my-2 rounded-xl border border-[#15A581] p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-white">{item.label}</Text>
        <Text className="text-[#1DE9B6]">{item.date}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-[#E6F6F4]">{item.time}</Text>
        <Text className="text-[#1DE9B6]">{item.status}</Text>
      </View>
    </View>
  );
};

export default TutorListItem;
