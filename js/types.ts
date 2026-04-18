// js/types.ts
// TypeScript type definitions for AURA 4K

export interface Game {
  rom: string;
  title: string;
  console: string;
  desc: string;
  thumbnail: string;
  image: string;
  rating: string;
  genre: string;
  players: string;
  favorite: boolean;
  pub?: string;
  short?: string;
  year?: string;
  let?: string;
  playersNum?: number;
  playersRange?: any;
  [key: string]: any;
}

export interface ConsoleConfig {
  name: string;
  id?: string;
  maker?: string;
  color?: string;
  cores?: Record<string, any>;
  romExtensions?: string[];
  imagesFolder?: string;
  musicFolder?: string;
  imageCenterSubfolder?: string;
  screenshotsSubfolder?: string;
  [key: string]: any;
}

export interface AppConfig {
  assetsBasePath?: string;
  retroarch?: Record<string, any>;
  [key: string]: any;
}

export interface Settings {
  [key: string]: any;
}

export interface GamepadMapping {
  [key: string]: any;
}

export interface AURAState {
  [key: string]: any;
}

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