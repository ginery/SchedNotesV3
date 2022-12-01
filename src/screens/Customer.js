import React from 'react';
import {
  Fab,
  Box,
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
  CheckIcon,
  Spinner,
  Icon,
  Badge,
  Skeleton,
} from 'native-base';
import {
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {color} from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {
  QuickSQLite as sqlite,
  open,
  QuickSQLiteConnection,
} from 'react-native-quick-sqlite';
import NetInfo from '@react-native-community/netinfo';
const db = open({name: 'myDB'});
export default function Customer({navigation}) {
  React.useEffect(() => {
    retrieveUser();
    createData();
    createTableBranch();
    selectTable();
    selectTableBranch();
    // syncData();
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshed_home');
      retrieveUser();
      createData();
      createTableBranch();
      selectTableBranch();
      selectTable();
      // createData();

      // retrieveUser();
      // syncData();
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
  const [updateBotton, setUpdateBotton] = React.useState(false);
  const [pinLoading, setPinLoading] = React.useState(false);
  const createData = async () => {
    try {
      db.execute(
        'CREATE TABLE IF NOT EXISTS "tbl_customer" (customer_id INTEGER PRIMARY KEY AUTOINCREMENT, company_id TEXT NOT NULL, branch_id TEXT NOT NULL, farm_name DATETIME, customer DATETIME, farm_type TEXT NOT NULL, population TEXT NOT NULL,contact_no TEXT NOT NULL, location TEXT NOT NULL, date_added DATETIME, encoded_by TEXT NOT NULL, update_status TEXT NOT NULL, sync_status INTEGER);',
      );
    } catch (e) {
      console.warn('Error opening db:', e);
    }
  };
  const createTableBranch = async () => {
    try {
      db.execute(
        'CREATE TABLE IF NOT EXISTS "tbl_branch" (branch_id INTEGER, island_group TEXT NOT NULL, region TEXT NOT NULL, province DATETIME, company_id INTEGER, branch TEXT NOT NULL, remarks TEXT NOT NULL, status TEXT NOT NULL);',
      );
    } catch (e) {
      console.warn('Error opening db:', e);
    }
  };
  const dropTable = async () => {
    try {
      db.execute(`DROP TABLE IF EXISTS tbl_customer`);
      db.execute(`DROP TABLE IF EXISTS tbl_branch`);
    } catch (e) {
      console.warn('Error opening db:', e);
    }
  };

  const insertDataBranch = async (
    branch_id,
    branch,
    island_group,
    region,
    province,
    company_id,
    remarks,
    status,
  ) => {
    try {
      db.execute(
        'INSERT INTO "tbl_branch" (branch_id ,island_group, region, province, company_id, branch, remarks, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?);',
        [
          branch_id,
          island_group,
          region,
          province,
          company_id,
          branch,
          remarks,
          status,
        ],
      );
    } catch (e) {
      console.warn('Error opening db:', e);
    }
  };
  const InsertData = async (
    company_id,
    branch_id,
    farmname,
    customer,
    farm_type,
    population,
    contact_no,
    location,
    date_added,
    encoded_by,
    update_status,
    sync_status,
  ) => {
    // Basic request
    try {
      db.execute(
        'INSERT INTO "tbl_customer" (company_id, branch_id, farm_name, customer, farm_type, population, contact_no, location, date_added, encoded_by, update_status, sync_status) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);',
        [
          company_id,
          branch_id,
          farmname,
          customer,
          farm_type,
          population,
          contact_no,
          location,
          date_added,
          // getDate(new Date()),
          encoded_by,
          update_status,
          sync_status,
        ],
      );
    } catch (e) {
      console.warn('Error opening db:', e);
    }
  };
  const selectTable = user_id => {
    db.executeAsync('SELECT * FROM "tbl_customer";', []).then(({rows}) => {
      // console.log('customer', rows);
      setLoadData(true);
      setCustomerData(rows._array);
    });
  };
  const selectTableBranch = user_id => {
    // const queryResult = db.execute(`SELECT * FROM "tbl_branch"`);
    // var data = queryResult.rows._array;

    db.executeAsync('SELECT * FROM "tbl_branch";', []).then(({rows}) => {
      // console.log(rows._array);

      setBranchData(rows._array);
    });
    // console.log(data);
  };
  const onRefresh = () => {
    setRefreshing(true);
    selectTable();
    // getCustomer();
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
    // console.log('branch user_id: ' + user_id);

    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'branches', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.array_data != '') {
          var data = responseJson.array_data.map(function (item, index) {
            insertDataBranch(
              item.branch_id,
              item.branch,
              item.island_group,
              item.region,
              item.province,
              item.company_id,
              item.remarks,
              item.status,
            );
          });
          // console.log(data);

          selectTableBranch();
          // setBranchData(data);
        } else {
          selectTableBranch();
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const getCustomer = () => {
    setLoadData(false);
    // console.log(loadData);
    // createData();
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'customers', {
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
          responseJson.array_data.map(function (item, index) {
            InsertData(
              item.company_id,
              item.branch_id,
              item.farm_name,
              item.customer,
              item.farm_type,
              item.population,
              item.contact_no,
              item.location,
              item.date_added,
              item.encoded_by,
              item.update_status,
              item.sync_status,
            );
          });
          selectTableBranch();
          selectTable();
          setUpdateBotton(false);
          Alert.alert('Success!');
          // console.log(responseJson);
        } else {
          console.log('get customer wala data');
          selectTableBranch();
          selectTable();
          setLoadData(true);
        }
      })
      .catch(error => {
        setLoadData(true);
        setUpdateBotton(false);
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const getLocation = () => {
    setBtnLocation(true);
    Geolocation.getCurrentPosition(info => {
      // console.log(info);
      setPinLoading(false);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
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
  const updateData = () => {
    setUpdateBotton(true);

    db.executeAsync(
      'SELECT * FROM "tbl_customer" WHERE sync_status="0";',
      [],
    ).then(({rows}) => {
      // console.log('customer', rows);
      var data = rows._array;
      if (data == '') {
        console.log('wala sa data');
        setUpdateBotton(false);
        setLoadData(true);
        dropTable();
        createData();
        createTableBranch();
        getBranch();
        getCustomer();
      } else {
        dropTable();
        createData();
        createTableBranch();
        console.log('may data unod');
        var data_array = data.map((item, index) => {
          return {
            company_id: item.company_id,
            branch_id: item.branch_id,
            farm_name: item.farm_name,
            customer: item.customer,
            farm_type: item.farm_type,
            population: item.population,
            location: item.location,
            contact_no: item.contact_no,
            encoded_by: item.encoded_by,
            date_added: item.date_added,
            update_status: item.update_status,
            sync_status: item.sync_status,
          };
        });
        // console.log(data);
        const formData = new FormData();
        formData.append('array_data', JSON.stringify(data_array));
        fetch(window.name + 'customer/store', {
          method: 'POST',
          header: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        })
          .then(response => response.json())
          .then(responseJson => {
            // console.log(responseJson);
            //   data.map((item, index) => {
            //     console.log(item);
            //   });
            if (responseJson.array_data != '') {
              if (responseJson.array_data[0].response == 1) {
                getBranch();
                getCustomer();
                setUpdateBotton(false);
                Alert.alert('Great! Customer successfully updated.');
              } else {
                Alert.alert('Customer already updated!');
                setUpdateBotton(false);
              }
            } else {
            }
          })
          .catch(error => {
            setUpdateBotton(false);
            console.error(error);
            Alert.alert('Internet Connection Error');
          });
      }
    });
  };
  const addCustomer = () => {
    // console.log(user_id);
    setBtnSave(true);
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
      setBtnSave(false);
    } else {
      db.executeAsync(
        'SELECT count(*) as counter FROM "tbl_customer" WHERE customer="' +
          fullname +
          '";',
        [],
      ).then(({rows}) => {
        setBtnSave(false);
        var data = rows._array;
        // console.log(data[0].counter);
        if (data[0].counter > 0) {
          Alert.alert('Customer Already Exist.');
        } else {
          InsertData(
            0,
            branch_id,
            farmname,
            fullname,
            farmtype,
            population,
            contact_number,
            latitude + ', ' + longitude,
            getDate(new Date()),
            user_id,
            0,
            0,
          );
          setFullname('');
          setFarmname('');
          setFarmType('');
          setBranchId('');
          setContactNum('');
          setPopulation('');
          setLatitude('');
          setLongitude('');
          setBtnLocation(false);
          setModalVisible(false);
          setBtnSave(false);
          selectTable();
        }
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
        // console.log(responseJson);
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
        // console.log(responseJson);
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
    <SafeAreaView>
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
          <HStack style={{width: '100%'}} justifyContent="center">
            <Center
              style={{
                // borderColor: 'black',
                // borderWidth: 1,

                width: '60%',
              }}
              rounded="md">
              <Text
                style={{
                  // borderColor: 'black',
                  // borderWidth: 1,
                  alignSelf: 'flex-start',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Customer
              </Text>
            </Center>

            <Center
              w="40%"
              style={{
                // borderColor: 'black',
                // borderWidth: 1,
                alignItems: 'flex-end',
              }}>
              <Button
                onPress={() => {
                  updateData();
                  // getCustomer();
                  // getBranch();
                  // setUpdateBotton(false);
                }}
                disabled={updateBotton}>
                <HStack>
                  {updateBotton == true && (
                    <ActivityIndicator size="small" color="white" />
                  )}

                  <Text style={{color: 'white'}}>
                    {updateBotton == true ? ' Loading..' : ' Update'}
                  </Text>
                </HStack>
              </Button>
            </Center>
          </HStack>
          {loadData == true ? (
            <FlatList
              style={{
                //   borderColor: 'black',
                //  borderWidth: 1,
                height: '90%',
              }}
              // initialNumToRender={20}
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
                        source={
                          item.farm_type == 'L'
                            ? require('../assets/layer.png')
                            : require('../assets/pig.png')
                        }
                      />
                      <VStack
                        w="50%"
                        // style={{borderColor: 'red', borderWidth: 1}}
                      >
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
                          {item.customer}
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
                          {/* <Badge
                            colorScheme={
                              item.update_status == 0 ? 'success' : 'info'
                            }
                            alignSelf="center"
                            variant="solid">
                            {item.update_status == 0 ? 'INCOMPLETE' : 'UPDATED'}
                          </Badge> */}
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
            renderInPortal={true}
            shadow={2}
            size="md"
            label="Add Customer"
            onPress={() => {
              setModalVisible(true);
              // console.log('test');
              // navigation.navigate('Add Customer');
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
              <Picker
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
                <Picker.Item label="Select Farm Type" value="" />
                <Picker.Item label="Farrow to finish" value="FF" />
                <Picker.Item label="Piglet dispersal" value="PD" />
                <Picker.Item label="Fatteners" value="F" />
                <Picker.Item label="Layer" value="L" />
              </Picker>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>
                Branch
                <Text style={{color: 'red'}}>*</Text>
              </FormControl.Label>
              <Picker
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
                <Picker.Item label="Select Branch" value="" />
                {branchData.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.branch + ' (' + item.province + ')'}
                      value={item.branch_id}
                    />
                  );
                })}
              </Picker>
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
                  setPinLoading(true);
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
                  {pinLoading == true && (
                    <Spinner
                      accessibilityLabel="Loading posts"
                      size="sm"
                      color="white"
                    />
                  )}

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
                setBtnSave(true);
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
                  <Picker
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
                    <Picker.Item label="Farrow to finish" value="FF" />
                    <Picker.Item label="Piglet dispersal" value="PD" />
                    <Picker.Item label="Fatteners" value="F" />
                    <Picker.Item label="Layer" value="L" />
                  </Picker>
                </FormControl>
                <FormControl mt="3">
                  <FormControl.Label>
                    Branch
                    <Text style={{color: 'red'}}>*</Text>
                  </FormControl.Label>
                  <Picker
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
                        <Picker.Item
                          label={item.branch_name}
                          value={item.branch_id}
                        />
                      );
                    })}
                  </Picker>
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
    </SafeAreaView>
  );
}
