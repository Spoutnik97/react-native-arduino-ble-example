import React, {useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Device, Service} from 'react-native-ble-plx';
import {ServiceCard} from './ServiceCard';

type DeviceCardProps = {
  device: Device;
};

const DeviceCard = ({device}: DeviceCardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const getDeviceInformations = async () => {
    device
      .connect()
      .then((dvice) => {
        setIsConnected(true);
        return dvice.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        device.services().then((value) => {
          setServices(value);
        });
      });
  };

  return (
    <TouchableOpacity
      style={{backgroundColor: 'pink', margin: 12}}
      onPress={getDeviceInformations}>
      <Text>{`Id : ${device.id}`}</Text>
      <Text>{`Name : ${device.name}`}</Text>
      <Text>{`Is connected : ${isConnected}`}</Text>
      <Text>{`RSSI : ${device.rssi}`}</Text>
      <Text>{`Manufacturer : ${device.manufacturerData}`}</Text>
      <Text>{`ServiceData : ${device.serviceData}`}</Text>
      {services && services.map((service) => <ServiceCard service={service} />)}
      <Text>{`UUIDS : ${device.serviceUUIDs}`}</Text>
    </TouchableOpacity>
  );
};

export {DeviceCard};
