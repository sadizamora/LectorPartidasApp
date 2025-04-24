
// screens/QRResultScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableHighlight } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function QRResultScreen({ route, navigation }) {
  const { scannedData } = route.params;
  console.log('Datos escaneados:', scannedData);

  const handleSave = async () => {
    console.log('Guardado:', scannedData);   
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Resultado escaneado</Text>
      <StatusBar style="light" />

      
        <View style={styles.barcodebox}>      
          <Text style={styles.dataText}>CODIGO:     {scannedData.cip}</Text>
          <Text style={styles.dataText}>NOMBRE :    {scannedData.nombre_completo}</Text>
          <Text style={styles.dataText}>CUI:                {scannedData.cui}</Text>
          <Text style={styles.dataText}>GENERO:       {scannedData.genero}</Text>
          <Text style={styles.dataText}>FECHA DE NACIMIENTO:     {scannedData.fecha_nacimiento}</Text>
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    gap: 20,
    
  },

  barcodebox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    paddingBottom: 20,
    
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
  dataText: {
    height: 35,
    width: '250',
    textAlign: 'left',
    backgroundColor: 'gray',
    padding: 10,   
    fontSize: 12,
    color: 'white',
  },

  button: {
    height: 60,
    width: '40%',
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