const GAMEPAD = {
  INITIAL_DELAY: 380,
  REPEAT_INTERVAL: 140,
  DEBOUNCE_INTERVAL: 120,
  DEFAULT_DEADZONE: 0.45
};
const ANIMATION = {
  FADE_DURATION: 800,
  TRANSITION_DURATION: 280,
  TOAST_DURATION: 2500,
  SLIDER_TRANSITION: 150
};
const CACHE = {
  MAX_IMAGE_SIZE: 100,
  CLEANUP_INTERVAL: 5e3
};
const NAVIGATION = {
  LETTERS: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"]
};
const FPS = {
  VALUES: [30, 60, 120, 144, 240],
  DEFAULT: 60
};
const CURSOR = {
  SIZES: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
  DEFAULT: 12,
  BIG_MULTIPLIER: 2.8
};
const TIMING = {
  UI_CALLBACK: 300,
  PRELOAD_DELAY: 100,
  SHOTS_FADE: 200,
  EXIT_FADE: 800,
  XML_PARSE_TIMEOUT: 2e3
};
const TRANSLATIONS = {
  DEFAULT_LOCALE: "fr",
  SUPPORTED: ["fr", "en", "es", "de", "it", "ja"]
};
export {
  ANIMATION,
  CACHE,
  CURSOR,
  FPS,
  GAMEPAD,
  NAVIGATION,
  TIMING,
  TRANSLATIONS
};
