import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Characteristic } from 'react-native-ble-plx';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Base64 } from '../lib/base64';

type CharacteristicCardProps = {
  char: Characteristic;
};

const CharacteristicCard = ({ char }: CharacteristicCardProps) => {
  useEffect(() => {
    char.monitor((err, cha) => {
      if (err) {
        console.warn('ERROR');
        return;
      }
      console.warn(
        'Notification',
        Base64.decode(cha?.value?.replace(/[=]/g, '')),
        cha?.value,
      );
    });
  }, [char]);

  return (
    <TouchableOpacity
      key={char.uuid}
      style={styles.container}
      onPress={() => {
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
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'teal', marginVertical: 6 },
});

export { CharacteristicCard };
