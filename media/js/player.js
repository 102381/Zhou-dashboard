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
let shuffleMode = false;
let repeatMode = false;

const songs = [
  {
    image: "./css/audio/cover/luther-cover.jpg",
    name: "luther",
    artist: "kendrick",
    Audio: "./css/audio/luther-kendrick.mp3",
  },
];

const audio = document.createElement("audio");
let currentSongIndex = 0;
updateSong(); //shows the first song when loading page

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
    if (currentSongIndex == songs.length - 1){
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

shuffleBtn.addEventListener("click", function(){
    shuffleMode = !shuffleMode;
    shuffleBtn.style.opacity = shuffleMode ? "1" : "0.5";
 });

 repeatBtn.addEventListener("click", function(){
    repeatMode = !repeatMode;
    repeatBtn.style.opacity = repeatMode ? "1" : "0.5";
 });

audio.addEventListener("ended", function () {
  const icon = playpauseBtn.querySelector("span");
  if(repeatMode) {
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

songSlider.addEventListener("change", function(){
    audio.currentTime = songSlider.value;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function moveSlider(){
    songSlider.value = audio.currentTime;
    currentTimeDisplay.innerText = formatTime(audio.currentTime);
}

setInterval(moveSlider, 100);