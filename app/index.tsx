import AddHabitModal from "@/components/AddHabitModal";
import DeleteSlider from "@/components/DeleteSlider";
import HabitCard from "@/components/HabitCard";
import { Habit } from "@/types/habit";
import { loadHabits, saveHabits } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  useEffect(() => {
    const init = async () => {
      const stored = await loadHabits();
      setHabits(stored);
    };
    init();
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
            marginBottom: 20,
          }}
        >
          Habit Tracker
        </Text>

        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onUpdate={(updatedHabit) => {
              setHabits((prev) =>
                prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
              );
            }}
            onDelete={deleteHabit}
            onLongPress={(habit) => {
              setHabitToDelete(habit);
            }}
          />
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          bottom: 30,
          right: 25,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#22c55e",
          justifyContent: "center",
          alignItems: "center",

          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={(name) => {
          const newHabit: Habit = {
            id: Date.now().toString(),
            name,
            createdAt: new Date().toISOString(),
            records: [],
          };

          setHabits((prev) => [...prev, newHabit]);
        }}
      />

      {habitToDelete && (
        <DeleteSlider
          onConfirm={() => {
            deleteHabit(habitToDelete.id);
            setHabitToDelete(null);
          }}
          onCancel={() => setHabitToDelete(null)}
        />
      )}
    </View>
  );
}
