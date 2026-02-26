import { generateSixMonthRange, groupByWeeks } from "@/utils/date";
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
  const weeks = groupByWeeks(dates);

  // 🔥 Agrupar semanas por mes
  const monthsMap: { [key: string]: typeof weeks } = {};

  weeks.forEach((week) => {
    const firstDateOfWeek = week[0];
    const monthKey = firstDateOfWeek.toISOString().slice(0, 7); // YYYY-MM

    if (!monthsMap[monthKey]) {
      monthsMap[monthKey] = [];
    }

    monthsMap[monthKey].push(week);
  });

  const isCompleted = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    return records.includes(iso);
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {Object.entries(monthsMap).map(([monthKey, monthWeeks]) => {
        const monthName = new Date(monthKey + "-01").toLocaleString("default", {
          month: "short",
        });

        return (
          <View key={monthKey} style={{ marginRight: 20 }}>
            {/* 🔥 Título del mes */}
            <Text
              style={{
                color: "white",
                fontSize: 12,
                marginBottom: 8,
                textTransform: "capitalize",
                opacity: 0.7,
              }}
            >
              {monthName}
            </Text>

            <View style={{ flexDirection: "row" }}>
              {monthWeeks.map((week, i) => (
                <View key={i}>
                  {week.map((date) => {
                    const iso = date.toISOString().split("T")[0];
                    const completed = isCompleted(date);

                    return (
                      <AnimatedCell
                        key={iso}
                        date={date}
                        completed={completed}
                        onPress={() => onToggle(iso)}
                      />
                    );
                  })}
                </View>
              ))}
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

            // 🌿 Verde suave cuando está completado
            backgroundColor: completed ? "rgba(34,197,94,0.25)" : "#2c2c2e",

            // 🔵 Borde azul si es hoy
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
            color: completed
              ? "#d1fae5" // verde claro
              : "#6b7280", // gris medio
          }}
        >
          {date.getDate()}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
