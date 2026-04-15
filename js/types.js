// js/types.js
// JSDoc type definitions for AURA 4K

/**
 * @typedef {Object} Game
 * @property {string} rom
 * @property {string} title
 * @property {string} console
 * @property {string} desc
 * @property {string} thumbnail
 * @property {string} image
 * @property {string} rating
 * @property {string} genre
 * @property {string} players
 * @property {boolean} favorite
 */

/**
 * @typedef {Object} ConsoleConfig
 * @property {string} name
 * @property {string} id
 * @property {string} maker
 * @property {string} color
 * @property {Object} cores
 * @property {string[]} romExtensions
 * @property {string} imagesFolder
 * @property {string} musicFolder
 */

/**
 * @typedef {Object} AppConfig
 * @property {string} assetsBasePath
 * @property {Object} retroarch
 */

export const Game = null;
export const ConsoleConfig = null;
export const AppConfig = null;
export const Settings = null;
export const GamepadMapping = null;
export const AURAState = null;