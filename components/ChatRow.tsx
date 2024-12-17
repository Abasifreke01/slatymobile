
import React, { FC } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableHighlight, View, Image, Text, TouchableOpacity } from 'react-native';
import chats from '@/assets/data/chats.js'
import { defaultStyles } from '@/constants/Styles';
import { Link, router } from 'expo-router';
import {format} from 'date-fns';
import {Colors} from '@/constants/Colors';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export interface ChatRowProps {
    id: string,
    from: string,
    date: string,
    img: any,
    msg: string,
    read: boolean,
    unreadCount: number;
}

const ChatRow: FC<ChatRowProps>= ({ id, from, msg, date, img, read, unreadCount }) => {
    return (
        <GestureHandlerRootView style={{flex: 1, marginBottom: 16}}>
        <AppleStyleSwipeableRow>
        <Link href={'/(each)/each'} asChild>
        <TouchableHighlight activeOpacity={0.7} underlayColor={Colors.gray}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={img} />
                <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{from}</Text>
              <Text style={{ fontSize: 16, color: 'white' }}>
                {msg.length > 40 ? `${msg.substring(0, 40)}...` : msg}
              </Text>
            </View>
            <Text style={{color: Colors.gray, alignSelf: 'flex-start', paddingRight: 10}}>
                {format(date, 'MM.dd.yy')}
            </Text>
            </View>
        </TouchableHighlight>
        </Link>
        </AppleStyleSwipeableRow>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({})

export default ChatRow;
