import React from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../ui/Button';

const EmptyActivityList = () => {
  return (
    <View className="my-auto gap-4">
      <Image
        source={require('../../assets/images/empty-activity.png')}
        alt="empty activity list"
        resizeMode="contain"
        className="mx-auto h-[285px] w-[300px]"
      />
      <Button>
        <Text className="text-center font-semibold text-[#E6F6F4]">
          Upload A Course
        </Text>
      </Button>
    </View>
  );
};

export default EmptyActivityList;
