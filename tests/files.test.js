import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('files.js', () => {
  describe('file existence', () => {
    it('should have index.html', () => {
      expect(fs.existsSync(path.join(process.cwd(), 'index.html'))).toBe(true);
    });

    it('should have console-select.html', () => {
      expect(fs.existsSync(path.join(process.cwd(), 'console-select.html'))).toBe(true);
    });

    it('should have config.json', () => {
      expect(fs.existsSync(path.join(process.cwd(), 'config.json'))).toBe(true);
    });
  });
});