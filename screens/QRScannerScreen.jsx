import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Text,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import Constants from "expo-constants";
const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig.extra;

export default function QRScannerScreen({ route, navigation }) {
  const { dataAlumno, carnet } = route.params;
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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
        await fetch(
          `${API_URL}` +
            "/schoolapi/utils/lecturaqr_url?UrlQR=" +
            data +
            "&Carnet=" +
            carnet +
            "&IdEmp=SZAMORAX01&IpHost=131.107.1.235&HostName=DEV&OS=Windows",
          {
            headers: JSON.parse(REACT_APP_API_HEADERS),
          }
        )
          .then((response) => response.json())
          .then((response) => {
            setLoading(false);
            navigation.navigate("QRResult", {
              dataAlumno,
              carnet,
              scannedData: response.msg,
            });
          })
          .catch((err) => {
            setLoading(false);
            console.error(err);
          });
      } catch (error) {
        setLoading(false);
        console.error("Error en la petición:", error);
      }
    } else {
      setLoading(false);
    }
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
