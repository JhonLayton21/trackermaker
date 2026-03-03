import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "automatic";

export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  text: string;
  subtext: string;
  accent: string;
}

const lightColors: ThemeColors = {
  background: "#f5f5f5",
  surface: "#ffffff",
  border: "#e0e0e0",
  text: "#111111",
  subtext: "#555555",
  accent: "#22c55e",
};

const darkColors: ThemeColors = {
  background: "#000000",
  surface: "#111111",
  border: "#222222",
  text: "#ffffff",
  subtext: "#aaaaaa",
  accent: "#22c55e",
};

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "automatic",
  setMode: () => {},
  colors: darkColors,
  isDark: true,
});

const STORAGE_KEY = "app_theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("automatic");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "automatic") {
        setModeState(stored as ThemeMode);
      }
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  const isDark =
    mode === "automatic" ? systemScheme === "dark" : mode === "dark";

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
