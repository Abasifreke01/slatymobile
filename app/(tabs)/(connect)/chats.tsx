import React from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import chats from '@/assets/data/chats.js'
import { Link } from 'expo-router';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ChatRow from '@/components/ChatRow';
import { router } from 'expo-router';



export default function HomeScreen() {

  return (
    <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={{ padding: 20, position: 'relative', backgroundColor: '#151320',  }}
        >
             <FlatList
            data={chats}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
                <View style={[defaultStyles.separator, {marginLeft: 90}]}/>
            )}
            renderItem={({item}) => (
              // <View>
              //   <Text>
              //     {item.from}
              //   </Text>
              // </View>
                <ChatRow {...item}/>
            )}
            />
            
            <TouchableOpacity onPress={() => router.push('/(new)/new')} style={{position: 'absolute', bottom: '10%', padding: '23', backgroundColor: '#4F378B', zIndex: 20, left: '90%'}}>
                <Ionicons name='pencil' size={22} color='white'/>
            </TouchableOpacity>
           
        </ScrollView>
  )
}

const styles = StyleSheet.create({})