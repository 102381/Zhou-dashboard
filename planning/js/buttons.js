function initializeButtons() {
  //nav-buttons
  const nextBtn = document.getElementById("nextButton");
  const backBtn = document.getElementById("backButton");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextMonth();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      previousMonth();
    });
  }

  //Today-button
  const todayBtn = document.querySelector(".today-btn");
  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      goToToday();
    });
  }

  //action-buttons
  const saveBtn = document.getElementById("saveButton");
  const cancelBtn = document.getElementById("cancelButton");
  const closeBtn = document.getElementById("closeButton");
  const deleteBtn = document.getElementById("deleteButton");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveModal();
    });
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      closeModal();
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeModal();
    });
  }
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      deleteEvent();
    });
  }

  // New Event buttons (sidebar and FAB)
  const newEventBtns = document.querySelectorAll(".new-event-btn, .fab");
  newEventBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Set clicked to today's date
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      clicked = `${day}/${month}/${year}`;

      // Open new event modal
      if (newEventModal) {
        newEventModal.style.display = "block";
      }
      if (backDrop) {
        backDrop.style.display = "block";
      }
      if (eventTitleInput) {
        eventTitleInput.focus();
      }
    });
  });

  // Sidebar navigation and bottom navigation
  // Now handled by view-switcher module

  // Input field enter key listener
  if (eventTitleInput) {
    eventTitleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveModal();
      }
    });
  }
}
