export function generateLastSixMonths() {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const dates: Date[] = [];
  const current = new Date(sixMonthsAgo);

  while (current <= today) {
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
