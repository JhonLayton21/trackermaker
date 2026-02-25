import { generateYearDates, groupByWeeks } from "@/utils/date";
import { Pressable, View } from "react-native";

type Props = {
  records: string[];
  onToggle: (date: string) => void;
};

export default function HabitGrid({ records, onToggle }: Props) {
  const dates = generateYearDates();
  const weeks = groupByWeeks(dates);

  const isCompleted = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    return records.includes(iso);
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {weeks.map((week, i) => (
        <View key={i}>
          {week.map((date) => {
            const iso = date.toISOString().split("T")[0];
            const completed = isCompleted(date);

            return (
              <Pressable
                key={iso}
                onPress={() => onToggle(iso)}
                style={{
                  width: 14,
                  height: 14,
                  margin: 2,
                  borderRadius: 3,
                  backgroundColor: completed ? "#22c55e" : "#2c2c2e",
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
