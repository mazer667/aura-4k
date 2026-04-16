import { describe, it, expect, vi } from 'vitest';
import { getConsoleConfigByName, getRomExtensions } from '../js/games.js';

describe('games.js', () => {
  describe('getConsoleConfigByName', () => {
    it('should be a function', () => {
      expect(typeof getConsoleConfigByName).toBe('function');
    });
  });

  describe('getRomExtensions', () => {
    it('should be a function', () => {
      expect(typeof getRomExtensions).toBe('function');
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
      expect(typeof nav.navigateToGame).toBe('function');
      expect(typeof nav.setOnGameChange).toBe('function');
    });
  });

  describe('navigate', () => {
    it('should be a function', async () => {
      const nav = await import('../js/navigation.js');
      expect(typeof nav.navigate).toBe('function');
    });
  });

  describe('navigateToLetter', () => {
    it('should call navigate', async () => {
      const nav = await import('../js/navigation.js');
      expect(typeof nav.navigateToLetter).toBe('function');
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
      expect(typeof state.getFavorites).toBe('function');
      expect(typeof state.getLastPlayed).toBe('function');
      expect(typeof state.setLastPlayed).toBe('function');
    });
  });

  describe('setCi', () => {
    it('should be a function', async () => {
      const state = await import('../js/state.js');
      expect(typeof state.setCi).toBe('function');
    });
  });

  describe('getIdle', () => {
    it('should be a function', async () => {
      const state = await import('../js/state.js');
      expect(typeof state.getIdle).toBe('function');
    });
  });

  describe('subscribe', () => {
    it('should be a function', async () => {
      const state = await import('../js/state.js');
      expect(typeof state.subscribe).toBe('function');
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
      expect(typeof options.openOptions).toBe('function');
      expect(typeof options.closeOptions).toBe('function');
      expect(typeof options.getFrameInterval).toBe('function');
      expect(typeof options.getTransitionDuration).toBe('function');
      expect(typeof options.initOptions).toBe('function');
    });
  });
});

describe('audio.js', () => {
  describe('audio functions', () => {
    it('should export audio functions', async () => {
      const audio = await import('../js/audio.js');
      expect(typeof audio.initAudio).toBe('function');
      expect(typeof audio.playSound).toBe('function');
      expect(typeof audio.playSoundAndWait).toBe('function');
      expect(typeof audio.updateSfxVolume).toBe('function');
      expect(typeof audio.muteAllAudio).toBe('function');
      expect(typeof audio.isAudioMuted).toBe('function');
    });
  });
});

describe('i18n.js', () => {
  describe('i18n API', () => {
    it('should export i18n functions', async () => {
      const i18n = await import('../js/i18n.js');
      expect(typeof i18n.t).toBe('function');
      expect(typeof i18n.applyLanguage).toBe('function');
      expect(typeof i18n.getCurrentLang).toBe('function');
      expect(typeof i18n.tGenre).toBe('function');
      expect(i18n.TRANSLATIONS).toBeDefined();
      expect(i18n.GENRES).toBeDefined();
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