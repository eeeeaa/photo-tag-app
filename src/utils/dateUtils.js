export function calculateTimeSpent(startISOTime, endISOTime) {
  const start = new Date(startISOTime);
  const end = new Date(endISOTime);
  const diffTime = Math.abs(end - start);
  return `${diffTime} milliseconds`;
}
