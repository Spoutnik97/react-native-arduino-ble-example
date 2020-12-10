import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, ScrollView, Button, View, StyleSheet } from 'react-native';
import { Service } from 'react-native-ble-plx';
import { ServiceCard } from '../components/ServiceCard';
import { RootStackParamList } from '../navigation/index';

const DeviceScreen = ({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, 'Device'>) => {
  const { device } = route.params;

  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const disconnectDevice = useCallback(async () => {
    console.warn('Disconecting');

    await device
      .cancelConnection()
      .catch((e) => console.warn('dicsonnected error', e));
  }, [device]);

  useEffect(() => {
    const getDeviceInformations = async () => {
      device
        .connect()
        .then((dvc) => {
          setIsConnected(true);
          return dvc.discoverAllServicesAndCharacteristics();
        })
        .then((dvc) => {
          dvc.services().then((value) => {
            setServices(value);
          });
        });
    };
    getDeviceInformations();

    device.onDisconnected(() => {
      navigation.navigate('Home');
    });

    return () => {
      disconnectDevice();
    };
  }, [device, disconnectDevice, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        title="disconnect"
        onPress={() => {
          navigation.goBack();
          disconnectDevice();
        }}
      />
      <View>
        <View style={styles.header}>
          <Text>{`Id : ${device.id}`}</Text>
          <Text>{`Name : ${device.name}`}</Text>
          <Text>{`Is connected : ${isConnected}`}</Text>
          <Text>{`RSSI : ${device.rssi}`}</Text>
          <Text>{`Manufacturer : ${device.manufacturerData}`}</Text>
          <Text>{`ServiceData : ${device.serviceData}`}</Text>
          <Text>{`UUIDS : ${device.serviceUUIDs}`}</Text>
        </View>
        {services &&
          services.map((service) => <ServiceCard service={service} />)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },

  header: {
    backgroundColor: 'teal',
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: 'rgba(60,64,67,0.3)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    padding: 12,
  },
});

export { DeviceScreen };
