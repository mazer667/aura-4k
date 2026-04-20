import type { AppConfig, ConsoleConfig, Game } from './types.js';

declare global {
  interface Window {
    electronAPI?: {
      getConfig(): Promise<AppConfig>;
      getAllConsoles(): Promise<ConsoleConfig[]>;
      quitApp(): void;
      launchGame(romBasePath: string, consoleName: string, extensions: string[]): void;
      countRoms?(folder: string): Promise<number>;
      createXml?(consoleName: string, folder: string): Promise<any>;
      selectFolder?(): Promise<{ canceled: boolean; path: string }>;
    };
    toggleFav?: () => void;
    setFilterFav?: () => void;
    getCurrentGame?: () => Game | undefined;
    updateSfxVolume?: (volume: number) => void;
    updateMusicVolume?: (volume: number) => void;
    setMusicVolume?: (volume: number) => void;
    muteMusic?: (mute: boolean) => void;
    muteAllAudio?: (mute: boolean) => void;
  }

  interface HTMLElement {
    _timer?: ReturnType<typeof setTimeout>;
    _saveTimer?: ReturnType<typeof setTimeout>;
  }
}

export {};