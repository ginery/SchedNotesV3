import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MainStackNavigator} from './StackNavigation';
import Sidebar from './Sidebar';
const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    // drawerContent={props => <Sidebar {...props} />}
    //useLegacyImplementation -> add this to <Drawer.Navigation if using higher or latest version
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={props => <Sidebar {...props} />}>
      <Drawer.Screen
        name="Home"
        component={MainStackNavigator}
        options={{
          drawerIcon: config => <Icon name="home" size={22} color="#7005a3" />,
          headerShown: false,
          swipeEdgeWidth: 0,
        }}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigation;
