// Calendar Module
// Handles calendar rendering and month navigation

let nav = 0;
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Get current month data
function getCurrentMonthData() {
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const month = dt.getMonth();
  const year = dt.getFullYear();
  const monthEvents = getEventsByMonth(month, year);

  return {
    eventCount: monthEvents.length,
    month,
    year,
  };
}

// Load and render calendar
function loadCalendar() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayofMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayofMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  // Update month display
  const monthDisplay = document.getElementById("monthDisplay");
  if (monthDisplay) {
    monthDisplay.innerText = `${dt.toLocaleDateString("en-us", {
      month: "long",
    })} ${year}`;
  }

  // Update current day display
  const today = new Date();
  const currentDayDisplay = document.getElementById("currentDayDisplay");
  if (currentDayDisplay) {
    const dayName = weekdays[today.getDay()];
    currentDayDisplay.innerText = `Today is ${dayName}`;
  }

  // Clear calendar
  const calendar = document.getElementById("calendar");
  if (calendar) {
    calendar.innerHTML = "";

    // Render days
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daysquare = document.createElement("div");
      daysquare.classList.add("day");

      if (i > paddingDays) {
        const dayNum = i - paddingDays;
        const dateKey = `${dayNum}/${month + 1}/${year}`;
        daysquare.innerText = dayNum;

        // Highlight today's date
        const today = new Date();
        if (dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          daysquare.classList.add("today");
        }

        const dayEvents = getEventsByDate(dateKey);
        if (dayEvents.length > 0) {
          dayEvents.forEach((event) => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");

            const vacationNames = [
              "Herfstvakantie",
              "Kerstvakantie",
              "Voorjaarsvakantie",
              "Pasen",
              "Meivakantie",
              "Pinksteren",
              "Zomervakantie",
            ];
            
            if (vacationNames.includes(event.title)) {
              eventDiv.classList.add("vacation");
            } else if (event.isHoliday) {
              eventDiv.classList.add("holiday");
            }

            eventDiv.innerText = event.title;
            daysquare.appendChild(eventDiv);
          });
        }

        daysquare.addEventListener("click", () => openModalForDate(dateKey));
      } else {
        daysquare.classList.add("padding");
      }

      calendar.appendChild(daysquare);
    }
  }

  // Update focus metrics
  updateFocusMetrics();
}

// Update focus metrics display
function updateFocusMetrics() {
  const data = getCurrentMonthData();
  const metricBoxes = document.querySelectorAll(".metric-box");

  if (metricBoxes.length >= 1) {
    const eventCountValue = metricBoxes[0].querySelector(".metric-value");
    if (eventCountValue) {
      eventCountValue.textContent = data.eventCount;
    }
  }
}

// Navigate to today
function goToToday() {
  nav = 0;
  loadCalendar();
}

// Navigate to next month
function nextMonth() {
  nav++;
  loadCalendar();
}

// Navigate to previous month
function previousMonth() {
  nav--;
  loadCalendar();
}
