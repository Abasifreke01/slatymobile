import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return(
        <Stack>
            <Stack.Screen name='each' options={{
                title: '',
                headerShadowVisible: false,
                headerShown: false,
            }}/>
        </Stack>
    )
}