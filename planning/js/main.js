// Main App Initialization
// Orchestrates the loading and initialization of all modules

document.addEventListener("DOMContentLoaded", function () {
  // Initialize categories first
  initCategories();

  // Initialize settings
  initSettingsView();

  // Initialize backdrop listener
  initializeBackdropListener();

  // Initialize vacations and recurring events
  initializeVacationsAndEvents();

  // Initialize view switcher
  initViewSwitcher();

  // Initialize all buttons
  initializeButtons();

  // Initialize events list view
  initEventsListView();

  // Load and render calendar (default view)
  loadCalendar();

  // console.log("App initialized successfully");
});
