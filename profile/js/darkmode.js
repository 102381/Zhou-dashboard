const storageKey = "zhou-user-settings";

const displayNameInput = document.getElementById("displayName");
const emailInput = document.getElementById("email");
const profileImageInput = document.getElementById("profileImage");
const darkModeToggle = document.getElementById("darkModeToggle");
const themeNote = document.getElementById("themeNote");
const sidebarName = document.getElementById("sidebarName");
const resetThemeBtn = document.getElementById("resetThemeBtn");
const clearProfileBtn = document.getElementById("clearProfileBtn");

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (error) {
    return {};
  }
}

function saveSettings(nextSettings) {
  localStorage.setItem(storageKey, JSON.stringify(nextSettings));
}

function applyTheme(isDark) {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light",
  );
  darkModeToggle.checked = isDark;
  themeNote.textContent = isDark
    ? "Theme is set to dark mode."
    : "Theme is set to light mode.";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function applyProfile(name, email) {
  displayNameInput.value = name;
  emailInput.value = email;
  sidebarName.textContent = name || "zero";
  saveSettings({
    ...loadSettings(),
    displayName: name,
    email: email,
  });
}

const stored = loadSettings();
displayNameInput.value = stored.displayName || "zero";
emailInput.value = stored.email || "zero@example.com";
sidebarName.textContent = stored.displayName || "zero";

// Load theme from localStorage or use stored setting
const savedTheme = localStorage.getItem("theme");
const isDarkMode = savedTheme !== "light" && savedTheme === "dark";
applyTheme(isDarkMode);

// Sync theme across all pages
function syncThemeGlobally(isDark) {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light",
  );
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

displayNameInput.addEventListener("input", function () {
  sidebarName.textContent = this.value.trim() || "zero";
  saveSettings({
    ...loadSettings(),
    displayName: this.value,
    email: emailInput.value,
  });
});

emailInput.addEventListener("input", function () {
  saveSettings({
    ...loadSettings(),
    displayName: displayNameInput.value,
    email: this.value,
  });
});

darkModeToggle.addEventListener("change", function () {
  applyTheme(this.checked);
  syncThemeGlobally(this.checked);
});

profileImageInput.addEventListener("input", function () {
  saveSettings({
    ...loadSettings(),
    profileImage: this.value,
  });
});
