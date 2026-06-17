// UI and controls are initialized after DOM is ready to ensure IDs exist
let shuffleMode = false;
let repeatMode = false;
let queueMode = false;

const queueStorageKey = "zhou-media-queue";

// Top-level songs list
const defaultSongs = [
  {
    image: "./css/audio/cover/luther-cover.jpg",
    name: "luther",
    artist: "kendrick",
    Audio: "./css/audio/luther-kendrick.mp3",
  },
  {
    image: "./css/audio/cover/RHCP-mother's-milk-cover.webp",
    name: "Mother's Milk",
    artist: "Red Hot Chili Peppers",
    Audio: "./css/audio/luther-kendrick.mp3",
  },
  {
    image: "./css/audio/cover/Cave-world-viagra-boys-cover.png",
    name: "Cave World",
    artist: "Viagra Boys",
    Audio: "./css/audio/viagra-boys.mp3",
  },
  {
    image: "./css/audio/cover/nevermind-nirvana-album-cover.jpg",
    name: "Nevermind",
    artist: "Nirvana",
    Audio: "./css/audio/luther-kendrick.mp3",
  },
];

function songKey(song) {
  return [song.name, song.artist, song.Audio, song.image].join("|");
}

function findSongIndex(targetSong) {
  return songs.findIndex(function (song) {
    return songKey(song) === songKey(targetSong);
  });
}

function loadQueue() {
  try {
    const storedQueue = localStorage.getItem(queueStorageKey);
    if (!storedQueue) return [];

    const parsedQueue = JSON.parse(storedQueue);
    return Array.isArray(parsedQueue) ? parsedQueue : [];
  } catch (e) {
    return [];
  }
}

function saveQueue(queue) {
  try {
    localStorage.setItem(queueStorageKey, JSON.stringify(queue));
  } catch (e) {
    // ignore storage errors
  }
}

function setQueue(queue) {
  songs = queue.slice();
  saveQueue(songs);
}

function addToQueue(newSongs) {
  let addedCount = 0;

  newSongs.forEach(function (song) {
    const exists = songs.some(function (queuedSong) {
      return songKey(queuedSong) === songKey(song);
    });

    if (!exists) {
      songs.push(song);
      addedCount += 1;
    }
  });

  saveQueue(songs);
  return addedCount;
}

let songs = loadQueue();

if (songs.length === 0) {
  songs = defaultSongs.slice();
  saveQueue(songs);
}

//album data
const albums = [
  {
    title: "GNX",
    artist: "Kendrick Lamar",
    image: "./css/audio/cover/luther-cover.jpg",
    songs: [
      {
        image: "./css/audio/cover/luther-cover.jpg",
        name: "luther",
        artist: "kendrick",
        Audio: "./css/audio/luther-kendrick.mp3",
      },
      {
        image: "./css/audio/cover/luther-cover.jpg",
        name: "afterglow",
        artist: "kendrick",
        Audio: "./css/audio/luther-kendrick.mp3",
      },
    ],
  },
  {
    title: "mother's milk",
    artist: "Red Hot Chili Peppers",
    image: "./css/audio/cover/RHCP-mother's-milk-cover.webp",
    songs: [
      {
        image: "./css/audio/cover/RHCP-mother's-milk-cover.webp",
        name: "dani california",
        artist: "RHCP",
        Audio: "./css/audio/luther-kendrick.mp3",
      },
      {
        image: "./css/audio/cover/RHCP-mother's-milk-cover.webp",
        name: "under the bridge",
        artist: "RHCP",
        Audio: "./css/audio/luther-kendrick.mp3",
      },
    ],
  },
  {
    title: "Cave world",
    artist: "Viagra Boys",
    image: "./css/audio/cover/Cave-world-viagra-boys-cover.png",
    songs: [
      {
        image: "./css/audio/cover/Cave-world-viagra-boys-cover.png",
        name: "cave world",
        artist: "Viagra Boys",
        Audio: "./css/audio/viagra-boys.mp3",
      },
      {
        image: "./css/audio/cover/Cave-world-viagra-boys-cover.png",
        name: "release",
        artist: "Viagra Boys",
        Audio: "./css/audio/viagra-boys.mp3",
      },
    ],
  },
  {
    title: "Nevermind",
    artist: "Nirvana",
    image: "./css/audio/cover/nevermind-nirvana-album-cover.jpg",
    songs: [
      {
        image: "./css/audio/cover/nevermind-nirvana-album-cover.jpg",
        name: "smells like teen spirit",
        artist: "Nirvana",
        Audio: "./css/audio/viagra-boys.mp3",
      },
      {
        image: "./css/audio/cover/nevermind-nirvana-album-cover.jpg",
        name: "come as you are",
        artist: "Nirvana",
        Audio: "./css/audio/viagra-boys.mp3",
      },
    ],
  },
];

