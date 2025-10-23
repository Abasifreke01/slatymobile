import { CloseIcon } from '@/app/icons';
import React from 'react';
import { Text, View } from 'react-native';

const Banner = ({ hideBanner }: { hideBanner: () => void }) => {
  return (
    <View className="absolute bottom-0 right-12 z-20 w-full max-w-xs items-end rounded-xl rounded-br-none border border-[#16DD89] bg-[#003B33] p-2">
      <CloseIcon color="#16DD89" onPress={hideBanner} />
      <View className="w-full max-w-xs rounded-xl rounded-br-none p-3 pt-1">
        <Text className="text-white">
          Fill your profile to help us select the most suitable jobs for you!
        </Text>
      </View>
    </View>
  );
};

export default Banner;
