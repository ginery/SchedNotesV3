import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
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
import FlatListCustomized from '../components/FlatlistCustomized';
import Controller from '../components/Controller';
class CustomerScreen extends React.PureComponent {
  state = {
    user_id: 0,
    updateBotton: false,
    customer_data: [],
  };
  componentDidMount() {
    Controller.instance.createTableCustomer();
    Controller.instance.createTableBranch();
    Controller.instance.getUserFromCached();
    this.getCustomer();
    // console.log(this.props.data);
  }
  async getCustomer() {
    try {
      const result = await Controller.instance.selectTableCustomer();
      // console.log(result);
      this.setState({customer_data: result});
    } catch (error) {
      console.log(error);
    }
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
        <Box w="100%" p="2" pt="5" pb="40">
          <HStack style={{width: '100%'}} justifyContent="center">
            <Center
              style={{
                // borderColor: 'black',
                // borderWidth: 1,

                width: '30%',
              }}
              rounded="md">
              <Text
                style={{
                  // borderColor: 'black',
                  // borderWidth: 1,
                  alignSelf: 'flex-start',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                Customer
              </Text>
            </Center>

            <Center
              w="70%"
              style={{
                // borderColor: 'black',
                // borderWidth: 1,
                alignItems: 'flex-end',
              }}>
              <HStack space={2}>
                <Button
                  colorScheme="emerald"
                  onPress={() => {
                    // setModalVisible(true);
                  }}>
                  <HStack>
                    <Text style={{color: 'white'}}>Add Customer</Text>
                  </HStack>
                </Button>
                <Button
                  onPress={() => {
                    // updateData();
                    // getCustomer();
                    // getBranch();
                    // setUpdateBotton(false);
                    Controller.instance.updateData();
                  }}
                  disabled={this.state.updateBotton}>
                  <HStack>
                    {this.state.updateBotton == true && (
                      <ActivityIndicator size="small" color="white" />
                    )}

                    <Text style={{color: 'white'}}>
                      {this.state.updateBotton == true
                        ? ' Loading..'
                        : ' Update'}
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </Center>
          </HStack>
          <FlatListCustomized data={this.state.customer_data} />
        </Box>
      </SafeAreaView>
    );
  }
}

export default CustomerScreen;
