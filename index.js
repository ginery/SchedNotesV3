/**
 * @format
 */
import NetInfo from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import {AppRegistry, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
const db = open({name: 'myDB'});

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
      'CREATE TABLE IF NOT EXISTS "tbl_coordinates" (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude TEXT NOT NULL, longitude TEXT NOT NULL, date_added DATETIME, user_id TEXT NOT NULL);',
    );
  } catch (e) {
    console.warn('Error opening db:', e);
  }
};
const InsetData = (user_id, latitude, longitude) => {
  // Basic request
  db.execute(
    'INSERT INTO "tbl_coordinates" ( latitude, longitude, date_added, user_id) VALUES( ?, ?, ?, ?);',
    [latitude, longitude, getDate(new Date()), user_id],
  );
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
    };
  });
  const formData = new FormData();
  formData.append('array_data', JSON.stringify(data_array));
  formData.append('user_id', user_id);
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
      console.log(responseJson);
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
  const valueString = await AsyncStorage.getItem('user_details');
  if (valueString != null) {
    const value = JSON.parse(valueString);
    var user_id = value.user_id;
  }
  console.log(valueString);
  NetInfo.fetch().then(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
    createData();
    if (state.isConnected == true) {
      queryUsers(user_id); //if connection is true sync
    }
  });
  //   requestLocationPermission();
  var watchID = Geolocation.watchPosition(
    latestposition => {
      //   console.log(latestposition);
    },
    error => console.log(error),
    {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000},
  );
  console.log(watchID);
  Geolocation.getCurrentPosition(info => {
    // console.log(info.coords.latitude);
    InsetData(user_id, info.coords.latitude, info.coords.longitude);
  });
};
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('Background', () => MyHeadlessTask);
