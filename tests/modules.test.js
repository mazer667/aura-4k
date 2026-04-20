import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock window properties
const mockDocument = {
  getElementById: vi.fn(),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(() => []),
  createElement: vi.fn(() => ({
    style: {},
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  })),
  addEventListener: vi.fn(),
  body: { appendChild: vi.fn(), removeChild: vi.fn() },
};

global.document = mockDocument;
global.window = {
  electronAPI: {
    getConfig: vi.fn(),
    getAllConsoles: vi.fn(),
    selectConsole: vi.fn(),
    quitApp: vi.fn(),
    getLastPlayed: vi.fn(),
    setLastPlayed: vi.fn(),
  },
  addEventListener: vi.fn(),
};

describe('games.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('functions', () => {
    it('should export games functions', async () => {
      const games = await import('../js/games.ts');
      expect(typeof games.getConsoleConfigByName).toBe('function');
      expect(typeof games.getRomExtensions).toBe('function');
      expect(typeof games.loadConfig).toBe('function');
    });
  });
});

describe('navigation.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('module exports', () => {
    it('should export required functions', async () => {
      const nav = await import('../js/navigation.ts');
      expect(typeof nav.navigate).toBe('function');
      expect(typeof nav.navigateToLetter).toBe('function');
      expect(typeof nav.launchCurrentGame).toBe('function');
      expect(typeof nav.navigateToGame).toBe('function');
      expect(typeof nav.setOnGameChange).toBe('function');
    });
  });
});

describe('state.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('state management', () => {
    it('should export state functions', async () => {
      const state = await import('../js/state.ts');
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
});

describe('ui.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UI functions', () => {
    it('should export UI functions', async () => {
      const ui = await import('../js/ui.ts');
      expect(typeof ui.updateUI).toBe('function');
      expect(typeof ui.setFilterLetter).toBe('function');
      expect(typeof ui.setFilterFav).toBe('function');
    });
  });
});

describe('options.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('options API', () => {
    it('should export options functions', async () => {
      const options = await import('../js/options.ts');
      expect(typeof options.isOptionsOpen).toBe('function');
      expect(typeof options.toggleOptions).toBe('function');
      expect(typeof options.getSetting).toBe('function');
      expect(typeof options.getFPSLimit).toBe('function');
      expect(typeof options.openOptions).toBe('function');
      expect(typeof options.closeOptions).toBe('function');
    });
  });
});

describe('audio.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('audio functions', () => {
    it('should export audio functions', async () => {
      const audio = await import('../js/audio.ts');
      expect(typeof audio.initAudio).toBe('function');
      expect(typeof audio.playSound).toBe('function');
    });
  });
});

describe('music.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('music functions', () => {
    it('should export music functions', async () => {
      const music = await import('../js/music.ts');
      expect(typeof music.playMusicForGame).toBe('function');
      expect(typeof music.pauseMusic).toBe('function');
      expect(typeof music.stopMusic).toBe('function');
    });
  });
});

describe('gamepad.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('gamepad API', () => {
    it('should export gamepad functions', async () => {
      const gamepad = await import('../js/gamepad.ts');
      expect(typeof gamepad.initGamepad).toBe('function');
      expect(typeof gamepad.setGameRunning).toBe('function');
    });
  });
});

describe('i18n.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('i18n API', () => {
    it('should export i18n functions', async () => {
      const i18n = await import('../js/i18n.ts');
      expect(typeof i18n.t).toBe('function');
      expect(typeof i18n.applyLanguage).toBe('function');
      expect(i18n.TRANSLATIONS).toBeDefined();
    });
  });
});

describe('aura.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AURA namespace', () => {
    it('should export AURA object', async () => {
      const aura = await import('../js/aura.ts');
      expect(aura.AURA).toBeDefined();
      expect(aura.AURA.navigate).toBeNull();
    });

    it('should export setter functions', async () => {
      const aura = await import('../js/aura.ts');
      expect(typeof aura.setNavigate).toBe('function');
      expect(typeof aura.setLaunchGame).toBe('function');
    });
  });
});

describe('batchUpdate.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('batchUpdate', () => {
    it('should export batchUpdate function', async () => {
      const { batchUpdate } = await import('../js/batchUpdate.ts');
      expect(typeof batchUpdate).toBe('function');
    });
  });
});

describe('preloader.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('preloader', () => {
    it('should export preload functions', async () => {
      const preloader = await import('../js/preloader.ts');
      expect(typeof preloader.preloadAdjacentGames).toBe('function');
    });
  });
});

describe('imageCache.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('imageCache', () => {
    it('should export cache functions', async () => {
      const imageCache = await import('../js/imageCache.ts');
      expect(typeof imageCache.getCachedImage).toBe('function');
      expect(typeof imageCache.preloadImage).toBe('function');
      expect(typeof imageCache.clearCache).toBe('function');
    });
  });
});

describe('gameCache.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('gameCache', () => {
    it('should export cache functions', async () => {
      const gameCache = await import('../js/gameCache.ts');
      expect(typeof gameCache.initCache).toBe('function');
      expect(typeof gameCache.getCachedGames).toBe('function');
      expect(typeof gameCache.setCachedGames).toBe('function');
    });
  });
});

describe('imageOptimizer.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('imageOptimizer', () => {
    it('should export optimizer functions', async () => {
      const optimizer = await import('../js/imageOptimizer.ts');
      expect(typeof optimizer.convertToWebP).toBe('function');
      expect(typeof optimizer.preloadAsWebP).toBe('function');
      expect(typeof optimizer.getOptimizationStats).toBe('function');
    });
  });
});
