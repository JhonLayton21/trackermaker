import { Habit } from "@/types/habit";
import { Text, View } from "react-native";
import HabitGrid from "./HabitGrid";

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
};

export default function HabitCard({ habit, onUpdate }: Props) {
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
      <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>
        {habit.name}
      </Text>

      <HabitGrid records={habit.records} onToggle={toggleDate} />
    </View>
  );
}
