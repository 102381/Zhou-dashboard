let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Fetch Netherlands public holidays
async function fetchNetherlandsHolidays() {
  try {
    const response = await fetch(
      "https://openholidaysapi.org/PublicHolidays?countryIsoCode=NL&languageIsoCode=en"
    );
    const holidays = await response.json();

    holidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const exists = events.some(
        (e) => e.date === `${day}/${month}/${year}` && e.title === holiday.name
      );
      if (!exists) {
        events.push({
          date: `${day}/${month}/${year}`,
          title: holiday.name,
          isHoliday: true,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching Netherlands holidays:", error);
  }
}

// current month data
function getCurrentMonthData() {
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const month = dt.getMonth();
  const year = dt.getFullYear();

  const monthEvents = events.filter((e) => {
    const [day, eventMonth, eventYear] = e.date.split("/").map(Number);
    return eventMonth === month + 1 && eventYear === year;
  });

  return {
    eventCount: monthEvents.length,
    month,
    year,
  };
}

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

function openModal(date) {
  clicked = date;
  const dayEvents = events.filter((e) => e.date == clicked);

  if (dayEvents.length > 0) {
    deleteEventModal.style.display = "block";
    backDrop.style.display = "block";

    const eventTextEl = document.getElementById("eventText");
    eventTextEl.innerHTML = dayEvents
      .map(
        (event, idx) =>
          `<div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333;">
        <strong>${event.title}</strong>
        <div style="font-size: 0.85rem; color: #999; margin-top: 4px;">Event ${
          idx + 1
        } of ${dayEvents.length}</div>
      </div>`
      )
      .join("");
  } else {
    newEventModal.style.display = "block";
    backDrop.style.display = "block";
  }
}

function load() {
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

  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-us",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daysquare = document.createElement("div");
    daysquare.classList.add("day");

    if (i > paddingDays) {
      const dayNum = i - paddingDays;
      const dateKey = `${dayNum}/${month + 1}/${year}`;
      daysquare.innerText = dayNum;

      const dayEvents = events.filter((e) => e.date === dateKey);
      if (dayEvents.length > 0) {
        dayEvents.forEach((event) => {
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event");

          const vacationNames = [
            "lerfstvakantie",
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

      daysquare.addEventListener("click", () => openModal(dateKey));
    } else {
      daysquare.classList.add("padding");
    }

    calendar.appendChild(daysquare);
  }

  // Update calendar
  updateFocusMetrics();
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveModal() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  // Delete only the first
  const eventIndex = events.findIndex((e) => e.date === clicked);
  if (eventIndex !== -1) {
    events.splice(eventIndex, 1);
    localStorage.setItem("events", JSON.stringify(events));
  }
  closeModal();
}

function goToToday() {
  nav = 0;
  load();
}

function initButtons() {
  // Navigation buttons
  const nextBtn = document.getElementById("nextButton");
  const backBtn = document.getElementById("backButton");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nav++;
      load();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      nav--;
      load();
    });
  }

  // Today button
  const todayBtn = document.querySelector(".today-btn");
  if (todayBtn) {
    todayBtn.addEventListener("click", goToToday);
  }

  // buttons
  const saveBtn = document.getElementById("saveButton");
  const cancelBtn = document.getElementById("cancelButton");
  const closeBtn = document.getElementById("closeButton");
  const deleteBtn = document.getElementById("deleteButton");

  if (saveBtn) saveBtn.addEventListener("click", saveModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (deleteBtn) deleteBtn.addEventListener("click", deleteEvent);

  // New Event buttons (sidebar)
  const newEventBtns = document.querySelectorAll(".new-event-btn, .fab");
  newEventBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Find today's date
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      clicked = `${day}/${month}/${year}`;

      newEventModal.style.display = "block";
      backDrop.style.display = "block";
      eventTitleInput.focus();
    });
  });

  // Backdrop click to close
  if (backDrop) {
    backDrop.addEventListener("click", (e) => {
      if (e.target === backDrop) {
        closeModal();
      }
    });
  }
}

function initializeVacationsAndEvents() {
  if (events.length > 0) return;

  const vacations = [
    { name: "Herfstvakantie", start: "2026-10-17", end: "2026-10-25" },
    { name: "Kerstvakantie", start: "2026-12-19", end: "2027-01-03" },
    { name: "Voorjaarsvakantie", start: "2027-02-20", end: "2027-02-28" },
    { name: "Pasen", start: "2027-03-26", end: "2027-03-29" },
    { name: "Meivakantie", start: "2027-04-24", end: "2027-05-09" },
    { name: "Pinksteren", start: "2027-05-17", end: "2027-05-17" },
    { name: "Zomervakantie", start: "2027-07-17", end: "2027-08-29" },
  ];

  vacations.forEach((vacation) => {
    const start = new Date(vacation.start);
    const end = new Date(vacation.end);

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      events.push({
        date: `${day}/${month}/${year}`,
        title: vacation.name,
      });
    }
  });

  for (
    let date = new Date("2026-01-01");
    date <= new Date("2027-12-31");
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() === 3) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      events.push({
        date: `${day}/${month}/${year}`,
        title: "Online les",
      });
    }
  }

  for (
    let date = new Date("2026-01-01");
    date <= new Date("2027-12-31");
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() === 5) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      events.push({
        date: `${day}/${month}/${year}`,
        title: "Blink meetup",
      });
    }
  }

  localStorage.setItem("events", JSON.stringify(events));
  fetchNetherlandsHolidays();
}

initializeVacationsAndEvents();
initButtons();
load();
