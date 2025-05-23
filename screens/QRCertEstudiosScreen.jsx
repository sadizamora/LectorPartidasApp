import { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

export default function QRCertEstudiosScreen({ route, navigation }) {
  const { dataAlumno, carnet, user } = route.params;
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRecuperacion, setShowRecuperacion] = useState(false);
  const [certificadoOriginal, setCertificadoOriginal] = useState(null);
  const [urlOriginal, setUrlOriginal] = useState(null);
  const [esSegundaLectura, setEsSegundaLectura] = useState(false);
  
  // Estados para manejo de la cámara y foto
  const cameraRef = useRef(null);
  const [showCamera, setShowCamera] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isQRMode, setIsQRMode] = useState(false); // Cambiado a false para empezar en modo foto
  const [photo, setPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [fotoTomada, setFotoTomada] = useState(false);
  const [responseImagenData, setResponseImagenData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setIsCameraReady(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!isQRMode) return;
    
    setScanned(true);
    setData(data);
    setLoading(true);
    if (data && type === "qr") {
      try {
        const response = await fetch(
          `${API_URL}/schoolapi/utils/lectura_certificado?UrlCertificado=${data}&Carnet=${carnet}&IdEmp=${user.IdEmp}&IpHost=131.107.1.235&HostName=DEV&OS=Windows`,
          {
            headers: JSON.parse(REACT_APP_API_HEADERS),
          }
        );
        const responseData = await response.json();
        console.log('responseData', responseData);
        if (!esSegundaLectura) {
          const tieneMateriaReprobada = responseData.msg.materias?.some(
            (materia) => parseFloat(materia.nota_numerica) < 60
          );

          if (tieneMateriaReprobada) {
            setCertificadoOriginal(responseData.msg);
            setUrlOriginal(data);
            setLoading(false);
            setShowRecuperacion(true);
            return;
          }

          // Si no hay materias reprobadas, navegar a resultados
          setLoading(false);
          navigation.navigate("QRResultEstudios", {
            dataAlumno,
            carnet,
            scannedData: responseData.msg,
            scannedDataImagen: responseImagenData,
            user,
            url: data,
          });
        } else {
          setLoading(false);
          navigation.navigate("QRResultEstudios", {
            dataAlumno,
            carnet,
            scannedData: certificadoOriginal,
            scannedDataRecuperacion: responseData.msg,
            scannedDataImagen: responseImagenData,
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

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
        width: 1700,
        height: 2200
      });
      setPhoto(photo);
      setShowPreview(true);
    }
  };

  const handleConfirmPhoto = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/schoolapi/utils/lectura_certificado_imagen_fecha`, {
        method: "POST",
        headers: JSON.parse(REACT_APP_API_HEADERS),
        body: JSON.stringify({
          FotoCertificado: photo.base64,
          Carnet: carnet,
        }),
      });
      const responseData = await response.json();
      setResponseImagenData(responseData.msg);
      setFotoTomada(true);
      setShowPreview(false);
      setLoading(false);
      setIsQRMode(true); // Cambiar a modo QR después de procesar la foto
    } catch (error) {
      setLoading(false);
      console.error("Error al procesar la imagen:", error);
    }
  };

  const handleReiniciarEscaneo = () => {
    setScanned(false);
    setShowRecuperacion(false);
    setEsSegundaLectura(true);
    setIsQRMode(false); // Comenzar con modo foto
    setPhoto(null);
    setResponseImagenData(null);
    setFotoTomada(false);
  };

  const handleContinuar = () => {
    setShowRecuperacion(false);
    navigation.navigate("QRResultEstudios", {
      dataAlumno,
      carnet,
      scannedData: certificadoOriginal,
      scannedDataImagen: responseImagenData,
      user,
      url: urlOriginal,
    });
  };

  const handleScanearOtro = () => {
    setScanned(false);
    setIsQRMode(false); // Comenzar con modo foto
    setPhoto(null);
    setResponseImagenData(null);
    setFotoTomada(false);
    setEsSegundaLectura(false);
    navigation.navigate("QRCertEstudios", { dataAlumno, carnet, user });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.barcodebox}>
        <CameraView
          ref={cameraRef}
          onBarcodeScanned={scanned && isQRMode ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: isQRMode ? ["qr"] : [],
          }}
          style={{ height: 400, width: 400 }}
        />
        
        {!isQRMode && (
          <View style={styles.guideOverlay}>
            <View style={styles.guideBox} />
          </View>
        )}

        {isQRMode && (
          <View style={[styles.guideOverlay, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
            <View style={[styles.guideBox, { borderColor: '#4782DA' }]} />
            <Text style={styles.guideText}>Escanea el código QR del certificado</Text>
          </View>
        )}
      </View>

      {!isQRMode && !showPreview && (
        <TouchableHighlight
          style={styles.floatingButton}
          underlayColor="#3366b3"
          onPress={handleTakePhoto}
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="camera" size={28} color="white" />
            <Text style={styles.buttonText}>Capturar</Text>
          </View>
        </TouchableHighlight>
      )}

      {/* Modal de Preview de Foto */}
      <Modal visible={showPreview} transparent animationType="fade">
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo?.uri }} style={styles.previewImage} />
          <View style={styles.previewButtons}>
            <TouchableHighlight
              style={[styles.button, { backgroundColor: "#EA963E" }]}
              underlayColor="#c97c32"
              onPress={() => setShowPreview(false)}
            >
              <Text style={styles.buttonText}>Repetir</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.button, { backgroundColor: "#4782DA" }]}
              underlayColor="#3366b3"
              onPress={handleConfirmPhoto}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

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
              name="file-cancel"
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
              {isQRMode ? "Procesando QR..." : "Procesando imagen..."}
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
  guideOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: '85%',
    height: '90%',
    borderWidth: 2,
    borderColor: '#EA963E',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#4782DA",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 5,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
});
