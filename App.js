import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import QRResultScreen from './screens/QRResultScreen';
import CameraScreen from './screens/CameraScreen';
import PhotoPreviewScreen from './screens/PhotoPreviewScreen';
import PhotoDataScreen from './screens/PhotoDataScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="QRResult" component={QRResultScreen} />
        <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
        <Stack.Screen name="PhotoData" component={PhotoDataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
