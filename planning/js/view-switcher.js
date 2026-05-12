// View Switcher Module
// Handles switching between different application views

function showView(viewName) {
  // Hide all views
  const allViews = document.querySelectorAll(".view-container");
  allViews.forEach((view) => {
    view.classList.add("hidden");
  });

  // Show selected view
  const viewMap = {
    months: ["months-view", "months-view-focus"],
    schedule: ["schedule-view"],
    categories: ["categories-view"],
    settings: ["settings-view"],
    day: ["day-view"],
    events: ["events-view"],
    profile: ["profile-view"],
  };

  if (viewMap[viewName]) {
    viewMap[viewName].forEach((viewId) => {
      const view = document.getElementById(viewId);
      if (view) {
        view.classList.remove("hidden");
      }
    });
  }

  // Update sidebar navigation items
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.view === viewName) {
      item.classList.add("active");
    }
  });

  // Update bottom navigation items
  const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
  bottomNavItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.view === viewName) {
      item.classList.add("active");
    }
  });

  // Load view-specific content
  switch (viewName) {
    case "day":
      loadDayView();
      break;
    case "events":
      loadEventsListView();
      initEventsListView();
      break;
    case "profile":
      loadProfileView();
      break;
    case "schedule":
      loadScheduleView();
      initScheduleView();
      break;
    case "categories":
      loadCategoriesView();
      initCategoriesView();
      break;
    case "settings":
      loadSettingsView();
      break;
    case "months":
      loadCalendar();
      break;
  }
}

function initViewSwitcher() {
  // Sidebar navigation
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const viewName = item.dataset.view;
      showView(viewName);
    });
  });

  // Bottom navigation
  const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
  bottomNavItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const viewName = item.dataset.view;
      showView(viewName);
    });
  });
}
