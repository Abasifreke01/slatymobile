import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';

const subjects = [
  { key: '1', label: 'English' },
  { key: '2', label: 'Physics' },
  { key: '3', label: 'Mathematics' },
  { key: '4', label: 'Government' },
  { key: '5', label: 'Chemistry' },
  { key: '6', label: 'Biology' },
];

const TutorHeader = () => {
  return (
    <View>
      <View className="flex-row justify-between gap-4">
        <View className="flex-row gap-4">
          <Image
            source={require('../../assets/images/avatar.png')}
            alt="avatar"
            resizeMode="contain"
            className="h-12 w-12"
          />
          <View>
            <Text className="text-3xl font-semibold text-white">
              Hello, Jonny!
            </Text>
            <Text className="text-[#E8FDF8]">
              What would you like to teach today?
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <Feather name="calendar" size={24} color="#E6F6F4" />
          <Feather name="bell" size={24} color="#E6F6F4" />
        </View>
      </View>
      <View className="mt-5 w-full flex-row gap-2 rounded-2xl bg-[#E6F6F4] px-4 py-2.5">
        <Feather
          name="search"
          size={24}
          color="#360083"
          className="flex-shrink-0"
        />
        <TextInput
          className="flex-1 placeholder:font-semibold"
          placeholder="Search course"
          placeholderTextColor="#CEB0FA"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />
      </View>
      {/* Subjects Scroll Section */}
      <ScrollView
        horizontal
        className="my-4"
        showsHorizontalScrollIndicator={false}
      >
        {subjects.map((subject) => (
          <View
            key={subject.key}
            className="mx-1 rounded-full border border-[#1DE9B6] px-4 py-3"
          >
            <Text className="font-semibold text-[#1DE9B6]">
              {subject.label}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Image
        source={require('../../assets/images/back-to-school.png')}
        alt="back to school banner"
        resizeMode="contain"
        className="mx-auto my-5 h-[145px] w-full"
      />
    </View>
  );
};

export default TutorHeader;
