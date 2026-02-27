export function generateSixMonthRange() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 4, 0);

  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function groupByWeeks(dates: Date[]) {
  const weeks: Date[][] = [];
  let week: Date[] = [];

  dates.forEach((date) => {
    const day = date.getDay();

    if (day === 1 && week.length) {
      weeks.push(week);
      week = [];
    }

    week.push(date);
  });

  if (week.length) {
    weeks.push(week);
  }

  return weeks;
}

export function calculateStreak(records: string[]) {
  if (!records.length) return 0;

  const sorted = [...records].sort().reverse();

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

  // Si ni hoy ni ayer están marcados, la racha es 0
  const todayISO = toLocalISO(current);
  const yesterday = new Date(current);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = toLocalISO(yesterday);

  if (!sorted.includes(todayISO) && !sorted.includes(yesterdayISO)) return 0;

  // Si hoy no está marcado pero ayer sí, empezamos desde ayer
  if (!sorted.includes(todayISO)) {
    current = yesterday;
  }

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

export function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
