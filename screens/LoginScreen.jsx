import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, REACT_APP_API_HEADERS } from "@env";

const logoApp = require("../assets/icon.png");

export default function App({ navigation }) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAviso, setShowAviso] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    rememberme: false,
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      console.log("Credenciales:", credentials);
      const response = await fetch(
        "http://www.imb-pc.com:81/seguridadapi/seguridad/login",
        {
          method: "POST",
          headers: JSON.parse(REACT_APP_API_HEADERS),
          body: JSON.stringify({
            LoginId: credentials.username,
            password: credentials.password,
          }),
        }
      );

      console.log("Respuesta de la API:", response);

      const resData = await response.json();

      console.log(response);

      // Validación de respuesta
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      if (resData.msg) {
        setMensajeAviso(resData.msg.Mensaje);
        setShowAviso(true);
      }

      if (resData.IdEmp) {
        setMensajeAviso(resData.IdEmp);
        setShowAviso(true);
        navigation.navigate("Carnet", { user: resData });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error en login:", err.message);
      setMensajeAviso("Error en la conexión o en las credenciales");
      setShowAviso(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image style={styles.image} source={logoApp} />
      <Text style={styles.banner}>Login</Text>
      <View style={styles.loginContainer}>
        <View style={styles.inputView}>
          <Text style={styles.labelText}>Usuario</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor="#9597a6"
            placeholder="ingrese nombre de usuario"
            onChangeText={(value) =>
              setCredentials((curr) => ({ ...curr, username: value }))
            }
          />
        </View>

        <View style={styles.inputView}>
          <Text style={styles.labelText}>Contraseña</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor="#9597a6"
              placeholder="*********"
              secureTextEntry={!showPwd}
              onChangeText={(value) =>
                setCredentials((curr) => ({ ...curr, password: value }))
              }
            />
            <TouchableWithoutFeedback
              onPress={() => setShowPwd((curr) => !curr)}
            >
              <Ionicons
                name={showPwd ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#EA963E"
              />
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() =>
              setCredentials((curr) => ({
                ...curr,
                rememberme: !curr.rememberme,
              }))
            }
          >
            <Ionicons
              name={
                credentials.rememberme
                  ? "checkmark-circle"
                  : "checkmark-circle-outline"
              }
              size={20}
              color="#EA963E"
              style={{ marginRight: 5 }}
            />
          </TouchableWithoutFeedback>
          <Text style={{ color: "#9597a6" }}>Recordarme</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleLogin()}
          style={styles.buttonLogin}
        >
          <Text style={styles.textButton}>Ingresar</Text>
        </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#233043",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: 140,
    height: 140,
    marginTop: 50,
    marginBottom: 10,
  },
  banner: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    letterSpacing: 1,
  },
  loginContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    height: "65%",
    width: "100%",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingTop: 50,
    paddingHorizontal: 32,
    marginLeft: 20,
    marginRight: 20,
  },
  textInput: {
    marginLeft: 5,
    fontSize: 16,
    height: 34,
    width: "100%",
  },
  passwordInput: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelText: {
    color: "#9597a6",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  inputView: {
    borderBottomColor: "#4782dA",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  buttonLogin: {
    backgroundColor: "#4782dA",
    marginTop: 28,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
