// Settings Module
// Manages application settings and preferences

const DEFAULT_SETTINGS = {
  weekStart: "sunday",
  notifications: true,
  reminderTime: 15,
};

let settings = localStorage.getItem("settings")
  ? JSON.parse(localStorage.getItem("settings"))
  : DEFAULT_SETTINGS;

function saveSettingsToStorage() {
  localStorage.setItem("settings", JSON.stringify(settings));
}

function updateSetting(key, value) {
  settings[key] = value;
  saveSettingsToStorage();
}

function getSetting(key) {
  return settings[key] !== undefined ? settings[key] : DEFAULT_SETTINGS[key];
}

function exportData() {
  const data = {
    events: events,
    categories: categories,
    settings: settings,
    exportDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `zhou-calendar-backup-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (data.events) events = data.events;
        if (data.categories) categories = data.categories;
        if (data.settings) settings = data.settings;

        saveEventsToStorage();
        saveCategoriesToStorage();
        saveSettingsToStorage();

        alert("Data imported successfully!");
        location.reload();
      } catch (error) {
        alert("Error importing data: " + error.message);
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

function clearAllData() {
  if (
    confirm(
      "Are you sure you want to delete all data? This cannot be undone."
    )
  ) {
    clearEvents();
    categories = [...defaultCategories];
    settings = DEFAULT_SETTINGS;

    saveEventsToStorage();
    saveCategoriesToStorage();
    saveSettingsToStorage();

    alert("All data has been cleared!");
    location.reload();
  }
}

function loadSettingsView() {
  // Week start select
  const weekStartSelect = document.getElementById("weekStartSelect");
  if (weekStartSelect) {
    weekStartSelect.value = getSetting("weekStart");
    weekStartSelect.addEventListener("change", () => {
      updateSetting("weekStart", weekStartSelect.value);
    });
  }

  // Notifications toggle
  const notificationsToggle = document.getElementById("notificationsToggle");
  if (notificationsToggle) {
    notificationsToggle.checked = getSetting("notifications");
    notificationsToggle.addEventListener("change", () => {
      updateSetting("notifications", notificationsToggle.checked);
    });
  }

  // Reminder time input
  const reminderTime = document.getElementById("reminderTime");
  if (reminderTime) {
    reminderTime.value = getSetting("reminderTime");
    reminderTime.addEventListener("change", () => {
      updateSetting("reminderTime", parseInt(reminderTime.value));
    });
  }

  // Export button
  const exportDataBtn = document.getElementById("exportDataBtn");
  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", exportData);
  }

  // Import button
  const importDataBtn = document.getElementById("importDataBtn");
  if (importDataBtn) {
    importDataBtn.addEventListener("click", importData);
  }

  // Clear data button
  const clearDataBtn = document.getElementById("clearDataBtn");
  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", clearAllData);
  }
}

function initSettingsView() {
  loadSettingsView();
}
