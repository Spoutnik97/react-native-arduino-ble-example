import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Characteristic, Descriptor, Service } from 'react-native-ble-plx';
import { CharacteristicCard } from './CharacteristicCard';
import { DescriptorCard } from './DescriptorCard';

type ServiceCardProps = {
  service: Service;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UART_SERVICE_UUID = '6E400001-B5A3-F393-­E0A9-­E50E24DCCA9E'.toLowerCase();

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [descriptors, setDescriptors] = useState<Descriptor[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [areCharacteristicsVisible, setAreCharacteristicsVisible] = useState(
    false,
  );

  useEffect(() => {
    const getCharacteristics = async () => {
      const newCharacteristics = await service.characteristics();
      setCharacteristics(newCharacteristics);
      newCharacteristics.forEach(async (characteristic) => {
        const newDescriptors = await characteristic.descriptors();
        setDescriptors((prev) => [...new Set([...prev, ...newDescriptors])]);
      });
    };

    getCharacteristics();
  }, [service]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setAreCharacteristicsVisible((prev) => !prev);
        }}>
        <Text>{`UUID : ${service.uuid}`}</Text>
      </TouchableOpacity>

      {areCharacteristicsVisible &&
        characteristics &&
        characteristics.map((char) => (
          <CharacteristicCard key={char.id} char={char} />
        ))}
      {descriptors &&
        descriptors.map((descriptor) => (
          <DescriptorCard key={descriptor.id} descriptor={descriptor} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: 'rgba(60,64,67,0.3)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    padding: 12,
  },
});

export { ServiceCard };
