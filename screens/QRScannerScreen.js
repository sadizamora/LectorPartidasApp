
// screens/QRScannerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { CameraView, Camera } from "expo-camera";
import { API_URL,REACT_APP_API_HEADERS } from '@env';

export default function QRScannerScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();      
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data);   

    if(data && type === 'qr') {   
      try { 
        // 🔹 Realizar la petición a la API
        await fetch(`${API_URL}`+'/schoolapi/utils/lecturaqr_url?UrlQR='+data+'&IdEmp=SZAMORAX01&IpHost=131.107.1.235&HostName=DEV&OS=Windows' , {
          headers: JSON.parse(REACT_APP_API_HEADERS)
        }).then(response => response.json())
        .then(response => {
          navigation.navigate('QRResult', { scannedData: response.msg})
        })
        .catch(err => console.error(err));
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    }
    
  };


  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.titleText}>Scanner</Text>  
      <View style={styles.barcodebox}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={{ height: 400, width: 400 }}
        />
      </View>
      {scanned && <Button title={'Scanear otra vez?'} onPress={() => setScanned(false)} color='#4782DA' padding='5' />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2635',
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center'
  },

  barcodebox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    
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
    color: 'white',
    fontWeight: 'bold',
  },
});