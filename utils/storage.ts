import { Habit } from "@/types/habit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "HABITS";

export const saveHabits = async (habits: Habit[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

export const loadHabits = async (): Promise<Habit[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
