//screens/CameraScreen.js
import React, { useRef } from 'react';
import { View, Text, SafeAreaView, TouchableHighlight } from 'react-native';
import { CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles';

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
      <View style={styles.container}>
        <CameraView   style={styles.cameraView} ref={cameraRef}/>
        <View style={styles.containerButton}>
          <TouchableHighlight style={styles.button} onPress={takePhoto} >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="camera" size={24} color="white" />
                <Text style={styles.buttonText}> Capturar </Text>
              </View>
            </TouchableHighlight>
        </View>
      </View>
      

    </SafeAreaView>
  );
}