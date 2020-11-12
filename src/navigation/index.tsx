import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/Home';
import { DeviceScreen } from '../screens/Device';
import { Device } from 'react-native-ble-plx';

export type RootStackParamList = {
  Home: undefined;
  Device: { device: Device };
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator mode="card">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Device" component={DeviceScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
