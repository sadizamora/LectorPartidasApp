import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ComparacionView = ({ route, navigation }) => {
  const { datos, dataAlumno, carnet } = route.params;

  const validacion = datos.Mensaje.Validacion;

  const renderCampo = (label, renap, db, esValido) => (
    <View style={styles.fila} key={label}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.columna}>
        <Text style={styles.renap}>RENAP: {renap || '—'}</Text>
        <Text style={styles.db}>DB: {db || '—'}</Text>
      </View>
      <Text style={[styles.estado, { color: esValido ? 'green' : 'red' }]}>
        {esValido ? '✔' : '✘'}
      </Text>
    </View>
  );

  const handleSave = async () => {
    console.log('Guardado:', scannedData);   
    navigation.navigate('Carnet');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo} alignItems="center">Datos RENAP vs Sistema</Text>

      {/* Datos básicos */}
      {renderCampo('Partida', validacion.Partida.DatoRenap, validacion.Partida.DatoDB, validacion.Partida.Validacion)}
      {renderCampo('Folio', validacion.Folio.DatoRenap, validacion.Folio.DatoDB, validacion.Folio.Validacion)}
      {renderCampo('Libro', validacion.Libro.DatoRenap, validacion.Libro.DatoDB, validacion.Libro.Validacion)}
      {renderCampo('CUI', validacion.CUI.DatoRenap, validacion.CUI.DatoDB, validacion.CUI.Validacion)}
      {renderCampo('Nombre Completo', validacion.NombreCompleto.DatoRenap, validacion.NombreCompleto.DatoDB, validacion.NombreCompleto.Validacion)}
      {renderCampo('Nombres', validacion.NombresApellidos.Nombres.DatoRenap, validacion.NombresApellidos.Nombres.DatoDB, validacion.NombresApellidos.Nombres.Validacion)}
      {renderCampo('Apellidos', validacion.NombresApellidos.Apellidos.DatoRenap, validacion.NombresApellidos.Apellidos.DatoDB, validacion.NombresApellidos.Apellidos.Validacion)}
      {renderCampo('Fecha Nacimiento', validacion.FechaNac.DatoRenap, validacion.FechaNac.DatoDB, validacion.FechaNac.Validacion)}
      {renderCampo('Género', validacion.Genero.DatoRenap, validacion.Genero.DatoDB, validacion.Genero.Validacion)}

      {/* Lugar de nacimiento */}
      {renderCampo('Lugar Nac - País', validacion.LugarNac.Pais.DatoRenap, validacion.LugarNac.Pais.DatoDB, validacion.LugarNac.Pais.Validacion)}
      {renderCampo('Lugar Nac - Depto', validacion.LugarNac.Depto.DatoRenap, validacion.LugarNac.Depto.DatoDB, validacion.LugarNac.Depto.Validacion)}
      {renderCampo('Lugar Nac - Muni', validacion.LugarNac.Muni.DatoRenap, validacion.LugarNac.Muni.DatoDB, validacion.LugarNac.Muni.Validacion)}

      {/* Datos madre */}
      {renderCampo('Nombre Madre', validacion.NombreMadre.DatoRenap, validacion.NombreMadre.DatoDB, validacion.NombreMadre.Validacion)}
      {renderCampo('CUI Madre', validacion.CUIMadre.DatoRenap, validacion.CUIMadre.DatoDB, validacion.CUIMadre.Validacion)}
      {renderCampo('Fecha Nac Madre', validacion.FechaNacMadre.DatoRenap, validacion.FechaNacMadre.DatoDB, validacion.FechaNacMadre.Validacion)}
      {renderCampo('Lugar Nac Madre - País', validacion.LugarNacMadre.PaisMadre.DatoRenap, validacion.LugarNacMadre.PaisMadre.DatoDB, validacion.LugarNacMadre.PaisMadre.Validacion)}
      {renderCampo('Lugar Nac Madre - Depto', validacion.LugarNacMadre.DeptoMadre.DatoRenap, validacion.LugarNacMadre.DeptoMadre.DatoDB, validacion.LugarNacMadre.DeptoMadre.Validacion)}
      {renderCampo('Lugar Nac Madre - Muni', validacion.LugarNacMadre.MuniMadre.DatoRenap, validacion.LugarNacMadre.MuniMadre.DatoDB, validacion.LugarNacMadre.MuniMadre.Validacion)}

      {/* Datos padre */}
      {renderCampo('Nombre Padre', validacion.NombrePadre.DatoRenap, validacion.NombrePadre.DatoDB, validacion.NombrePadre.Validacion)}
      {renderCampo('CUI Padre', validacion.CUIPadre.DatoRenap, validacion.CUIPadre.DatoDB, validacion.CUIPadre.Validacion)}
      {renderCampo('Fecha Nac Padre', validacion.FechaNacPadre.DatoRenap, validacion.FechaNacPadre.DatoDB, validacion.FechaNacPadre.Validacion)}
      {renderCampo('Lugar Nac Padre - País', validacion.LugarNacPadre.PaisPadre.DatoRenap, validacion.LugarNacPadre.PaisPadre.DatoDB, validacion.LugarNacPadre.PaisPadre.Validacion)}
      {renderCampo('Lugar Nac Padre - Depto', validacion.LugarNacPadre.DeptoPadre.DatoRenap, validacion.LugarNacPadre.DeptoPadre.DatoDB, validacion.LugarNacPadre.DeptoPadre.Validacion)}
      {renderCampo('Lugar Nac Padre - Muni', validacion.LugarNacPadre.MuniPadre.DatoRenap, validacion.LugarNacPadre.MuniPadre.DatoDB, validacion.LugarNacPadre.MuniPadre.Validacion)}

      {/* Observaciones */}
      {renderCampo('Observaciones', validacion.Observaciones.DatoRenap, validacion.Observaciones.DatoDB, validacion.Observaciones.Validacion)}

      <View style={styles.containerButton}>
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Carnet')}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="check-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Finalizar</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Home', { dataAlumno, carnet})}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="camera" size={24} color="white" />
            <Text style={styles.buttonText}> Otro </Text>
          </View>
        </TouchableHighlight>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1B2635',
  },
  titulo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#EA963E',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
    width: '100%',
    gap: 10, // solo si tu versión de React Native lo soporta
  },
  fila: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    width: '30%',
  },
  columna: {
    width: '55%',
  },
  renap: {
    fontSize: 12,
    color: '#333',
  },
  db: {
    fontSize: 12,
    color: '#555',
  },
  estado: {
    fontSize: 18,
    fontWeight: 'bold',
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

export default ComparacionView;
