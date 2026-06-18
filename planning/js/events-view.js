// Events List View Module
// Shows all events in a simple list format
function searchEvents(searchTerm) {
  searchTerm = searchTerm.toLowerCase();

  return events.filter((event) => {
    const titleMatch = event.title.toLowerCase().includes(searchTerm);

    const categoryMatch =
      event.categoryId && event.categoryId.toLowerCase().includes(searchTerm);

    const holidayMatch = searchTerm === "holiday" && event.isHoliday;

    const vacationMatch =
      searchTerm === "vacation" &&
      [
        "Herfstvakantie",
        "Kerstvakantie",
        "Voorjaarsvakantie",
        "Pasen",
        "Meivakantie",
        "Pinksteren",
        "Zomervakantie",
      ].includes(event.title);

    return titleMatch || categoryMatch || holidayMatch || vacationMatch;
  });
}

function loadEventsListView() {
  const eventsList = document.getElementById("eventsList");
  if (!eventsList) return;

  eventsList.innerHTML = "";

  // Get all events sorted by date
  const sortedEvents = [...events].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
  });

  if (sortedEvents.length === 0) {
    eventsList.innerHTML =
      '<div class="no-events"><p>No events scheduled</p></div>';
    return;
  }

  // Render all events
  sortedEvents.forEach((event) => {
    const [day, month, year] = event.date.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const eventEl = document.createElement("div");
    eventEl.classList.add("events-list-item");

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
      <div class="events-list-item-content">
        <h3>${event.title}</h3>
        <p>${formattedDate}</p>
      </div>
      <button class="event-action-btn" onclick="deleteScheduleEvent('${event.date}', '${event.title.replace(
        /'/g,
        "\\'",
      )}')">
        <span class="material-symbols-outlined">close</span>
      </button>
    `;

    eventsList.appendChild(eventEl);
  });
}

function initEventsListView() {
  const eventsSearch = document.getElementById("searchbar");  
  if (eventsSearch) {
    eventsSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const eventsList = document.getElementById("eventsList");
      const eventElements = eventsList.querySelectorAll(".events-list-item");

      eventElements.forEach((el) => {
        const title = el.querySelector("h3").textContent.toLowerCase();
        el.style.display = title.includes(searchTerm) ? "flex" : "none";
      });
      
    });
  }
  
}
