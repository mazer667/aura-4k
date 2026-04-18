import { describe, it, expect } from 'vitest';
import { FPS, CURSOR, NAVIGATION, ANIMATION, GAMEPAD, CACHE, TIMING } from '../js/constants.ts';

describe('constants.js', () => {
  describe('FPS', () => {
    it('should have valid values', () => {
      expect(FPS.VALUES).toContain(60);
      expect(FPS.DEFAULT).toBe(60);
    });
  });

  describe('CURSOR', () => {
    it('should have valid sizes', () => {
      expect(CURSOR.SIZES).toContain(12);
      expect(CURSOR.DEFAULT).toBe(12);
    });
  });

  describe('NAVIGATION', () => {
    it('should have all letters', () => {
      expect(NAVIGATION.LETTERS).toContain('A');
      expect(NAVIGATION.LETTERS).toContain('Z');
      expect(NAVIGATION.LETTERS).toContain('#');
    });
  });
});

describe('logger.js', () => {
  it('should export all log levels', async () => {
    const logger = await import('../js/utils/logger.js');
    expect(logger.default.LEVELS).toBeDefined();
  });
});
