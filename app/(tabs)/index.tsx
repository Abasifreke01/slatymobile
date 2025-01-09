import Banner from '@/components/tutor/Banner';
import EmptyActivityList from '@/components/tutor/EmptyActivityList';
import TutorHeader from '@/components/tutor/Header';
import StickyHeader from '@/components/tutor/StickyHeader';
import TutorListItem from '@/components/tutor/TutorListItem';
import Button from '@/components/ui/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const activityList = [
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
        <TutorHeader />
        <FlatList
          ListHeaderComponent={<StickyHeader />}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={false}
          showsVerticalScrollIndicator={false}
          data={activityList}
          renderItem={({ item }) => <TutorListItem item={item} />}
          ListEmptyComponent={<EmptyActivityList />}
        />
        <View className="absolute bottom-0 left-0 right-0 z-10 items-center justify-center">
          <Button className="w-max p-6 shadow-2xl">
            <FontAwesome5 name="plus" size={24} color="white" />
          </Button>
        </View>
        {/* Profile Banner */}
        {showBanner ? <Banner hideBanner={hideBanner} /> : null}
      </View>
    </SafeAreaView>
  );
};
export default Home;
