import { describe, it, expect } from 'vitest';

describe('i18n.js', () => {
  describe('translations', () => {
    it('should export translations object', async () => {
      const i18n = await import('../js/i18n.ts');
      expect(i18n.TRANSLATIONS).toBeDefined();
      expect(i18n.TRANSLATIONS.fr).toBeDefined();
    });

    it('should have French as default', async () => {
      const i18n = await import('../js/i18n.ts');
      expect(i18n.TRANSLATIONS.fr['player.one']).toBe('Joueur');
    });

    it('should have multiple languages', async () => {
      const i18n = await import('../js/i18n.ts');
      expect(i18n.TRANSLATIONS.en).toBeDefined();
      expect(i18n.TRANSLATIONS.es).toBeDefined();
    });
  });

  describe('t function', () => {
    it('should translate keys', async () => {
      const { t } = await import('../js/i18n.ts');
      expect(typeof t).toBe('function');
    });
  });

  describe('applyLanguage function', () => {
    it('should export applyLanguage', async () => {
      const { applyLanguage } = await import('../js/i18n.ts');
      expect(typeof applyLanguage).toBe('function');
    });
  });
});

describe('batchUpdate.js', () => {
  describe('batchUpdate', () => {
    it('should export batchUpdate function', async () => {
      const batch = await import('../js/batchUpdate.ts');
      expect(typeof batch.batchUpdate).toBe('function');
    });

    it('should export setProperty function', async () => {
      const batch = await import('../js/batchUpdate.ts');
      expect(typeof batch.setProperty).toBe('function');
    });

    it('should export setStyle function', async () => {
      const batch = await import('../js/batchUpdate.ts');
      expect(typeof batch.setStyle).toBe('function');
    });

    it('should export setHTML function', async () => {
      const batch = await import('../js/batchUpdate.ts');
      expect(typeof batch.setHTML).toBe('function');
    });

    it('should export cancelBatch function', async () => {
      const batch = await import('../js/batchUpdate.ts');
      expect(typeof batch.cancelBatch).toBe('function');
    });

    it('should export sync function', async () => {
      const batch = await import('../js/batchUpdate.ts');
      expect(typeof batch.sync).toBe('function');
    });
  });
});

describe('constants.js', () => {
  describe('TRANSLATIONS', () => {
    it('should export translation settings', async () => {
      const { TRANSLATIONS } = await import('../js/constants.ts');
      expect(TRANSLATIONS.DEFAULT_LOCALE).toBe('fr');
      expect(TRANSLATIONS.SUPPORTED).toContain('fr');
      expect(TRANSLATIONS.SUPPORTED).toContain('en');
    });
  });
});
