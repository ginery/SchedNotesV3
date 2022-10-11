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
const {Background} = NativeModules;
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const db = open({name: 'myDB'});
  const [heartBeat, setHeartBeat] = React.useState(false);
  React.useEffect(() => {
    let today = new Date();

    // getdb();
    // NetInfo.fetch().then(state => {
    //   console.log('Connection type', state.type);
    //   console.log('Is connected?', state.isConnected);
    // });
  }, [1]);
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
  const getdb = async () => {
    try {
      db.execute(
        'CREATE TABLE IF NOT EXISTS "tbl_coordinates" (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude TEXT NOT NULL, longitude TEXT NOT NULL, date_added DATETIME);',
      );
    } catch (e) {
      console.warn('Error opening db:', e);
    }
  };
  const testInsert = () => {
    // Basic request
    db.execute(
      'INSERT INTO "tbl_coordinates" ( latitude, longitude, date_added) VALUES( ?, ?, ?);',
      [32, 3000.23, getDate(new Date())],
    );
  };
  const queryUsers = () => {
    const queryResult = db.execute(`SELECT * FROM "tbl_coordinates"`);

    console.log(queryResult.rows._array);
  };
  const dropTable = () => {
    const queryResult = db.execute(`DROP TABLE IF EXISTS tbl_coordinates `);
  };
  return (
    <SafeAreaView>
      <View>
        <Button
          title="Insert"
          onPress={() => {
            // console.log('start service');
            // Background.startService();
            testInsert();
          }}></Button>
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
            Background.startService();
          }}></Button>
        <Button
          title="Stop BG"
          onPress={() => {
            // console.log('stop service');
            Background.stopService();
          }}></Button>
      </View>
    </SafeAreaView>
  );
};

export default App;
