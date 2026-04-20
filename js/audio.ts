// js/audio.js - Lazy loading des sons
import { AURA } from './aura.js';

const sounds = {};
let isMuted = false;
const soundFiles = {
  highlight: 'sounds/highlight.wav',
  select:    'sounds/select.wav',
  load:      'sounds/load.wav',
  unload:    'sounds/unload.wav',
  netplay:   'sounds/netplay-alert.wav'
};

export async function initAudio() {
  // Ne rien charger au demarrage - chargement lazy
}

function loadSound(name) {
  if (sounds[name]) return sounds[name];
  
  const path = soundFiles[name];
  if (!path) return null;
  
  const audio = new Audio(path);
  audio.preload = 'auto';
  audio.volume = isMuted ? 0 : AURA.sfxVolume;
  sounds[name] = audio;
  return audio;
}

export function playSound(name) {
  if (isMuted) return;
  const audio = loadSound(name);
  if (!audio) return;
  audio.volume = AURA.sfxVolume;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function playSoundAndWait(name): Promise<void> {
  return new Promise<void>((resolve) => {
    if (isMuted) { resolve(); return; }
    const audio = loadSound(name);
    if (!audio) { resolve(); return; }
    audio.volume = AURA.sfxVolume;
    audio.currentTime = 0;
    audio.onended = () => { audio.onended = null; resolve(); };
    audio.play().catch(() => resolve());
  });
}

export function updateSfxVolume(volume) {
  AURA.sfxVolume = volume;
  for (const name in sounds) {
    if (sounds[name]) sounds[name].volume = volume;
  }
}

export function muteAllAudio(mute) {
  isMuted = mute;
  for (const name in sounds) {
    if (sounds[name]) {
      sounds[name].volume = mute ? 0 : AURA.sfxVolume;
      if (mute) {
        sounds[name].pause();
        sounds[name].currentTime = 0;
      }
    }
  }
}

export function isAudioMuted() {
  return isMuted;
}

window.updateSfxVolume = updateSfxVolume;
window.muteAllAudio = muteAllAudio;
