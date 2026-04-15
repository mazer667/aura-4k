import { describe, it, expect, vi } from 'vitest';
import { getConsoleConfigByName } from '../js/games.js';

describe('games.js', () => {
  describe('getConsoleConfigByName', () => {
    it('should be a function', () => {
      expect(typeof getConsoleConfigByName).toBe('function');
    });
  });
});

describe('navigation.js', () => {
  describe('module exports', () => {
    it('should export required functions', async () => {
      const nav = await import('../js/navigation.js');
      expect(typeof nav.navigate).toBe('function');
      expect(typeof nav.navigateToLetter).toBe('function');
      expect(typeof nav.launchCurrentGame).toBe('function');
    });
  });
});

describe('state.js', () => {
  describe('state management', () => {
    it('should export state functions', async () => {
      const state = await import('../js/state.js');
      expect(typeof state.getGames).toBe('function');
      expect(typeof state.getCurrentIndex).toBe('function');
      expect(typeof state.setCi).toBe('function');
      expect(typeof state.toggleFavorite).toBe('function');
      expect(typeof state.isFavorite).toBe('function');
    });
  });
});

describe('ui.js', () => {
  describe('UI functions', () => {
    it('should export UI functions', async () => {
      const ui = await import('../js/ui.js');
      expect(typeof ui.updateUI).toBe('function');
      expect(typeof ui.setFilterLetter).toBe('function');
      expect(typeof ui.setFilterFav).toBe('function');
    });
  });
});

describe('options.js', () => {
  describe('options API', () => {
    it('should export options functions', async () => {
      const options = await import('../js/options.js');
      expect(typeof options.isOptionsOpen).toBe('function');
      expect(typeof options.toggleOptions).toBe('function');
      expect(typeof options.getSetting).toBe('function');
      expect(typeof options.getFPSLimit).toBe('function');
    });
  });
});

describe('audio.js', () => {
  describe('audio functions', () => {
    it('should export audio functions', async () => {
      const audio = await import('../js/audio.js');
      expect(typeof audio.initAudio).toBe('function');
      expect(typeof audio.playSound).toBe('function');
    });
  });
});

describe('music.js', () => {
  describe('music functions', () => {
    it('should export music functions', async () => {
      const music = await import('../js/music.js');
      expect(typeof music.playMusicForGame).toBe('function');
      expect(typeof music.pauseMusic).toBe('function');
      expect(typeof music.stopMusic).toBe('function');
      expect(typeof music.muteMusic).toBe('function');
    });
  });
});

describe('gamepad.js', () => {
  describe('gamepad API', () => {
    it('should export gamepad functions', async () => {
      const gamepad = await import('../js/gamepad.js');
      expect(typeof gamepad.initGamepad).toBe('function');
      expect(typeof gamepad.setGameRunning).toBe('function');
    });
  });
});