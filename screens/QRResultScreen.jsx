// screens/QRResultScreen.js
import React from 'react';
import { View, Text, SafeAreaView, TouchableHighlight, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function QRResultScreen({ route, navigation }) {
  const { scannedData, carnet, dataAlumno } = route.params;
  console.log('Datos escaneados:', scannedData);

  const handleSave = async () => {
    console.log('Guardado:', scannedData);   
    navigation.navigate('Home',{ dataAlumno, carnet });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado con CARNET y botón de edición */}
      <View style={styles.headerRow}>
        <Text style={styles.subtitleText}>CARNET {carnet}</Text>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Carnet')}>
          <MaterialCommunityIcons name="pencil" size={28} color="#EA963E" />
        </TouchableWithoutFeedback>
      </View>

      {/* Datos Personales */}
      <View style={styles.data}>
        {[
          { label: 'CODIGO', value: scannedData.cip },          
          { label: 'NOMBRES', value: scannedData.nombres_apellidos.nombres },
          { label: 'APELLIDOS', value: scannedData.nombres_apellidos.apellidos },
          { label: 'CUI', value: scannedData.cui },
          { label: 'FECHA NACIMIENTO', value: scannedData.fecha_nacimiento },
          { label: 'GENERO', value: scannedData.genero },
        ].map((item, index) => (
          <View key={index} style={styles.dataContainer}>
            <Text style={styles.textBold}>{item.label}</Text>
            <Text style={styles.textNormal}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Botones */}
      <View style={styles.containerButton}>
        <TouchableHighlight style={styles.button} onPress={handleSave}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="check-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Finalizar</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => navigation.navigate('QRScanner', { scannedData, carnet })}
          
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            <Text style={styles.buttonText}>Escanear otro</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1B2635',
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  data: {
    marginTop: 5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#EA963E',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
    width: '100%',
    gap: 10,
  },
  dataContainer: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  textNormal: {
    fontSize: 16,
    color: '#444',
  },  
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  containerButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',    
    gap: 10,
    width: '53%'
  },
  button: {
    padding: 5,
    height: 60,
    width: '90%',
    backgroundColor: '#4782DA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  }, 
});



