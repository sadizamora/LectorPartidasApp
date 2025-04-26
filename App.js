import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import QRResultScreen from './screens/QRResultScreen';
import CameraScreen from './screens/CameraScreen';
import PhotoPreviewScreen from './screens/PhotoPreviewScreen';
import PhotoDataScreen from './screens/PhotoDataScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="white" translucent={false}/>
      <Stack.Navigator initialRouteName='Home' screenOptions={{headerStyle: {backgroundColor:  '#233043'}, headerTintColor: '#fff',
      headerTitleStyle: {fontWeight: 'bold'}, headerTitleAlign: 'center'}}>          
          <Stack.Screen name="Home"   options={{title: 'COLEGIO IMB - PC'}} component={HomeScreen} />
          <Stack.Screen name="QRScanner" options={{title: 'Scanner'}} component={QRScannerScreen} />
          <Stack.Screen name="Camera" options={{title: 'Camara'}} component={CameraScreen} />
          <Stack.Screen name="QRResult" options={{title: 'Resultado'}} component={QRResultScreen} />
          <Stack.Screen name="PhotoPreview" options={{title: 'Fotografía'}} component={PhotoPreviewScreen} />
          <Stack.Screen name="PhotoData" options={{title: 'Resultado'}} component={PhotoDataScreen} />
      </Stack.Navigator>
  </NavigationContainer>
  );
}
