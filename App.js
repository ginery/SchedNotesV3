import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider, Text} from 'native-base';
import DrawerNavigator from './src/components/DrawerNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from './src/components/RootNavigation';
import * as RootNavigation from './src/components/RootNavigation';

import {PermissionsAndroid} from 'react-native';

// local connection
// window.name = 'http://192.168.1.118/schednotesv3/mobile/';
// online connection
window.name = 'https://wdysolutions.com/schednotes/mobile/mobile/';

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer ref={navigationRef}>
        <DrawerNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
