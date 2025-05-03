import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { API_URL,REACT_APP_API_HEADERS } from '@env';

export default function QRScannerScreen({ route, navigation }) {
  const { dataAlumno, carnet } = route.params;
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
        await fetch(`${API_URL}`+'/schoolapi/utils/lecturaqr_url?UrlQR='+data+'&Carnet='+carnet+'&IdEmp=SZAMORAX01&IpHost=131.107.1.235&HostName=DEV&OS=Windows' , {
          headers: JSON.parse(REACT_APP_API_HEADERS)
        }).then(response => response.json())
        .then(response => {
          console.log('Respuesta de la API:', response);
          navigation.navigate('QRResult', { dataAlumno, carnet, scannedData : response.msg});
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
            barcodeTypes: ["qr"],
          }}
          style={{ height: 400, width: 400 }}
        />
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2635',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerButton: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',    
    gap: 10,
    width: '50%'
  }, 

  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    borderBlockColor: 'orange',
    borderWidth: 1.5,
    borderStyle: 'solid',
  },  
  titleText: {
    height: 40,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#374151',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
  subtitleText: {
    height: 50,
    width: '80%',
    textAlign: 'center',
    backgroundColor: '#233043',
    padding: 10,   
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
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
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  data:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#233043',
    padding: 10,    
    borderRadius: 10,
    borderBlockColor: 'orange',
    borderWidth: 0.4,
    borderStyle: 'solid',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    marginTop: 50,
    width: '90%',
  },  
});

