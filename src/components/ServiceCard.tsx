import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Characteristic, Descriptor, Service} from 'react-native-ble-plx';

type ServiceCardProps = {
  service: Service;
};

const DescriptorComponent = ({descriptor}: {descriptor: Descriptor}) => {
  return (
    <View key={descriptor.id}>
      <Text>{'Characteristic  : ' + descriptor.characteristicID}</Text>
      <Text>{descriptor.value}</Text>
      {/* <Text>{descriptor.read()}</Text> */}
    </View>
  );
};

const ServiceCard = ({service}: ServiceCardProps) => {
  const [descriptors, setDescriptors] = useState<Descriptor[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

  const getCharacteristics = async () => {
    const newCharacteristics = await service.characteristics();
    setCharacteristics(newCharacteristics);
    newCharacteristics.forEach(async (characteristic) => {
      const newDescriptors = await characteristic.descriptors();
      setDescriptors((prev) => [...prev, ...newDescriptors]);
    });
  };
  useEffect(() => {
    getCharacteristics();
  }, []);

  return (
    <View>
      <Text>{`UUID : ${service.uuid}`}</Text>
      {characteristics &&
        characteristics.map((char) => (
          <TouchableOpacity
            key={char.uuid}
            style={{backgroundColor: 'teal', marginVertical: 6}}
            onPress={() => {
              char.monitor((err, cha) => {
                console.warn('Notification');

                if (cha) {
                  Alert.alert('value', cha?.value || 'No content');
                }
              });

              char
                .writeWithoutResponse('Q291Y291')
                .then(() => {
                  console.warn('Success');
                })
                .catch((e) => console.log('Error', e));
            }}>
            <Text>{`isIndicatable : ${char.isIndicatable}`}</Text>
            <Text>{`isNotifiable : ${char.isNotifiable}`}</Text>
            <Text>{`isNotifying : ${char.isNotifying}`}</Text>
            <Text>{`isReadable : ${char.isReadable}`}</Text>
            <Text>{`isWritableWithResponse : ${char.isWritableWithResponse}`}</Text>
            <Text>{`isWritableWithoutResponse : ${char.isWritableWithoutResponse}`}</Text>
          </TouchableOpacity>
        ))}
      {/* {descriptors &&
        descriptors.map((descriptor) => (
         <DescriptorComponent descriptor={descriptor} />
        ))} */}
    </View>
  );
};
export {ServiceCard};
