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
import { RefreshControl, TouchableOpacity, Alert } from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Chat({ navigation }) {
    React.useEffect(() => {
        // const unsubscribe = navigation.addListener('focus', () => {
        //     console.log('refreshed_home');
        //     getBranch();
        //     getCustomer();
        //     retrieveUser();
        // });

        // return unsubscribe;
    }, [navigation]);

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
                        Chat
                    </Heading>
                </Box>
            </Center>
        </NativeBaseProvider>
    );
}

