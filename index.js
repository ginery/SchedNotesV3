/**
 * @format
 */
import Geolocation from 'react-native-geolocation-service';
import {AppRegistry, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
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
      'CREATE TABLE IF NOT EXISTS "tbl_coordinates" (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude TEXT NOT NULL, longitude TEXT NOT NULL, date_added DATETIME);',
    );
  } catch (e) {
    console.warn('Error opening db:', e);
  }
};
const InsetData = (latitude, longitude) => {
  createData();
  // Basic request
  db.execute(
    'INSERT INTO "tbl_coordinates" ( latitude, longitude, date_added) VALUES( ?, ?, ?);',
    [latitude, longitude, getDate(new Date())],
  );
};
const queryData = () => {
  const queryResult = db.execute(`SELECT * FROM "tbl_coordinates"`);

  console.log(queryResult.rows._array);
};
const dropTable = () => {
  const queryResult = db.execute(`DROP TABLE IF EXISTS tbl_coordinates `);
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
    }

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   Geolocation.getCurrentPosition(info => console.log(info));

      console.log('Location permission granted');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.log(err);
  }
};
const MyHeadlessTask = async () => {
  //   requestLocationPermission();
  var watchID = Geolocation.watchPosition(
    latestposition => {
      //   console.log(latestposition);
    },
    error => console.log(error),
    {enableHighAccuracy: true, timeout: 3000, maximumAge: 3000},
  );
  //   //   const interval = setInterval(() => {
  //   //     // getTransactionStatus();
  //   //     // refreshLocation();
  //   //     // backgroundLocation();
  //   //     console.log('headless Task');
  //   //     Geolocation.getCurrentPosition(info => console.log(info));
  //   //   }, 5000);
  //   //   return () => {
  //   //     clearInterval(interval);
  //   //     Geolocation.clearWatch(watchID);
  //   //   };
  console.log('watchID');
  Geolocation.getCurrentPosition(info => {
    console.log(info.coords.latitude);
    InsetData(info.coords.latitude, info.coords.longitude);
  });
};
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('Background', () => MyHeadlessTask);
