import { calculateWeekday } from "../src/doomsday.js";

const CASES = [
  ["1776-07-04", "Thursday"],
  ["1900-01-01", "Monday"],
  ["1945-05-08", "Tuesday"],
  ["1969-07-20", "Sunday"],
  ["1999-12-31", "Friday"],
  ["2000-01-01", "Saturday"],
  ["2024-02-29", "Thursday"],
  ["2026-02-08", "Sunday"]
];

function expectedByDate(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  const index = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
}

let failures = 0;

for (const [date, expected] of CASES) {
  const result = calculateWeekday(date);
  if (result.weekday !== expected) {
    failures += 1;
    console.error(`FAIL fixed case ${date}: expected=${expected}, got=${result.weekday}`);
  }
}

for (let year = 1700; year <= 2100; year += 17) {
  for (const month of [1, 2, 3, 6, 9, 12]) {
    const day = month === 2 ? 15 : 19;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const result = calculateWeekday(date).weekday;
    const expected = expectedByDate(date);
    if (result !== expected) {
      failures += 1;
      console.error(`FAIL cross-check ${date}: expected=${expected}, got=${result}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
}

console.log("All doomsday tests passed.");
