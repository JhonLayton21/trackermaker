/**
 * PANTALLA DE CONFIGURACIÓN
 * Permite cambiar el tema de la aplicación
 * Opciones: Claro, Automático (sigue sistema), Oscuro
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ThemeMode, useTheme } from "../context/ThemeContext";

interface SettingsScreenProps {
  onClose: () => void;  // Callback para cerrar la pantalla
}

/**
 * Opciones de tema disponibles con su ícono
 */
const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: "light", label: "Claro", icon: "sunny-outline" },
  { mode: "automatic", label: "Automático", icon: "contrast-outline" },
  { mode: "dark", label: "Oscuro", icon: "moon-outline" },
];

/**
 * Pantalla de configuración de tema e interfaz
 */
/**
 * Pantalla de configuración de tema e interfaz
 */
export default function SettingsScreen({ onClose }: SettingsScreenProps) {
  const { mode, setMode, colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 36,
        }}
      >
        <TouchableOpacity onPress={onClose} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>
          Configuración
        </Text>
      </View>

      {/* Theme Section */}
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: colors.subtext,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 12,
        }}
      >
        Apariencia
      </Text>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {THEME_OPTIONS.map((option, index) => {
          const isSelected = mode === option.mode;
          return (
            <TouchableOpacity
              key={option.mode}
              onPress={() => setMode(option.mode)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 16,
                paddingHorizontal: 18,
                borderBottomWidth: index < THEME_OPTIONS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                backgroundColor: isSelected
                  ? colors.accent + "18"
                  : "transparent",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isSelected
                      ? colors.accent + "30"
                      : colors.border,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={isSelected ? colors.accent : colors.subtext}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: isSelected ? colors.accent : colors.text,
                    fontWeight: isSelected ? "600" : "400",
                  }}
                >
                  {option.label}
                </Text>
              </View>

              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.accent}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 12,
          color: colors.subtext,
          paddingHorizontal: 4,
        }}
      >
        "Automático" sigue la configuración del sistema operativo.
      </Text>
    </View>
  );
}
