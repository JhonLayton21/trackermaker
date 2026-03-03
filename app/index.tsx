import AddHabitModal from "@/components/AddHabitModal";
import DeleteSlider from "@/components/DeleteSlider";
import HabitCard from "@/components/HabitCard";
import { Habit } from "@/types/habit";
import { loadHabits, saveHabits } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const insets = useSafeAreaInsets();

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

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: insets.top + 20,
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Habit Tracker
          </Text>
          <TouchableOpacity
            onPress={openMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
        </View>

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

      {/* Drawer Overlay */}
      {menuOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeMenu}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* Drawer Menu */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: SCREEN_WIDTH,
          backgroundColor: "#111",
          transform: [{ translateX: slideAnim }],
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
        }}
      >
        {/* Drawer Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Menú
          </Text>
          <TouchableOpacity onPress={closeMenu}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Drawer Items */}
        {[
          { icon: "home-outline", label: "Inicio" },
          { icon: "stats-chart-outline", label: "Estadísticas" },
          { icon: "settings-outline", label: "Configuración" },
          { icon: "information-circle-outline", label: "Acerca de" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#222",
            }}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color="#22c55e"
              style={{ marginRight: 16 }}
            />
            <Text style={{ color: "white", fontSize: 16 }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}
