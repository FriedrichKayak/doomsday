const CENTURY_ANCHORS = {
  1600: 2,
  1700: 0,
  1800: 5,
  1900: 3,
  2000: 2,
  2100: 0
};

const MONTH_DOOMSDAYS = {
  common: [3, 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12],
  leap: [4, 29, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function mod(n, m) {
  return ((n % m) + m) % m;
}

export function isLeapYear(year) {
  if (year % 400 === 0) {
    return true;
  }
  if (year % 100 === 0) {
    return false;
  }
  return year % 4 === 0;
}

export function parseIsoDate(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error("Date must be formatted as YYYY-MM-DD.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1700 || year > 2100) {
    throw new Error("Year must be between 1700 and 2100.");
  }
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }

  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];

  if (day < 1 || day > daysInMonth[month - 1]) {
    throw new Error("Day is out of range for the month.");
  }

  return { year, month, day };
}

export function getCenturyAnchor(year) {
  const century = Math.floor(year / 100) * 100;
  const anchor = CENTURY_ANCHORS[century];
  if (anchor === undefined) {
    throw new Error("Century not supported by configured anchors.");
  }
  return anchor;
}

export function getYearDoomsday(year) {
  const anchor = getCenturyAnchor(year);
  const y = year % 100;
  let t = y;
  const trace = [{ step: "Start with y (last two digits)", value: t }];

  if (t % 2 !== 0) {
    t += 11;
    trace.push({ step: "y is odd, add 11", value: t });
  } else {
    trace.push({ step: "y is even, no change", value: t });
  }

  t = Math.floor(t / 2);
  trace.push({ step: "Divide by 2", value: t });

  if (t % 2 !== 0) {
    t += 11;
    trace.push({ step: "Result is odd, add 11", value: t });
  } else {
    trace.push({ step: "Result is even, no change", value: t });
  }

  const tMod7 = t % 7;
  const offset = 7 - tMod7;
  trace.push({ step: "Compute 7 - (value mod 7)", value: offset });

  const doomsday = mod(anchor + offset, 7);
  return {
    doomsday,
    steps: { anchor, y, offset, trace }
  };
}

export function getMonthDoomsdayDate(year, month) {
  const set = isLeapYear(year) ? MONTH_DOOMSDAYS.leap : MONTH_DOOMSDAYS.common;
  return set[month - 1];
}

export function calculateWeekday(input) {
  const { year, month, day } =
    typeof input === "string" ? parseIsoDate(input) : input;
  const { doomsday, steps } = getYearDoomsday(year);
  const monthDoomsdayDate = getMonthDoomsdayDate(year, month);
  const offset = mod(day - monthDoomsdayDate, 7);
  const weekdayIndex = mod(doomsday + offset, 7);

  return {
    weekdayIndex,
    weekday: WEEKDAYS[weekdayIndex],
    yearDoomsday: WEEKDAYS[doomsday],
    details: {
      ...steps,
      monthDoomsdayDate,
      offset,
      year,
      month,
      day
    }
  };
}

export { WEEKDAYS };
