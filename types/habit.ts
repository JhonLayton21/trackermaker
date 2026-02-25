export type HabitRecord = {
  date: string; // "2026-02-25"
  completed: boolean;
};

export type Habit = {
  id: string;
  name: string;
  createdAt: string;
  records: HabitRecord[];
};
