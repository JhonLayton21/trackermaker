/**
 * SLIDER PARA ELIMINAR HÁBITO
 * Componente interactivo con gesto de deslizar
 * Usuario debe deslizar hasta el 80% para confirmar la eliminación
 * Si no llega al 80%, vuelve a su posición inicial con animación spring
 */

import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

// Ancho disponible de la pantalla
const { width } = Dimensions.get("window");

type Props = {
  onConfirm: () => void;  // Callback cuando se confirma eliminación
  onCancel: () => void;   // Callback cuando se cancela
};

/**
 * Componente de slider para confirmar eliminación de hábito
 * Requiere deslizar el cursor rojo hasta el 80% del ancho
 */
export default function DeleteSlider({ onConfirm }: Props) {
  const translateX = useSharedValue(0);

  // Dimensiones del slider
  const BUTTON_WIDTH = width - 40;
  const SLIDER_SIZE = 60;
  const MAX_SLIDE = BUTTON_WIDTH - SLIDER_SIZE;

  /**
   * Gesto de pan (deslizar) para el slider
   * - onUpdate: Actualiza posición mientras se desliza
   * - onEnd: Verifica si llegó al 80% para confirmar
   */
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      // Limita el movimiento entre 0 y MAX_SLIDE
      if (e.translationX >= 0 && e.translationX <= MAX_SLIDE) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      // Si pasó el 80%, confirma la eliminación
      if (translateX.value > MAX_SLIDE * 0.8) {
        runOnJS(onConfirm)();
      } else {
        // Si no llegó, vuelve al inicio con animación spring
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={{
        position: "absolute",
        bottom: 30,
        width: "100%",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: BUTTON_WIDTH,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#7f1d1d",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Text
          style={{
            position: "absolute",
            alignSelf: "center",
            color: "#fecaca",
            fontWeight: "600",
            fontSize: 14,
          }}
        >
          Desliza para eliminar
        </Text>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                width: SLIDER_SIZE,
                height: SLIDER_SIZE,
                borderRadius: SLIDER_SIZE / 2,
                backgroundColor: "#dc2626",
                justifyContent: "center",
                alignItems: "center",
              },
              animatedStyle,
            ]}
          >
            <Ionicons name="trash" size={24} color="white" />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}
