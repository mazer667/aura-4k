// js/music.js
import { getMusicUrl, getMusicId } from './games.js';

let currentAudio  = null;
let currentGameId = null;
let currentGame   = null;
let isMuted       = false;

// volume musique — peut être mis à jour par options.js
window.__auraMusicVolume = 0.70;

export function playMusicForGame(game, immediate = false) {
  if (!game) return;
  if (isMuted) return;

  const gameId = getMusicId(game);
  if (!gameId) return;

  // Déjà en lecture pour ce jeu → rien à faire
  if (currentGameId === gameId && currentAudio && !currentAudio.paused && currentGame?.console === game.console) return;

  // Arrêter la musique précédente
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentGameId = gameId;
  currentGame   = game;

  // ── Chemin construit depuis la config (assets/consoles/{console}/music/{rom}.mp3) ──
  const musicPath = getMusicUrl(game);
  if (!musicPath) return;

  const audio  = new Audio(musicPath);
  audio.loop   = true;
  audio.volume = window.__auraMusicVolume ?? 0.70;

  audio.addEventListener('canplaythrough', () => {
    if (currentGameId !== gameId) return;
    if (isMuted) return;
    if (currentAudio && currentAudio !== audio) currentAudio.pause();
    currentAudio = audio;
    currentAudio.play().catch(() => {});
  });

  audio.addEventListener('error', () => {});

  audio.load();
}

export function pauseMusic() {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
  }
}

export function resumeMusic() {
  if (currentAudio && currentAudio.paused && currentGameId && !isMuted) {
    currentAudio.play().catch(() => {});
  }
}

export function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentGameId = null;
}

export function muteMusic(mute) {
  isMuted = mute;
  if (currentAudio) {
    currentAudio.volume = mute ? 0 : (window.__auraMusicVolume ?? 0.70);
    if (mute) {
      currentAudio.pause();
    }
  }
}

export function updateMusicVolume(volume) {
  window.__auraMusicVolume = volume;
  if (currentAudio && !isMuted) currentAudio.volume = volume;
}

// Exposé globalement pour options.js — doit s'appeler setMusicVolume
window.setMusicVolume    = updateMusicVolume;
window.updateMusicVolume = updateMusicVolume; // alias de compatibilité
window.muteMusic = muteMusic;
