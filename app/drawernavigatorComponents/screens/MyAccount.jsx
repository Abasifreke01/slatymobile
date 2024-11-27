import { View, Text, Image, Pressable, StyleSheet, ScrollView, SafeAreaView, Platform} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
const profileImg = require("../assets/profileimg.png");
const bookImg = require("../assets/rectangle.png");
const carousel = require("../assets/Carousel-dark.png");
const edit = require("../assets/bx_edit.png");
const bar = require('../assets/Group 74.png');
const add = require('../assets/add.png');
const share = require('../assets/share.png');

const Myaccount = () => {
    return (

        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
    contentInsetAdjustmentBehavior="automatic"
    bounces={Platform.OS === 'ios'} // Disable bounce on Android
    overScrollMode={Platform.OS === 'android' ? 'never' : 'auto'}
            >
                <View>
                    <View style={styles.first}>
                        <View style={styles.firstText}>   
                            <Text style={[styles.WhiteText, styles.name]}>Jonny Doe</Text>
                            <Text style={[styles.WhiteText, styles.email]}>@jonnydoe45</Text>
                            <Text style={[styles.GreenText, styles.tutor]}>Science Tutor</Text>
                            <Text style={[styles.WhiteText, styles.school]}>Government Technical College</Text>
                        </View>
                        <View>
                            <Image source={profileImg} />
                        </View>
                    </View>

                    <View style={styles.connection}>
                        <Text style={styles.WhiteText}>50 Connections</Text>
                        <Image source={edit} />
                    </View>
                </View>

                <View style={styles.connectionContainer}>
                    <Pressable onPress={() => {}} style={styles.addConnectionContainer}>
                            <Image source={add}/>
                        <Text style={{color: "white" }}> Add Connections</Text>
                    </Pressable>
                    <Pressable onPress={() => {}} style={styles.shareContainer}>
                        <Image source={share} style={{ textAlign: "center", color: "white" }}/>
                    </Pressable>
                </View>
                <Text style={[styles.WhiteText, styles.margin]}>About</Text>
                <Text style={styles.AboutContainer}>Hello, I am a student passionate about everything that involves calculations.</Text>
                <View style={styles.rowContainer}>
                    <Text style={styles.WhiteText}>My Activity</Text>
                    <Pressable><Text style={styles.GreenText}>View all</Text></Pressable>
                </View>
   <LinearGradient
      colors={['#9BA0FC', '#CEB0FA']}
      style={styles.activity}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >    
                <View style={styles.activityContent}>
                    <Image source={bookImg} style={styles.bookImg} />
                    <View style={styles.course}>
                        <Text style={styles}>General Mathematics</Text>
                        <Text>Course</Text>
                        <Image source={bar} />
                        <Text>Uploading your course...</Text>
                    </View>
                </View>
    </LinearGradient>
                <View style={styles.rowContainer}>
                    <Text style={styles.WhiteText}>My Courses</Text>
                    <Pressable><Text style={styles.GreenText}>View All</Text></Pressable>
                </View>
                <View style={styles.coursesContainer}>
                    <Image style={{ flex: 1, height: 200, resizeMode: "contain" }} source={carousel} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bookImg: {
        flex: 1,
        resizeMode: "contain",
    },
    course: {
        flex: 2
    },
    container: {
        flex: 1,
        backgroundColor: "#151320",
        
    },
    scrollContainer: {
        padding: 10,
        
    },
    WhiteText: {
        color: "white",
    },
    GreenText: {
        color: "#1DE9B6",
        fontSize: 10
    },
    first: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal:40,
        marginRight:10
    },
    name:{fontWeight:"bold",fontSize:20},
    school:{fontSize:10, marginBottom:15},
    tutor:{fontSize:8, marginTop:15},
    email:{fontSize:8},
    connectionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
        marginHorizontal:20,
        marginRight:10,
        marginVertical:10,
        marginTop:30
    },
    addConnectionContainer: {
        flex: 6,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: "#151320",
        padding: 10,
        borderColor: "#1DE9B6",
        flexDirection:"row",
        justifyContent:"center",
        gap:10,
        alignItems:"center"
    },
    shareContainer: {
        flex: 1,
        backgroundColor: "#1DE9B6",
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        borderColor: "#1DE9B6",
        alignItems:"center"
    },
    AboutContainer: {
        borderWidth: 2,
        padding: 30,
        color: "white",
        borderColor: "#1f1c2f",
        backgroundColor: "#1f1c2f",
        fontSize: 10,
        borderRadius: 10,
        marginHorizontal:20,
        marginRight:10,
        marginVertical:10,
    },
    margin: {
        marginHorizontal:40,
        marginVertical:10,
        marginRight:10,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal:40,
        marginVertical:10,
        marginRight:10,
    },
    activity: {
        borderWidth: 2,
        borderRadius: 10,
        elevation:10,
        margin:20,
        marginRight:10,
    },
    activityContent:{
       flexDirection: "row",
        flex:1,
        padding: 10,
        justifyContent:"space-between",
        
    }
    ,
    coursesContainer: {
        flexDirection: "row",
        padding: 0,
        gap: 10,
        
    },
    connection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 40,
        marginTop: 0,
        marginRight:10,
    },
    firstText:{
        marginTop:20
    },
});

export default Myaccount;
