// This file contains the styles for the app using React Native's StyleSheet API.
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

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
    padding: 10,
    gap: 20,
    width: '50%',
    
  },
 
  containerHome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: '#233043',
    padding: 20,    
    borderRadius: 10,
    borderBlockColor: 'orange',
    borderWidth: 0.4,
    borderStyle: 'solid',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 90,
    marginTop: 100,
    width: '80%',
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
    backgroundColor: '#233043',
    padding: 10,   
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
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

  textBold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  textNormal: {
    fontSize: 12,
  },

  image: {
    width: '950%',
    height: '65%',    
    resizeMode: 'contain',
    borderColor: 'orange',
    borderWidth: 1,
    borderStyle: 'solid',
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: '#233043',
  },

  cameraView: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 450,
    width: 300,
    overflow: 'hidden',
    borderBlockColor: 'orange',
    borderWidth: 1.5,
    borderStyle: 'solid',
  }
  

});

export default styles;