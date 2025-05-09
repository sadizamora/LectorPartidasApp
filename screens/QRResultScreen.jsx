// screens/QRResultScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableHighlight,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig.extra;

export default function QRResultScreen({ route, navigation }) {
  const { scannedData, carnet, dataAlumno } = route.params;
  console.log("Datos escaneados:", scannedData);

  const validacion = scannedData.Mensaje.Validacion;

  // Lista de campos a mostrar con path dinámico y valor v
  const campos = [
    {
      label: "CIP",
      path: ["cip"],
      v: validacion.cip,
      DatoRenap: validacion.cip.DatoRenap,
      DatoDB: validacion.cip.DatoDB,
      Validacion: validacion.cip.Validacion,
      check: true,
    },
    {
      label: "Nombre Completo",
      path: ["nombre_completo"],
      v: validacion.nombre_completo,
      DatoRenap: validacion.nombre_completo.DatoRenap,
      DatoDB: validacion.nombre_completo.DatoDB,
      Validacion: validacion.nombre_completo.Validacion,
      check: false,
    },
    {
      label: "Nombres",
      path: ["nombres_apellidos", "nombres"],
      v: validacion.nombres_apellidos.nombres,
      DatoRenap: validacion.nombres_apellidos.nombres.DatoRenap,
      DatoDB: validacion.nombres_apellidos.nombres.DatoDB,
      Validacion: validacion.nombres_apellidos.nombres.Validacion,
      check: true,
    },
    {
      label: "Apellidos",
      path: ["nombres_apellidos", "apellidos"],
      v: validacion.nombres_apellidos.apellidos,
      DatoRenap: validacion.nombres_apellidos.apellidos.DatoRenap,
      DatoDB: validacion.nombres_apellidos.apellidos.DatoDB,
      Validacion: validacion.nombres_apellidos.apellidos.Validacion,
      check: true,
    },
    {
      label: "CUI",
      path: ["cui"],
      v: validacion.cui,
      DatoRenap: validacion.cui.DatoRenap,
      DatoDB: validacion.cui.DatoDB,
      Validacion: validacion.cui.Validacion,
      check: true,
    },
    {
      label: "Fecha de nacimiento",
      path: ["fecha_nacimiento"],
      v: validacion.fecha_nacimiento,
      DatoRenap: validacion.fecha_nacimiento.DatoRenap,
      DatoDB: validacion.fecha_nacimiento.DatoDB,
      Validacion: validacion.fecha_nacimiento.Validacion,
      check: true,
    },
    {
      label: "Genero",
      path: ["genero"],
      v: validacion.genero,
      DatoRenap: validacion.genero.DatoRenap,
      DatoDB: validacion.genero.DatoDB,
      Validacion: validacion.genero.Validacion,
      check: true,
    },
  ];

  // Estado para selección de checkbox por campo
  const [seleccion, setSeleccion] = useState(() => {
    // Por defecto todos CIP
    const obj = {};
    campos.forEach((c) => {
      obj[c.label] = "CIP";
    });
    return obj;
  });
  // Estado para selección global
  const [seleccionGlobal, setSeleccionGlobal] = useState("CIP");

  // Estado para mostrar el modal de aviso
  const [showAviso, setShowAviso] = useState(false);

  // Estado para mostrar mensaje en el modal de aviso
  const [mensajeAviso, setMensajeAviso] = useState("");

  // Estado para mostrar el indicador de carga
  const [loading, setLoading] = useState(false);

  // Estado para mostrar el modal de éxito
  const [showExito, setShowExito] = useState(false);

  // Cambia la selección de checkbox para un campo
  const handleSeleccion = (campo, valor) => {
    setSeleccion((prev) => {
      // Si ya está seleccionado, desmarcar (dejar vacío)
      if (prev[campo] === valor) {
        return { ...prev, [campo]: undefined };
      } else {
        return { ...prev, [campo]: valor };
      }
    });
    setSeleccionGlobal(null); // Si el usuario toca individual, desmarca global
  };

  // Cambia la selección global
  const handleSeleccionGlobal = (valor) => {
    setSeleccionGlobal((prev) => {
      // Si ya está seleccionado, desmarcar todos
      if (prev === valor) {
        // Desmarcar todos los campos
        const nuevo = {};
        campos.forEach((c) => {
          nuevo[c.label] = undefined;
        });
        setSeleccion(nuevo);
        return null;
      } else {
        // Marca todos los campos con el valor seleccionado
        const nuevo = {};
        campos.forEach((c) => {
          nuevo[c.label] = valor;
        });
        setSeleccion(nuevo);
        return valor;
      }
    });
  };

  const renderCampo = (label, cip, db, esValido, check) => (
    <View style={styles.fila} key={label}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.columna}>
        <Text style={styles.renap}>CIP QR: {cip || "—"}</Text>
        <Text style={styles.db}>DB: {db || "—"}</Text>
        {check && (
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
          >
            <TouchableHighlight
              onPress={() => handleSeleccion(label, "CIP")}
              underlayColor="#eee"
              style={{ marginRight: 10, borderRadius: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={
                    seleccion[label] === "CIP"
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color="#4782DA"
                />
                <Text style={{ marginLeft: 4 }}>CIP</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => handleSeleccion(label, "DB")}
              underlayColor="#eee"
              style={{ borderRadius: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={
                    seleccion[label] === "DB"
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color="#EA963E"
                />
                <Text style={{ marginLeft: 4 }}>DB</Text>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
      <Text style={[styles.estado, { color: esValido ? "green" : "red" }]}>
        {esValido ? "✔" : "✘"}
      </Text>
    </View>
  );

  const handleSave = async () => {
    const incompletos = Object.values(seleccion).some(
      (v) => v !== "CIP" && v !== "DB"
    );
    if (incompletos) {
      setMensajeAviso(
        "Debes seleccionar CIP o DB en todos los campos antes de finalizar."
      );
      setShowAviso(true);
      return;
    }
    setLoading(true);
    // Forzar un pequeño retraso para mostrar el modal de cargando
    setTimeout(async () => {
      const datosSeleccionados = campos.map(({ label, path }) => {
        const tipo = seleccion[label];
        let obj = validacion;
        for (const p of path) obj = obj[p];
        const valor = tipo === "CIP" ? obj.DatoRenap : obj.DatoDB;
        return { campo: label, tipo, valor };
      });
      try {
        const response = await fetch("https://tu-api.com/endpoint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            datos: datosSeleccionados,
            carnet,
            dataAlumno,
          }),
        });
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        const data = await response.json();
        setLoading(false);
        setShowExito(true);
      } catch (error) {
        setLoading(false);
        setMensajeAviso(
          "Ocurrió un error al guardar los datos. Intenta de nuevo."
        );
        setShowAviso(true);
      }
    }, 300); // 300ms para asegurar que el modal se vea
  };

  return (
    <>
      {/* Modal personalizado de aviso */}
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
      {/* Modal de loading */}
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
      {/* Modal de éxito */}
      <Modal visible={showExito} transparent animationType="fade">
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
              ¡Éxito!
            </Text>
            <Text
              style={{ color: "#1B2635", fontSize: 16, textAlign: "center" }}
            >
              Los datos se guardaron correctamente.
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
              onPress={() => {
                setShowExito(false);
                navigation.navigate("Home", {
                  dataAlumno,
                  carnet,
                  datosSeleccionados,
                });
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Aceptar
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.titulo}>Datos CIP QR vs Sistema</Text>
          <View style={styles.checkboxesHeader}>
            <TouchableHighlight
              onPress={() => handleSeleccionGlobal("CIP")}
              underlayColor="#eee"
              style={{ marginRight: 8, borderRadius: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={
                    seleccionGlobal === "CIP"
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color="#4782DA"
                />
                <Text style={{ marginLeft: 4, color: "white" }}>Todos CIP</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => handleSeleccionGlobal("DB")}
              underlayColor="#eee"
              style={{ borderRadius: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={
                    seleccionGlobal === "DB"
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color="#EA963E"
                />
                <Text style={{ marginLeft: 4, color: "white" }}>Todos DB</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        {/* Datos Personales */}
        {campos.map((c) =>
          renderCampo(c.label, c.DatoRenap, c.DatoDB, c.Validacion, c.check)
        )}

        {/* Botones */}
        <View style={styles.containerButton}>
          <TouchableHighlight style={styles.button} onPress={handleSave}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>Finalizar</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.button}
            onPress={() =>
              navigation.navigate("QRScanner", { scannedData, carnet })
            }
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>Escanear otro</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1B2635",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  checkboxesHeader: {
    flexDirection: "row",
  },
  titulo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    borderBottomColor: "#EA963E",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  fila: {
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: "800",
    width: "25%",
  },
  columna: {
    width: "60%",
  },
  renap: {
    fontWeight: "800",
    fontSize: 16,
    color: "blue",
  },
  db: {
    fontWeight: "800",
    fontSize: 16,
    color: "orange",
  },
  estado: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  containerButton: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 10,
    width: "53%",
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
});
