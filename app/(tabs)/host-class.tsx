import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HostClass = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#151320]">
      <View className="flex-1 px-4">
        <Text className="text-white">HostClass</Text>
      </View>
    </SafeAreaView>
  );
};

export default HostClass;
