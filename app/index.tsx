import AddHabitModal from "@/components/AddHabitModal";
import HabitCard from "@/components/HabitCard";
import { Habit } from "@/types/habit";
import { loadHabits, saveHabits } from "@/utils/storage";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text } from "react-native";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Habit Tracker</Text>

      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onUpdate={(updatedHabit) => {
            setHabits((prev) =>
              prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
            );
          }}
        />
      ))}

      <Button title="Agregar hábito" onPress={() => setModalVisible(true)} />
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
    </ScrollView>
  );
}
