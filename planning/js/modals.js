// Modal Management Module
// Handles modal opening, closing, and event management

let clicked = null;

const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");

// Open modal for specific date
function openModalForDate(date) {
  clicked = date;
  const dayEvents = getEventsByDate(clicked);

  if (dayEvents.length > 0) {
    // Show delete/view modal
    if (deleteEventModal) {
      deleteEventModal.style.display = "block";
    }
    if (backDrop) {
      backDrop.style.display = "block";
    }

    const eventTextEl = document.getElementById("eventText");
    if (eventTextEl) {
      eventTextEl.innerHTML = dayEvents
        .map(
          (event, idx) => {
            const categoryName = event.categoryId
              ? categories.find((c) => c.id === event.categoryId)?.name
              : "Uncategorized";
            return `<div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #333;">
          <strong>${event.title}</strong>
          <div style="font-size: 0.85rem; color: #999; margin-top: 4px;">Category: ${categoryName}</div>
          <div style="font-size: 0.85rem; color: #999;">Event ${
            idx + 1
          } of ${dayEvents.length}</div>
        </div>`;
          }
        )
        .join("");
    }
  } else {
    // Show new event modal
    if (newEventModal) {
      newEventModal.style.display = "block";
    }
    if (backDrop) {
      backDrop.style.display = "block";
    }
    
    // Populate category select
    const categorySelect = document.getElementById("eventCategorySelect");
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">Select Category (Optional)</option>';
      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    }
    
    if (eventTitleInput) {
      eventTitleInput.focus();
    }
  }
}

// Close all modals
function closeModal() {
  if (eventTitleInput) {
    eventTitleInput.classList.remove("error");
    eventTitleInput.value = "";
  }
  if (newEventModal) {
    newEventModal.style.display = "none";
  }
  if (deleteEventModal) {
    deleteEventModal.style.display = "none";
  }
  if (backDrop) {
    backDrop.style.display = "none";
  }
  clicked = null;
  loadCalendar();
}

// Save new event
function saveModal() {
  if (eventTitleInput && eventTitleInput.value) {
    eventTitleInput.classList.remove("error");
    
    const categorySelect = document.getElementById("eventCategorySelect");
    const selectedCategoryId = categorySelect ? categorySelect.value : null;
    
    addEvent(clicked, eventTitleInput.value, {
      categoryId: selectedCategoryId || null,
    });
    closeModal();
  } else if (eventTitleInput) {
    eventTitleInput.classList.add("error");
  }
}

// Delete event
function deleteEvent() {
  const eventIndex = findEventByDate(clicked);
  deleteEventByIndex(eventIndex);
  closeModal();
}

// Handle backdrop click
function initializeBackdropListener() {
  if (backDrop) {
    backDrop.addEventListener("click", (e) => {
      if (e.target === backDrop) {
        closeModal();
      }
    });
  }
}
