// App.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTailwind } from 'tailwind-rn';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const tailwind = useTailwind();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    Alert.alert(
      'Código escaneado',
      `Tipo de código: ${type}\nDatos: ${data}`,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={tailwind('flex-1 justify-center items-center')}>
        <Text style={tailwind('text-lg')}>Solicitando permisos de cámara...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={tailwind('flex-1 justify-center items-center p-4')}>
        <Text style={tailwind('text-lg text-red-500 text-center mb-4')}>
          No se ha concedido acceso a la cámara
        </Text>
        <Button 
          title="Solicitar permisos nuevamente" 
          onPress={() => {
            BarCodeScanner.requestPermissionsAsync();
          }} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tailwind('flex-1')}>
      <StatusBar style="light" />
      
      <View style={tailwind('flex-1 bg-gray-900')}>
        <View style={tailwind('h-2/3 w-full')}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            type={'front'}
          />
          <View style={tailwind('absolute inset-0 border-8 border-blue-500 bg-transparent rounded-lg m-8 opacity-50')} />
        </View>
        
        <View style={tailwind('h-1/3 w-full bg-white p-4')}>
          <Text style={tailwind('text-xl font-bold mb-2')}>Escáner de códigos QR</Text>
          
          {scannedData ? (
            <View style={tailwind('mb-4')}>
              <Text style={tailwind('text-lg mb-1')}>Último código escaneado:</Text>
              <Text style={tailwind('p-2 bg-gray-100 rounded')}>{scannedData}</Text>
            </View>
          ) : (
            <Text style={tailwind('text-gray-500 mb-4')}>
              Apunta la cámara a un código QR para escanearlo
            </Text>
          )}
          
          {scanned && (
            <Button 
              title="Escanear nuevamente" 
              onPress={() => setScanned(false)} 
              color="#3b82f6"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}