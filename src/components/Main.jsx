import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableHighlight, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Main = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>IMB-PC</Text>
      <Text style={styles.subtitleText}>Lector de Partidas</Text>
      
      <View style={styles.buttonWrapper}>
        <TouchableHighlight style={styles.button} onPress={() => alert('Scanned!')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            <Text style={styles.buttonText}>INICIAR</Text>
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
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: '50%',
    backgroundColor: 'rgb(71 130 218)',
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

export default Main;