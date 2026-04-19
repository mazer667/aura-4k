import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('state.ts', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { _resetFavoritesCache } = await import('../js/state.ts');
    _resetFavoritesCache();
  });

  describe('getFavorites', () => {
    it('should return parsed favorites from localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('["rom1", "rom2"]');
      const { getFavorites } = await import('../js/state.ts');
      expect(getFavorites()).toEqual(['rom1', 'rom2']);
    });

    it('should return empty array on error', async () => {
      localStorageMock.getItem.mockImplementation(() => { throw new Error('test'); });
      const { getFavorites } = await import('../js/state.ts');
      expect(getFavorites()).toEqual([]);
    });
  });

  describe('toggleFavorite', () => {
    it('should add favorite if not present', async () => {
      localStorageMock.getItem.mockReturnValue('["rom1"]');
      const { toggleFavorite } = await import('../js/state.ts');
      expect(toggleFavorite('rom2')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('aura4k_favorites', '["rom1","rom2"]');
    });

    it('should remove favorite if present', async () => {
      localStorageMock.getItem.mockReturnValue('["rom1", "rom2"]');
      const { toggleFavorite } = await import('../js/state.ts');
      expect(toggleFavorite('rom1')).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('aura4k_favorites', '["rom2"]');
    });
  });

  describe('isFavorite', () => {
    it('should check if rom is in favorites', async () => {
      localStorageMock.getItem.mockReturnValue('["rom1"]');
      const { isFavorite } = await import('../js/state.ts');
      expect(isFavorite('rom1')).toBe(true);
      expect(isFavorite('rom2')).toBe(false);
    });
  });

  describe('getLastPlayed', () => {
    it('should return parsed last played', async () => {
      const mockData = { console: 'nes', rom: 'game.nes', time: 123456 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
      const { getLastPlayed } = await import('../js/state.ts');
      expect(getLastPlayed()).toEqual(mockData);
    });

    it('should return null on error', async () => {
      localStorageMock.getItem.mockImplementation(() => { throw new Error('test'); });
      const { getLastPlayed } = await import('../js/state.ts');
      expect(getLastPlayed()).toBeNull();
    });
  });

  describe('setLastPlayed', () => {
    it('should set last played in localStorage', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(1000);
      const { setLastPlayed } = await import('../js/state.ts');
      setLastPlayed('nes', 'game.nes');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('aura4k_last_played', JSON.stringify({ console: 'nes', rom: 'game.nes', time: 1000 }));
      vi.useRealTimers();
    });
  });
});