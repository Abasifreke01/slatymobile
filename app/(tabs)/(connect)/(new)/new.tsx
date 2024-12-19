import {View, Text, StyleSheet, Image, ScrollView, FlatList} from 'react-native'
import chats from '@/assets/data/chats'
import { defaultStyles } from '@/constants/Styles';




export default function New() {
    return(
    <ScrollView style={{flex: 1, backgroundColor: '#151320', padding: 20}}
    contentInsetAdjustmentBehavior='automatic'
    >
       <FlatList
       data={chats}
       scrollEnabled={false}
            // ItemSeparatorComponent={() => (
            //     <View style={[defaultStyles.separator, {marginLeft: 90}]}/>
            // )}
       renderItem={(({item}) => (
        <View style={{flexDirection: 'row', gap: 20, padding: 20, alignItems: 'start'}}>
            <Image source={item.img} style={{width: 50}}/>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
                {item.from}
            </Text>
        </View>
       ))}
       />
    </ScrollView>
    )
}