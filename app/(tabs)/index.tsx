import Button from '@/components/ui/Button';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import React, { Fragment, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloseIcon } from '../icons';

const subjects = [
  { key: '1', label: 'English' },
  { key: '2', label: 'Physics' },
  { key: '3', label: 'Mathematics' },
  { key: '4', label: 'Government' },
  { key: '5', label: 'Chemistry' },
  { key: '6', label: 'Biology' },
];
const activityList = [
  {
    key: '1',
    label: 'English',
    date: 'Today',
    time: '10:00 AM',
    status: 'Pending',
    color: '#E6F6F4',
  },
  {
    key: '2',
    label: 'Physics',
    date: 'Today',
    time: '10:00 AM',
    status: 'Pending',
    color: '#E6F6F4',
  },
  {
    key: '3',
    label: 'Mathematics',
    date: 'Today',
    time: '10:00 AM',
    status: 'Pending',
    color: '#E6F6F4',
  },
  {
    key: '4',
    label: 'Government',
    date: 'Today',
    time: '10:00 AM',
    status: 'Pending',
    color: '#E6F6F4',
  },
  {
    key: '5',
    label: 'Chemistry',
    date: 'Today',
    time: '10:00 AM',
    status: 'Pending',
    color: '#E6F6F4',
  },
  {
    key: '6',
    label: 'Biology',
    date: 'Today',
    time: '10:00 AM',
    status: 'Pending',
    color: '#E6F6F4',
  },
];
const Home = () => {
  const [showBanner, setShowBanner] = useState(true);
  const hideBanner = () => setShowBanner(false);
  return (
    <SafeAreaView className="flex-1 bg-[#151320]">
      <View className="relative flex-1 px-4">
        {/* Header Section */}
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
        {activityList.length > 0 ? (
          // Activity List Section
          <Fragment>
            <FlatList
              ListHeaderComponent={() => (
                //  Sticky section
                <View className="sticky flex-row items-center justify-between bg-[#151320] p-4">
                  <Text className="text-xl font-semibold text-white">
                    My Activity
                  </Text>
                  <Link href="/" className="text-[#1DE9B6]">
                    View all
                  </Link>
                </View>
              )}
              stickyHeaderIndices={[0]}
              stickyHeaderHiddenOnScroll={false}
              showsVerticalScrollIndicator={false}
              data={activityList}
              renderItem={({ item }) => (
                <View className="my-2 rounded-xl border border-[#15A581] p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xl font-semibold text-white">
                      {item.label}
                    </Text>
                    <Text className="text-[#1DE9B6]">{item.date}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[#E6F6F4]">{item.time}</Text>
                    <Text className="text-[#1DE9B6]">{item.status}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
            <View className="absolute bottom-2 left-0 right-0 z-10 items-center justify-center">
              <Button className="w-max p-6 shadow-2xl">
                <FontAwesome5 name="plus" size={24} color="white" />
              </Button>
            </View>
          </Fragment>
        ) : (
          //  Empty Activity List
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
        )}
        {/* Profile Banner */}
        {showBanner ? (
          <View className="absolute -bottom-8 right-12 z-20 w-full max-w-xs items-end rounded-xl rounded-br-none border border-[#16DD89] p-2">
            <CloseIcon color="#003B33" onPress={hideBanner} />
            <View className="w-full max-w-xs rounded-xl rounded-br-none p-3 pt-1">
              <Text className="text-white">
                Fill your profile to help us select the most suitable jobs for
                you!
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
export default Home;
