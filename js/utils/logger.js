/**
 * @fileoverview Logger utility - replaces console.log
 * @module utils/logger
 */

const LEVELS = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
let currentLevel = LEVELS.INFO;

export function setLevel(level) {
  currentLevel = LEVELS[level.toUpperCase()] ?? LEVELS.INFO;
}

export function error(...args) {
  if (currentLevel >= LEVELS.ERROR) console.error('[ERROR]', ...args);
}

export function warn(...args) {
  if (currentLevel >= LEVELS.WARN) console.warn('[WARN]', ...args);
}

export function info(...args) {
  if (currentLevel >= LEVELS.INFO) console.info('[INFO]', ...args);
}

export function debug(...args) {
  if (currentLevel >= LEVELS.DEBUG) console.debug('[DEBUG]', ...args);
}

export default { setLevel, error, warn, info, debug, LEVELS };