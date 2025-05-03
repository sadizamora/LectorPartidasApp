import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_URL, REACT_APP_API_HEADERS } from "@env";

export default function CarnetScreeen({ navigation }) {
  const [carnet, setCarnet] = useState("");
  const [dataAlumno, setAlumno] = useState("");

  const handleSearch = async () => {
    console.log("Carnet:", carnet);
    try {
      //🔹 Realizar la petición a la API
      await fetch(
        `${API_URL}` +
          "/schoolapi/utils/busquedas?opcion=CARNET&Carnet=" +
          carnet,
        {
          headers: JSON.parse(REACT_APP_API_HEADERS)
        }
      )
        .then((response) => response.json())
        .then((response) => {
          console.log("Respuesta de la API:", response);
          setAlumno(response[0]);
        })
        .catch((err) => console.error(err));

      console.log("Respuesta de la API:", response);

      const resData = await response.json();

      console.log(response);

      // Validación de respuesta
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      if (resData.msg) {
        alert(resData.msg.Mensaje);
      }

      if (resData.IdEmp) {
        alert(resData.IdEmp);
        navigation.navigate("Carnet", { user: resData });
      }
    } catch (err) {
      console.error("Error en login:", error.message);
      alert("Error en la conexión o en las credenciales");
    }
  };

  const formatCustomInput = (text) => {
    // Eliminar todo lo que no sea número
    const digits = text.replace(/\D/g, "");

    // Construir el formato: 2-4-4
    let formatted = "";
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(
        6,
        10
      )}`;
    }

    setCarnet(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerSearch}>
        {!dataAlumno ? (
          <>
            {/* Campo de búsqueda */}
            <View style={styles.searchInputView}>
              <TextInput
                style={styles.searchTextInput}
                placeholder="Ingrese el carnet"
                placeholderTextColor="#9597a6"
                keyboardType="numeric"
                value={carnet}
                onChangeText={formatCustomInput}
                maxLength={12}
              />
            </View>
  
            {/* Botón Buscar */}
            <TouchableHighlight
              style={styles.buttonSearch}
              underlayColor="#3366b3"
              onPress={handleSearch}
            >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="magnify" size={28} color="white" />
                <Text style={styles.buttonText}>Buscar</Text>
              </View>
            </TouchableHighlight>
          </>
        ) : (
          <>
            {/* Datos del alumno */}
            <View style={styles.alumnoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.subtitleTextSearch}>Datos del alumno</Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={28}
                  color="#EA963E"
                  onPress={() => setAlumno("")}
                />
              </View>
  
              <View style={styles.infoContainer}>
                <Text style={styles.dataTextSearch}>
                  <Text style={{ fontWeight: "bold" }}>Carnet: </Text>
                  {carnet}
                </Text>
                <Text style={styles.dataTextSearch}>
                  <Text style={{ fontWeight: "bold" }}>Nombre: </Text>
                  {dataAlumno.Alumno}
                </Text>
              </View>
  
              <TouchableHighlight
                style={styles.buttonSearch}
                underlayColor="#3366b3"
                onPress={() =>
                  navigation.navigate("Home", { dataAlumno, carnet })
                }
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={28}
                    color="white"
                  />
                  <Text style={styles.buttonText}>Confirmar</Text>
                </View>
              </TouchableHighlight>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2635',
    paddingTop: 20,
  },
  containerSearch: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchInputView: {
    width: '50%',
    marginBottom: 20,
    marginTop: 40,
  },
  searchTextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  buttonSearch: {
    backgroundColor: '#4782DA',
    borderRadius: 10,    
    paddingHorizontal: 20,
    marginTop: 10,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  alumnoContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#EA963E',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 15,
  },
  subtitleTextSearch: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA963E',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dataTextSearch: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

