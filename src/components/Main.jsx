import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Button, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTailwind } from 'tailwind-rn';

export function Main()  {

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
    <View style={styles.container}>
      <Text style={styles.titleText}>IMB - PC</Text>
      <Text style={styles.subtitleText}>Lector de partidas</Text>      
      <View style={styles.buttonWrapper}>
        <TouchableHighlight style={styles.button} onPress={() => alert('Scanned!')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            <Text style={styles.buttonText}>INICIAR</Text>
          </View>
        </TouchableHighlight>
      </View>
      <Text style={styles.footerText}>© Copyright 2025 IMB-PC</Text>      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2635',
    paddingTop: Constants.statusBarHeight
  },
  titleText: {
    height: 50,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#374151',
    padding: 10,   
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitleText: {
    height: 50,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#1B2635',
    padding: 10,   
    fontSize: 20,
    color: '#e89545',
    fontWeight: 'bold',
  },
  footerText: {
    height: 25,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#374151',
    padding: 5,   
    fontSize: 10,
    color: 'white',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: '50%',
    backgroundColor: '#4782da',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default Main