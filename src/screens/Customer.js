import React from 'react';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {
  Fab,
  Box,
  Heading,
  Avatar,
  HStack,
  VStack,
  Spacer,
  Center,
  NativeBaseProvider,
  FormControl,
  Input,
  Button,
  CheckIcon,
  Spinner,
  Icon,
  Badge,
  Skeleton,
  Stack,
  Pressable,
  ScrollView,
} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import Controller from '../components/Controller';
class CustomerScreen extends React.PureComponent {
  state = {
    user_id: 0,
  };
  componentDidMount() {
    Controller.instance.createTableCustomer();
    Controller.instance.createTableBranch();
    Controller.instance.getUserFromCached();
    Controller.instance.getCustomer();
  }
  addCustomer(items) {}
  render() {
    return (
      <SafeAreaView>
        <HStack
          bg="#7005a3"
          px={3}
          py={4}
          justifyContent="space-between"
          alignItems="center">
          <HStack space={4} alignItems="center">
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.openDrawer();
              }}>
              <FontIcon name="bars" size={22} color="white" />
            </TouchableOpacity>
            <Text style={{color: 'white'}}>SchedNotes@V3</Text>
          </HStack>
          <HStack space={2}>
            <TouchableOpacity>
              <FontIcon name="map-marker-alt" size={20} color="white" />
            </TouchableOpacity>
          </HStack>
        </HStack>

        <Button
          colorScheme="emerald"
          onPress={() => {
            this.addCustomer('hello');
          }}>
          <HStack>
            <Text style={{color: 'white'}}>Add Customer</Text>
          </HStack>
        </Button>
      </SafeAreaView>
    );
  }
}

export default CustomerScreen;
