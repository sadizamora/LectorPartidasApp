import { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

export default function CarnetScreeen({ route, navigation }) {
  const { user } = route.params;
  const [carnet, setCarnet] = useState("");
  const [dataAlumno, setAlumno] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAviso, setShowAviso] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState("");

  const handleSearch = async () => {
    console.warn("handleSearch llamado", carnet);
    if (!carnet || carnet.trim() === "") {
      setMensajeAviso("Debes ingresar un carnet antes de buscar.");
      setShowAviso(true);
      console.warn("Carnet vacío");
      return;
    }
    setLoading(true);
    try {
      console.warn(
        "Llamando a la API:",
        `${API_URL}/schoolapi/utils/busquedas?opcion=CARNET&Carnet=${carnet}`
      );
      const res = await fetch(
        `${API_URL}/schoolapi/utils/busquedas?opcion=CARNET&Carnet=${carnet}`,
        {
          headers: JSON.parse(REACT_APP_API_HEADERS),
        }
      );
      const response = await res.json();
      setLoading(false);
      console.warn("Respuesta de la API:", response);
      if (!Array.isArray(response) || response.length === 0) {
        setMensajeAviso("No se encontró información para el carnet ingresado.");
        setShowAviso(true);
        console.warn("Respuesta vacía o no es array");
        return;
      }
      if (!response[0] || typeof response[0] !== "object") {
        setMensajeAviso("La respuesta de la API no es válida.");
        setShowAviso(true);
        console.warn("Primer elemento de la respuesta no es objeto");
        return;
      }
      setAlumno(response[0]);
      console.warn("Alumno seteado:", response[0]);
    } catch (err) {
      setLoading(false);
      setMensajeAviso("Error en la conexión o en las credenciales");
      setShowAviso(true);
      console.warn("Error en handleSearch:", err);
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

  let renderAlumno = null;
  try {
    renderAlumno = (
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
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Carnet: </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
              {dataAlumno?.Carnet || "-"}
            </Text>
          </Text>
          <Text style={styles.dataTextSearch}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Nombre: </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
              {dataAlumno?.Alumno || "-"}
            </Text>
          </Text>
          <Text style={styles.dataTextSearch}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Último ciclo:{" "}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
              {dataAlumno?.UltimoCiclo || "-"}
            </Text>
          </Text>
          <Text style={styles.dataTextSearch}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Última sede:{" "}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
              {dataAlumno?.UltimaSede || "-"}
            </Text>
          </Text>
          <Text style={styles.dataTextSearch}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Último grado:{" "}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
              {dataAlumno?.UltimoGrado || "-"}
            </Text>
          </Text>
          {dataAlumno?.Renap > 0 && (
            <Text style={styles.dataTextSearch}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "orange" }}
              >
                El alumno ya tiene guardado el proceso de lectura de RENAP. Si
                continúa, se reemplazará la información almacenada.
              </Text>
            </Text>
          )}
        </View>
        <TouchableHighlight
          style={styles.buttonSearch}
          underlayColor="#3366b3"
          onPress={() =>
            navigation.navigate("Home", { dataAlumno, carnet, user })
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
    );
  } catch (err) {
    console.warn("Error renderizando datos del alumno:", err);
    renderAlumno = (
      <View style={styles.alumnoContainer}>
        <Text style={{ color: "red", fontSize: 18, fontWeight: "bold" }}>
          Error mostrando los datos del alumno. Por favor, contacte soporte.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={loading} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <View
            style={{
              backgroundColor: "#e6ecf5",
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
              minWidth: 180,
            }}
          >
            <ActivityIndicator size="large" color="#EA963E" />
            <Text style={{ color: "#1B2635", marginTop: 10, fontSize: 18 }}>
              Cargando...
            </Text>
          </View>
        </View>
      </Modal>
      <Modal visible={showAviso} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <View
            style={{
              backgroundColor: "#e6ecf5",
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
              minWidth: 220,
            }}
          >
            <Text
              style={{
                color: "#1B2635",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Aviso
            </Text>
            <Text
              style={{ color: "#1B2635", fontSize: 16, textAlign: "center" }}
            >
              {mensajeAviso}
            </Text>
            <TouchableHighlight
              style={{
                marginTop: 20,
                backgroundColor: "#4782DA",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 24,
              }}
              underlayColor="#3366b3"
              onPress={() => setShowAviso(false)}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Cerrar
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <View style={styles.containerSearch}>
        {!dataAlumno ? (
          <>
            {/* Campo de búsqueda */}
            <Text style={styles.subtitleTextSearch}>
              Ingresa el carnet que deseas trabajar
            </Text>
            <View style={styles.searchInputView}>
              <TextInput
                style={styles.searchTextInput}
                placeholder="Ingresa carnet"
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
                <MaterialCommunityIcons
                  name="magnify"
                  size={28}
                  color="white"
                />
                <Text style={styles.buttonText}>Buscar</Text>
              </View>
            </TouchableHighlight>
          </>
        ) : (
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
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Carnet:{" "}
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}
                >
                  {dataAlumno?.Carnet || "-"}
                </Text>
              </Text>
              <Text style={styles.dataTextSearch}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Nombre:{" "}
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}
                >
                  {dataAlumno?.Alumno || "-"}
                </Text>
              </Text>
              <Text style={styles.dataTextSearch}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Último ciclo:{" "}
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}
                >
                  {dataAlumno?.UltimoCiclo || "-"}
                </Text>
              </Text>
              <Text style={styles.dataTextSearch}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Última sede:{" "}
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}
                >
                  {dataAlumno?.UltimaSede || "-"}
                </Text>
              </Text>
              <Text style={styles.dataTextSearch}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Último grado:{" "}
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}
                >
                  {dataAlumno?.UltimoGrado || "-"}
                </Text>
              </Text>
              {dataAlumno?.Renap > 0 && (
                <Text style={styles.dataTextSearch}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                      color: "orange",
                    }}
                  >
                    El alumno ya tiene guardado el proceso de lectura de RENAP.
                    Si continúa, se reemplazará la información almacenada.
                  </Text>
                </Text>
              )}
            </View>
            <TouchableHighlight
              style={styles.buttonSearch}
              underlayColor="#3366b3"
              onPress={() =>
                navigation.navigate("Home", { dataAlumno, carnet, user })
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
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2635",
    paddingTop: 20,
  },
  containerSearch: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  searchInputView: {
    width: "60%",
    marginBottom: 20,
    marginTop: 40,
  },
  searchTextInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  buttonSearch: {
    backgroundColor: "#4782DA",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  button: {
    padding: 5,
    height: 60,
    width: "90%",
    backgroundColor: "#4782DA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },
  alumnoContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#EA963E",
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 15,
  },
  subtitleTextSearch: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EA963E",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dataTextSearch: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
});
