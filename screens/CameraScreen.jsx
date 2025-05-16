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

export default function CaptureScreen({ route, navigation }) {
  const { datos, dataAlumno, carnet, user } = route.params;
  const cameraRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Images, setBase64Images] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAviso, setShowAviso] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [showCamera, setShowCamera] = useState(true);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const newPhotos = [...photos, photo.uri];
      setPhotos(newPhotos);
      if (newPhotos.length === 2) setShowPreview(true);
    }
  };

  const resetCapture = () => {
    setPhotos([]);
    setBase64Images([]);
    setShowPreview(false);
  };

  const handleConfirm = async () => {
    console.log("Carnet:", carnet);
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
      // Envía las imágenes al servidor
      const response = await fetch(`${API_URL}/schoolapi/utils/lectura_renap`, {
        method: "POST",
        headers: JSON.parse(REACT_APP_API_HEADERS),
        body: JSON.stringify({
          IdEmp: user.IdEmp,
          IpHost: "131.107.1.235",
          HostName: "DEV1",
          OS: "Windows",
          FotoRenap: encoded[0],
          FotoRenap2: encoded[1],
          Carnet: carnet,
        }),
      });
      const data = await response.json();
      if (data.msg.Error == 2005) {
        setMensajeAviso(data.msg.Mensaje);
        setShowAviso(true);
        setLoading(false);
        return;
      }
      if (data.msg.Error == 0) {
        setLoading(false); // Cierra el modal antes de navegar
        setShowPreview(false); // Opcional: desmonta la vista previa
        setShowCamera(false); // desmonta la cámara
        setTimeout(() => {
          navigation.navigate("PhotoData", {
            dataAlumno,
            carnet,
            datos: data.msg,
            user,
          });
        }, 150); // espera a que la cámara se desmonte
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error al convertir/enviar:", error);
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

      {showPreview ? (
        <View style={styles.previewContainer}>
          <Text style={styles.title}>Fotos Capturadas</Text>

          <FlatList
            data={photos}
            horizontal
            keyExtractor={(item, index) => item + index}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={({ item, index }) => (
              <View style={styles.thumbnailWrapper}>
                <TouchableOpacity onPress={() => setSelectedImage(item)}>
                  <Image source={{ uri: item }} style={styles.thumbnailLarge} />
                </TouchableOpacity>
                <Text style={styles.thumbnailText}>
                  {index === 0 ? "Frente" : "Atrás"}
                </Text>
              </View>
            )}
          />

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
            <CameraView style={styles.cameraView} ref={cameraRef} />
          )}

          <Text style={styles.helperText}>
            <MaterialCommunityIcons
              name={
                photos.length === 0 ? "numeric-1-circle" : "numeric-2-circle"
              }
              size={24}
              color="#fff"
            />
            {photos.length === 0 ? "Frente" : "Atras"}
          </Text>

          {photos.length > 0 && (
            <View style={styles.bottomOverlay}>
              <FlatList
                data={photos}
                horizontal
                keyExtractor={(item, index) => item + index}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({ item, index }) => (
                  <View style={styles.thumbnailWrapper}>
                    <TouchableOpacity onPress={() => setSelectedImage(item)}>
                      <Image
                        source={{ uri: item }}
                        style={styles.thumbnailSmall}
                      />
                    </TouchableOpacity>
                    <Text style={styles.thumbnailText}>
                      {index === 0 ? "Frente" : "Atrás"}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

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
  },
  thumbnailWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "250",
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  thumbnailText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingBottom: 20,
  },
  repeatButton: {
    backgroundColor: "#4782DA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "#4782DA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  thumbnailLarge: {
    width: 250,
    height: 450,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "orange",
    marginHorizontal: 10,
  },
  thumbnailSmall: {
    width: 120,
    height: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "orange",
    marginHorizontal: 6,
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
