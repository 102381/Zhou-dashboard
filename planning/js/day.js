// Day View Module
// Shows today's events and schedule

function loadDayView() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const dateKey = `${day}/${month}/${year}`;

  const dayTitle = document.getElementById("dayTitle");
  const dayDate = document.getElementById("dayDate");
  const dayEventsList = document.getElementById("dayEventsList");

  if (!dayTitle || !dayDate || !dayEventsList) return;

  // Set day and date
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  dayTitle.textContent = dayName;
  dayDate.textContent = formattedDate;

  // Get today's events
  const todayEvents = getEventsByDate(dateKey);

  dayEventsList.innerHTML = "";

  if (todayEvents.length === 0) {
    dayEventsList.innerHTML =
      '<div class="no-events"><p>No events today</p></div>';
    return;
  }

  // Render events
  todayEvents.forEach((event, idx) => {
    const eventEl = document.createElement("div");
    eventEl.classList.add("day-event-item");

    const vacationNames = [
      "Herfstvakantie",
      "Kerstvakantie",
      "Voorjaarsvakantie",
      "Pasen",
      "Meivakantie",
      "Pinksteren",
      "Zomervakantie",
    ];

    if (event.isHoliday) {
      eventEl.classList.add("event-holiday");
    } else if (vacationNames.includes(event.title)) {
      eventEl.classList.add("event-vacation");
    }

    eventEl.innerHTML = `
      <div class="day-event-content">
        <h3>${event.title}</h3>
        <p>${event.isHoliday ? "Holiday" : "Event"}</p>
      </div>
      <button class="event-action-btn" onclick="deleteScheduleEvent('${dateKey}', '${event.title.replace(
      /'/g,
      "\\'"
    )}')">
        <span class="material-symbols-outlined">close</span>
      </button>
    `;

    dayEventsList.appendChild(eventEl);
  });
}
