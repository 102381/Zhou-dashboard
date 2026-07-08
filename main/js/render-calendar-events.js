// Load user settings from localStorage (set in settings.html)
const html = document.documentElement;

function applySettings() {
  const sidebarName = document.getElementById("sidebarName");
  const sidebarAvatar = document.getElementById("sidebarAvatar");
  if (!sidebarName || !sidebarAvatar) return;

  const settings = JSON.parse(
    localStorage.getItem("zhou-user-settings") || "{}",
  );
  const theme = localStorage.getItem("theme") || "dark";

  html.setAttribute("class", theme);
  sidebarName.textContent = settings.displayName || "user";
  if (settings.profileImage) {
    sidebarAvatar.src = settings.profileImage;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applySettings();

  if (typeof initializeVactionsAndEvents === "function") {
    initializeVactionsAndEvents();
  }

  loadAgendaEvents();
});

// Load and display upcoming events from the calendar app
function loadAgendaEvents() {
  const agendaList = document.getElementById("agendaEventsList");
  if (!agendaList) return;

  // Get events from localStorage (shared with planning app)
  const events = localStorage.getItem("events")
    ? JSON.parse(localStorage.getItem("events"))
    : [];

  if (events.length === 0) {
    agendaList.innerHTML =
      '<p class="text-xs text-secondary text-center py-4">No upcoming events</p>';
    return;
  }

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter for upcoming events (today and future)
  const upcomingEvents = events.filter((event) => {
    const [day, month, year] = event.date.split("/").map(Number);
    const eventDate = new Date(year, month - 1, day);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  // Sort by date
  upcomingEvents.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
  });

  // Limit to next 5 events
  const limitedEvents = upcomingEvents.slice(0, 5);

  if (limitedEvents.length === 0) {
    agendaList.innerHTML =
      '<p class="text-xs text-secondary text-center py-4">No upcoming events</p>';
    return;
  }

  // Render events
  agendaList.innerHTML = limitedEvents
    .map((event, index) => {
      const [day, month, year] = event.date.split("/").map(Number);
      const eventDate = new Date(year, month - 1, day);
      const monthName = eventDate
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase();
      const isFirstEvent = index === 0;
      const borderClass = isFirstEvent
        ? "border-primary"
        : "border-outline-variant";

      return `
              <div class="p-4 bg-surface-container rounded-xl flex gap-4 items-center border-l-4 ${borderClass}">
                <div class="text-center min-w-[48px]">
                  <p class="text-[10px] font-bold uppercase">${monthName}</p>
                  <p class="text-h2 font-bold leading-none">${day}</p>
                </div>
                <div>
                  <h4 class="font-bold text-body-md">${event.title}</h4>
                  <p class="text-xs text-secondary">${year}</p>
                </div>
              </div>
            `;
    })
    .join("");
}

// Listen for storage changes (when events are added/deleted in the planning app)
window.addEventListener("storage", (e) => {
  if (e.key === "events") {
    loadAgendaEvents();
  }
});
