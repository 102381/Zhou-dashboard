// UI and controls are initialized after DOM is ready to ensure IDs exist
let shuffleMode = false;
let repeatMode = false;

const songs = [
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
    Audio: "./css/audio/luther-kendrick.mp3",
  },
  {
    image: "./css/audio/cover/nevermind-nirvana-album-cover.jpg",
    name: "Nevermind",
    artist: "Nirvana",
    Audio: "./css/audio/luther-kendrick.mp3",
  },
];

const audio = document.createElement("audio");
let currentSongIndex = 0;

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
  } catch (e) {
    // ignore if URL parsing isn't available (e.g., non-browser env)
  }

  console.log(
    "player init: songs length",
    songs.length,
    "start index",
    currentSongIndex,
  );

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
  }

  if (songSlider) {
    audio.addEventListener("loadedmetadata", function () {
      songSlider.max = Math.ceil(audio.duration);
      songSlider.value = 0;
      if (currentTimeDisplay) currentTimeDisplay.innerText = "0:00";
      if (totalTimeDisplay)
        totalTimeDisplay.innerText = formatTime(audio.duration);
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
});

//checks if you dont go to -1
prevBtn.addEventListener("click", function () {
  if (currentSongIndex == 0) {
    return;
  }
  currentSongIndex--;
  updateSong();
});

// Update next button to check shuffle mode
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

playpauseBtn.addEventListener("click", function () {
  const icon = playpauseBtn.querySelector("span");
  if (!audio.paused) {
    audio.pause();
    icon.innerText = "play_arrow";
  } else {
    audio.play();
    icon.innerText = "pause";
  }
});

shuffleBtn.addEventListener("click", function () {
  shuffleMode = !shuffleMode;
  shuffleBtn.style.opacity = shuffleMode ? "1" : "0.5";
});

repeatBtn.addEventListener("click", function () {
  repeatMode = !repeatMode;
  repeatBtn.style.opacity = repeatMode ? "1" : "0.5";
});

audio.addEventListener("ended", function () {
  const icon = playpauseBtn.querySelector("span");
  if (repeatMode) {
    audio.currentTime = 0;
    audio.play();
    icon.innerText = "pause";
  } else {
    if (shuffleMode) {
      currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
      if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
      } else {
        icon.innerText = "play_arrow";
        return;
      }
    }
    updateSong();
    audio.play();
    icon.innerText = "pause";
  }
});
//updates the music player information
function updateSong() {
  const song = songs[currentSongIndex];
  songImage.src = song.image;
  songName.innerText = song.name;
  songArtist.innerText = song.artist;

  audio.src = song.Audio;
  audio.load();
}

audio.addEventListener("loadedmetadata", function () {
  songSlider.max = Math.ceil(audio.duration);
  songSlider.value = 0;
  currentTimeDisplay.innerText = "0:00";
  totalTimeDisplay.innerText = formatTime(audio.duration);
});

songSlider.addEventListener("change", function () {
  audio.currentTime = songSlider.value;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function moveSlider() {
  songSlider.value = audio.currentTime;
  currentTimeDisplay.innerText = formatTime(audio.currentTime);
}

setInterval(moveSlider, 100);
