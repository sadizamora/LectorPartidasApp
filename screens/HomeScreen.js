
// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableHighlight } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <SafeAreaView  style={styles.container}><Text>Solicitando permiso para la cámara...</Text></SafeAreaView>
  }
  if (hasPermission === false) {
    return <SafeAreaView  style={styles.container}><Text>Sin permiso para la cámara</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.titleText}>IMB-PC</Text>
      <Text style={styles.subtitleText}>Lector de Partidas</Text>      
      <View style={styles.containerButton}>
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('QRScanner')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            <Text style={styles.buttonText}>Escanear QR</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Camera')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="image-area" size={24} color="white" />
            <Text style={styles.buttonText}> Fotografía </Text>
          </View>
        </TouchableHighlight>
      </View>      
    </SafeAreaView >
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

  containerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    
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
    backgroundColor: '#4782DA',
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