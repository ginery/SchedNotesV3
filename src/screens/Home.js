/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  DeviceEventEmitter,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  NativeModules,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const {Background} = NativeModules;
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import NetInfo from '@react-native-community/netinfo';
import {NativeBaseProvider, Box, HStack, Text, Center} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = () => {
  const navigation = useNavigation();
  const [dataArray, setDataArray] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // PushNotification.createChannel(
      //   {
      //     channelId: 'schednotes_channel_id', // (required)
      //     channelName: 'My channel', // (required)
      //     channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      //     playSound: false, // (optional) default: true
      //     soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      //     // (optional) default: Importance.HIGH. Int value of the Android notification importance
      //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      //   },
      //   created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      // );
      //console.log('refreshed_home');
      // BackgroundTimer.runBackgroundTimer(() => {
      //   //code that will be called every 1hr
      //   console.log('timer here 1h');
      //   Background.startService();
      //   localNotif();
      // }, 3600000);
      // BackgroundTimer.stopBackgroundTimer();
      requestLocationPermission();
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);
  const localNotif = () => {
    PushNotification.localNotification({
      //... You can use all the options from localNotifications
      channelId: 'schednotes_channel_id',
      message: 'Wake up SchedNotes!', // (required)
      allowWhileIdle: true,
      playSound: false, // (optional) set notification to work while on doze, default: false
    });
    setTimeout(() => {
      PushNotification.cancelAllLocalNotifications();
    }, 600000);
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'MyMapApp needs access to your location',
        },
      );
      const granted_bg = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );

      if (granted_bg === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted background');
      } else {
        console.log('Location permission not granted background');
        Alert.alert(
          'You denied the location permission. Please allow it to your phone settings manually for the app to utilize its full features',
        );
        AsyncStorage.clear();
        navigation.navigate('Login');
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   Geolocation.getCurrentPosition(info => console.log(info));
        // Background.startService();
        console.log('Location permission granted');
        // setTimeout(() => {
        //   PushNotification.getDeliveredNotifications(e => {
        //     console.log(e);

        //     if (e != '') {
        //       e.map((item, index) => {
        //         if (item.identifier == 20220302 && item.title == 'SchedNotes') {
        //           console.log('horray');
        //           Background.startService();
        //         } else {
        //           Background.stopService();
        //           AsyncStorage.clear();
        //           navigation.navigate('Login');
        //         }
        //       });
        //     } else {
        //       Background.stopService();
        //       AsyncStorage.clear();
        //       navigation.navigate('Login');
        //     }
        //   });
        // }, 2000);
      } else {
        Alert.alert(
          'You denied the location permission. Please allow it to your phone settings manually for the app to utilize its full features.',
        );
        AsyncStorage.clear();
        navigation.navigate('Login');

        console.log('Location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const db = open({name: 'myDB'});
  const [heartBeat, setHeartBeat] = React.useState(false);
  const queryUsers = () => {
    const queryResult = db.execute(`SELECT * FROM "tbl_coordinates"`);
    var data = queryResult.rows._array;

    var data_array = data.map((item, index) => {
      return {
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
        date_added: item.date_added,
      };
    });
    const formData = new FormData();
    formData.append('array_data', JSON.stringify(data_array));
    fetch(window.name + 'sendArrayData.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        //   data.map((item, index) => {
        //     console.log(item);
        //   });
        console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
        // Alert.alert('Internet Connection Error');
      });
  };
  const dropTable = () => {
    const queryResult = db.execute(`DROP TABLE IF EXISTS tbl_coordinates `);
  };

  return (
    // <SafeAreaView>
    //   <View>
    //     <Button
    //       title="Get Data"
    //       onPress={() => {
    //         // console.log('stop service');
    //         // Background.stopService();
    //         queryUsers();
    //       }}></Button>
    //     <Button
    //       title="Drop"
    //       onPress={() => {
    //         // console.log('stop service');
    //         // Background.stopService();
    //         dropTable();
    //       }}></Button>
    //     <Button
    //       title="Start BG"
    //       onPress={() => {
    //         // console.log('stop service');
    //       }}></Button>
    //     <Button
    //       title="Stop BG"
    //       onPress={() => {
    //         console.log('stop service');
    //         Background.stopService();
    //       }}></Button>
    //   </View>
    // </SafeAreaView>
    <NativeBaseProvider>
      <Box safeAreaTop backgroundColor="#7005a3" />
      <HStack
        bg="#7005a3"
        px={3}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={4} alignItems="center">
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Icon name="bars" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            SchedNotes@V3
          </Text>
        </HStack>
        <HStack space={2}>
          <TouchableOpacity>
            <Icon name="map-marker-alt" size={20} color="white" />
          </TouchableOpacity>
        </HStack>
      </HStack>
      <Center>
        {/* <Button
          title="Drop"
          onPress={() => {
            // console.log('stop service');
            // Background.stopService();
            dropTable();
          }}></Button>
        <Button
          title="Start BG"
          onPress={() => {
            Background.startService();
          }}></Button>
        <Button
          title="Stop BG"
          onPress={() => {
            console.log('stop service');
            Background.stopService();
          }}></Button> */}
        Welcome!
      </Center>
    </NativeBaseProvider>
  );
};

export default Home;
