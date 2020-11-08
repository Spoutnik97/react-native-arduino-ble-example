import React, {useReducer, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Button,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DeviceCard} from './src/components/DeviceCard';

const manager = new BleManager();

const reducer = (
  state: Device[],
  action: {type: 'ADD_DEVICE'; payload: Device} | {type: 'CLEAR'},
): Device[] => {
  switch (action.type) {
    case 'ADD_DEVICE':
      const {payload: device} = action;
      if (device && !state.find((dev) => dev.id === device.id)) {
        return [...state, device];
      }
      return state;
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};
const App = () => {
  const [scannedDevices, dispatch] = useReducer(reducer, []);
  const [isLoading, setIsLoading] = useState(false);

  const scanDevices = () => {
    setIsLoading(true);

    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.warn(error);
      }

      if (scannedDevice) {
        dispatch({type: 'ADD_DEVICE', payload: scannedDevice});
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      console.warn('Scan stopped');
      setIsLoading(false);
    }, 5000);
  };

  const ListHeaderComponent = () => (
    <View style={styles.body}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Step One</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Button
          title="Clear devices"
          onPress={() => dispatch({type: 'CLEAR'})}
        />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button title="Scan devices" onPress={scanDevices} />
        )}
      </View>
    </View>
  );
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <FlatList
          keyExtractor={(item) => item.id}
          data={scannedDevices}
          renderItem={({item}) => <DeviceCard device={item} />}
          ListHeaderComponent={ListHeaderComponent}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

export default App;
