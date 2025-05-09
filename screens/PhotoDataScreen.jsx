import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

const ComparacionView = ({ route, navigation }) => {
  const { datos, dataAlumno, carnet, user } = route.params;
  const validacion = datos.Mensaje.Validacion;

  // Lista de campos a mostrar con path dinámico y valor v
  const campos = [
    // Datos básicos
    {
      label: "Partida",
      path: ["Partida"],
      v: validacion.Partida,
      DatoRenap: validacion.Partida.DatoRenap,
      DatoDB: validacion.Partida.DatoDB,
      Validacion: validacion.Partida.Validacion,
      check: true,
    },
    {
      label: "Folio",
      path: ["Folio"],
      v: validacion.Folio,
      DatoRenap: validacion.Folio.DatoRenap,
      DatoDB: validacion.Folio.DatoDB,
      Validacion: validacion.Folio.Validacion,
      check: true,
    },
    {
      label: "Libro",
      path: ["Libro"],
      v: validacion.Libro,
      DatoRenap: validacion.Libro.DatoRenap,
      DatoDB: validacion.Libro.DatoDB,
      Validacion: validacion.Libro.Validacion,
      check: true,
    },
    {
      label: "CUI",
      path: ["CUI"],
      v: validacion.CUI,
      DatoRenap: validacion.CUI.DatoRenap,
      DatoDB: validacion.CUI.DatoDB,
      Validacion: validacion.CUI.Validacion,
      check: true,
    },
    {
      label: "Nombre Completo",
      path: ["NombreCompleto"],
      v: validacion.NombreCompleto,
      DatoRenap: validacion.NombreCompleto.DatoRenap,
      DatoDB: validacion.NombreCompleto.DatoDB,
      Validacion: validacion.NombreCompleto.Validacion,
      check: false,
    },
    {
      label: "Nombres",
      path: ["NombresApellidos", "Nombres"],
      v: validacion.NombresApellidos.Nombres,
      DatoRenap: validacion.NombresApellidos.Nombres.DatoRenap,
      DatoDB: validacion.NombresApellidos.Nombres.DatoDB,
      Validacion: validacion.NombresApellidos.Nombres.Validacion,
      check: true,
    },
    {
      label: "Apellidos",
      path: ["NombresApellidos", "Apellidos"],
      v: validacion.NombresApellidos.Apellidos,
      DatoRenap: validacion.NombresApellidos.Apellidos.DatoRenap,
      DatoDB: validacion.NombresApellidos.Apellidos.DatoDB,
      Validacion: validacion.NombresApellidos.Apellidos.Validacion,
      check: true,
    },
    {
      label: "Fecha Nacimiento",
      path: ["FechaNac"],
      v: validacion.FechaNac,
      DatoRenap: validacion.FechaNac.DatoRenap,
      DatoDB: validacion.FechaNac.DatoDB,
      Validacion: validacion.FechaNac.Validacion,
      check: true,
    },
    {
      label: "Género",
      path: ["Genero"],
      v: validacion.Genero,
      DatoRenap: validacion.Genero.DatoRenap,
      DatoDB: validacion.Genero.DatoDB,
      Validacion: validacion.Genero.Validacion,
      check: true,
    },
    // Lugar de nacimiento
    {
      label: "Lugar Nac - País",
      path: ["LugarNac", "Pais"],
      v: validacion.LugarNac.Pais,
      DatoRenap: validacion.LugarNac.Pais.DatoRenap,
      DatoDB: validacion.LugarNac.Pais.DatoDB,
      Validacion: validacion.LugarNac.Pais.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac - Depto",
      path: ["LugarNac", "Depto"],
      v: validacion.LugarNac.Depto,
      DatoRenap: validacion.LugarNac.Depto.DatoRenap,
      DatoDB: validacion.LugarNac.Depto.DatoDB,
      Validacion: validacion.LugarNac.Depto.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac - Muni",
      path: ["LugarNac", "Muni"],
      v: validacion.LugarNac.Muni,
      DatoRenap: validacion.LugarNac.Muni.DatoRenap,
      DatoDB: validacion.LugarNac.Muni.DatoDB,
      Validacion: validacion.LugarNac.Muni.Validacion,
      check: true,
    },
    // Datos madre
    {
      label: "Nombre Madre",
      path: ["NombreMadre"],
      v: validacion.NombreMadre,
      DatoRenap: validacion.NombreMadre.DatoRenap,
      DatoDB: validacion.NombreMadre.DatoDB,
      Validacion: validacion.NombreMadre.Validacion,
      check: true,
    },
    {
      label: "CUI Madre",
      path: ["CUIMadre"],
      v: validacion.CUIMadre,
      DatoRenap: validacion.CUIMadre.DatoRenap,
      DatoDB: validacion.CUIMadre.DatoDB,
      Validacion: validacion.CUIMadre.Validacion,
      check: true,
    },
    {
      label: "Fecha Nac Madre",
      path: ["FechaNacMadre"],
      v: validacion.FechaNacMadre,
      DatoRenap: validacion.FechaNacMadre.DatoRenap,
      DatoDB: validacion.FechaNacMadre.DatoDB,
      Validacion: validacion.FechaNacMadre.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac Madre - País",
      path: ["LugarNacMadre", "PaisMadre"],
      v: validacion.LugarNacMadre.PaisMadre,
      DatoRenap: validacion.LugarNacMadre.PaisMadre.DatoRenap,
      DatoDB: validacion.LugarNacMadre.PaisMadre.DatoDB,
      Validacion: validacion.LugarNacMadre.PaisMadre.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac Madre - Depto",
      path: ["LugarNacMadre", "DeptoMadre"],
      v: validacion.LugarNacMadre.DeptoMadre,
      DatoRenap: validacion.LugarNacMadre.DeptoMadre.DatoRenap,
      DatoDB: validacion.LugarNacMadre.DeptoMadre.DatoDB,
      Validacion: validacion.LugarNacMadre.DeptoMadre.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac Madre - Muni",
      path: ["LugarNacMadre", "MuniMadre"],
      v: validacion.LugarNacMadre.MuniMadre,
      DatoRenap: validacion.LugarNacMadre.MuniMadre.DatoRenap,
      DatoDB: validacion.LugarNacMadre.MuniMadre.DatoDB,
      Validacion: validacion.LugarNacMadre.MuniMadre.Validacion,
      check: true,
    },
    // Datos padre
    {
      label: "Nombre Padre",
      path: ["NombrePadre"],
      v: validacion.NombrePadre,
      DatoRenap: validacion.NombrePadre.DatoRenap,
      DatoDB: validacion.NombrePadre.DatoDB,
      Validacion: validacion.NombrePadre.Validacion,
      check: true,
    },
    {
      label: "CUI Padre",
      path: ["CUIPadre"],
      v: validacion.CUIPadre,
      DatoRenap: validacion.CUIPadre.DatoRenap,
      DatoDB: validacion.CUIPadre.DatoDB,
      Validacion: validacion.CUIPadre.Validacion,
      check: true,
    },
    {
      label: "Fecha Nac Padre",
      path: ["FechaNacPadre"],
      v: validacion.FechaNacPadre,
      DatoRenap: validacion.FechaNacPadre.DatoRenap,
      DatoDB: validacion.FechaNacPadre.DatoDB,
      Validacion: validacion.FechaNacPadre.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac Padre - País",
      path: ["LugarNacPadre", "PaisPadre"],
      v: validacion.LugarNacPadre.PaisPadre,
      DatoRenap: validacion.LugarNacPadre.PaisPadre.DatoRenap,
      DatoDB: validacion.LugarNacPadre.PaisPadre.DatoDB,
      Validacion: validacion.LugarNacPadre.PaisPadre.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac Padre - Depto",
      path: ["LugarNacPadre", "DeptoPadre"],
      v: validacion.LugarNacPadre.DeptoPadre,
      DatoRenap: validacion.LugarNacPadre.DeptoPadre.DatoRenap,
      DatoDB: validacion.LugarNacPadre.DeptoPadre.DatoDB,
      Validacion: validacion.LugarNacPadre.DeptoPadre.Validacion,
      check: true,
    },
    {
      label: "Lugar Nac Padre - Muni",
      path: ["LugarNacPadre", "MuniPadre"],
      v: validacion.LugarNacPadre.MuniPadre,
      DatoRenap: validacion.LugarNacPadre.MuniPadre.DatoRenap,
      DatoDB: validacion.LugarNacPadre.MuniPadre.DatoDB,
      Validacion: validacion.LugarNacPadre.MuniPadre.Validacion,
      check: true,
    },
    // Observaciones (si aplica)
    {
      label: "Observaciones",
      path: ["Observaciones"],
      v: validacion.Observaciones,
      DatoRenap: validacion.Observaciones?.DatoRenap,
      DatoDB: validacion.Observaciones?.DatoDB,
      Validacion: validacion.Observaciones?.Validacion,
      check: false,
    },
  ];

  // Estado para selección de checkbox por campo
  const [seleccion, setSeleccion] = useState(() => {
    const obj = {};
    campos.forEach((c) => {
      obj[c.label] = "RENAP";
    });
    return obj;
  });
  // Estado para selección global
  const [seleccionGlobal, setSeleccionGlobal] = useState("RENAP");
  const [showAviso, setShowAviso] = useState(false);
  const [showExito, setShowExito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensajeAviso, setMensajeAviso] = useState("");

  // Cambia la selección de checkbox para un campo
  const handleSeleccion = (campo, valor) => {
    setSeleccion((prev) => {
      if (prev[campo] === valor) {
        return { ...prev, [campo]: undefined };
      } else {
        return { ...prev, [campo]: valor };
      }
    });
    setSeleccionGlobal(null);
  };

  // Cambia la selección global
  const handleSeleccionGlobal = (valor) => {
    setSeleccionGlobal((prev) => {
      if (prev === valor) {
        const nuevo = {};
        campos.forEach((c) => {
          nuevo[c.label] = undefined;
        });
        setSeleccion(nuevo);
        return null;
      } else {
        const nuevo = {};
        campos.forEach((c) => {
          nuevo[c.label] = valor;
        });
        setSeleccion(nuevo);
        return valor;
      }
    });
  };

  const renderCampo = (label, renap, db, esValido, check) => (
    <View style={styles.fila} key={label}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.columna}>
        <Text style={styles.renap}>RENAP: {renap || "—"}</Text>
        <Text style={styles.db}>DB: {db || "—"}</Text>
        {check && (
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
          >
            <TouchableHighlight
              onPress={() => handleSeleccion(label, "RENAP")}
              underlayColor="#eee"
              style={{ marginRight: 10, borderRadius: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={
                    seleccion[label] === "RENAP"
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color="#4782DA"
                />
                <Text style={{ marginLeft: 4 }}>RENAP</Text>
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
      (v) => v !== "RENAP" && v !== "DB"
    );
    if (incompletos) {
      setMensajeAviso(
        "Debes seleccionar RENAP o DB en todos los campos antes de finalizar."
      );
      setShowAviso(true);
      return;
    }
    setLoading(true);
    const datosSeleccionados = campos.map(({ label, path }) => {
      const tipo = seleccion[label];
      let obj = validacion;
      for (const p of path) obj = obj[p];
      const valor = tipo === "RENAP" ? obj.DatoRenap : obj.DatoDB;
      return { campo: label, tipo, valor };
    });
    try {
      const response = await fetch(
        `${API_URL}/schoolapi/utils/confirma_renap`,
        {
          method: "POST",
          headers: JSON.parse(REACT_APP_API_HEADERS),
          body: JSON.stringify({
            IdEmp: user.IdEmp,
            IpHost: "131.107.1.235",
            HostName: "DEV1",
            OS: "Windows",
            Detalle: datosSeleccionados,
            Carnet: carnet,
          }),
        }
      );
      const data = await response.json();
      if (data.msg.Error !== "0") {
        setMensajeAviso("Error al guardar los datos.");
        setLoading(false);
        setShowAviso(true);
      } else {
        console.log("Respuesta update revisión 2:", data);
        setLoading(false);
        setTimeout(() => {
          setShowExito(true);
        }, 100);
      }
    } catch (error) {
      setMensajeAviso("Error en la conexión o en las credenciales");
      setLoading(false);
      setShowAviso(true);
    }
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
      {/* Modal personalizado de éxito */}
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
                setTimeout(() => {
                  navigation.navigate("Carnet", { user });
                }, 100);
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo}>Datos RENAP vs Sistema</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableHighlight
              onPress={() => handleSeleccionGlobal("RENAP")}
              underlayColor="#eee"
              style={{ marginRight: 8, borderRadius: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={
                    seleccionGlobal === "RENAP"
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color="#4782DA"
                />
                <Text style={{ marginLeft: 4, color: "white" }}>
                  Todos RENAP
                </Text>
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
        {/* Datos básicos, madre, padre, observaciones */}
        {campos.map((c) =>
          renderCampo(c.label, c.DatoRenap, c.DatoDB, c.Validacion, c.check)
        )}
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
            onPress={() => navigation.navigate("Home", { dataAlumno, carnet })}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}> Otro </Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1B2635",
  },
  titulo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#EA963E",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
    width: "100%",
    gap: 10, // solo si tu versión de React Native lo soporta
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
    width: "30%",
  },
  columna: {
    width: "55%",
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

export default ComparacionView;
