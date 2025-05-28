// HomeScreen.js
import { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";

const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

export default function HomeScreen({ navigation, route }) {
  const { dataAlumno, carnet, user } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [certificadosData, setCertificadosData] = useState({
    ContadorCerti: 0,
    Ciclos: "",
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Función para obtener datos de certificados
  const fetchCertificadosData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/schoolapi/utils/busquedas?opcion=CARNET&Carnet=${carnet}`,
        {
          headers: JSON.parse(REACT_APP_API_HEADERS),
        }
      );
      const data = await response.json();
      console.log(data);
      setCertificadosData({
        ContadorCerti: data[0].ContadorCerti || 0,
        Ciclos: data[0].Ciclos || "",
      });
    } catch (error) {
      console.error("Error al obtener datos de certificados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchCertificadosData cada vez que la pantalla se enfoque
  useFocusEffect(
    useCallback(() => {
      fetchCertificadosData();
    }, [carnet, user.IdEmp])
  );

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            backgroundColor: "#1B2635",
            color: "#ffff",
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
            justifyContent: "flex-start",
          }}
        >
          Solicitando permiso para la cámara...
        </Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            backgroundColor: "#1B2635",
            color: "#ffff",
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
            justifyContent: "flex-start",
          }}
        >
          Sin permiso para la cámara
        </Text>
      </SafeAreaView>
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
      <View style={styles.containerHome}>
        {/* Encabezado con CARNET y botón de edición */}
        <View
          style={{
            marginBottom: 10,
            width: "100%",
            alignItems: "center",
            borderBottomColor: "#EA963E",
            borderBottomWidth: 1,
          }}
        >
          <Text style={[styles.subtitleText, { textAlign: "center" }]}>
            Carnet
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={[
                styles.subtitleText,
                {
                  textAlign: "center",
                  color: "#EA963E",
                  fontSize: 22,
                },
              ]}
            >
              {carnet}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Carnet", { user })}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={28}
                color="#EA963E"
                style={{ marginLeft: 24, alignSelf: "center" }}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View
          style={{
            marginBottom: 10,
            width: "100%",
            alignItems: "center",
            borderBottomColor: "#EA963E",
            borderBottomWidth: 1,
          }}
        >
          <Text style={[styles.subtitleText, { textAlign: "center" }]}>
            Alumno
          </Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: "#EA963E",
                fontSize: 22,
                textAlign: "center",
              },
            ]}
          >
            {dataAlumno?.Alumno}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 10,
            width: "100%",
            alignItems: "center",
            borderBottomColor: "#EA963E",
            borderBottomWidth: 1,
          }}
        >
          <Text style={[styles.subtitleText, { textAlign: "center" }]}>
            Cantidad de certificados guardados
          </Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: "#EA963E",
                fontSize: 28,
                textAlign: "center",
              },
            ]}
          >
            {certificadosData.ContadorCerti}
          </Text>
        </View>
        <View
          style={{
            marginBottom: 20,
            width: "100%",
            alignItems: "center",
            borderBottomColor: "#EA963E",
            borderBottomWidth: 1,
          }}
        >
          <Text style={[styles.subtitleText, { textAlign: "center" }]}>
            Ciclos de certificados guardados
          </Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: "#EA963E",
                fontSize: 22,
                textAlign: "center",
              },
            ]}
          >
            {certificadosData.Ciclos}
          </Text>
        </View>
        {/* Botón RENAP */}
        <TouchableHighlight
          style={styles.button}
          underlayColor="#3366b3"
          onPress={() =>
            navigation.navigate("Camera", { dataAlumno, carnet, user })
          }
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="numeric-1-circle"
              size={28}
              color="#fff"
            />
            <Text style={styles.buttonText}>Certificado RENAP</Text>
          </View>
        </TouchableHighlight>
        {/* Botón Escanear CIP */}
        <TouchableHighlight
          style={styles.button}
          underlayColor="#3366b3"
          onPress={() =>
            navigation.navigate("QRScanner", { dataAlumno, carnet, user })
          }
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="numeric-2-circle"
              size={28}
              color="#fff"
            />
            <Text style={styles.buttonText}>Escanear CIP - QR</Text>
          </View>
        </TouchableHighlight>
        {/* Botón Escanear certificados estudios */}
        {/* <TouchableHighlight
          style={styles.button}
          underlayColor="#3366b3"
          onPress={() =>
            navigation.navigate("QRCertEstudios", { dataAlumno, carnet, user })
          }
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="numeric-3-circle"
              size={28}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              Escanear certificados de estudios
            </Text>
          </View>
        </TouchableHighlight> */}
        {/* Botón tomar foto certificados estudios */}
        <TouchableHighlight
          style={styles.button}
          underlayColor="#3366b3"
          onPress={() =>
            navigation.navigate("CamaraCert", { dataAlumno, carnet, user })
          }
        >
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons
              name="numeric-3-circle"
              size={28}
              color="#fff"
            />
            <Text style={styles.buttonText}>Certificados de estudios</Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2635",
    paddingTop: 10,
  },
  containerHome: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#EA963E",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
    width: "80%",
    gap: 10,
  },
  subtitleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#4782DA",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "70%",
    marginBottom: 15,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
});
