/**
 * SELECTOR DE EMOJIS
 * Modal para seleccionar emojis categorizados
 * Permite personalizar el emoji de un hábito con 8 categorías diferentes
 */

import { useTheme } from "@/context/ThemeContext";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

/**
 * Categorías de emojis organizadas por tipo
 * Facilita encontrar y seleccionar emojis relevantes por tema
 */
const EMOJI_CATEGORIES = [
  {
    label: "Ejercicio",
    emojis: [
      "💪",
      "🏃",
      "🏋️",
      "🚴",
      "🏊",
      "🧘",
      "🚶",
      "🤸",
      "⛹️",
      "🏇",
      "🧗",
      "🤾",
      "🏌️",
      "🎽",
      "👟",
    ],
  },
  {
    label: "Salud",
    emojis: [
      "💧",
      "🥗",
      "🍎",
      "😴",
      "💊",
      "🌿",
      "🥦",
      "🫀",
      "🧬",
      "🩺",
      "🥤",
      "🫁",
      "🍵",
      "🧃",
      "🥕",
    ],
  },
  {
    label: "Mente",
    emojis: [
      "🧠",
      "📚",
      "📖",
      "✍️",
      "🎯",
      "🧩",
      "💡",
      "🔍",
      "📝",
      "🗂️",
      "💭",
      "🎓",
      "📐",
      "🔬",
      "📊",
    ],
  },
  {
    label: "Creatividad",
    emojis: [
      "🎨",
      "🎵",
      "🎤",
      "🎸",
      "🎹",
      "📷",
      "🎬",
      "✏️",
      "🖌️",
      "📸",
      "🎭",
      "🪗",
      "🥁",
      "🎻",
      "📻",
    ],
  },
  {
    label: "Productividad",
    emojis: [
      "💰",
      "📅",
      "⏰",
      "✅",
      "📋",
      "🗓️",
      "💼",
      "📈",
      "🏆",
      "🎖️",
      "🔑",
      "⚡",
      "🚀",
      "🛠️",
      "📌",
    ],
  },
  {
    label: "Bienestar",
    emojis: [
      "❤️",
      "🙏",
      "🌙",
      "☀️",
      "🌿",
      "😊",
      "🧸",
      "🕯️",
      "🛁",
      "🌸",
      "🍃",
      "🌊",
      "🌅",
      "🦋",
      "✨",
    ],
  },
  {
    label: "Hogar",
    emojis: [
      "🧹",
      "🏠",
      "🪴",
      "🧺",
      "🍳",
      "🛒",
      "🪟",
      "🧽",
      "🛏️",
      "🪣",
      "🔧",
      "🧰",
      "🪑",
      "🏡",
      "🚿",
    ],
  },
  {
    label: "Social",
    emojis: [
      "🐶",
      "👨‍👩‍👧",
      "📞",
      "🤝",
      "💌",
      "👥",
      "🗣️",
      "🎉",
      "🥂",
      "🫂",
      "💬",
      "🌍",
      "🤗",
      "👋",
      "💝",
    ],
  },
];

type Props = {
  visible: boolean;                    // Modal visible
  onSelect: (emoji: string) => void;   // Callback cuando se selecciona emoji
  onClose: () => void;                 // Callback para cerrar modal
};

/**
 * Modal con selector de emojis por categorías
 */
export default function EmojiPickerModal({
  visible,
  onSelect,
  onClose,
}: Props) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 24,
        }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              maxHeight: 480,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              Elige un emoji
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {EMOJI_CATEGORIES.map((category) => (
                <View key={category.label} style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 12,
                      fontWeight: "600",
                      opacity: 0.5,
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                    }}
                  >
                    {category.label}
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                  >
                    {category.emojis.map((emoji, index) => (
                      <Pressable
                        key={`${emoji}-${index}`}
                        onPress={() => {
                          onSelect(emoji);
                          onClose();
                        }}
                        style={({ pressed }) => ({
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          backgroundColor: pressed
                            ? colors.border
                            : "transparent",
                          borderWidth: 1,
                          borderColor: colors.border,
                          justifyContent: "center",
                          alignItems: "center",
                          opacity: pressed ? 0.7 : 1,
                        })}
                      >
                        <Text style={{ fontSize: 24 }}>{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
