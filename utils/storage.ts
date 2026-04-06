import { Habit } from "@/types/habit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clave para almacenar los hábitos en AsyncStorage
const STORAGE_KEY = "HABITS";

/**
 * Guarda el array completo de hábitos en AsyncStorage (persistencia local)
 * @param habits - Array de hábitos a guardar
 */
export const saveHabits = async (habits: Habit[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

/**
 * Carga los hábitos guardados desde AsyncStorage
 * @returns Promise con el array de hábitos, o array vacío si no hay datos
 */
export const loadHabits = async (): Promise<Habit[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
