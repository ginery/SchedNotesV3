/**
 * @format
 */
import NetInfo from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import {
  AppRegistry,
  PermissionsAndroid,
  NativeModules,
  AppState,
} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {Alert} from 'react-native';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
  magnetometer,
} from 'react-native-sensors';
import 'react-native-gesture-handler';
// import React from "react";
setUpdateIntervalForType(SensorTypes.magnetometer, 100);
const {Background} = NativeModules;
const db = open({name: 'myDB'});
const setItemStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Error saving data
  }
};

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
    var iidToken = token.token;
    setItemStorage('IDToken', {
      idtoken: iidToken,
    });
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification.message);
    // Alert.alert(notification.message);
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    // console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
const getDate = today => {
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var dt = today.getDate();
  var hh = today.getHours();
  var mm = today.getMinutes();
  var ss = today.getSeconds();
  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  // console.log(year + '-' + month + '-' + dt + ' ' + hh + ':' + mm + ':' + ss);
  return year + '-' + month + '-' + dt + ' ' + hh + ':' + mm + ':' + ss;
};
const createData = async () => {
  try {
    db.execute(
      'CREATE TABLE IF NOT EXISTS "tbl_coordinates" (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude TEXT NOT NULL, longitude TEXT NOT NULL, date_added DATETIME, user_id TEXT NOT NULL, log TEXT NOT NULL);',
    );
  } catch (e) {
    console.warn('Error opening db:', e);
  }
};
const InsetData = (user_id, latitude, longitude) => {
  // Basic request
  db.execute(
    'INSERT INTO "tbl_coordinates" (latitude, longitude, date_added, user_id, log) VALUES( ?, ?, ?, ?, ?);',
    [latitude, longitude, getDate(new Date()), user_id, 'Offline'],
  );
};
const selectTable = () => {
  const queryResult = db.execute(`SELECT * FROM "tbl_coordinates"`);
  var data = queryResult.rows._array;
  return data;
};
const directOnlinesend = (latitude, longitude, user_id) => {
  const data = [
    {
      latitude: latitude,
      longitude: longitude,
      date_added: getDate(new Date()),
      user_id: user_id,
      log: 'Online',
    },
  ];

  const formData = new FormData();
  formData.append('array_data', JSON.stringify(data));
  formData.append('user_id', user_id);
  fetch(window.name + 'syncdata', {
    method: 'POST',
    header: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  })
    .then(response => response.json())
    .then(responseJson => {
      // data.map((item, index) => {
      //   console.log(item);
      // });
      if (responseJson.array_data != '') {
        if (responseJson.array_data[0].response == 1) {
          // dropTable();
          createData();
        }
      }
      // console.log(responseJson);
    })
    .catch(error => {
      console.error(error);
      // Alert.alert('Internet Connection Error');
    });
};
const queryUsers = user_id => {
  const queryResult = db.execute(`SELECT * FROM "tbl_coordinates"`);
  var data = queryResult.rows._array;
  // console.log(data);
  var data_array = data.map((item, index) => {
    return {
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      date_added: item.date_added,
      log: item.log, //internet status
    };
  });
  const formData = new FormData();
  formData.append('array_data', JSON.stringify(data_array));
  formData.append('user_id', user_id);
  fetch(window.name + 'syncdata', {
    method: 'POST',
    header: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  })
    .then(response => response.json())
    .then(responseJson => {
      //  console.log(responseJson);
      //   data.map((item, index) => {
      //     console.log(item);
      //   });
      if (responseJson.array_data != '') {
        if (responseJson.array_data[0].response == 1) {
          dropTable();
          createData();
        }
      }
    })
    .catch(error => {
      console.error(error);

      // Alert.alert('Internet Connection Error');
    });
};
const dropTable = () => {
  const queryResult = db.execute(`DROP TABLE IF EXISTS tbl_coordinates`);
};

const MyHeadlessTask = async () => {
  // console.log(AppState.currentState);
  const valueString = await AsyncStorage.getItem('user_details');
  if (valueString != null) {
    const value = JSON.parse(valueString);
    var user_id = value.user_id;
  }
  // console.log(valueString);

  //   requestLocationPermission();
  var watchID = Geolocation.watchPosition(
    latestposition => {
      //   console.log(latestposition);
    },
    error => {
      console.log(error);
      InsetData(user_id, '', '');
    },
    {enableHighAccuracy: true},
  );
  // console.log(watchID);
  Geolocation.getCurrentPosition(info => {
    // console.log(info.coords.latitude);

    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      // console.log(selectTable());
      createData();
      if (state.isConnected == true) {
        // queryUsers(user_id); //if connection is true sync
        // dropTable();
        if (selectTable() == '') {
          directOnlinesend(
            info.coords.latitude,
            info.coords.longitude,
            user_id,
          );
        } else {
          // InsetData(user_id, info.coords.latitude, info.coords.longitude);
          queryUsers(user_id); // sync
        }
      } else {
        // createData();
        InsetData(user_id, info.coords.latitude, info.coords.longitude);
      }
    });
  });
};
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('Background', () => MyHeadlessTask);
