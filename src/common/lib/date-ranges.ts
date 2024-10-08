export const dateRanges = (year: number) => {
  const startOfYear = new Date(`${year}-01-01`);
  const endOfYear = new Date(`${year}-12-31`);

  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);
  const previousWeekEnd = new Date(currentWeekEnd);
  previousWeekEnd.setDate(currentWeekEnd.getDate() - 7);

  return {
    startOfYear,
    endOfYear,
    currentWeekStart,
    currentWeekEnd,
    previousWeekStart,
    previousWeekEnd,
  };
};
