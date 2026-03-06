import AddHabitModal from "@/components/AddHabitModal";
import DeleteSlider from "@/components/DeleteSlider";
import HabitCard from "@/components/HabitCard";
import SettingsScreen from "@/components/SettingsScreen";
import { useTheme } from "@/context/ThemeContext";
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
  const { colors } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    setShowSettings(false);
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
    }).start(() => {
      setMenuOpen(false);
      setShowSettings(false);
    });
  };

  const MENU_ITEMS = [
    { icon: "home-outline", label: "Inicio", onPress: closeMenu },
    { icon: "stats-chart-outline", label: "Estadísticas", onPress: () => {} },
    {
      icon: "settings-outline",
      label: "Configuración",
      onPress: () => setShowSettings(true),
    },
    {
      icon: "information-circle-outline",
      label: "Acerca de",
      onPress: () => {},
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            style={{ fontSize: 24, fontWeight: "bold", color: colors.text }}
          >
            TrackerMaker
          </Text>
          <TouchableOpacity
            onPress={openMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={28} color={colors.text} />
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
            onLongPress={(habit) => setHabitToDelete(habit)}
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

      {/* Overlay */}
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

      {/* Drawer */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: SCREEN_WIDTH,
          backgroundColor: colors.surface,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {showSettings ? (
          <View style={{ flex: 1, paddingTop: insets.top + 20 }}>
            <SettingsScreen onClose={() => setShowSettings(false)} />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              paddingTop: insets.top + 20,
              paddingHorizontal: 24,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <Text
                style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}
              >
                Menú
              </Text>
              <TouchableOpacity onPress={closeMenu}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={item.onPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={colors.accent}
                  style={{ marginRight: 16 }}
                />
                <Text style={{ color: colors.text, fontSize: 16 }}>
                  {item.label}
                </Text>
                {item.label === "Configuración" && (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.subtext}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
