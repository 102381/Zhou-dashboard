const filterButtons = document.querySelectorAll(".filter-btn");
const albumCards = document.querySelectorAll(".album-card");
const albumCount = document.getElementById("album-count");

const QUEUE_KEY = "zhou-media-queue";

const albums = [
  {
    songs: [
      {
        image: "../css/audio/cover/luther-cover.jpg",
        name: "luther",
        artist: "kendrick",
        Audio: "../css/audio/luther-kendrick.mp3",
      },
      {
        image: "../css/audio/cover/luther-cover.jpg",
        name: "i",
        artist: "kendrick",
        Audio: "../css/audio/luther-kendrick.mp3",
      },
    ],
  },
  {
    songs: [
      {
        image: "./css/audio/cover/RHCP-mother's-milk-cover.webp",
        name: "dani california",
        artist: "RHCP",
        Audio: "../css/audio/luther-kendrick.mp3",
      },
      {
        image: "./css/audio/cover/RHCP-mother's-milk-cover.webp",
        name: "under the bridge",
        artist: "RHCP",
        Audio: "../css/audio/luther-kendrick.mp3",
      },
    ],
  },
  {
    songs: [
      {
        image: "../css/audio/cover/Cave-world-viagra-boys-cover.png",
        name: "cave world",
        artist: "Viagra Boys",
        Audio: "../css/audio/viagra-boys.mp3",
      },
      {
        image: "../css/audio/cover/Cave-world-viagra-boys-cover.png",
        name: "release",
        artist: "Viagra Boys",
        Audio: "../css/audio/viagra-boys.mp3",
      },
    ],
  },
];

// --- Queue helpers (localStorage, same key as player.js) ---
function songKey(song) {
  return [song.name, song.artist, song.Audio, song.image].join("|");
}

function loadQueue() {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function addSongsToQueue(newSongs) {
  const queue = loadQueue();
  const existingKeys = new Set(queue.map(songKey));
  let added = 0;
  newSongs.forEach(function (song) {
    if (!existingKeys.has(songKey(song))) {
      queue.push(song);
      existingKeys.add(songKey(song));
      added++;
    }
  });
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {}
  return added;
}

// --- Mark a + button as added ---
function markAdded(el) {
  el.textContent = "✓";
  el.dataset.added = "true";
}

// --- Per-song + buttons ---
document.querySelectorAll(".add-to-queue").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault(); // stop the <a> from navigating
    e.stopPropagation();

    if (btn.dataset.added) return;

    const card = btn.closest(".album-card");
    const albumIndex = parseInt(card.dataset.album, 10);
    const songRow = btn.closest(".song-row");
    const songIndex = Array.from(card.querySelectorAll(".song-row")).indexOf(
      songRow,
    );

    const song = albums[albumIndex]?.songs[songIndex];
    if (!song) return;

    addSongsToQueue([song]);
    markAdded(btn);
  });
});

// --- Per-album + Add album buttons ---
document.querySelectorAll(".add-album-btn").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (btn.dataset.added) return;

    const card = btn.closest(".album-card");
    const albumIndex = parseInt(card.dataset.album, 10);
    const albumSongs = albums[albumIndex]?.songs;
    if (!albumSongs) return;

    addSongsToQueue(albumSongs);
    markAdded(btn);
    btn.textContent = "✓ Added";

    // Also mark all individual song buttons in this album
    card.querySelectorAll(".add-to-queue").forEach(markAdded);
  });
});

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
    filterButtons.forEach(function (item) {
      item.classList.remove("active");
    });
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

    document.querySelectorAll(".song-list.open").forEach(function (list) {
      list.classList.remove("open");
    });
    document.querySelectorAll(".open-btn.active").forEach(function (b) {
      b.classList.remove("active");
      b.textContent = "Open album";
    });

    if (!isOpen) {
      songList.classList.add("open");
      btn.classList.add("active");
      btn.textContent = "Close";
    }
  });
});

updateAlbums("all");
