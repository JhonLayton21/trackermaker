/**
 * GRID DE FECHAS MENSUAL
 * Renderiza el calendario de 12 meses (año natural) donde cada celda representa un día
 * Los días completados se muestran en verde, hoy tiene borde azul
 * Al tocar una celda se ejecuta la animación spring y se actualiza el registro
 */

import { useTheme } from "@/context/ThemeContext";
import { generateSixMonthRange } from "@/utils/date";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

type Props = {
  records: string[]; // Array de fechas ISO completadas ["2026-04-06", ...]
  onToggle: (date: string) => void; // Callback cuando se toca una celda
};

/**
 * Renderiza un grid con todos los meses del año natural
 */
export default function HabitGrid({ records, onToggle }: Props) {
  const { colors, isDark } = useTheme();
  // Genera array de fechas para todo el año natural
  const dates = generateSixMonthRange();

  // Agrupa fechas por mes para renderizar por columnas
  const monthsMap: { [key: string]: Date[] } = {};
  dates.forEach((date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthsMap[key]) monthsMap[key] = [];
    monthsMap[key].push(date);
  });

  /**
   * Verifica si una fecha está en el registro de completados
   */
  const isCompleted = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    return records.includes(iso);
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {Object.entries(monthsMap).map(([monthKey, monthDates]) => {
        const firstDay = monthDates[0];
        const monthName = firstDay.toLocaleString("default", {
          month: "short",
        });
        const startDay = new Date(
          firstDay.getFullYear(),
          firstDay.getMonth(),
          1,
        ).getDay();
        const padding = (startDay + 6) % 7;
        const paddedDates = [...Array(padding).fill(null), ...monthDates];

        return (
          <View key={monthKey} style={{ marginRight: 24 }}>
            <Text
              style={{
                color: colors.subtext,
                fontSize: 12,
                marginBottom: 8,
                textTransform: "capitalize",
              }}
            >
              {monthName}
            </Text>
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", width: 196 }}
            >
              {paddedDates.map((date, i) =>
                date ? (
                  <AnimatedCell
                    key={date.toISOString()}
                    date={date}
                    completed={isCompleted(date)}
                    isDark={isDark}
                    onPress={() => onToggle(date.toISOString().split("T")[0])}
                  />
                ) : (
                  <View
                    key={`empty-${i}`}
                    style={{ width: 28, height: 28, margin: 3 }}
                  />
                ),
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function AnimatedCell({
  date,
  completed,
  isDark,
  onPress,
}: {
  date: Date;
  completed: boolean; // Si el día está completado
  isDark: boolean; // Si está en tema oscuro
  onPress: () => void; // Callback cuando se toca
}) {
  // Valor animado para el efecto scale/zoom
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Verifica si esta celda es hoy
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  /**
   * Maneja el toque en la celda:
   * - Vibración háptica (feedback táctil)
   * - Animación spring de zoom
   * - Actualiza el registro por callback
   */
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Anima el zoom con spring (1 -> 1.2 -> 1)
    scale.value = withSpring(1.2, { damping: 8 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  // Colores de celda según tema y estado
  const cellBg = completed
    ? "rgba(34, 197, 94, 1)"
    : isDark
      ? "#2c2c2e"
      : "#e5e7eb";

  const textColor = completed ? "#06532b" : isDark ? "#6b7280" : "#9ca3af";

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          {
            width: 28,
            height: 28,
            margin: 3,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: cellBg,
            borderWidth: isToday ? 1.5 : 0,
            borderColor: isToday ? "#3B82F6" : "transparent",
          },
          animatedStyle,
        ]}
      >
        <Text style={{ fontSize: 11, fontWeight: "500", color: textColor }}>
          {date.getDate()}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
