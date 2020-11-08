import React from 'react';
import {Text, View} from 'react-native';
import {Service} from 'react-native-ble-plx';

type ServiceCardProps = {
  service: Service;
};

const ServiceCard = ({service}: ServiceCardProps) => (
  <View>
    <Text>{`DeviceId : ${service.deviceID}`}</Text>
    <Text>{`UUID : ${service.uuid}`}</Text>
  </View>
);

export {ServiceCard};
