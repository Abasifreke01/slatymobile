import { 
  View, Text, Image, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig'; // Firebase config
import { doc, getDoc } from 'firebase/firestore';

// Static image assets
const cartpicture = require("../../assets/images/typcn_shopping-cart.png");
const notificationpic = require("../../assets/images/Vector.png");
const solveimg = require("../../assets/images/Saly-25.png");
const booksimg = require("../../assets/images/3d-view-books-cartoon-style 1.png");
const progressimg = require("../../assets/images/Rectangle 604.png");
const trending = require("../../assets/images/trending.png");

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp';

export default function Dashboard() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || '');
          setProfilePicture(data.profilePicture || DEFAULT_AVATAR);
        } else {
          console.log("No such user document!");
        }
      }
    };

    fetchUserData();

    const unsubscribe = auth.onAuthStateChanged(fetchUserData);
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <View style={styles.topContainer}>
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Personal')}>
              <Image source={{ uri: profilePicture }} style={styles.imageStyle} />
            </TouchableOpacity>
            <Text style={styles.textStyle}>Hello, {username || 'User'}!</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image source={cartpicture} style={styles.iconStyle} />
            <Image source={notificationpic} style={styles.iconStyle} />
          </View>
        </View>

        <View style={styles.barsContainer}>
          <TouchableOpacity 
            style={styles.solveBar} 
            onPress={() => navigation.navigate('Task')}
          >
            <Image source={solveimg} style={styles.solveImage} />
            <Text style={styles.solveText}>Solve a Problem</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.problemBar} 
            onPress={() => navigation.navigate('CBTScreen')}
          >
            <Image source={booksimg} style={styles.booksImage} />
            <Text style={styles.booksText}>JAMB/ CBT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityLabel}>My Activity</Text>
          <Text style={styles.topRightText}>Your Progress</Text>
        </View>

        <View style={styles.generalMathsContainer}>
          <View style={styles.generalMathsBar}>
            <Image source={progressimg} style={styles.progressImage} />
            <Text style={styles.generalMathsText}>General Mathematics</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar} />
            </View>
          </View>
        </View>

        <Text style={styles.popularCoursesText}>Popular</Text>

        <View style={styles.newBarsContainer}>
          <View style={styles.rowContainer}>
            <View style={[styles.newBar, { backgroundColor: '#E9760B' }]}>
              <Text style={styles.barText}>Term Papers</Text>
            </View>
            <View style={[styles.newBar, { backgroundColor: '#69EB9C' }]}>
              <Text style={styles.barText}>Research Writing</Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={[styles.newBar, { backgroundColor: '#AB9DFB' }]}>
              <Text style={styles.barText}>Projects</Text>
            </View>
            <View style={[styles.newBar, { backgroundColor: '#EEEE68' }]}>
              <Text style={styles.barText}>Thermodynamics</Text>
            </View>
          </View>
        </View>

        <View style={styles.trendingContainer}>
          <Image source={trending} style={styles.trendingImage} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1DE9B6',
  },
  textStyle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  solveBar: {
    width: 156,
    height: 90,
    backgroundColor: '#B0E4DD',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 10,
  },
  solveImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  solveText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  problemBar: {
    width: 156,
    height: 90,
    backgroundColor: '#B9A9FB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  booksImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  booksText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  activityLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topRightText: {
    color: '#aaa',
    fontSize: 12,
  },
  generalMathsContainer: {
    width: '100%',
    marginTop: 10,
  },
  generalMathsBar: {
    height: 90,
    backgroundColor: '#B3A8FB',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  progressImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  generalMathsText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  progressContainer: {
    width: '30%',
    height: 10,
    backgroundColor: '#e0e0df',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBar: {
    width: '30%',
    height: '100%',
    backgroundColor: '#3b5998',
  },
  popularCoursesText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  trendingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  trendingImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  newBarsContainer: {
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  newBar: {
    width: '48%',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
