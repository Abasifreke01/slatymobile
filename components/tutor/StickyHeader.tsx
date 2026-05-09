import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const StickyHeader = () => {
  return (
    <View className="sticky flex-row items-center justify-between bg-[#151320] p-4">
      <Text className="text-xl font-semibold text-white">My Activity</Text>
      <Link href="/find-topics" className="text-[#1DE9B6]">
        View all
      </Link>
    </View>
  );
};

export default StickyHeader;
