/**
 * Tipo que representa un hábito en la aplicación
 *
 * Propiedades:
 * - id: Identificador único del hábito (timestamp)
 * - name: Nombre descriptivo del hábito (ej: "Ejercicio", "Leer")
 * - emoji: Emoji asociado al hábito (opcional, ej: "💪")
 * - createdAt: Fecha de creación en formato ISO
 * - records: Array de fechas ISO (YYYY-MM-DD) cuando se completó el hábito
 */
export type Habit = {
  id: string; // Identificador único
  name: string; // Nombre del hábito
  emoji?: string; // Emoji opcional del hábito
  createdAt: string; // Fecha de creación (ISO)
  records: string[]; // Fechas completadas ["2026-04-06", ...]
};
