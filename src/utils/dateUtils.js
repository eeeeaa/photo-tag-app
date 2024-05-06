export function calculateTimeSpent(startISOTime, endISOTime) {
  const start = new Date(startISOTime);
  const end = new Date(endISOTime);
  const diffTime = Math.abs(end - start);
  return `${format(diffTime)}`;
}

export const format = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms - hours * 3600000) / 60000);
  const seconds = Math.floor((ms - hours * 3600000 - minutes * 60000) / 1000);
  const tenMillis = Math.floor(
    (ms - hours * 3600000 - minutes * 60000 - seconds * 1000) / 10
  );
  const pad = (n, len) => {
    let result = n + "";
    let digits = 0;
    while (n > 0) {
      n = Math.floor(n / 10);
      digits++;
    }
    if (digits === 0) digits++;
    const zeros = Math.max(0, len - digits);
    for (let i = 0; i < zeros; i++) result = "0" + result;
    return result;
  };
  return `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(tenMillis, 2)}`;
};
