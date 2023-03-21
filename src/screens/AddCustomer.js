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
const AddCustomerScreen = () => {
  const navigation = useNavigation();
  const [dataArray, setDataArray] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('stest');
      requestLocationPermission();
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        // setUserId(value.user_id);
        logOutUser(value.user_id);
        // console.log(value.user_id);
      }
    } catch (error) {
      // console.log(error);
    }
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
        // console.log('Location permission granted background');
      } else {
        // console.log('Location permission not granted background');
        Alert.alert(
          'You denied the location permission. Please allow it to your phone settings manually for the app to utilize its full features',
        );
        AsyncStorage.clear();
        navigation.navigate('Login');
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        setTimeout(() => {
          PushNotification.getDeliveredNotifications(e => {
            console.log(e, 'notif');

            if (e != '') {
              e.map((item, index) => {
                if (item.title == 'SchedNotes') {
                  // console.log('horray');
                  Background.startService();
                } else {
                  // console.log('logout');
                  Background.stopService();
                  AsyncStorage.clear();
                  navigation.navigate('Login');
                  retrieveUser();
                }
              });
            } else {
              Background.stopService();
              AsyncStorage.clear();
              navigation.navigate('Login');
              retrieveUser();
            }
          });
        }, 10000);
      } else {
        Alert.alert(
          'You denied the location permission. Please allow it to your phone settings manually for the app to utilize its full features.',
        );
        AsyncStorage.clear();
        navigation.navigate('Login');

        // console.log('Location permission denied');
      }
    } catch (err) {
      // console.log(err);
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
        // console.log(responseJson);
      })
      .catch(error => {
        // console.error(error);
        // Alert.alert('Internet Connection Error');
      });
  };
  const dropTable = () => {
    const queryResult = db.execute(`DROP TABLE IF EXISTS tbl_coordinates `);
  };

  const logOutUser = user_id => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'loginMobile/revoke_account', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(user_id);
        if (responseJson.array_data != '') {
          if (responseJson.array_data[0].res == 1) {
            Background.stopService();
            AsyncStorage.clear();
            navigation.navigate('Login');
          }
        }
      })
      .catch(error => {
        // console.error(error);
        // Alert.alert('Internet Connection Error');
      });
  };
  return (
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
              navigation.navigate('Customer');
            }}>
            <Icon name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            Add Customer
          </Text>
        </HStack>
        <HStack space={2}>
          <TouchableOpacity>
            <Icon name="map-marker-alt" size={20} color="white" />
          </TouchableOpacity>
        </HStack>
      </HStack>
      <Center>Welcome!</Center>
    </NativeBaseProvider>
  );
};

export default AddCustomerScreen;
