import * as React from 'react';
import {
  View,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {NativeBaseProvider, Center, Spinner, Text} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/native';
export default function LandingScreen({navigation}) {
  // const navigation = useNavigation();
  // React.useEffect(() => {
  //   retrieveData();
  // }, [1]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      retrieveData();
    });

    return unsubscribe;
  }, [navigation]);
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        navigation.navigate('HomeScreen');
      } else {
        console.log('login');
        // navigate('Login');
        navigation.navigate('Login');
      }

      //setUserID(value.user_fname);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        {/* <Spinner accessibilityLabel="Loading posts" size="lg" color="#7005a3" /> */}
        <ActivityIndicator size={50} color="#7005a3" />
        <Text>Rendering...</Text>
      </Center>
    </NativeBaseProvider>
  );
}
