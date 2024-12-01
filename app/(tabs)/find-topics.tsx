import Button from '@/components/ui/Button';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, Switch, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { MoneyIcon } from '../icons';

const results = [
  {
    key: '1',
    avatar_text: 'A',
    gradient: ['#16DD89', '#69EB9C', '#C3FAB0'],
    name: 'A.J Murphy',
    institution: 'Secondary School',
    duration: '30 mins',
    price: '1500',
    desc: 'Mathematics Tutor needed in the area of Algebra',
  },
  {
    key: '2',
    avatar_text: 'B',
    gradient: ['#E9760B', '#F7C993'],
    name: 'J.D Doe',
    institution: 'Secondary School',
    duration: '60 mins',
    price: '500',
    desc: 'Physics Tutor needed in the area of Algebra',
  },
  {
    key: '3',
    avatar_text: 'C',
    gradient: ['#16DD89', '#69EB9C', '#C3FAB0'],
    name: 'C.J Jane',
    institution: 'Primary School',
    duration: '60 mins',
    price: '750',
    desc: 'Mathematics Tutor needed in the area of Algebra',
  },
  {
    key: '4',
    avatar_text: 'D',
    gradient: ['#E9760B', '#F7C993'],
    name: 'D.J Murphy',
    institution: 'Secondary School',
    duration: '45 mins',
    price: '1000',
    desc: 'English Tutor needed in the area of Algebra',
  },
];
const FindTopics = () => {
  const [checked, setChecked] = useState(false);
  const { bottom } = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-[#151320]">
      <View className="flex-1">
        <View className="flex-row justify-between gap-4 px-4">
          <Feather name="chevron-left" size={24} color="#E6F6F4" />
          <View className="flex-row gap-4">
            <MaterialCommunityIcons name="refresh" size={24} color="#E6F6F4" />
            <Feather name="bell" size={24} color="#E6F6F4" />
          </View>
        </View>
        <View className="my-2">
          <Text className="text-center text-2xl font-bold text-white">
            Search Results(12)
          </Text>
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
            contentContainerStyle={{ paddingBottom: bottom + 120 }}
            data={results}
            renderItem={({ item }) => (
              <View
                key={item.key}
                className="mb-4 rounded-xl border border-[#16DD89] bg-[#201c2e] p-6"
              >
                <View className="flex-row items-center justify-between gap-4">
                  <LinearGradient
                    colors={item.gradient}
                    style={{ borderRadius: 100 }}
                  >
                    <View className="h-12 w-12 items-center justify-center">
                      <Text className="text-3xl font-bold">
                        {item.avatar_text}
                      </Text>
                    </View>
                  </LinearGradient>
                  <View>
                    <Text className="text-2xl font-semibold text-white">
                      {item.name}
                    </Text>
                    <Text className="text-[#E8FDF8]">{item.institution}</Text>
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
                    <Text className="text-[#E8FDF8]">{item.duration}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <MoneyIcon color="#1AD4A6" />
                    <Text className="text-[#E8FDF8]">N {item.price}</Text>
                  </View>
                </View>
                <View>
                  <Text className="text-lg text-white">{item.desc}</Text>
                  <Button className="mt-6 w-full items-center">
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

export default FindTopics;
