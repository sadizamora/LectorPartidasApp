
// screens/QRResultScreen.js
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableHighlight } from 'react-native';
import styles from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PhotoDataScreen({ route, navigation }) {
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
          <Text style={styles.textBold}>Partida</Text>
          <Text style={styles.textNormal}>{scannedData.Partida}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>Folio</Text>
          <Text style={styles.textNormal}>{scannedData.Folio}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>Libro</Text>
          <Text style={styles.textNormal}>{scannedData.Libro}</Text>
        </View>        
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>CUI</Text>          
          <Text style={styles.textNormal}>{scannedData.CUI}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>NOMBRES</Text>
          <Text style={styles.textNormal}>{scannedData.NombresApellidos.Nombres}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>APELLIDOS</Text>
          <Text style={styles.textNormal}>{scannedData.NombresApellidos.Apellidos}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.textBold}>FECHA NACIMIENTO</Text>
          <Text style={styles.textNormal}>{scannedData.FechaNac}</Text>
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

          <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Camara')}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}> Otra Captura</Text>
            </View>
          </TouchableHighlight>
        </View>    
      
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1B2635',
//     paddingTop: Constants.statusBarHeight,
//     alignItems: 'center',
//     justifyContent: 'center'
    
//   },

//   containerButton: {
//     flex: 1,
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     padding: 10,
//     gap: 20,
    
//   },

//   barcodebox: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     gap: 5,
//     paddingBottom: 20,
    
//   },
 
//   titleText: {
//     height: 50,
//     width: '100%',
//     textAlign: 'center',
//     backgroundColor: '#374151',
//     padding: 10,   
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   dataText: {
//     height: 35,
//     width: '250',
//     textAlign: 'left',
//     backgroundColor: 'gray',
//     padding: 10,   
//     fontSize: 12,
//     color: 'white',
//   },

//   button: {
//     height: 60,
//     width: '40%',
//     backgroundColor: '#4782DA',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//   },

//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });