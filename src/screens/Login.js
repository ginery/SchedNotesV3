import * as React from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  useToast,
  Icon,
  Spinner,
} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeModules, PermissionsAndroid} from 'react-native';
import {ItemClick} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
const {Background} = NativeModules;
export default function LoginScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [buttonStatus, setButtonStatus] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');

      setButtonStatus(false);

      retrieveUser();
    });

    return unsubscribe;
  }, [navigation]);
  const getDate = () => {
    var now = new Date();
    now.setDate(now.getDate());
    now.setHours(0);
    now.setMinutes(0);
    now.setMilliseconds(5);
    // console.log(now + '-----' + new Date(Date.now() + 3 * 1000));

    return now;
  };

  const setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        navigation.navigate('Landing');
      } else {
        console.log('login');
        // navigate('Login');
        navigation.navigate('Login');
      }

      //setUserID(value.user_fname);
    } catch (error) {
      console.log(error);
    }
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'MyMapApp needs access to your location',
        },
      );
      const granted_bg = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );

      if (granted_bg === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted background');
      } else {
        console.log('Location permission not granted background');
        Alert.alert(
          'You denied the location permission. Please allow it to your phone settings manually for the app to utilize its full features',
        );
        AsyncStorage.clear();
        navigation.navigate('Login');
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   Geolocation.getCurrentPosition(info => console.log(info));
        Background.startService();
        console.log('Location permission granted');
      } else {
        Alert.alert(
          'You denied the location permission. Please allow it to your phone settings manually for the app to utilize its full features.',
        );
        AsyncStorage.clear();
        navigation.navigate('Login');

        console.log('Location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };
  const login = () => {
    if (username == '' && password == '') {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
              <Text color="white">Please fill out the text filled.</Text>
            </Box>
          );
        },
      });
    } else {
      setButtonStatus(true);
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      fetch(window.name + 'loginMobile', {
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
          var data = responseJson.array_data[0];
          if (data.response == 1) {
            requestLocationPermission();
            toast.show({
              placement: 'top',
              render: () => {
                return (
                  <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">
                      Great! Please Wait 10 seconds after login.
                    </Text>
                  </Box>
                );
              },
            });
            setItemStorage('user_details', {
              user_id: data.user_id,
              user_name: data.name,
              // user_mname: data.user_mname,
              // user_lname: data.user_lname,
            });
            setButtonStatus(true);
            setTimeout(function () {
              navigation.navigate('Landing');
            }, 1000);
          } else if (data.response == 0) {
            setButtonStatus(false);
            toast.show({
              placement: 'top',
              render: () => {
                return (
                  <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">Ops! Incorrect credential</Text>
                  </Box>
                );
              },
            });
            setButtonStatus(false);
          } else {
            toast.show({
              placement: 'top',
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">
                      Aw snap! Something went wrong. Please try again
                    </Text>
                  </Box>
                );
              },
            });
            setButtonStatus(false);
          }
        })
        .catch(error => {
          setButtonStatus(false);
          console.error(error);
          Alert.alert('Internet Connection Error');
        });
    }
  };
  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="md"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}>
          Welcome to SchedNotes Version 3
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: 'warmGray.200',
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input value={username} onChangeText={text => setUsername(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </FormControl>
          <Button
            disabled={buttonStatus}
            mt="2"
            bgColor="#8c0cc9"
            bg="#7005a3"
            onPress={() => {
              login();
            }}>
            <HStack space={2} alignItems="center">
              {buttonStatus == true && (
                <Spinner
                  accessibilityLabel="Loading posts"
                  size="sm"
                  color="white"
                />
              )}
              <Heading color="white" fontSize="md">
                {buttonStatus ? 'Loading' : 'Sign In'}
              </Heading>
              {buttonStatus == false && (
                <Icon
                  as={<FontIcon name="sign-in-alt" />}
                  size="5"
                  color="white"
                />
              )}
            </HStack>
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
