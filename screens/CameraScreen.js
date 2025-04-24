//screens/CameraScreen.js
import React, { useRef } from 'react';
import { View, Button, StyleSheet, Text, SafeAreaView } from 'react-native';
import { CameraView } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function CameraScreen({ navigation }) {
  
  const cameraRef = useRef(null);
  
  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      navigation.navigate('PhotoPreview', { photo });
    }
  };
  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.titleText}>Fotografía</Text>      
      <View style={styles.barcodebox}>
        <CameraView                    
          style={{ height: 400, width: 400 }}  ref={cameraRef}/>
        <Button title="Capturar" style={styles.button} onPress={takePhoto} />
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

  barcodebox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    
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
  camera: {
    flex: 1,
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