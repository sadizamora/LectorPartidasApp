import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableHighlight, SafeAreaView  } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrDetected, setQrDetected] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const cameraRef = useRef(null);
  
  const [text, setText] = useState('Sin escanear');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    //if (!qrDetected && type.includes('qr')) {
      clearTimeout(timeoutId);
      setQrDetected(true);
      setScanning(false);
      Alert.alert('Código QR detectado...', data);
    //}
    setScanned(true);
  setText(data)
  console.log('Type: ' + type + '\nData: ' + data)
  };

  const iniciarEscaneo = () => {
    setScanning(true);
    setQrDetected(false);

    const id = setTimeout(() => {
      if (!qrDetected) {
        setScanning(false);
        Alert.alert('Aviso', 'No se detectó ningún código QR.');
      }
    }, 10000); // 10 segundos

    setTimeoutId(id);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permisos de cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="light" />
       <Text style={styles.titleText}>IMB-PC</Text>
       <Text style={styles.subtitleText}>Lector de Partidas</Text>
      {!scanning ? (        
        <View style={styles.containerButton}>
          <TouchableHighlight style={styles.button} onPress={iniciarEscaneo}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
              <Text style={styles.buttonText}>Escanear QR</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={iniciarEscaneo}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="image-area" size={24} color="white" />
              <Text style={styles.buttonText}> Fotografía </Text>
            </View>
          </TouchableHighlight>
        </View>
        
      ) : (
        <View style={styles.containerButton}>
          <View style={styles.barcodebox}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }} />
          </View>
          <Text style={styles.maintext}>{text}</Text>

          {scanned && <Button title={'Scanear otra vez?'} onPress={() => setScanned(false)} color='skyblue' />}
        </View>
      )}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2635',
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    
  },

  containerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    
  },
  
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
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
  
  button: {
    padding: 10,
    height: 60,
    width: '100%',
    backgroundColor: 'rgb(71 130 218)',
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
