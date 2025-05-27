import { useState } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

const { API_URL, REACT_APP_API_HEADERS } = Constants.expoConfig?.extra || {};

export default function QRResultCertScreen({ route, navigation }) {
  const {
    scannedData,
    scannedDataRecuperacion,
    carnet,
    dataAlumno,
    user,
    url,
    urlRecuperacion,
    scannedDataImagen,
  } = route.params;

  const certificado = scannedData;
  const certificadoRecuperacion = scannedDataRecuperacion;
  const certificadoImagen = scannedDataImagen;

  // Estado para mostrar el modal de aviso
  const [showAviso, setShowAviso] = useState(false);

  // Estado para mostrar mensaje en el modal de aviso
  const [mensajeAviso, setMensajeAviso] = useState("");

  // Estado para mostrar el indicador de carga
  const [loading, setLoading] = useState(false);

  // Estado para mostrar el modal de éxito
  const [showExito, setShowExito] = useState(false);

  // Estado para mostrar el modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);

  // Estado para controlar si se permite continuar después del modal de validaciones
  const [puedeContinuar, setPuedeContinuar] = useState(false);

  const handleSave = async () => {
    // Si hay mensajes de validación no vacíos, mostrar en el modal de confirmación
    const mensajes = (certificado.validaciones || [])
      .map((v) => v.Mensaje && v.Mensaje.trim())
      .filter((msg) => msg && msg !== "");
    if (mensajes.length > 0) {
      setMensajeAviso(mensajes.join("\n"));
      setPuedeContinuar(true); // Permitir continuar después del modal
      setShowAviso(true);
      return;
    }
    setShowConfirm(true); // Mostrar modal de confirmación
  };

  // Nueva función para confirmar y enviar el POST
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    setTimeout(async () => {
      try {
        console.log("certificado", certificado);
        // Guardar certificado original
        const response = await fetch(
          `${API_URL}/schoolapi/utils/insert_certificado`,
          {
            method: "POST",
            headers: JSON.parse(REACT_APP_API_HEADERS),
            body: JSON.stringify({
              IdEmp: user.IdEmp,
              IpHost: "131.107.1.235",
              HostName: "DEV1",
              OS: "Windows",
              Data: { Detalle: certificado },
              Recuperacion: false,
              Carnet: carnet,
            }),
          }
        );
        const data = await response.json();
        // Si hay certificado de recuperación, guardarlo también
        if (certificadoRecuperacion) {
          const responseRecuperacion = await fetch(
            `${API_URL}/schoolapi/utils/insert_certificado`,
            {
              method: "POST",
              headers: JSON.parse(REACT_APP_API_HEADERS),
              body: JSON.stringify({
                IdEmp: user.IdEmp,
                IpHost: "131.107.1.235",
                HostName: "DEV1",
                OS: "Windows",
                Data: { Detalle: certificadoRecuperacion },
                Recuperacion: true,
                Carnet: carnet,
              }),
            }
          );
          const dataRecuperacion = await responseRecuperacion.json();

          if (dataRecuperacion.msg.Error !== "0") {
            setMensajeAviso("Error al guardar el certificado de recuperación.");
            setLoading(false);
            setShowAviso(true);
            return;
          }
        }

        if (data.msg.Error !== "0") {
          setMensajeAviso("Error al guardar los datos.");
          setLoading(false);
          setShowAviso(true);
        } else {
          setLoading(false);
          setTimeout(() => {
            setShowExito(true);
          }, 100);
        }
      } catch (error) {
        setLoading(false);
        setMensajeAviso(
          "Ocurrió un error al guardar los datos. Intenta de nuevo."
        );
        setShowAviso(true);
      }
    }, 300);
  };

  // Renderizado de datos generales del certificado
  const renderCertGeneral = (cert, titulo, certFecha) => (
    <View
      style={{
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          color: "#EA963E",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {titulo}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Centro educativo: </Text>
        {cert.centro_educativo}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Código centro: </Text>
        {cert.codigo_centro_educativo}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Municipio: </Text>
        {cert.municipio}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Departamento: </Text>
        {cert.departamento}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Jornada: </Text>
        {cert.jornada}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Plan: </Text>
        {cert.plan}
      </Text>
      <Text style={styles.dataText}>
        <Text
          style={[
            styles.label,
            {
              color:
                cert.validaciones &&
                cert.validaciones[0] &&
                cert.validaciones[0].Mensaje &&
                cert.validaciones[0].Mensaje.trim() !== ""
                  ? "#b30000"
                  : undefined,
            },
          ]}
        >
          Estudiante:{" "}
        </Text>
        <Text
          style={{
            color:
              cert.validaciones &&
              cert.validaciones[0] &&
              cert.validaciones[0].Mensaje &&
              cert.validaciones[0].Mensaje.trim() !== ""
                ? "#b30000"
                : undefined,
          }}
        >
          {cert.estudiante}
        </Text>
      </Text>
      <Text style={styles.dataText}>
        <Text
          style={[
            styles.label,
            {
              color:
                cert.validaciones &&
                cert.validaciones[1] &&
                cert.validaciones[1].Mensaje &&
                cert.validaciones[1].Mensaje.trim() !== ""
                  ? "#b30000"
                  : undefined,
            },
          ]}
        >
          Código personal:{" "}
        </Text>
        <Text
          style={{
            color:
              cert.validaciones &&
              cert.validaciones[1] &&
              cert.validaciones[1].Mensaje &&
              cert.validaciones[1].Mensaje.trim() !== ""
                ? "#b30000"
                : undefined,
          }}
        >
          {cert.codigo_personal}
        </Text>
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Matrícula: </Text>
        {cert.matricula}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Fecha matrícula: </Text>
        {cert.fecha_matricula}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Lugar matrícula: </Text>
        {cert.lugar_matricula}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Grado: </Text>
        {cert.grado}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Resultado: </Text>
        {cert.resultado}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Fecha emisión: </Text>
        {certFecha ? certFecha.fecha_emision : cert.fecha_emision}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Responsable: </Text>
        {cert.nombre_responsable}
      </Text>
      <Text style={styles.dataText}>
        <Text style={styles.label}>Director(a): </Text>
        {cert.nombre_director}
      </Text>
    </View>
  );

  // Renderizado de validaciones
  const renderValidaciones = (cert) => {
    if (
      !cert.validaciones ||
      !Array.isArray(cert.validaciones) ||
      cert.validaciones.length === 0
    ) {
      return null;
    }
    return (
      <View
        style={{
          backgroundColor: "#ffeaea",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#ffb3b3",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            color: "#b30000",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Observaciones certificado
        </Text>
        {cert.validaciones.map((v, idx) => (
          <View
            key={idx}
            style={{
              marginBottom: 6,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color="#b30000"
              style={{ marginRight: 6, marginTop: 2 }}
            />
            <Text
              style={{ color: "#b30000", fontSize: 16, flex: 1 }}
            >{`${v.Mensaje}`}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Renderizado de materias
  const renderMaterias = (cert, titulo = "Materias certificado") => {
    let correlativoInterno = 1;
    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            color: "#4782DA",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {titulo}
        </Text>
        {cert.materias.map((m, idx) => (
          <View
            key={idx}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#1B2635" }}>
              {correlativoInterno++}. {m.nombre}
            </Text>
            {m.submateria !== "" && m.submateria !== null && (
              <Text
                style={{ fontWeight: "bold", color: "#1B2635", marginLeft: 20 }}
              >
                {m.submateria}
              </Text>
            )}
            {m.submateria2 !== "" && m.submateria2 !== null && (
              <Text
                style={{ fontWeight: "bold", color: "#1B2635", marginLeft: 20 }}
              >
                {m.submateria2}
              </Text>
            )}
            <Text style={{ color: "#333", marginLeft: 20 }}>
              Nota numérica:{" "}
              <Text style={{ fontWeight: "bold" }}>{m.nota_numerica}</Text>
            </Text>
            <Text style={{ color: "#333", marginLeft: 20 }}>
              Nota en letras:{" "}
              <Text style={{ fontWeight: "bold" }}>{m.nota_letras}</Text>
            </Text>
            <Text
              style={{
                color: m.nota_numerica >= 60 ? "green" : "red",
                fontWeight: "bold",
                marginLeft: 20,
              }}
            >
              Resultado: {m.resultado}
            </Text>
            {m.fecha !== "" && m.fecha !== null && (
              <Text
                style={{ fontWeight: "bold", color: "#1B2635", marginLeft: 20 }}
              >
                Fecha: {m.fecha}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
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
            <MaterialCommunityIcons
              name="information"
              size={48}
              color="#4782DA"
              style={{ marginBottom: 10 }}
            />
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
            {/* Mensajes de validación en el modal de aviso */}
            {puedeContinuar ? (
              <View
                style={{
                  backgroundColor: "#ffeaea",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 0,
                  borderWidth: 1,
                  borderColor: "#ffb3b3",
                  width: 240,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#b30000",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Observaciones certificado
                </Text>
                {mensajeAviso.split("\n").map((msg, idx) => (
                  <View
                    key={idx}
                    style={{
                      marginBottom: 6,
                      flexDirection: "row",
                      alignItems: "flex-start",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={20}
                      color="#b30000"
                      style={{ marginRight: 6, marginTop: 2 }}
                    />
                    <Text style={{ color: "#b30000", fontSize: 16, flex: 1 }}>
                      {msg}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text
                style={{ color: "#1B2635", fontSize: 16, textAlign: "center" }}
              >
                {mensajeAviso}
              </Text>
            )}
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
                setShowAviso(false);
                if (puedeContinuar) {
                  setPuedeContinuar(false);
                  setShowConfirm(true);
                }
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
            <MaterialCommunityIcons
              name="check-circle"
              size={48}
              color="#4CAF50"
              style={{ marginBottom: 10 }}
            />
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
                  user,
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

      {/* Modal de confirmación antes de guardar */}
      <Modal visible={showConfirm} transparent animationType="fade">
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
            <MaterialCommunityIcons
              name="help-circle"
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
              }}
            >
              Confirmación
            </Text>
            <Text
              style={{ color: "#1B2635", fontSize: 16, textAlign: "center" }}
            >
              ¿Estás seguro de guardar los datos de la certificación de
              estudios?
            </Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableHighlight
                style={{
                  backgroundColor: "#4782DA",
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 24,
                  marginRight: 10,
                }}
                underlayColor="#3366b3"
                onPress={handleConfirmSave}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Aceptar
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
                onPress={() => setShowConfirm(false)}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Cancelar
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Certificado Original */}
        {renderCertGeneral(
          certificado,
          "Certificado escolar",
          certificadoImagen
        )}
        {/* Validaciones del certificado original */}
        {renderValidaciones(certificado)}
        {/* Materias del certificado original */}
        {renderMaterias(certificado)}

        {/* Certificado de Recuperación si existe */}
        {certificadoRecuperacion && (
          <>
            {renderCertGeneral(
              certificadoRecuperacion,
              "Certificado de recuperación",
              certificadoImagen
            )}
            {renderValidaciones(certificadoRecuperacion)}
            {renderMaterias(
              certificadoRecuperacion,
              "Materias de recuperación"
            )}
          </>
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
              navigation.replace("CamaraCert", { dataAlumno, carnet, user })
            }
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
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
    justifyContent: "center",
    marginBottom: 10,
  },
  checkboxesHeader: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 20,
  },
  titulo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    borderBottomColor: "#EA963E",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 0,
    textAlign: "center",
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
  dataText: {
    color: "#1B2635",
    fontSize: 16,
    marginBottom: 4,
  },
});
