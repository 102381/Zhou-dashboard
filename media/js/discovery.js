const filterButtons = document.querySelectorAll(".filter-btn");
const albumCards = document.querySelectorAll(".album-card");
const albumCount = document.getElementById("album-count");

// --- Filter logic ---
function updateAlbums(category) {
  let visibleCount = 0;
  albumCards.forEach(function (card) {
    const match = category === "all" || card.dataset.category === category;
    card.classList.toggle("hidden", !match);
    if (match) visibleCount++;
  });
  albumCount.textContent = "Showing " + visibleCount + " albums";
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");
    updateAlbums(button.dataset.category);
  });
});

// --- Inline song list toggle ---
document.querySelectorAll(".open-btn").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const albumId = btn.dataset.album;
    const songList = document.getElementById("songs-" + albumId);
    if (!songList) return;

    const isOpen = songList.classList.contains("open");

    // Close all open lists and reset all buttons
    document.querySelectorAll(".song-list.open").forEach(function (list) {
      list.classList.remove("open");
    });
    document.querySelectorAll(".open-btn.active").forEach(function (b) {
      b.classList.remove("active");
      b.textContent = "Open album";
    });

    // Toggle the clicked one
    if (!isOpen) {
      songList.classList.add("open");
      btn.classList.add("active");
      btn.textContent = "Close";
    }
  });
});

updateAlbums("all");