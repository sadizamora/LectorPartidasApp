
// screens/PhotoPreviewScreen.js
import React from 'react';
import { View, Image, StyleSheet, SafeAreaView,Text, TouchableHighlight} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL,REACT_APP_API_HEADERS } from '@env';
import axios from 'axios';


export default function PhotoPreviewScreen({ route, navigation }) {
  const { photo } = route.params;

  const handleConfirm = async () => {
    console.log('Foto guardada (base64):', photo.base64);

    if(photo) {

      const imgCoverted = photo.base64;
       
      try {         
        console.log('Foto guardada (base64):');
        
        // 🔹 Realizar la petición a la API
        const configObj = {
          method: "POST",
          url: `${API_URL}`+'/schoolapi/utils/lectura_renap',
          headers: JSON.parse(REACT_APP_API_HEADERS),
          data: {
            FotoRenap: imgCoverted, 
            IdEmp: 'SZAMORAX01',
            IpHost: '131.107.1.23',
            HostName: 'DEV',
            OS: 'Windows',
          },
        };

        let response = await axios(configObj);

        console.log('Fin'+JSON.stringify(response.data));

        if (response.data) {
          console.log('Respuesta de la API:', response.data);
          navigation.navigate('PhotoData', { scannedData: response.data.msg})
        }
       
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    }


  };

  return (
    <SafeAreaView  style={styles.container}>
        <Text style={styles.titleText}>Fotografía</Text>      
        <StatusBar style="light" />
        <Image source={{ uri: photo.uri }} style={styles.image} />

      <View style={styles.containerButton}>
          <TouchableHighlight style={styles.button}  onPress={handleConfirm} >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="check-circle" size={24} color="white" />
              <Text style={styles.buttonText}>Confirmar</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Camera')}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}> Volver a tomar </Text>
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
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  buttons: {
    padding: 10,
    height: 60,
    width: '100%',
    backgroundColor: '#4782DA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
