import { Habit } from "@/types/habit";
import { format, subDays } from "date-fns";
import { Pressable, View } from "react-native";

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
};

export default function HabitGrid({ habit, onUpdate }: Props) {
  const days = Array.from({ length: 30 }).map((_, i) =>
    format(subDays(new Date(), i), "yyyy-MM-dd"),
  );

  const toggleDay = (date: string) => {
    const exists = habit.records.find((r) => r.date === date);

    let updated;

    if (exists) {
      updated = habit.records.filter((r) => r.date !== date);
    } else {
      updated = [...habit.records, { date, completed: true }];
    }

    onUpdate({ ...habit, records: updated });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
      }}
    >
      {days.map((date) => {
        const completed = habit.records.some((r) => r.date === date);

        return (
          <Pressable
            key={date}
            onPress={() => toggleDay(date)}
            style={{
              width: 20,
              height: 20,
              margin: 3,
              borderRadius: 4,
              backgroundColor: completed ? "#22c55e" : "#333",
            }}
          />
        );
      })}
    </View>
  );
}
