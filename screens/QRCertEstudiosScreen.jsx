import { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
  TouchableHighlight,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

export default function QRCertEstudiosScreen({ route, navigation }) {
  const { dataAlumno, carnet, user } = route.params;
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRecuperacion, setShowRecuperacion] = useState(false);
  // Nuevos estados para manejar ambos certificados
  const [certificadoOriginal, setCertificadoOriginal] = useState(null);
  const [urlOriginal, setUrlOriginal] = useState(null);
  const [esSegundaLectura, setEsSegundaLectura] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data);
    setLoading(true);
    if (data && type === "qr") {
      try {
        // 🔹 Realizar la petición a la API
        const response = await fetch(
          `${API_URL}` +
          "/schoolapi/utils/lectura_certificado?UrlCertificado=" +
          data +
          "&Carnet=" +
          carnet +
          "&IdEmp=" +
          user.IdEmp +
          "&IpHost=131.107.1.235&HostName=DEV&OS=Windows",
          {
            headers: JSON.parse(REACT_APP_API_HEADERS),
          }
        );
        const responseData = await response.json();
        console.log('responseData', responseData);
        // Si es la primera lectura
        if (!esSegundaLectura) {
          // Verificar si hay materias con nota menor a 60
          const tieneMateriaReprobada = responseData.msg.materias?.some(
            (materia) => parseFloat(materia.nota_numerica) < 60
          );

          if (tieneMateriaReprobada) {
            // Guardar el certificado original
            setCertificadoOriginal(responseData.msg);
            setUrlOriginal(data);
            setLoading(false);
            setShowRecuperacion(true);
            return;
          }

          // Si no hay materias reprobadas, navegar directamente
          setLoading(false);
          navigation.navigate("QRResultEstudios", {
            dataAlumno,
            carnet,
            scannedData: responseData.msg,
            user,
            url: data,
          });
        } else {
          // Es la segunda lectura (certificado de recuperación)
          setLoading(false);
          navigation.navigate("QRResultEstudios", {
            dataAlumno,
            carnet,
            scannedData: certificadoOriginal,
            scannedDataRecuperacion: responseData.msg,
            user,
            url: urlOriginal,
            urlRecuperacion: data,
          });
        }
      } catch (error) {
        setLoading(false);
        console.error("Error en la petición:", error);
      }
    } else {
      setLoading(false);
    }
  };

  const handleReiniciarEscaneo = () => {
    setScanned(false);
    setShowRecuperacion(false);
    setEsSegundaLectura(true);
  };

  const handleContinuar = () => {
    setShowRecuperacion(false);
    navigation.navigate("QRResultEstudios", {
      dataAlumno,
      carnet,
      scannedData: certificadoOriginal,
      user,
      url: urlOriginal,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.barcodebox}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={{ height: 400, width: 400 }}
        />
      </View>

      {/* Modal de Recuperación */}
      <Modal visible={showRecuperacion} transparent animationType="fade">
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
              minWidth: 300,
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={48}
              color="#EA963E"
              style={{ marginBottom: 10 }}
            />
            <Text
              style={{
                color: "#1B2635",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Aviso
            </Text>
            <Text
              style={{
                color: "#1B2635",
                fontSize: 16,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              El alumno tiene una nota no promovida. ¿Deseas leer el certificado de recuperación?
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableHighlight
                style={{
                  backgroundColor: "#4782DA",
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 24,
                }}
                underlayColor="#3366b3"
                onPress={handleReiniciarEscaneo}
              >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                  Sí
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  backgroundColor: "#aaa",
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 24,
                }}
                underlayColor="#888"
                onPress={handleContinuar}
              >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                  No
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Loading */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2635",
    alignItems: "center",
    justifyContent: "center",
  },
  containerButton: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    width: "50%",
  },

  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    borderBlockColor: "orange",
    borderWidth: 1.5,
    borderStyle: "solid",
  },
  titleText: {
    height: 40,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#374151",
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
  subtitleText: {
    height: 50,
    width: "80%",
    textAlign: "center",
    backgroundColor: "#233043",
    padding: 10,
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
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
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  data: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#233043",
    padding: 10,
    borderRadius: 10,
    borderBlockColor: "orange",
    borderWidth: 0.4,
    borderStyle: "solid",
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    marginTop: 50,
    width: "90%",
  },
});
