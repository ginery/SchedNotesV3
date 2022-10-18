import React from 'react';
import {
  Fab,
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
  Modal,
  FormControl,
  Input,
  Button,
  Select,
  CheckIcon,
  Spinner,
  Icon,
  Badge,
  Skeleton,
} from 'native-base';
import {RefreshControl, TouchableOpacity, Alert} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {color} from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Customer({navigation}) {
  React.useEffect(() => {
    getCustomer();
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshed_home');
      getBranch();
      getCustomer();
      retrieveUser();
    });

    return unsubscribe;
  }, [navigation]);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisibleUpdate, setModalVisibleUpdate] = React.useState(false);
  const [service, setService] = React.useState('');
  const [farmname, setFarmname] = React.useState('');
  const [fullname, setFullname] = React.useState('');
  const [farmtype, setFarmType] = React.useState('');
  const [branch_id, setBranchId] = React.useState('');
  const [contact_number, setContactNum] = React.useState('');
  const [population, setPopulation] = React.useState('');
  const [branchData, setBranchData] = React.useState([]);
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [customerData, setCustomerData] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [user_id, setUserId] = React.useState(0);
  const [btnLocation, setBtnLocation] = React.useState(false);
  const [loadData, setLoadData] = React.useState(false);
  const [btnSave, setBtnSave] = React.useState(false);
  const [customerDetails, setCustomerDetails] = React.useState(false);
  const [customer_id, setCustomerId] = React.useState(0);
  const onRefresh = () => {
    setRefreshing(true);
    getCustomer();
    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  };
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        setUserId(value.user_id);
        // console.log(value.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getBranch = () => {
    fetch(window.name + 'branches', {
      method: 'GET',
      headers: {
        Accept: 'applicatiion/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          var data = responseJson.array_data.map(function (item, index) {
            return {
              branch_id: item.branch_id,
              branch_name: item.branch_name,
            };
          });
          setBranchData(data);
        }
      })
      .catch(error => {
        console.error(error);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const getCustomer = () => {
    // console.log(loadData);
    fetch(window.name + 'customers', {
      method: 'GET',
      headers: {
        Accept: 'applicatiion/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.array_data != '') {
          var data = responseJson.array_data.map(function (item, index) {
            return {
              customer_id: item.customer_id,
              farm_name: item.farm_name,
              branch_name: item.branch_name,
              customer_name: item.customer,
              update_status: item.update_status,
            };
          });
          setCustomerData(data);
          setLoadData(true);
        } else {
          setLoadData(false);
        }
      })
      .catch(error => {
        console.error(error);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const getLocation = () => {
    setBtnLocation(true);
    Geolocation.getCurrentPosition(info => {
      console.log(info);

      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
  const addCustomer = () => {
    if (
      user_id == '' ||
      farmname == '' ||
      fullname == '' ||
      farmtype == '' ||
      branch_id == '' ||
      population == '' ||
      latitude == '' ||
      longitude == ''
    ) {
      Alert.alert('Fill out all information requires');
    } else {
      setBtnSave(true);
      // console.log(population);
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('farm_name', farmname);
      formData.append('fullname', fullname);
      formData.append('farmtype', farmtype);
      formData.append('branch_id', branch_id);
      formData.append('contact_number', contact_number);
      formData.append('population', population);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);

      fetch(window.name + 'customer/store', {
        method: 'POST',
        headers: {
          Accept: 'applicatiion/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.array_data != '') {
            var data = responseJson.array_data[0];
            if (data.response == 1) {
              setFullname('');
              setFarmname('');
              setFarmType('');
              setBranchId('');
              setContactNum('');
              setPopulation('');
              setLatitude('');
              setLongitude('');
              getCustomer();
              setBtnLocation(false);
              setModalVisible(false);
              setBtnSave(false);
            } else if (data.response == 2) {
              Alert.alert('already exist!');
            } else {
              Alert.alert('something went wrong!');
            }
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert(error.toString());
        });
    }
  };
  const getCustomerDetails = customer_id => {
    // console.log(customer_id);
    setModalVisibleUpdate(true);
    setCustomerDetails(false);
    const formData = new FormData();
    formData.append('customer_id', customer_id);

    fetch(window.name + 'customer/details', {
      method: 'POST',
      headers: {
        Accept: 'applicatiion/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.array_data != '') {
          var data = responseJson.array_data[0];
          // console.log(data.customer);
          setCustomerId(data.customer_id);
          setFullname(data.customer);
          setFarmname(data.farm_name);
          setFarmType(data.farm_type);
          setBranchId(data.branch_id);
          setContactNum(data.contact_num);
          setPopulation(data.population);
          setLatitude('');
          setLongitude('');
          setCustomerDetails(true);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(error.toString());
      });
  };
  const updateCustomer = () => {
    const formData = new FormData();
    formData.append('customer_id', customer_id);

    fetch(window.name + 'customer/update', {
      method: 'POST',
      headers: {
        Accept: 'applicatiion/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        // if (responseJson.array_data != '') {
        //   var data = responseJson.array_data[0];

        // }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(error.toString());
      });
  };
  return (
    <NativeBaseProvider>
      <Box safeAreaTop backgroundColor="#7005a3" />
      <HStack
        bg="#7005a3"
        px={3}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={4} alignItems="center">
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}>
            <FontIcon name="bars" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            SchedNotes@V3
          </Text>
        </HStack>
        <HStack space={2}>
          <TouchableOpacity>
            <FontIcon name="map-marker-alt" size={20} color="white" />
          </TouchableOpacity>
        </HStack>
      </HStack>
      <Center>
        <Box w="100%" p="2" pt="5" pb="40">
          <Heading fontSize="xl" p="4" pb="3">
            Customer
          </Heading>
          {loadData == true ? (
            <FlatList
              data={customerData}
              renderItem={({item}) => (
                <TouchableOpacity
                  // onPress={() => {
                  //   getCustomerDetails(item.customer_id);
                  // }}
                  // disabled={item.update_status == 0 ? false : true}
                  disabled={true}>
                  <Box
                    borderBottomWidth="1"
                    _dark={{
                      borderColor: 'muted.50',
                    }}
                    borderColor="muted.800"
                    pl={['0', '4']}
                    pr={['0', '5']}
                    py="2">
                    <HStack space={[2, 3]} justifyContent="space-between">
                      <Avatar
                        size="48px"
                        source={{
                          uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
                        }}
                      />
                      <VStack>
                        <Text
                          _dark={{
                            color: 'warmGray.50',
                          }}
                          color="coolGray.800"
                          bold>
                          {item.farm_name}
                        </Text>
                        <Text
                          color="coolGray.600"
                          _dark={{
                            color: 'warmGray.200',
                          }}>
                          {item.customer_name}
                        </Text>
                      </VStack>
                      <Spacer />
                      <Center>
                        <Text
                          fontSize="xs"
                          _dark={{
                            color: 'warmGray.50',
                          }}
                          color="coolGray.800"
                          alignSelf="flex-start">
                          <Badge
                            colorScheme={
                              item.update_status == 0 ? 'success' : 'info'
                            }
                            alignSelf="center"
                            variant="solid">
                            {item.update_status == 0 ? 'INCOMPLETE' : 'UPDATED'}
                          </Badge>
                          {/* {item.update_status} */}
                        </Text>
                      </Center>
                    </HStack>
                  </Box>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.customer_id}
              refreshControl={
                <RefreshControl
                  title="Pull to refresh"
                  tintColor="#fff"
                  titleColor="#fff"
                  colors={['#7005a3']}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            <Center w="100%">
              <VStack
                w="90%"
                maxW="400"
                borderWidth="1"
                space={8}
                overflow="hidden"
                rounded="md"
                _dark={{
                  borderColor: 'coolGray.500',
                }}
                _light={{
                  borderColor: 'coolGray.200',
                }}>
                {/* <Skeleton h="40" /> */}

                <HStack>
                  <Skeleton size="20" m="2" rounded="full" />
                  <Skeleton.Text pt={6} w="30%" lines={2} />
                  <Skeleton.Text pt={6} w="30%" pl={5} lines={1} />
                </HStack>
                <HStack>
                  <Skeleton size="20" m="2" rounded="full" />
                  <Skeleton.Text pt={6} w="30%" lines={2} />
                  <Skeleton.Text pt={6} w="30%" pl={5} lines={1} />
                </HStack>
                <HStack>
                  <Skeleton size="20" m="2" rounded="full" />
                  <Skeleton.Text pt={6} w="30%" lines={2} />
                  <Skeleton.Text pt={6} w="30%" pl={5} lines={1} />
                </HStack>
                <HStack>
                  <Skeleton size="20" m="2" rounded="full" />
                  <Skeleton.Text pt={6} w="30%" lines={2} />
                  <Skeleton.Text pt={6} w="30%" pl={5} lines={1} />
                </HStack>
                <HStack>
                  <Skeleton size="20" m="2" rounded="full" />
                  <Skeleton.Text pt={6} w="30%" lines={2} />
                  <Skeleton.Text pt={6} w="30%" pl={5} lines={1} />
                </HStack>

                {/* <Skeleton px="4" my="4" rounded="md" startColor="primary.100" /> */}
              </VStack>
            </Center>
          )}
          <Fab
            shadow={2}
            size="md"
            label="Add Customer"
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </Box>
      </Center>
      <Modal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setBtnLocation(false);
        }}
        avoidKeyboard
        style={{marginBottom: 'auto', marginTop: 0}}
        size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Add Customer</Modal.Header>
          <Modal.Body>
            Enter Customer Details
            <FormControl mt="3">
              <FormControl.Label>
                Farm Name <Text style={{color: 'red'}}>*</Text>
              </FormControl.Label>
              <Input
                value={farmname}
                onChangeText={text => setFarmname(text)}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>
                Fullname <Text style={{color: 'red'}}>*</Text>
              </FormControl.Label>
              <Input
                value={fullname}
                onChangeText={text => setFullname(text)}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>
                Farmtype <Text style={{color: 'red'}}>*</Text>
              </FormControl.Label>
              <Select
                selectedValue={farmtype}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Choose Service"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => setFarmType(itemValue)}>
                <Select.Item label="Farrow to finish" value="FF" />
                <Select.Item label="Piglet dispersal" value="PD" />
                <Select.Item label="Fatteners" value="F" />
                <Select.Item label="Layer" value="L" />
              </Select>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>
                Branch
                <Text style={{color: 'red'}}>*</Text>
              </FormControl.Label>
              <Select
                selectedValue={branch_id}
                minWidth="200"
                accessibilityLabel="Choose Branch"
                placeholder="Choose Branch"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => setBranchId(itemValue)}>
                {branchData.map((item, index) => {
                  return (
                    <Select.Item
                      label={item.branch_name}
                      value={item.branch_id}
                    />
                  );
                })}
              </Select>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Contact Number (Optional)</FormControl.Label>
              <Input
                value={contact_number}
                onChangeText={text => setContactNum(text)}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>
                Population <Text style={{color: 'red'}}>*</Text>
              </FormControl.Label>
              <Input
                value={population}
                onChangeText={text => setPopulation(text)}
              />
            </FormControl>
            <FormControl mt="3">
              <Button
                disabled={btnLocation}
                flex="1"
                onPress={() => {
                  getLocation();
                }}>
                {/* {btnLocation == true && (
                  <Spinner
                    accessibilityLabel="Loading posts"
                    size="sm"
                    color="white"
                  />
                )}
                <Text style={{color: 'white'}}>
                  <Icon name="map-marker" style={{fontSize: 15}} /> Pin Location
                </Text> */}
                <HStack space={2} alignItems="center">
                  {/* {btnLocation == true && (
                    <Spinner
                      accessibilityLabel="Loading posts"
                      size="sm"
                      color="white"
                    />
                  )} */}

                  <Heading color="white" fontSize="md">
                    {btnLocation ? 'Pinned' : 'Pin Location'}
                  </Heading>
                  {btnLocation == false && (
                    <Icon
                      as={<FontIcon name="map-marker" />}
                      size="5"
                      color="white"
                    />
                  )}
                </HStack>
              </Button>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              colorScheme="emerald"
              onPress={() => {
                addCustomer();
              }}>
              <HStack space={2} alignItems="center">
                {btnSave == true && (
                  <Spinner
                    accessibilityLabel="Loading posts"
                    size="sm"
                    color="white"
                  />
                )}

                <Heading color="white" fontSize="md">
                  {btnSave ? 'Loading' : 'Save'}
                </Heading>
              </HStack>
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {/* !END of add customer modal */}
      <Modal
        isOpen={modalVisibleUpdate}
        onClose={() => setModalVisibleUpdate(false)}
        avoidKeyboard
        style={{marginBottom: 'auto', marginTop: 0}}
        size="lg">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Update Customer</Modal.Header>

          <Modal.Body>
            {customerDetails == false ? (
              <Center>
                <Spinner
                  accessibilityLabel="Loading posts"
                  size="sm"
                  color="#7005a3"
                />
              </Center>
            ) : (
              <Center>
                <FormControl mt="3">
                  <FormControl.Label>
                    Farm Name <Text style={{color: 'red'}}>*</Text>
                  </FormControl.Label>
                  <Input
                    isReadOnly={true}
                    value={farmname}
                    onChangeText={text => setFarmname(text)}
                  />
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>
                    Fullname <Text style={{color: 'red'}}>*</Text>
                  </FormControl.Label>
                  <Input
                    isReadOnly={true}
                    value={fullname}
                    onChangeText={text => setFullname(text)}
                  />
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>
                    Farmtype <Text style={{color: 'red'}}>*</Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={farmtype}
                    minWidth="200"
                    accessibilityLabel="Choose Service"
                    placeholder="Choose Service"
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={itemValue => setFarmType(itemValue)}>
                    <Select.Item label="Farrow to finish" value="FF" />
                    <Select.Item label="Piglet dispersal" value="PD" />
                    <Select.Item label="Fatteners" value="F" />
                    <Select.Item label="Layer" value="L" />
                  </Select>
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>
                    Branch
                    <Text style={{color: 'red'}}>*</Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={branch_id}
                    minWidth="200"
                    accessibilityLabel="Choose Branch"
                    placeholder="Choose Branch"
                    _selectedItem={{
                      bg: 'teal.600',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={itemValue => setBranchId(itemValue)}>
                    {branchData.map((item, index) => {
                      return (
                        <Select.Item
                          label={item.branch_name}
                          value={item.branch_id}
                        />
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>
                    Contact Number (Optional)
                  </FormControl.Label>
                  <Input
                    value={contact_number}
                    onChangeText={text => setContactNum(text)}
                  />
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>
                    Population <Text style={{color: 'red'}}>*</Text>
                  </FormControl.Label>
                  <Input
                    value={population}
                    onChangeText={text => setPopulation(text)}
                  />
                </FormControl>
                <FormControl mt="3">
                  <Button
                    disabled={btnLocation}
                    flex="1"
                    onPress={() => {
                      getLocation();
                    }}>
                    {/* {btnLocation == true && (
                <Spinner
                  accessibilityLabel="Loading posts"
                  size="sm"
                  color="white"
                />
              )}
              <Text style={{color: 'white'}}>
                <Icon name="map-marker" style={{fontSize: 15}} /> Pin Location
              </Text> */}
                    <HStack space={2} alignItems="center">
                      {/* {btnLocation == true && (
                  <Spinner
                    accessibilityLabel="Loading posts"
                    size="sm"
                    color="white"
                  />
                )} */}

                      <Heading color="white" fontSize="md">
                        {btnLocation ? 'Pinned' : 'Update Location'}
                      </Heading>
                      {btnLocation == false && (
                        <Icon
                          as={<FontIcon name="map-marker" />}
                          size="5"
                          color="white"
                        />
                      )}
                    </HStack>
                  </Button>
                </FormControl>
              </Center>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              flex="1"
              colorScheme="emerald"
              onPress={() => {
                updateCustomer();
              }}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
}
