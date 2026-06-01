const filterButtons = document.querySelectorAll(".filter-btn");
const albumCards = document.querySelectorAll(".album-card");
const albumCount = document.getElementById("album-count");

function updateAlbums(category) {
  let visibleCount = 0;

  albumCards.forEach(function (card) {
    const match = category === "all" || card.dataset.category === category;
    card.classList.toggle("hidden", !match);

    if (match) {
      visibleCount += 1;
    }
  });

  albumCount.textContent = "Showing " + visibleCount + " albums";
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const category = button.dataset.category;

    filterButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    updateAlbums(category);
  });
});

updateAlbums("all");
