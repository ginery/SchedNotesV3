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
  Text,
  useColorScheme,
  View,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const {Background} = NativeModules;
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import NetInfo from '@react-native-community/netinfo';

const Home = () => {
  const navigation = useNavigation();
  const [dataArray, setDataArray] = React.useState([]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      requestLocationPermission();
    });

    return unsubscribe;
  }, [navigation]);
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
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   Geolocation.getCurrentPosition(info => console.log(info));
        Background.startService();
        console.log('Location permission granted');
      } else {
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
    <SafeAreaView>
      <View>
        <Button
          title="Get Data"
          onPress={() => {
            // console.log('stop service');
            // Background.stopService();
            queryUsers();
          }}></Button>
        <Button
          title="Drop"
          onPress={() => {
            // console.log('stop service');
            // Background.stopService();
            dropTable();
          }}></Button>
        <Button
          title="Start BG"
          onPress={() => {
            // console.log('stop service');
          }}></Button>
        <Button
          title="Stop BG"
          onPress={() => {
            console.log('stop service');
            Background.stopService();
          }}></Button>
      </View>
    </SafeAreaView>
  );
};

export default Home;
