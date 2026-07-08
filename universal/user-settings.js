const sidebarName = document.getElementById("sidebarName");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const htmlEl = document.documentElement;

function applySyncedSettings() {
  const settings = JSON.parse(
    localStorage.getItem("zhou-user-settings") || "{}",
  );
  const theme = localStorage.getItem("theme") || "dark";

  sidebarName.textContent = settings.displayName || "temp";
  if (settings.profileImage) {
    sidebarAvatar.src = settings.profileImage;
  }
  htmlEl.setAttribute("class", theme);
}

applySyncedSettings();
window.addEventListener("storage", applySyncedSettings);
