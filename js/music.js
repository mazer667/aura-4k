import { getMusicUrl, getMusicId } from "./games.js";
import { AURA } from "./aura.js";
let currentAudio = null;
let currentGameId = null;
let currentGame = null;
let isMuted = false;
function playMusicForGame(game, immediate = false) {
  if (!game) return;
  if (isMuted) return;
  const gameId = getMusicId(game);
  if (!gameId) return;
  if (currentGameId === gameId && currentAudio && !currentAudio.paused && currentGame?.console === game.console) return;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentGameId = gameId;
  currentGame = game;
  const musicPath = getMusicUrl(game);
  if (!musicPath) return;
  const audio = new Audio(musicPath);
  audio.loop = true;
  audio.volume = AURA.musicVolume ?? 0.7;
  audio.addEventListener("canplaythrough", () => {
    if (currentGameId !== gameId) return;
    if (isMuted) return;
    if (currentAudio && currentAudio !== audio) currentAudio.pause();
    currentAudio = audio;
    currentAudio.play().catch(() => {
    });
  });
  audio.addEventListener("error", () => {
  });
  audio.load();
}
function pauseMusic() {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
  }
}
function resumeMusic() {
  if (currentAudio && currentAudio.paused && currentGameId && !isMuted) {
    currentAudio.play().catch(() => {
    });
  }
}
function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentGameId = null;
}
function muteMusic(mute) {
  isMuted = mute;
  if (currentAudio) {
    currentAudio.volume = mute ? 0 : AURA.musicVolume ?? 0.7;
    if (mute) {
      currentAudio.pause();
    }
  }
}
function updateMusicVolume(volume) {
  AURA.musicVolume = volume;
  if (currentAudio && !isMuted) currentAudio.volume = volume;
}
window.setMusicVolume = updateMusicVolume;
window.updateMusicVolume = updateMusicVolume;
window.muteMusic = muteMusic;
export {
  muteMusic,
  pauseMusic,
  playMusicForGame,
  resumeMusic,
  stopMusic,
  updateMusicVolume
};
