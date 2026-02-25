import { Habit } from "@/types/habit";
import { calculateStreak } from "@/utils/date";
import { ScrollView, Text, View } from "react-native";
import HabitGrid from "./HabitGrid";

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
};

export default function HabitCard({ habit, onUpdate }: Props) {
  const streak = calculateStreak(habit.records);
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
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {habit.name}
        </Text>

        <Text
          style={{
            color: "#22c55e",
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          🔥 {streak}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HabitGrid records={habit.records} onToggle={toggleDate} />
      </ScrollView>
    </View>
  );
}
