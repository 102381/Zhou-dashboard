// Vacations and Events Initialization Module
// Handles setup of vacations, recurring events, and holidays

function initializeVacationsAndEvents() {
  // Don't re-initialize if events already exist
  if (events.length > 0) return;

  const vacations = [
    { name: "Herfstvakantie", start: "2026-10-17", end: "2026-10-25" },
    { name: "Kerstvakantie", start: "2026-12-19", end: "2027-01-03" },
    { name: "Voorjaarsvakantie", start: "2027-02-20", end: "2027-02-28" },
    { name: "Pasen", start: "2027-03-26", end: "2027-03-29" },
    { name: "Meivakantie", start: "2027-04-24", end: "2027-05-09" },
    { name: "Pinksteren", start: "2027-05-17", end: "2027-05-17" },
    { name: "Zomervakantie", start: "2027-07-17", end: "2027-08-29" },
  ];

  // Add vacation events
  vacations.forEach((vacation) => {
    const start = new Date(vacation.start);
    const end = new Date(vacation.end);

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      addEvent(`${day}/${month}/${year}`, vacation.name);
    }
  });

  // Add recurring events - Online les every Wednesday
  for (
    let date = new Date("2026-01-01");
    date <= new Date("2027-12-31");
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() === 3) {
      // Wednesday = 3
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      addEvent(`${day}/${month}/${year}`, "Online les");
    }
  }

  // Add recurring events - Blink meetup every Friday
  for (
    let date = new Date("2026-01-01");
    date <= new Date("2027-12-31");
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() === 5) {
      // Friday = 5
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      addEvent(`${day}/${month}/${year}`, "Blink meetup");
    }
  }

  saveEventsToStorage();

  // Fetch and add Netherlands public holidays
  fetchNetherlandsHolidays();
}
