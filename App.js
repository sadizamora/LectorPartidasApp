import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import QRScannerScreen from "./screens/QRScannerScreen";
import QRResultScreen from "./screens/QRResultScreen";
import CameraScreen from "./screens/CameraScreen";
import PhotoDataScreen from "./screens/PhotoDataScreen";
import Login from "./screens/LoginScreen";
import Carnet from "./screens/CarnetScreen";
import QRCertEstudiosScreen from "./screens/QRCertEstudiosScreen";
import QRResultCertScreen from "./screens/QRResultCertScreen";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="white" translucent={false} />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#233043" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="Login" options={{ title: "" }} component={Login} />
        <Stack.Screen
          name="Carnet"
          options={{ title: "Búsqueda de alumno" }}
          component={Carnet}
        />
        <Stack.Screen
          name="Home"
          options={{ title: "Lectura de documentos" }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="QRScanner"
          options={{ title: "Lectura CIP QR" }}
          component={QRScannerScreen}
        />
        <Stack.Screen
          name="QRResult"
          options={{ title: "Resultado lectura CIP QR" }}
          component={QRResultScreen}
        />
        <Stack.Screen
          name="Camera"
          options={{ title: "Lectura certificado RENAP" }}
          component={CameraScreen}
        />
        <Stack.Screen
          name="PhotoData"
          options={{ title: "Resultado certificado RENAP" }}
          component={PhotoDataScreen}
        />
        <Stack.Screen
          name="QRCertEstudios"
          options={{ title: "Lectura certificados estudios" }}
          component={QRCertEstudiosScreen}
        />
        <Stack.Screen
          name="QRResultEstudios"
          options={{ title: "Resultado lectura certificados" }}
          component={QRResultCertScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
