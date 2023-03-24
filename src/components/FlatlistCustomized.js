import React from 'react';
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
import {
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
  Modal,
  ToastAndroid,
  FlatList,
} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
class FlatListCustomized extends React.PureComponent {
  state = {
    user_id: 0,
    refreshing: false,
  };
  listEmptyComponent() {
    return (
      <Center
        // borderColor="black"
        // borderWidth={1}
        h={350}
        alignItems="center"
        alignContent="center"
        textAlign="center">
        <FontIcon name="database" color="#8c0cc9" size={150} />
        <Text fontSize="lg" color="#8c0cc9" fontWeight="bold">
          No Data Available.
        </Text>
      </Center>
    );
  }
  renderItem({item}) {
    return (
      <View>
        <Text>{item.customer}</Text>
      </View>
    );
  }
  onRefresh() {
    this.setState({refreshing: true});
    // selectTable();
    // getCustomer();
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }
  render() {
    return (
      <View>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          ListEmptyComponent={this.listEmptyComponent}
          refreshControl={
            <RefreshControl
              title="Pull to refresh"
              tintColor="#fff"
              titleColor="#fff"
              colors={['#7005a3']}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}
export default FlatListCustomized;
