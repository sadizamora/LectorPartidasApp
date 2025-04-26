
// screens/PhotoPreviewScreen.js
import React from 'react';
import { View, Image, SafeAreaView,Text, TouchableHighlight} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL,REACT_APP_API_HEADERS } from '@env';
import axios from 'axios';
import styles from '../styles';


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
            FotoRenap2: imgCoverted,
            IdEmp: 'SZAMORAX01',
            IpHost: '131.107.1.23',
            HostName: 'DEV',
            OS: 'Windows',
          },
        };

        let response = await axios(configObj);

        console.log('Fin'+JSON.stringify(response.data));

        if (response.Error) {
          console.log('Error en la API:', response.Error);
          navigation.navigate('Camera')
        }

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

