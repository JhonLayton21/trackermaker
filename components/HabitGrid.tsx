import { generateLastSixMonths, groupByWeeks } from "@/utils/date";
import { Pressable, View } from "react-native";
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
  const dates = generateLastSixMonths();
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
              <AnimatedCell
                key={iso}
                completed={completed}
                onPress={() => onToggle(iso)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function AnimatedCell({
  completed,
  onPress,
}: {
  completed: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.25, { damping: 8 }, () => {
      scale.value = withSpring(1);
    });

    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          {
            width: 14,
            height: 14,
            margin: 2,
            borderRadius: 3,
            backgroundColor: completed ? "#22c55e" : "#2c2c2e",
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}
