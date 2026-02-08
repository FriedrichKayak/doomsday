import {
  calculateWeekday,
  getMonthDoomsdayDate,
  isLeapYear,
  WEEKDAYS
} from "./doomsday.js";

const form = document.querySelector("#date-form");
const dateInput = document.querySelector("#target-date");
const randomDateButton = document.querySelector("#random-date");
const output = document.querySelector("#result");
const details = document.querySelector("#details");
const modeInputs = document.querySelectorAll("input[name='mode']");
const revealButton = document.querySelector("#reveal");
const expertChallenge = document.querySelector("#expert-challenge");
const weekdayGuessInput = document.querySelector("#weekday-guess");
const checkGuessButton = document.querySelector("#check-guess");
const guessFeedback = document.querySelector("#guess-feedback");
const referenceTitle = document.querySelector("#reference-title");
const referenceList = document.querySelector("#reference-list");
const monthViewPanel = document.querySelector("#month-view-panel");
const calendarTitle = document.querySelector("#calendar-title");
const calendarGrid = document.querySelector("#calendar-grid");

let currentResult = null;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function getMode() {
  return document.querySelector("input[name='mode']:checked").value;
}

function renderBeginner(result) {
  const { details: d, weekday, yearDoomsday } = result;
  const leapYear = isLeapYear(d.year);
  const leapExplanation = leapYear
    ? "Leap year (divisible by 400, or divisible by 4 but not by 100)"
    : "Not a leap year (fails the divisible-by-400 / 4-and-not-100 rule)";
  const rows = d.trace
    .map((item) => `<tr><td>${item.step}</td><td>${item.value}</td></tr>`)
    .join("");
  details.innerHTML = `
    <h3>Step-by-step</h3>
    <table class="steps-table">
      <thead>
        <tr><th>Year Doomsday (Odd +11 Method)</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>Century anchor (${Math.floor(d.year / 100) * 100}s)</td><td>${d.anchor}</td></tr>
        ${rows}
        <tr><td>Year doomsday = (anchor + offset) mod 7</td><td>${yearDoomsday}</td></tr>
      </tbody>
    </table>
    <table class="steps-table">
      <thead>
        <tr><th>Date Shift to Target Day</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>Leap-year check for ${d.year}</td><td>${leapExplanation}</td></tr>
        <tr><td>Month doomsday date for ${d.month}/${d.year}</td><td>${d.monthDoomsdayDate}</td></tr>
        <tr><td>Offset = (target day - month doomsday) mod 7</td><td>${d.offset}</td></tr>
        <tr><td>Final weekday = (year doomsday + offset) mod 7</td><td>${weekday}</td></tr>
      </tbody>
    </table>
  `;
}

function renderExpert(result) {
  const { details: d } = result;
  details.innerHTML = `
    <h3>Expert prompt</h3>
    <p>Compute mentally first: anchor=${d.anchor}, y=${d.y}, odd+11 offset=${d.offset}, month anchor=${d.monthDoomsdayDate}.</p>
    <p>Click reveal when ready.</p>
  `;
}

function renderResult(result, reveal = false) {
  const mode = getMode();
  const dateLabel = `${result.details.year}-${String(result.details.month).padStart(2, "0")}-${String(result.details.day).padStart(2, "0")}`;

  if (mode === "beginner") {
    output.textContent = `${dateLabel} is ${result.weekday}.`;
    revealButton.hidden = true;
    expertChallenge.hidden = true;
    monthViewPanel.hidden = false;
    guessFeedback.textContent = "";
    renderBeginner(result);
  } else {
    expertChallenge.hidden = false;
    revealButton.hidden = false;
    if (reveal) {
      output.textContent = `${dateLabel} is ${result.weekday}.`;
      guessFeedback.textContent = "";
      monthViewPanel.hidden = false;
      renderBeginner(result);
    } else {
      output.textContent = `${dateLabel}: answer hidden. Make your guess, then click Check Guess or Reveal Steps.`;
      monthViewPanel.hidden = true;
      renderExpert(result);
    }
  }

  renderReference(result.details.year, result.details.month);
  if (!monthViewPanel.hidden) {
    renderCalendar(result);
  } else {
    calendarTitle.textContent = "Month view hidden until Reveal Steps in Expert mode.";
    calendarGrid.innerHTML = "";
  }
}

function getDaysInMonth(year, month) {
  const days = [
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
  return days[month - 1];
}

function getWeekdayIndex(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function renderReference(year, selectedMonth) {
  referenceTitle.textContent = `Month anchors for ${year}`;
  const items = MONTH_NAMES.map((monthName, idx) => {
    const month = idx + 1;
    const dd = getMonthDoomsdayDate(year, month);
    const activeClass = month === selectedMonth ? " class='active-anchor'" : "";
    return `<li${activeClass}><span>${monthName}</span><strong>${monthName} ${dd}</strong></li>`;
  });
  referenceList.innerHTML = items.join("");
}

function renderCalendar(result) {
  const { year, month, day } = result.details;
  const doomsdayDate = getMonthDoomsdayDate(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getWeekdayIndex(year, month, 1);

  calendarTitle.textContent = `${MONTH_NAMES[month - 1]} ${year} | doomsday: ${doomsdayDate}, target: ${day}`;

  const cells = WEEKDAYS.map((w) => `<div class="dow">${w.slice(0, 3)}</div>`);
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push("<div class='day empty'></div>");
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const classes = ["day"];
    if (d === doomsdayDate) {
      classes.push("doomsday");
    }
    if (d === day) {
      classes.push("target");
    }
    cells.push(`<div class="${classes.join(" ")}">${d}</div>`);
  }

  calendarGrid.innerHTML = cells.join("");
}

function computeFromInput() {
  try {
    currentResult = calculateWeekday(dateInput.value);
    renderResult(currentResult, false);
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
    details.innerHTML = "";
    revealButton.hidden = true;
    expertChallenge.hidden = true;
    guessFeedback.textContent = "";
    referenceList.innerHTML = "";
    monthViewPanel.hidden = false;
    calendarTitle.textContent = "No date selected";
    calendarGrid.innerHTML = "";
  }
}

function getRandomDateInRange() {
  const start = Date.UTC(1700, 0, 1);
  const end = Date.UTC(2100, 11, 31);
  const randomTimestamp = start + Math.floor(Math.random() * (end - start + 1));
  const randomDate = new Date(randomTimestamp);
  const year = randomDate.getUTCFullYear();
  const month = String(randomDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(randomDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  computeFromInput();
});

revealButton.addEventListener("click", () => {
  if (!currentResult) {
    return;
  }
  renderResult(currentResult, true);
});

checkGuessButton.addEventListener("click", () => {
  if (!currentResult || getMode() !== "expert") {
    return;
  }
  const guess = weekdayGuessInput.value;
  if (guess === currentResult.weekday) {
    guessFeedback.textContent = "Correct.";
    return;
  }
  guessFeedback.textContent = `Not quite. You guessed ${guess}. Try again or click Reveal Steps.`;
});

for (const input of modeInputs) {
  input.addEventListener("change", () => {
    if (!currentResult) {
      return;
    }
    renderResult(currentResult, false);
  });
}

randomDateButton.addEventListener("click", () => {
  dateInput.value = getRandomDateInRange();
  computeFromInput();
});

computeFromInput();
