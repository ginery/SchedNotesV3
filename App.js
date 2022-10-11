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
const App = () => {
  const db = open({name: 'myDB'});
  const [heartBeat, setHeartBeat] = React.useState(false);
  React.useEffect(() => {
    getdb();
  }, [1]);
  const getdb = async () => {
    try {
      db.execute(
        'CREATE TABLE IF NOT EXISTS "User" ( id INT PRIMARY KEY, name TEXT NOT NULL, age INT, networth FLOAT);',
      );

      queryUsers();
    } catch (e) {
      console.warn('Error opening db:', e);
    }
  };
  const testInsert = () => {
    // Basic request
    db.execute(
      'INSERT INTO "User" (id, name, age, networth) VALUES(?, ?, ?, ?);',
      [new Date().getMilliseconds(), `TOM`, 32, 3000.23],
    );
  };
  const queryUsers = () => {
    const queryResult = db.execute(`SELECT * FROM "User"`);

    console.log(queryResult.rows._array);
  };
  return (
    <SafeAreaView>
      <View>
        <Button
          title="Start"
          onPress={() => {
            // console.log('start service');
            // Background.startService();
            testInsert();
          }}></Button>
        <Button
          title="Stop"
          onPress={() => {
            // console.log('stop service');
            // Background.stopService();
            getdb();
          }}></Button>
      </View>
    </SafeAreaView>
  );
};

export default App;
