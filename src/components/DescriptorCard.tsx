import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Descriptor } from 'react-native-ble-plx';
import { Base64 } from '../lib/base64';
type DescriptorCardProps = {
  descriptor: Descriptor;
};

const DescriptorCard = ({ descriptor }: DescriptorCardProps) => {
  const [value, setValue] = useState('');
  useEffect(() => {
    (async () => {
      descriptor.read().then((r) => {
        if (r && r.value) {
          setValue(r.value);
        }
      });
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text>
        {descriptor.id + ' -> ' + Base64.decode(value) + '(' + value + ')'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({ container: {} });

export { DescriptorCard };
