import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { Fragment } from 'react';
import { SvgProps } from 'react-native-svg';
import {
  CameraActiveIcon,
  CameraInactiveIcon,
  ChatActiveIcon,
  ChatInactiveIcon,
  FindActiveIcon,
  FindInactiveIcon,
  HomeActiveIcon,
  HomeInactiveIcon,
  ProfileActiveIcon,
  ProfileInactiveIcon,
} from '../icons';

type Tabs = {
  name: string;
  title: string;
  activeIcon: (props: SvgProps) => JSX.Element;
  inactiveIcon: (props: SvgProps) => JSX.Element;
};

const tabs: Tabs[] = [
  {
    name: 'index',
    title: 'For You',
    activeIcon: HomeActiveIcon,
    inactiveIcon: HomeInactiveIcon,
  },
  {
    name: 'find-topics',
    title: 'Find Topics',
    activeIcon: FindActiveIcon,
    inactiveIcon: FindInactiveIcon,
  },
  {
    name: 'host-class',
    title: 'Host Class',
    activeIcon: CameraActiveIcon,
    inactiveIcon: CameraInactiveIcon,
  },
  {
    name: '(connect)',
    title: 'Connect',
    activeIcon: ChatActiveIcon,
    inactiveIcon: ChatInactiveIcon,
  },
  {
    name: 'personal',
    title: 'Personal',
    activeIcon: ProfileActiveIcon,
    inactiveIcon: ProfileInactiveIcon,
  },
];
const TutorsTabsLayout = () => {
  return (
    <Fragment>
      <Tabs screenOptions={{ headerShown: false }}>
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, focused }) =>
                focused
                  ? tab.activeIcon({ color })
                  : tab.inactiveIcon({ color }),
              tabBarActiveTintColor: '#1DE9B6',
              tabBarInactiveTintColor: '#7A797B',
              tabBarStyle: {
                backgroundColor: '#151320',
                borderTopWidth: 0,
              },
            }}
          />
        ))}
      </Tabs>
      <StatusBar style="light" />
    </Fragment>
  );
};

export default TutorsTabsLayout;
