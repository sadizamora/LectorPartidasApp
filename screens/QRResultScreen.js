
// screens/QRResultScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles';

export default function QRResultScreen({ route, navigation }) {
  const { scannedData } = route.params;
  console.log('Datos escaneados:', scannedData);

  const handleSave = async () => {
    console.log('Guardado:', scannedData);   
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.data}>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>CODIGO</Text>
          <Text style={styles.textNormal}>{scannedData.cip}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>NOMBRES</Text>
          <Text style={styles.textNormal}>{scannedData.nombres_apellidos.nombres}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>APELLIDOS</Text>
          <Text style={styles.textNormal}>{scannedData.nombres_apellidos.apellidos}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>CUI</Text>          
          <Text style={styles.textNormal}>{scannedData.cui}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>FECHA NACIMIENTO</Text>
          <Text style={styles.textNormal}>{scannedData.fecha_nacimiento}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>GENERO</Text>
          <Text style={styles.textNormal}>{scannedData.genero}</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <TouchableHighlight style={styles.button}  onPress={handleSave} >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="check-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Finalizar</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('QRScanner')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            <Text style={styles.buttonText}> Escanear otro </Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}
