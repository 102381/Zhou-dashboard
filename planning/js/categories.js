// Categories Module
// Manages event categories and tagging system

let categories = localStorage.getItem("categories")
  ? JSON.parse(localStorage.getItem("categories"))
  : [];

const defaultCategories = [
  { id: "vacation", name: "Vacation", color: "#FF6B6B" },
  { id: "holiday", name: "Holiday", color: "#FFD93D" },
  { id: "work", name: "Work", color: "#6BCB77" },
  { id: "personal", name: "Personal", color: "#4D96FF" },
  { id: "meeting", name: "Meeting", color: "#A78BFA" },
];

function initCategories() {
  if (categories.length === 0) {
    categories = [...defaultCategories];
    saveCategoriesToStorage();
  }
}

function saveCategoriesToStorage() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function addCategory(name, color) {
  const id = name.toLowerCase().replace(/\s+/g, "-");
  categories.push({
    id,
    name,
    color,
  });
  saveCategoriesToStorage();
}

function deleteCategory(categoryId) {
  categories = categories.filter((c) => c.id !== categoryId);
  saveCategoriesToStorage();
}

function getCategoryColor(categoryName) {
  const category = categories.find((c) => c.name === categoryName);
  return category ? category.color : "#ffffff";
}

function loadCategoriesView() {
  const categoriesList = document.getElementById("categoriesList");
  if (!categoriesList) return;

  categoriesList.innerHTML = "";

  categories.forEach((category) => {
    // Get events for this category
    const categoryEvents = events.filter((e) => e.categoryId === category.id);

    const categoryEl = document.createElement("div");
    categoryEl.classList.add("category-item");

    categoryEl.innerHTML = `
      <div class="category-header">
        <div class="category-color" style="background-color: ${category.color}"></div>
        <div class="category-info">
          <h3>${category.name}</h3>
          <p>${categoryEvents.length} event${categoryEvents.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div class="category-actions">
        <button class="edit-category-btn" onclick="editCategory('${category.id}')">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="delete-category-btn" onclick="deleteFromCategories('${category.id}')">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;

    // Add events list if there are events
    if (categoryEvents.length > 0) {
      const eventsList = document.createElement("div");
      eventsList.classList.add("category-events-list");

      categoryEvents.forEach((event) => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("category-event-item");
        eventItem.innerHTML = `
          <span>${event.title}</span>
          <small>${event.date}</small>
        `;
        eventsList.appendChild(eventItem);
      });

      categoryEl.appendChild(eventsList);
    }

    categoriesList.appendChild(categoryEl);
  });
}

function deleteFromCategories(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    deleteCategory(categoryId);
    loadCategoriesView();
  }
}

function editCategory(categoryId) {
  const category = categories.find((c) => c.id === categoryId);
  if (category) {
    const modal = document.getElementById("categoryModal");
    const nameInput = document.getElementById("categoryNameInput");
    const colorInput = document.getElementById("categoryColorInput");

    nameInput.value = category.name;
    colorInput.value = category.color;

    // Store the ID for saving
    nameInput.dataset.categoryId = categoryId;

    if (modal) {
      modal.classList.remove("hidden");
      nameInput.focus();
    }
  }
}

function openAddCategoryModal() {
  const modal = document.getElementById("categoryModal");
  const nameInput = document.getElementById("categoryNameInput");

  nameInput.value = "";
  nameInput.dataset.categoryId = null;

  if (modal) {
    modal.classList.remove("hidden");
    nameInput.focus();
  }
}

function closeCategoryModal() {
  const modal = document.getElementById("categoryModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function saveCategoryModal() {
  const nameInput = document.getElementById("categoryNameInput");
  const colorInput = document.getElementById("categoryColorInput");
  const categoryId = nameInput.dataset.categoryId;

  if (!nameInput.value.trim()) {
    alert("Please enter a category name");
    return;
  }

  if (categoryId) {
    // Edit existing
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      category.name = nameInput.value;
      category.color = colorInput.value;
    }
  } else {
    // Add new
    addCategory(nameInput.value, colorInput.value);
  }

  closeCategoryModal();
  loadCategoriesView();
}

function initCategoriesView() {
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", openAddCategoryModal);
  }

  const saveCategoryBtn = document.getElementById("saveCategoryBtn");
  if (saveCategoryBtn) {
    saveCategoryBtn.addEventListener("click", saveCategoryModal);
  }

  const cancelCategoryBtn = document.getElementById("cancelCategoryBtn");
  if (cancelCategoryBtn) {
    cancelCategoryBtn.addEventListener("click", closeCategoryModal);
  }

  // Add keyboard support for category modal
  const categoryNameInput = document.getElementById("categoryNameInput");
  if (categoryNameInput) {
    categoryNameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveCategoryModal();
      }
    });
  }
}
