import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Text, ScrollView } from 'react-native';
import { Service } from 'react-native-ble-plx';
import { ServiceCard } from '../components/ServiceCard';
import { RootStackParamList } from '../navigation/index';

const DeviceScreen = ({
  route,
}: StackScreenProps<RootStackParamList, 'Device'>) => {
  const { device } = route.params;

  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

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
  }, [device]);

  return (
    <ScrollView>
      <Text>{`Id : ${device.id}`}</Text>
      <Text>{`Name : ${device.name}`}</Text>
      <Text>{`Is connected : ${isConnected}`}</Text>
      <Text>{`RSSI : ${device.rssi}`}</Text>
      <Text>{`Manufacturer : ${device.manufacturerData}`}</Text>
      <Text>{`ServiceData : ${device.serviceData}`}</Text>
      {services && services.map((service) => <ServiceCard service={service} />)}
      <Text>{`UUIDS : ${device.serviceUUIDs}`}</Text>
    </ScrollView>
  );
};

export { DeviceScreen };
