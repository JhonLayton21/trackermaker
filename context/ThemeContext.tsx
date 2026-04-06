import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

/**
 * Tipos de tema disponibles:
 * - "light": Tema claro (fondo blanco)
 * - "dark": Tema oscuro (fondo negro)
 * - "automatic": Sigue la configuración del sistema
 */
export type ThemeMode = "light" | "dark" | "automatic";

/**
 * Interfaz que define todos los colores disponibles en un tema
 * Cada tema (light/dark) tiene su propia paleta de colores
 */
export interface ThemeColors {
  background: string; // Color de fondo principal
  surface: string; // Color de superficies (tarjetas)
  border: string; // Color de bordes
  text: string; // Color de texto principal
  subtext: string; // Color de texto secundario (labels)
  accent: string; // Color de acento (verde #22c55e)
}

// Paleta de colores para tema claro
const lightColors: ThemeColors = {
  background: "#f5f5f5",
  surface: "#ffffff",
  border: "#e0e0e0",
  text: "#111111",
  subtext: "#555555",
  accent: "#22c55e",
};

// Paleta de colores para tema oscuro
const darkColors: ThemeColors = {
  background: "#000000",
  surface: "#111111",
  border: "#222222",
  text: "#ffffff",
  subtext: "#aaaaaa",
  accent: "#22c55e",
};

/**
 * Interfaz del contexto de tema
 * Proporciona: modo actual, función para cambiar modo, colores y booleano isDark
 */
interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
}

// Contexto compartido para todos los componentes
const ThemeContext = createContext<ThemeContextType>({
  mode: "automatic",
  setMode: () => {},
  colors: darkColors,
  isDark: true,
});

// Clave para almacenar la preferencia de tema
const STORAGE_KEY = "app_theme_mode";

/**
 * Proveedor de tema que envuelve toda la aplicación
 * Gestiona el tema actual y proporciona acceso a colores en tod la app
 * @param children - Componentes hijos que tendrán acceso al tema
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Obtiene el esquema de color del sistema (light/dark)
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("automatic");

  // Al montar el componente, carga la preferencia de tema guardada
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "automatic") {
        setModeState(stored as ThemeMode);
      }
    });
  }, []);

  /**
   * Cambia el modo de tema y guarda la preferencia en AsyncStorage
   */
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  // Determina si el tema es oscuro según el modo seleccionado
  const isDark =
    mode === "automatic" ? systemScheme === "dark" : mode === "dark";

  // Selecciona la paleta de colores según el tema
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acceder al tema desde cualquier componente
 * Uso: const { colors, isDark, mode, setMode } = useTheme()
 * @returns Objeto con modo de tema, colores y función para cambiar modo
 */
export function useTheme() {
  return useContext(ThemeContext);
}
