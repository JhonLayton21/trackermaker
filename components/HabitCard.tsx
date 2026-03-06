import { useTheme } from "@/context/ThemeContext";
import { Habit } from "@/types/habit";
import { calculateBestStreak, calculateStreak } from "@/utils/date";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import EmojiPickerModal from "./EmojiPickerModal";
import HabitGrid from "./HabitGrid";

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onLongPress?: (habit: Habit) => void;
};

const MONTH_WIDTH = 220;
const PAST_MONTHS = 3;

export default function HabitCard({
  habit,
  onUpdate,
  onDelete,
  onLongPress,
}: Props) {
  const { colors } = useTheme();
  const streak = calculateStreak(habit.records);
  const bestStreak = calculateBestStreak(habit.records);
  const scrollRef = useRef<ScrollView>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const toggleDate = (date: string) => {
    const exists = habit.records.includes(date);
    onUpdate({
      ...habit,
      records: exists
        ? habit.records.filter((d) => d !== date)
        : [...habit.records, date],
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    onUpdate({ ...habit, emoji });
  };

  return (
    <>
      <EmojiPickerModal
        visible={emojiPickerVisible}
        onSelect={handleEmojiSelect}
        onClose={() => setEmojiPickerVisible(false)}
      />

      <Pressable
        onLongPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onLongPress?.(habit);
        }}
        delayLongPress={300}
      >
        <View
          style={{
            marginVertical: 15,
            padding: 15,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {/* Nombre con cuadrito de emoji */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                flex: 1,
              }}
            >
              <Pressable
                onPress={() => setEmojiPickerVisible(true)}
                style={({ pressed }) => ({
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: colors.border,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ fontSize: 22 }}>{habit.emoji ?? "✨"}</Text>
              </Pressable>

              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                {habit.name}
              </Text>
            </View>

            {/* Streak */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                🔥 {streak}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 11,
                  opacity: 0.4,
                  marginTop: 2,
                }}
              >
                mejor: {bestStreak}
              </Text>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onLayout={() => {
              scrollRef.current?.scrollTo({
                x: PAST_MONTHS * MONTH_WIDTH,
                animated: false,
              });
            }}
          >
            <HabitGrid records={habit.records} onToggle={toggleDate} />
          </ScrollView>
        </View>
      </Pressable>
    </>
  );
}
