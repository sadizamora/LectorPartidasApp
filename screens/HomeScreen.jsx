// HomeScreen.js
import { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import Constants from "expo-constants";

const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

export default function HomeScreen({ navigation, route }) {
  const { dataAlumno, carnet, user } = route.params;
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

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
      <View style={styles.containerHome}>
        {/* Encabezado con CARNET y botón de edición */}
        <View
          style={{
            marginBottom: 30,
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
            marginBottom: 30,
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
        <TouchableHighlight
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
        </TouchableHighlight>
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
              name="numeric-4-circle"
              size={28}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              Foto certificados de estudios
            </Text>
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
    paddingTop: 40,
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
