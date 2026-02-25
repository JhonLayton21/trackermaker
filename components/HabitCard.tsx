import { Habit } from "@/types/habit";
import { Text, View } from "react-native";
import HabitGrid from "./HabitGrid";

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
};

export default function HabitCard({ habit, onUpdate }: Props) {
  return (
    <View
      style={{
        marginVertical: 15,
        padding: 15,
        backgroundColor: "#111",
        borderRadius: 12,
      }}
    >
      <Text style={{ color: "white", fontSize: 18 }}>{habit.name}</Text>

      <HabitGrid habit={habit} onUpdate={onUpdate} />
    </View>
  );
}
