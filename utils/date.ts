/**
 * Genera un array con todas las fechas del año natural (1 de enero - 31 de diciembre)
 * Se utiliza para renderizar el calendario de 12 meses en el grid de hábitos
 * @returns Array de objetos Date para todos los días del año actual
 */
export function generateSixMonthRange() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1); // 1 de enero
  const end = new Date(today.getFullYear(), 11, 31); // 31 de diciembre

  const dates: Date[] = [];
  const current = new Date(start);

  // Itera día a día desde el 1 de enero hasta el 31 de diciembre
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Agrupa un array de fechas por semanas (comenzando en lunes)
 * Útil para reorganizar el calendario en vista semanal
 * @param dates - Array de fechas a agrupar
 * @returns Array de arrays, donde cada sub-array representa una semana
 */
export function groupByWeeks(dates: Date[]) {
  const weeks: Date[][] = [];
  let week: Date[] = [];

  dates.forEach((date) => {
    const day = date.getDay();

    // Si encontramos lunes (día 1) y ya hay fechas en la semana, guardamos la semana anterior
    if (day === 1 && week.length) {
      weeks.push(week);
      week = [];
    }

    week.push(date);
  });

  // Agrega la última semana incompleta
  if (week.length) {
    weeks.push(week);
  }

  return weeks;
}

/**
 * Calcula la racha actual de días consecutivos completados
 * La racha se mantiene si está marcado hoy O ayer (para no interrumpir racha en cambio de día)
 * @param records - Array de fechas ISO cuando se completó el hábito
 * @returns Número de días consecutivos actuales
 */
export function calculateStreak(records: string[]) {
  if (!records.length) return 0;

  const sorted = [...records].sort().reverse();

  // Convierte una fecha a formato ISO (YYYY-MM-DD)
  const toLocalISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const today = new Date();
  let current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  // Obtiene fechas en formato ISO
  const todayISO = toLocalISO(current);
  const yesterday = new Date(current);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = toLocalISO(yesterday);

  // Si ni hoy ni ayer están marcados, la racha es 0
  if (!sorted.includes(todayISO) && !sorted.includes(yesterdayISO)) return 0;

  // Si hoy no está marcado pero ayer sí, empezamos desde ayer
  if (!sorted.includes(todayISO)) {
    current = yesterday;
  }

  // Cuenta los días consecutivos hacia atrás
  let streak = 0;
  while (true) {
    const iso = toLocalISO(current);
    if (sorted.includes(iso)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Verifica si una fecha es hoy
 * Se utiliza para resaltar visualmente el día actual en el calendario
 * @param date - Fecha a validar
 * @returns true si la fecha es hoy, false en caso contrario
 */
export function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Calcula la racha más larga registrada en toda la historia del hábito
 * Analiza todos los registros para encontrar la secuencia más larga de días consecutivos
 * @param records - Array de fechas ISO completadas
 * @returns Número de días de la mejor racha histórica
 */
export function calculateBestStreak(records: string[]) {
  if (!records.length) return 0;

  const sorted = [...records].sort();
  let best = 1;
  let current = 1;

  // Itera comparando fechas consecutivas
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    // Calcula diferencia en días
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    // Si la diferencia es exactamente 1 día, incrementa la racha actual
    if (diffDays === 1) {
      current++;
      if (current > best) best = current;
    } else {
      // Si hay un hueco, reinicia la racha
      current = 1;
    }
  }

  return best;
}
