import { generateSixMonthRange } from "@/utils/date";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  records: string[];
  onToggle: (date: string) => void;
};

export default function HabitGrid({ records, onToggle }: Props) {
  const dates = generateSixMonthRange();

  // 🔥 Agrupar por mes REAL
  const monthsMap: { [key: string]: Date[] } = {};

  dates.forEach((date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthsMap[key]) {
      monthsMap[key] = [];
    }
    monthsMap[key].push(date);
  });

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

        // 🔥 Padding antes del primer día
        const startDay = new Date(
          firstDay.getFullYear(),
          firstDay.getMonth(),
          1,
        ).getDay();

        const padding = (startDay + 6) % 7; // Lunes como inicio

        const paddedDates = [...Array(padding).fill(null), ...monthDates];

        return (
          <View key={monthKey} style={{ marginRight: 24 }}>
            <Text
              style={{
                color: "white",
                fontSize: 12,
                marginBottom: 8,
                opacity: 0.7,
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
                    onPress={() => onToggle(date.toISOString().split("T")[0])}
                  />
                ) : (
                  <View
                    key={`empty-${i}`}
                    style={{
                      width: 28,
                      height: 28,
                      margin: 3,
                    }}
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
  onPress,
}: {
  date: Date;
  completed: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    scale.value = withSpring(1.2, { damping: 8 }, () => {
      scale.value = withSpring(1);
    });

    onPress();
  };

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
            backgroundColor: completed ? "rgba(34,197,94,0.25)" : "#2c2c2e",
            borderWidth: isToday ? 1.5 : 0,
            borderColor: isToday ? "#3B82F6" : "transparent",
          },
          animatedStyle,
        ]}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "500",
            color: completed ? "#d1fae5" : "#6b7280",
          }}
        >
          {date.getDate()}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
