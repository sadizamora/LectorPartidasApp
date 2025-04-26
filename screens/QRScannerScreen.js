import React, { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { API_URL,REACT_APP_API_HEADERS } from '@env';
import styles from '../styles';

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
      <View style={styles.barcodebox}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={{ height: 400, width: 400 }}
        />
      </View>
    </SafeAreaView>
  );
}
