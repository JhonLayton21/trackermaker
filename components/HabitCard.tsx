import { Habit } from "@/types/habit";
import { calculateStreak } from "@/utils/date";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import HabitGrid from "./HabitGrid";

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onLongPress?: (habit: Habit) => void;
};

// Ajusta este valor al ancho real de cada mes en tu HabitGrid
const MONTH_WIDTH = 220; // px por mes (columnas * ancho celda + gaps)
const PAST_MONTHS = 3;

export default function HabitCard({
  habit,
  onUpdate,
  onDelete,
  onLongPress,
}: Props) {
  const streak = calculateStreak(habit.records);
  const scrollRef = useRef<ScrollView>(null);

  const toggleDate = (date: string) => {
    const exists = habit.records.includes(date);
    const updatedHabit: Habit = {
      ...habit,
      records: exists
        ? habit.records.filter((d) => d !== date)
        : [...habit.records, date],
    };
    onUpdate(updatedHabit);
  };

  return (
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
          backgroundColor: "#111",
          borderRadius: 12,
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
          <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
            {habit.name}
          </Text>
          <Text style={{ color: "#22c55e", fontSize: 14, fontWeight: "500" }}>
            🔥 {streak}
          </Text>
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
  );
}