const audio = document.createElement("audio");
let currentSongIndex = 0;

// Format time in seconds to MM:SS or H:MM:SS format
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const paddedMins = String(minutes).padStart(2, "0");
  const paddedSecs = String(secs).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${paddedMins}:${paddedSecs}`;
  }
  return `${minutes}:${paddedSecs}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const songImage = document.getElementById("song-image");
  const songName = document.getElementById("song-name");
  const songArtist = document.getElementById("song-artist");

  const currentTimeDisplay = document.getElementById("current-time");
  const totalTimeDisplay = document.getElementById("total-time");

  const songSlider = document.getElementById("song-slider");

  const playpauseBtn = document.getElementById("playpause-button");
  const prevBtn = document.getElementById("prev-button");
  const nextBtn = document.getElementById("next-button");
  const shuffleBtn = document.getElementById("shuffle-song");
  const repeatBtn = document.getElementById("repeat-song");
  const queueBtn = document.getElementById("queue-button");
  const albumPlaylist = document.getElementById("album-playlist");
  const albumTitle = document.getElementById("album-title");
  const albumSongs = document.getElementById("album-songs");

  // Debug: ensure elements found
  console.log("player init: elements", { songImage, songName, songArtist });

  // If a song index is provided via URL (e.g. ?song=2), use it
  try {
    const params = new URLSearchParams(window.location.search);
    const songParam = params.get("song");
    if (songParam !== null) {
      const idx = parseInt(songParam, 10);
      if (!isNaN(idx) && idx >= 0 && idx < songs.length) {
        currentSongIndex = idx;
      }
    }
    // If an album index is provided load that album's songs
    const albumParam = params.get("album");
    if (albumParam !== null) {
      const albumIndex = parseInt(albumParam, 10);
      if (!isNaN(albumIndex) && albumIndex >= 0 && albumIndex < albums.length) {
        const addMode = params.get("add") === "1";
        const songParam = params.get("song");
        const albumSongs = albums[albumIndex].songs.slice();
        const selectedSongIndex =
          songParam !== null ? parseInt(songParam, 10) : -1;
        const selectedSong =
          !isNaN(selectedSongIndex) &&
          selectedSongIndex >= 0 &&
          selectedSongIndex < albumSongs.length
            ? albumSongs[selectedSongIndex]
            : null;

        if (addMode) {
          const addedCount = addToQueue(
            selectedSong ? [selectedSong] : albumSongs,
          );
          if (selectedSong) {
            const queuedIndex = findSongIndex(selectedSong);
            if (queuedIndex >= 0) {
              currentSongIndex = queuedIndex;
            }
          } else if (addedCount > 0) {
            currentSongIndex = songs.length - addedCount;
          }
        } else {
          setQueue(albumSongs);
          currentSongIndex = 0;
        }
      }
    }
  } catch (e) {
    // ignore if URL parsing isn't available
  }

  // attach events (guard if buttons are present)
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (currentSongIndex == 0) {
        return;
      }
      currentSongIndex--;
      updateSong();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (shuffleMode) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
      } else {
        if (currentSongIndex == songs.length - 1) {
          return;
        }
        currentSongIndex++;
      }
      updateSong();
    });
  }

  if (playpauseBtn) {
    playpauseBtn.addEventListener("click", function () {
      const icon = playpauseBtn.querySelector("span");
      if (!audio.paused) {
        audio.pause();
        if (icon) icon.innerText = "play_arrow";
      } else {
        audio.play();
        if (icon) icon.innerText = "pause";
      }
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function () {
      shuffleMode = !shuffleMode;
      shuffleBtn.style.opacity = shuffleMode ? "1" : "0.5";
    });
  }

  if (repeatBtn) {
    repeatBtn.addEventListener("click", function () {
      repeatMode = !repeatMode;
      repeatBtn.style.opacity = repeatMode ? "1" : "0.5";
    });
  }

  if (queueBtn) {
    queueBtn.addEventListener("click", function () {
      queueMode = !queueMode;
      renderQueue();
    });
  }

  audio.addEventListener("ended", function () {
    const icon = playpauseBtn ? playpauseBtn.querySelector("span") : null;
    if (repeatMode) {
      audio.currentTime = 0;
      audio.play();
      if (icon) icon.innerText = "pause";
    } else {
      if (shuffleMode) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
      } else {
        if (currentSongIndex < songs.length - 1) {
          currentSongIndex++;
        } else {
          if (icon) icon.innerText = "play_arrow";
          return;
        }
      }
      updateSong();
      audio.play();
      if (icon) icon.innerText = "pause";
    }
  });

  // updates the music player information
  function updateSong() {
    const song = songs[currentSongIndex];
    if (!song) return;

    if (songImage) songImage.src = song.image;
    if (songName) songName.innerText = song.name;
    if (songArtist) songArtist.innerText = song.artist;

    audio.src = song.Audio;
    audio.load();
    renderQueue();
  }

  function renderQueue() {
    if (!albumPlaylist || !albumTitle || !albumSongs) return;

    albumTitle.innerText = "Queue";
    albumPlaylist.classList.toggle("hidden", !queueMode);
    if (!queueMode) return;

    albumSongs.innerHTML = "";
    let dragSrcIndex = null;

    songs.forEach(function (song, index) {
      const li = document.createElement("li");
      li.className =
        "flex items-center justify-between p-3 bg-surface-container-low rounded";
      li.draggable = true; // Make draggable 

      if (index === currentSongIndex) {
        li.classList.add("border", "border-primary"); // visibility for current song in queue
      }
      li.innerHTML = `<span>${index + 1}. ${song.name} — ${song.artist}</span>`;
      li.addEventListener("click", function () {
        currentSongIndex = index;
        updateSong();
        audio.play();
      });

      // Drag events
      li.addEventListener("dragstart", function () {
        dragSrcIndex = index;   // Remember which song we're dragging
        li.classList.add("opacity-50");
      });

      li.addEventListener("dragend", function () {
        li.classList.remove("opacity-50");
      });

      li.addEventListener("dragover", function (e) {
        e.preventDefault();  // REQUIRED
        li.classList.add("border-t-2", "border-primary");
      });

      li.addEventListener("dragleave", function () {
        li.classList.remove("border-t-2", "border-primary");
      });

      li.addEventListener("drop", function (e) {
        e.preventDefault();
        li.classList.remove("border-t-2", "border-primary");

        if (dragSrcIndex === null || dragSrcIndex === index) return; // Prevent dropping on itself

        // Reorder songs array
        const draggedSong = songs.splice(dragSrcIndex, 1)[0]; // Remove from old position
        songs.splice(index, 0, draggedSong); //add to new position

        // Keep currentSongIndex pointing at the same song after reorder
        if (currentSongIndex === dragSrcIndex) {
          currentSongIndex = index;
        } else if (
          dragSrcIndex < currentSongIndex &&
          index >= currentSongIndex
        ) {
          currentSongIndex--;
        } else if (
          dragSrcIndex > currentSongIndex &&
          index <= currentSongIndex
        ) {
          currentSongIndex++;
        }

        saveQueue(songs);
        renderQueue(); // re-render with new order
      });
      albumSongs.appendChild(li);
    });
  }

  //
  if (songSlider) {
    audio.addEventListener("loadedmetadata", function () {
      songSlider.max = Math.ceil(audio.duration); //set the max value of the slider to song duration 
      songSlider.value = 0;
      if (currentTimeDisplay) currentTimeDisplay.innerText = "0:00"; 
      if (totalTimeDisplay)
        totalTimeDisplay.innerText = formatTime(audio.duration); //shows time like 3:45 instead of '225 seconds'
    });

    songSlider.addEventListener("change", function () {
      audio.currentTime = songSlider.value;
    });
  } else {
    audio.addEventListener("loadedmetadata", function () {
      if (currentTimeDisplay) currentTimeDisplay.innerText = "0:00";
      if (totalTimeDisplay)
        totalTimeDisplay.innerText = formatTime(audio.duration);
    });
  }

  updateSong(); // shows the selected song when loading page

  function moveSlider() {
    if (songSlider) songSlider.value = audio.currentTime;
    if (currentTimeDisplay)
      currentTimeDisplay.innerText = formatTime(audio.currentTime);
  }

  setInterval(moveSlider, 100);

  //share song 
  document
    .getElementById("share-button")
    ?.addEventListener("click", function () { //? so it doesnt crash if button is missing 
      if (navigator.share) {
        const song = songs[currentSongIndex];
        navigator
          .share({
            title: song.name,
            text: `Listening to ${song.name} by ${song.artist}`,
            url: window.location.href,
          })
          .then(() => console.log("Shared successfully"))
          .catch((error) => console.error("Error sharing:", error));
      } else {
        alert("Sharing is not supported in this browser.");
      }
    });

  //volume slider
  const vol = document.getElementById("volume-slider");
  const updateVolTrack = () => vol.style.setProperty("--val", vol.value + "%");
  vol.addEventListener("input", updateVolTrack);
  updateVolTrack();
});
