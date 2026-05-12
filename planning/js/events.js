// Event Management Module
// Handles event creation, deletion, and localStorage management

let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

// Add event to the events array
function addEvent(date, title, eventType = {}) {
  events.push({
    date: date,
    title: title,
                categoryId: null,
    ...eventType,
  });
  saveEventsToStorage();
}

// Delete event by index
function deleteEventByIndex(eventIndex) {
  if (eventIndex !== -1) {
    events.splice(eventIndex, 1);
    saveEventsToStorage();
  }
}

// Find event index by date
function findEventByDate(dateKey) {
  return events.findIndex((e) => e.date === dateKey);
}

// Get events for a specific date
function getEventsByDate(dateKey) {
  return events.filter((e) => e.date === dateKey);
}

// Get events for a specific month
function getEventsByMonth(month, year) {
  return events.filter((e) => {
    const [day, eventMonth, eventYear] = e.date.split("/").map(Number);
    return eventMonth === month + 1 && eventYear === year;
  });
}

// Save events to localStorage
function saveEventsToStorage() {
  localStorage.setItem("events", JSON.stringify(events));
}

// Clear all events
function clearEvents() {
  events = [];
  saveEventsToStorage();
}

// Fetch Netherlands public holidays from API
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
        addEvent(`${day}/${month}/${year}`, holiday.name, { isHoliday: true });
      }
    });
  } catch (error) {
    console.error("Error fetching Netherlands holidays:", error);
  }
}
