import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, StyleSheet } from 'react-native';

import TutorDashboard from './TutorDashboard';
import TutorFindTopics from './TutorFindTopics';
import TutorHostClass from './TutorHostClass';
import TutorConnect from './TutorConnect';
import TutorPersonal from './TutorPersonal';

const Tab = createBottomTabNavigator();

const TutorTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: 'black',
                    borderRadius: 15,
                    height: 90,
                },
            }}
        >
            <Tab.Screen
                name="TutorDashboard"
                component={TutorDashboard}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../../../assets/images/ion_home-outline.png')}
                                style={[styles.iconStyle, { tintColor: focused ? '#1DE9B6' : '#748c94' }]}
                            />
                            <Text style={[styles.iconText, { color: focused ? '#1DE9B6' : '#748c94' }]}>Home</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="TutorFindTopics"
                component={TutorFindTopics}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../../../assets/images/icon-park-outline_find.png')}
                                style={[styles.iconStyle, { tintColor: focused ? '#1DE9B6' : '#748c94' }]}
                            />
                            <Text style={[styles.iconText, { color: focused ? '#1DE9B6' : '#748c94' }]}>Find</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="TutorHostClass"
                component={TutorHostClass}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../../../assets/images/ri_live-line.png')}
                                style={[styles.iconStyle, { tintColor: focused ? '#1DE9B6' : '#748c94' }]}
                            />
                            <Text style={[styles.iconText, { color: focused ? '#1DE9B6' : '#748c94' }]}>Live</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="TutorConnect"
                component={TutorConnect}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../../../assets/images/heroicons-outline_chat-alt.png')}
                                style={[styles.iconStyle, { tintColor: focused ? '#1DE9B6' : '#748c94' }]}
                            />
                            <Text style={[styles.iconText, { color: focused ? '#1DE9B6' : '#748c94' }]}>Connect</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="TutorPersonal"
                component={TutorPersonal}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../../../assets/images/iconamoon_profile-bold.png')}
                                style={[styles.iconStyle, { tintColor: focused ? '#1DE9B6' : '#748c94' }]}
                            />
                            <Text style={[styles.iconText, { color: focused ? '#1DE9B6' : '#748c94' }]}>Profile</Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
    },
    iconStyle: {
        width: 24,
        height: 24,
    },
    iconText: {
        marginTop: 4,
        fontSize: 12,
    },
});

export default TutorTabs;
