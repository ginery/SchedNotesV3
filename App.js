import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider, Text} from 'native-base';
import DrawerNavigator from './src/components/DrawerNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from './src/components/RootNavigation';
import * as RootNavigation from './src/components/RootNavigation';

import {PermissionsAndroid} from 'react-native';

// local connection
// window.name = 'http://192.168.1.4/schednotes_new/';
// online connection
window.name = 'https://schednotes.wdysolutions.com/';

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer ref={navigationRef}>
        <DrawerNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
