// Profile View Module
// Displays user profile and statistics

function loadProfileView() {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const totalEventsStat = document.getElementById("totalEventsStat");
  const monthEventsStat = document.getElementById("monthEventsStat");
  const upcomingEventsStat = document.getElementById("upcomingEventsStat");

  if (!profileName || !profileEmail) return;

  // Set profile info (from sidebar or default)
  const sidebarName = document.querySelector(".profile-name");
  const profileNameText = sidebarName
    ? sidebarName.textContent
    : "User Profile";

  profileName.textContent = profileNameText;
  profileEmail.textContent = "Zhou Calendar User";

  // Calculate statistics
  const totalEvents = events.length;

  // Get this month's events
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthEvents = getEventsByMonth(currentMonth - 1, currentYear).length;

  // Get upcoming events (from today onwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter((e) => {
    const [day, month, year] = e.date.split("/").map(Number);
    const eventDate = new Date(year, month - 1, day);
    return eventDate >= today;
  }).length;

  // Update stats
  if (totalEventsStat) totalEventsStat.textContent = totalEvents;
  if (monthEventsStat) monthEventsStat.textContent = monthEvents;
  if (upcomingEventsStat) upcomingEventsStat.textContent = upcomingEvents;
}
