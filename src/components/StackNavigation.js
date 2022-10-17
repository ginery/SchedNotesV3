import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LandingScreen from './LandingPage';
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import CustomerScreen from '../screens/Customer';
const Stack = createStackNavigator();
const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Customer"
        component={CustomerScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export {MainStackNavigator};
