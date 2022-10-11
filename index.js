/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
const MyHeadlessTask = async () => {
  console.log('headless Task');
  //   Geolocation.getCurrentPosition(info => console.log(info));
};
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('Background', () => MyHeadlessTask);
