// Schedule Module
// Displays all events in a list view organized by month

function loadScheduleView() {
  const scheduleList = document.getElementById("scheduleList");
  if (!scheduleList) return;

  scheduleList.innerHTML = "";

  // Get all events sorted by date
  const sortedEvents = [...events].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
  });

  if (sortedEvents.length === 0) {
    scheduleList.innerHTML =
      '<div class="no-events"><p>No events scheduled</p></div>';
    return;
  }

  // Group events by month and year
  const groupedByMonth = {};
  sortedEvents.forEach((event) => {
    const [day, month, year] = event.date.split("/").map(Number);
    const monthYearKey = `${year}-${String(month).padStart(2, "0")}`;
    
    if (!groupedByMonth[monthYearKey]) {
      groupedByMonth[monthYearKey] = {};
    }
    
    if (!groupedByMonth[monthYearKey][event.date]) {
      groupedByMonth[monthYearKey][event.date] = [];
    }
    
    groupedByMonth[monthYearKey][event.date].push(event);
  });

  // Render months and events
  Object.keys(groupedByMonth)
    .sort()
    .forEach((monthYearKey) => {
      const [year, month] = monthYearKey.split("-").map(Number);
      const monthDate = new Date(year, month - 1, 1);
      const monthName = monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      // Create month section
      const monthSection = document.createElement("div");
      monthSection.classList.add("schedule-month-section");
      monthSection.innerHTML = `
        <div class="schedule-month-header">
          <h2>${monthName}</h2>
          <span class="month-event-count">${
            Object.values(groupedByMonth[monthYearKey])
              .reduce((sum, dates) => sum + dates.length, 0)
          } events</span>
        </div>
      `;

      const monthContent = document.createElement("div");
      monthContent.classList.add("schedule-month-content");

      // Render dates within month
      Object.keys(groupedByMonth[monthYearKey])
        .sort((a, b) => {
          const [dayA] = a.split("/").map(Number);
          const [dayB] = b.split("/").map(Number);
          return dayA - dayB;
        })
        .forEach((dateKey) => {
          const [day, monthNum, yearNum] = dateKey.split("/").map(Number);
          const dateObj = new Date(yearNum, monthNum - 1, day);
          const formattedDate = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          const dateGroup = document.createElement("div");
          dateGroup.classList.add("schedule-date-group");
          dateGroup.innerHTML = `<h3 class="schedule-date">${formattedDate}</h3>`;

          const eventsList = document.createElement("div");
          eventsList.classList.add("schedule-events");

          groupedByMonth[monthYearKey][dateKey].forEach((event) => {
            const eventEl = document.createElement("div");
            eventEl.classList.add("schedule-event");

            if (event.isHoliday) {
              eventEl.classList.add("event-holiday");
            } else {
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
                eventEl.classList.add("event-vacation");
              }
            }

            eventEl.innerHTML = `
              <div class="schedule-event-content">
                <span class="schedule-event-title">${event.title}</span>
                <span class="schedule-event-type">${
                  event.isHoliday ? "Holiday" : "Event"
                }</span>
              </div>
              <button class="event-delete-btn" onclick="deleteScheduleEvent('${dateKey}', '${event.title.replace(
              /'/g,
              "\\'"
            )}')">
                <span class="material-symbols-outlined">close</span>
              </button>
            `;

            eventsList.appendChild(eventEl);
          });

          dateGroup.appendChild(eventsList);
          monthContent.appendChild(dateGroup);
        });

      monthSection.appendChild(monthContent);
      scheduleList.appendChild(monthSection);
    });
}

function deleteScheduleEvent(dateKey, title) {
  const eventIndex = events.findIndex(
    (e) => e.date === dateKey && e.title === title
  );
  if (eventIndex !== -1) {
    deleteEventByIndex(eventIndex);
    
    // Reload current view based on active navigation
    const activeNav = document.querySelector(".nav-item.active");
    if (activeNav) {
      const currentView = activeNav.dataset.view;
      switch(currentView) {
        case 'schedule':
          loadScheduleView();
          break;
        case 'day':
          if (typeof loadDayView === 'function') loadDayView();
          break;
        case 'events':
          if (typeof loadEventsListView === 'function') loadEventsListView();
          break;
        case 'months':
          loadCalendar();
          updateFocusMetrics();
          break;
      }
    } else {
      // Mobile view - check bottom nav
      const activeBottomNav = document.querySelector(".bottom-nav-item.active");
      if (activeBottomNav && activeBottomNav.dataset.view === 'day') {
        if (typeof loadDayView === 'function') loadDayView();
      } else if (activeBottomNav && activeBottomNav.dataset.view === 'events') {
        if (typeof loadEventsListView === 'function') loadEventsListView();
      } else if (activeBottomNav && activeBottomNav.dataset.view === 'months') {
        loadCalendar();
      }
    }
    
    // Update profile stats
    if (typeof loadProfileView === 'function') loadProfileView();
  }
}

function initScheduleView() {
  const scheduleSearch = document.getElementById("scheduleSearch");
  if (scheduleSearch) {
    scheduleSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const scheduleList = document.getElementById("scheduleList");
      const eventElements = scheduleList.querySelectorAll(".schedule-event");
      const dateGroups = scheduleList.querySelectorAll(".schedule-date-group");
      const monthSections = scheduleList.querySelectorAll(
        ".schedule-month-section"
      );

      // Show/hide events based on search
      eventElements.forEach((el) => {
        const title = el
          .querySelector(".schedule-event-title")
          .textContent.toLowerCase();
        el.style.display = title.includes(searchTerm) ? "flex" : "none";
      });

      // Hide empty date groups
      dateGroups.forEach((group) => {
        const visibleEvents = group.querySelectorAll(
          ".schedule-event:not([style*='display: none'])"
        );
        group.style.display = visibleEvents.length > 0 ? "flex" : "none";
      });

      // Hide empty month sections
      monthSections.forEach((section) => {
        const visibleDateGroups = section.querySelectorAll(
          ".schedule-date-group:not([style*='display: none'])"
        );
        section.style.display = visibleDateGroups.length > 0 ? "block" : "none";
      });
    });
  }

  const scheduleSort = document.getElementById("scheduleSort");
  if (scheduleSort) {
    scheduleSort.addEventListener("change", (e) => {
      const sortType = e.target.value;
      // Sort functionality can be expanded here
      loadScheduleView();
    });
  }
}
