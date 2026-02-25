export function generateYearDates() {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const dates = [];
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
    const day = date.getDay(); // 0 domingo

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
