import { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableHighlight,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { CameraView } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

export default function CamaraCertScreen({ route, navigation }) {
  const { dataAlumno, carnet, user } = route.params;
  const cameraRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Images, setBase64Images] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAviso, setShowAviso] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [showCamera, setShowCamera] = useState(true);
  const [showRecuperacion, setShowRecuperacion] = useState(false);
  const [certificadoOriginal, setCertificadoOriginal] = useState(null);
  const [esSegundaFoto, setEsSegundaFoto] = useState(false);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
        width: 1700,
        height: 2200
      });
      const newPhotos = [...photos, photo.uri];
      setPhotos(newPhotos);
      if (newPhotos.length === 1) setShowPreview(true);
    }
  };

  const resetCapture = () => {
    setPhotos([]);
    setBase64Images([]);
    setShowPreview(false);
  };

  const handleReiniciarCaptura = () => {
    setShowRecuperacion(false);
    setEsSegundaFoto(true);
    resetCapture();
    setShowCamera(true);
  };

  const handleContinuar = () => {
    setShowRecuperacion(false);
    setLoading(false);
    setShowPreview(false);
    setShowCamera(false);
    setTimeout(() => {
      navigation.navigate("QRResultEstudios", {
        dataAlumno,
        carnet,
        scannedData: certificadoOriginal,
        user,
        url: null,
      });
    }, 150);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const encoded = await Promise.all(
        photos.map(async (photo) => {
          const base64 = await FileSystem.readAsStringAsync(photo, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return base64;
        })
      );
      setBase64Images(encoded);

      // Envía la imagen al servidor
      const response = await fetch(`${API_URL}/schoolapi/utils/lectura_certificado_imagen`, {
        method: "POST",
        headers: JSON.parse(REACT_APP_API_HEADERS),
        body: JSON.stringify({
          FotoCertificado: encoded[0],
          Carnet: carnet,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      // Si es la primera foto
      if (!esSegundaFoto) {
        // Verificar si hay materias con nota menor a 60
        const tieneMateriaReprobada = data.msg.materias?.some(
          (materia) => parseFloat(materia.nota_numerica) < 60
        );

        if (tieneMateriaReprobada) {
          setCertificadoOriginal(data.msg);
          setLoading(false);
          setShowRecuperacion(true);
          return;
        }

        // Si no hay materias reprobadas, continuar con flujo normal
        setLoading(false);
        setShowPreview(false);
        setShowCamera(false);
        setTimeout(() => {
          navigation.navigate("QRResultEstudios", {
            dataAlumno,
            carnet,
            scannedData: data.msg,
            user,
            url: null,
          });
        }, 150);
      } else {
        // Es la segunda foto (certificado de recuperación)
        setLoading(false);
        setShowPreview(false);
        setShowCamera(false);
        setTimeout(() => {
          navigation.navigate("QRResultEstudios", {
            dataAlumno,
            carnet,
            scannedData: certificadoOriginal,
            scannedDataRecuperacion: data.msg,
            user,
            url: null,
          });
        }, 150);
      }
    } catch (error) {
      setLoading(false);
      setMensajeAviso("Error al procesar la imagen. Intente nuevamente.");
      setShowAviso(true);
      console.error("Error al procesar:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
          <View style={styles.fullscreenContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
              Procesando certificado...
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
              El alumno tiene una nota no promovida. ¿Deseas capturar el certificado de recuperación?
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
                onPress={handleReiniciarCaptura}
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

      {showPreview ? (
        <View style={styles.previewContainer}>
          <Text style={styles.title}>
            {esSegundaFoto ? "Certificado de Recuperación Capturado" : "Certificado Capturado"}
          </Text>

          <View style={styles.thumbnailWrapper}>
            <TouchableOpacity onPress={() => setSelectedImage(photos[0])}>
              <Image source={{ uri: photos[0] }} style={styles.thumbnailLarge} />
            </TouchableOpacity>
            <Text style={styles.thumbnailText}>
              {esSegundaFoto ? "Certificado de Recuperación" : "Certificado"}
            </Text>
          </View>

          <View style={styles.previewButtons}>
            <TouchableHighlight
              style={styles.repeatButton}
              underlayColor="#c94c4c"
              onPress={resetCapture}
            >
              <Text style={styles.buttonText}>Repetir</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.confirmButton}
              underlayColor="#3c74c9"
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableHighlight>
          </View>
        </View>
      ) : (
        <>
          {showCamera && !showPreview && (
            <>
              <CameraView style={styles.cameraView} ref={cameraRef} />
              <View style={styles.guideOverlay}>
                <View style={styles.guideBox} />
              </View>
            </>
          )}

          <Text style={styles.helperText}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="#fff"
            />
            {esSegundaFoto 
              ? "Capture el certificado de recuperación completo"
              : "Capture el certificado completo"
            }
          </Text>

          <TouchableHighlight
            style={styles.floatingButton}
            underlayColor="#3366b3"
            onPress={takePhoto}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="camera" size={28} color="white" />
              <Text style={styles.buttonText}>Capturar</Text>
            </View>
          </TouchableHighlight>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2635",
  },
  cameraView: {
    flex: 1,
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
  helperText: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    color: "#fff",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    zIndex: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B2635",
    paddingHorizontal: 5,
    margin: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 20,
    marginBottom: 20,
  },
  thumbnailWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  thumbnailText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingBottom: 20,
    marginTop: 20,
    gap: 20,
  },
  repeatButton: {
    backgroundColor: "#EA963E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "#4782DA",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  thumbnailLarge: {
    width: 300,
    height: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "orange",
    marginHorizontal: 10,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
}); 