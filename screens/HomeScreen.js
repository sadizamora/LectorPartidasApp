
// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, TouchableHighlight, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles';

export default function HomeScreen({ navigation }) {

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <SafeAreaView  style={styles.container}><Text style={styles.subtitleText}>Solicitando permiso para la cámara...</Text></SafeAreaView>
  }

  if (hasPermission === false) {
    return <SafeAreaView  style={styles.container}><Text style={styles.subtitleText}>Sin permiso para la cámara</Text></SafeAreaView>;
  }

  return (
      
    <SafeAreaView  style={styles.container}>
      <View style={styles.containerHome}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.subtitleText}>Lector de Partidas</Text>           
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('QRScanner')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            <Text style={styles.buttonText}>Escanear CIP</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Camera')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="image-area" size={24} color="white" />
            <Text style={styles.buttonText}> RENAP </Text>
          </View>
        </TouchableHighlight>
      </View>      
    </SafeAreaView >
  );
}