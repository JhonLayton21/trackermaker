/**
 * Layout raiz de la aplicación (RootLayout)
 * 
 * Este componente configura la estructura global:
 * - GestureHandlerRootView: Habilita gestos nativos (swipe, pan, etc.)
 * - SafeAreaProvider: Maneja áreas seguras (notches, etc.)
 * - ThemeProvider: Proporciona acceso al tema en toda la app
 * - Stack: Sistema de navegación (Expo Router)
 * - StatusBar: Barra de estado del sistema
 */

import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * Componente raiz que envuelve toda la aplicación con los proveedores necesarios
 */
export default function RootLayout() {
  return (
    // Habilita soporte para gestos (swipe, pan, pinch, etc.)
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Maneja las áreas seguras de la pantalla */}
      <SafeAreaProvider>
        {/* Proporciona el tema (light/dark) a toda la aplicación */}
        <ThemeProvider>
          {/* Sistema de navegación con pantallas */}
          <Stack screenOptions={{ headerShown: false }} />
          {/* Barra de estado del sistema */}
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
