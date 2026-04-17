# AURA 4K

![Version](https://img.shields.io/badge/version-2.5.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Electron](https://img.shields.io/badge/Electron-28.0.0-purple)
![Tests](https://img.shields.io/badge/tests-32-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

![CI](https://github.com/mazer667/aura-4k/actions/workflows/ci.yml/badge.svg)

## Table des matières

1. [Presentation](#presentation)
2. [Installation](#installation)
3. [Structure du projet](#structure-du-projet)
4. [Architecture](#architecture)
5. [Configuration](#configuration)
6. [Utilisation](#utilisation)
7. [Modules JavaScript](#modules-javascript)
8. [Options et parametres](#options-et-parametres)
9. [API IPC](#api-ipc)
10. [Cache et performances](#cache-et-performances)
11. [Technologies employees](#technologies-employees)
12. [Changelog](#changelog)
13. [Contribution](#contribution)
14. [Licence](#licence)

---

## Presentation

AURA 4K est un launcher de jeux retro codé en Electron avec une interface cinema immersive. Il permet de lancer vos ROMs via RetroArch et supporte plus de 70 consoles differentes.

### Fonctionnalites principales

| Fonctionnalite | Description |
|----------------|-------------|
| **Interface cinema** | Design sombre avec effets cinematiques, grain, animations fluides |
| **70+ consoles** | FBNeo, NES, SNES, Mega Drive, PC Engine, Dreamcast, Saturn, PS1, N64, Game Boy, etc. |
| **Gamepad support** | Navigation complete avec gamepad (Nintendo Switch Nano compatible) |
| **Musique par jeu** | Lecture automatique de musique pour chaque jeu depuis dossier music/ |
| **Favoris** | Ajout rapide en jeu avec bouton Y, liste de favoris |
| **Recherche lettre** | Navigation lettre par lettre (A-Z) |
| **Generation XML** | Creation automatique des fichiers hyperlist depuis dossiers ROMs |
| **Cache IndexedDB** | Chargement rapide des jeux, pas de re-parsing |
| **Images WebP** | Compression automatique des images |
| **Internationalisation** | 6 langues (FR, EN, ES, DE, IT, JA) |
| **Mode plein ecran** | Support kiosk et plein ecran |
| **Options completes** | Audio, affichage, manette, langue, data |

---

## Installation

### Prérequis

- Node.js 18+
- Windows 10/11
- RetroArch installé (optionnel)

### Étapes

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le launcher
npm start

# ou directement avec Electron
electron .
```

### Premiere utilisation

1. Lancez l'application
2. VosROMs doivent etre dans `assets/consoles/[Console]/roms/`
3. Allez dans **Options > Data > Créer XML** pour generer les listes de jeux

---

## Structure du projet

```
Aura 4K/
├── index.html              # Écran principal (liste jeux)
├── console-select.html   # Écran sélection console
├── main.js                # Processus principal Electron
├── preload.js            # Bridge secure IPC renderer/main
├── config.json           # Configuration globale (minimal)
├── consoles.json         # Définition complète des consoles (70+)
├── package.json          # Dependencies npm
├── README.md             # Ce fichier
├── .gitignore            # Git ignore
│
├── js/                   # Modules JavaScript (ES Modules)
│   ├── state.js         # État global, jeux, favoris, index
│   ├── i18n.js         # Internationalisation (6 langues)
│   ├── audio.js        # Sons interface (lazy loading)
│   ├── music.js        # Musique par jeu
│   ├── games.js        # Chargement XML + cache IndexedDB
│   ├── navigation.js  # Navigation clavier/gamepad
│   ├── ui.js          # Interface utilisateur
│   ├── options.js     # Menu options
│   ├── gamepad.js     # Support gamepadAPI
│   ├── imageCache.js  # Cache images LRU (50 img)
│   ├── gameCache.js  # Cache IndexedDB
│   ├── imageOptimizer.js # Conversion WebP
│   ├── xmlParser.worker.js # Web Worker XML
│   └── batchUpdate.js # Optimisation DOM (requestAnimationFrame)
│
├── assets/
│   └── consoles/    # Ressources par console
│       ├── FBNeo - Arcade Games/
│       │   ├── roms/
│       │   │   ├── 1941.zip
│       │   │   └── ...
│       │   ├── images/
│       │   │   ├── Image centre/
│       │   │   └── screenshots/
│       │   └── music/
│       ├── [Console]/
│       └── ...
│
├── data/             # Fichiers XML (hyperlists)
│   ├── FBNeo - Arcade Games.xml
│   └── ...
│
├── retroarch/        # RetroArch + cores
│   ├── retroarch.exe
│   └── cores/
│
├── sounds/          # Sons interface
│   ├── load.wav
│   ├── select.wav
│   ├── go.wav
│   └── ...
│
├── fonts/           # Polices
├── service-worker.js # Cache offline
├── tests.js        # Tests unitaires
└── build.js        # Build minifié
```

---

## Configuration

### consoles.json

Chaque console est definie avec ses parametres:

```json
{
  "id": "fbneo",
  "maker": "Arcade",
  "systemId": 51,
  "era": "arcade",
  "color": "#fbbf24",
  "rgb": "251,191,36",
  "cores": {
    "default": "retroarch/cores/fbneo_libretro.dll"
  },
  "romExtensions": [".zip"],
  "imagesFolder": "consoles/FBNeo - Arcade Games/images",
  "imageCenterSubfolder": "Image centre",
  "screenshotsSubfolder": "screenshots",
  "musicFolder": "consoles/FBNeo - Arcade Games/music"
}
```

### Parametres consoles.json

| Parametre | Type | Description |
|----------|------|-------------|
| `id` | string | Identifiant court unique |
| `maker` | string | Fabricant |
| `systemId` | number | ID ScreenScraper pour metadonnees |
| `era` | string | Epoque (arcade, 8bit, 16bit, 32bit, 64bit, portable) |
| `color` | string | Couleur CSSthematique |
| `rgb` | string | Code RGB pour elements |
| `cores` | object | Definitions cores RetroArch |
| `romExtensions` | array | Extensions ROM supportees |
| `imagesFolder` | string | Chemin dossier images |
| `imageCenterSubfolder` | string | Sous-dossier image centrale |
| `screenshotsSubfolder` | string | Sous-dossier screenshots |
| `musicFolder` | string | Chemin dossier musique |

---

## Utilisation

### Ajout de jeux

#### Methode 1: Creation automatique XML

1. Creez le dossier: `assets/consoles/[Nom Console]/roms/`
2. Placez vos ROMs (.zip, .nes, etc.) dans ce dossier
3. Dans l'app: **Options > Data**
4. Selectionnez la console dans la liste deroulante
5. Cliquez sur **Créer XML**
6. Attendez la generation (avec barre de progression)
7. Les jeux apparaissent dans la liste

#### Methode 2: Manuel

Editez directement le fichier XML dans `data/`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<menu>
  <game name="MonJeu">
    <description>Ma Description</description>
    <manufacturer>MonEditeur</manufacturer>
    <year>1990</year>
    <genre>Action</genre>
    <players>1</players>
    <rating>10.0</rating>
    <enabled>Yes</enabled>
  </game>
</menu>
```

### Lancer un jeu

1. Depuis l'ecran de selection, choississez une console
2. Naviguez avec fleches directionnelles ou gamepad
3. Appuyez sur **Entree** ou **bouton A** pour lancer
4. Le jeu demarre via RetroArch avec le core configure

### Navigation

| Input | Action |
|-------|--------|
| **Fleche gauche/droite** | Jeu precedent/suivant |
| **Fleche haut/bas** | Lettre precedente/suivante |
| **Entree / A** | Lancer jeu |
| **Y** | Ajouter favori |
| **B** | Afficher screenshots |
| **X** | Quitter jeu |
| **Backspace** | Ouvrir menu options |
| **Escape** | Retour / Quitter |

---

## Modules JavaScript

### state.js

Gestion de l'etat global de l'application.

**Fonctions exportees:**
- `getGames()`, `setGames()`
- `getCurrentIndex()`, `setCi()`
- `getCurrentGame()`
- `getFavorites()`, `addFavorite()`, `removeFavorite()`, `isFavorite()`
- `getIdle()`, `setIdle()`
- `getFilterFav()`, `setFilterFav()`
- `getFilterLetter()`, `setFilterLetter()`

**Stockage:** Variables globales en memoire + localStorage pour favoris.

### i18n.js

Internationalisation avec 6 langues.

**Langues:** FR, EN, ES, DE, IT, JA

**Fonctions:**
- `applyLanguage(lang)` - Applique une langue
- `t(key)` - Traduit une cle
- `getCurrentLang()` - Retourne la langue actuelle
- `getLanguages()` - Liste des langues disponibles

**Usage:**
```javascript
import { t, applyLanguage } from './js/i18n.js';
t('btn.play'); // "JOUER"
applyLanguage('en');
```

### games.js

Chargement des jeux depuis XML avec cache.

**Fonctions:**
- `loadConfig()` - Charge la configuration
- `loadGamesFromXML(consoleName)` - Charge XML
- `loadGamesAndPopulate(consoleName, forceReload)` - Charge avec cache
- `getRomPath(game)` - Retourne chemin ROM
- `getMusicUrl(game)` - Retourne URL musique
- `clearGamesCache()` - Vide le cache

**Cache:** IndexedDB avec validation timestamp ("vraie" date modification XML).

### gameCache.js

Module de cache IndexedDB.

**Fonctions:**
- `initCache()` - Initialise la base IndexedDB
- `getCachedGames(consoleKey)` - Recupere jeux depuis cache
- `setCachedGames(consoleKey, games, xmlTimestamp)` - Sauvegarde en cache
- `clearCache()` - Vide tout le cache
- `getCacheInfo()` - Infos cache (entrees, jeux, dates)

### imageCache.js

Cache LRU pour images (50 images max).

**Fonctions:**
- `initImageCache()` - Initialise
- `preloadImage(url)` - Precharge une image
- `preloadImages(urls)` - Precharge plusieurs images
- `isImageCached(url)` - Verifie si en cache
- `clearImageCache()` - Vide le cache

### navigation.js

Navigation dans la liste de jeux.

**Fonctions:**
- `navigate(direction)` - Navigation avant/arriere
- `launchCurrentGame()` - Lance le jeu actuel
- `navigateToLetter(letter)` - Va a une lettre
- `navigateToGame(game)` - Va a un jeu specifique
- `setOnGameChange(callback)` - Callback changement selection

### ui.js

Interface utilisateur et animations.

**Fonctions:**
- `initDisplay()` - Initialise l'affichage
- `setIdleUI()` - UI mode repos
- `shotsAppear()` / `shotsDisappear()` - Screenshots
- `btnsShow()` / `btnsHide()` - Boutons jeu
- `setFilterFav(active)` - Filtre favoris
- `setFilterLetter(letter)` - Filtre lettre

### options.js

Menu d'options complet avec onglets.

**Onglets:** Audio, Affichage, Interface, Manette, Langue, Data, A propos

**Parametres sauvegardes (localStorage):**
```javascript
{
  volume_music: 72,
  volume_sfx: 60,
  mute: false,
  fullscreen: true,
  show_clock: true,
  grain_intensity: 35,
  cursor_size: 12,
  accent_color: '#5eb8ff',
  language: 'fr',
  subtitles: true,
  transition_speed: 'normal',
  fps_limit: 60,
  hide_empty_consoles: false,
  // Gamepad
  gp_left: 4, gp_right: 5,
  gp_up: 12, gp_down: 13,
  gp_play: 1, gp_quit: 2,
  gp_shots: 3, gp_favorite: 0,
  gp_options: 8,
  gp_deadzone: 45
}
```

### gamepad.js

Support Gamepad API avec polling.

**Fonctions:**
- `initGamepad()` - Initialise le polling
- `getBtn(name)` - Recupere index bouton
- `getDeadzone()` - Recupere deadzone

**Mapping par defaut (NSW Nano):**
| Bouton | Index | Action |
|-------|-------|--------|
| Y | 0 | Favori |
| A | 1 | Jouer |
| X | 2 | Quitter |
| B | 3 | Screenshots |
| LB | 4 | Jeu precedent |
| RB | 5 | Jeu suivant |
| D-pad haut | 12 | Lettre precedente |
| D-pad bas | 13 | Lettre suivante |

### audio.js

Sons interface avec lazy loading.

**Fonctions:**
- `initAudio()` - Initialise (appel differe)
- `playSound(name)` - Joue un son
- `muteAllAudio(muted)` - Muet global

**Sons disponibles:** load, select, go, favorite, unfavorite, error

### music.js

Musique par jeu.

**Fonctions:**
- `initMusic()` - Initialise le lecteur
- `playMusicForGame(game)` - Joue musique du jeu
- `stopMusic()` - Arrete la musique
- `pauseMusic()` / `resumeMusic()` - Pause
- `muteMusic(muted)` - Muet musique

---

## Options et parametres

### Onglet Audio

| Option | Defaut | Description |
|--------|-------|-------------|
| Volume musique | 72 | Volume de la musique (0-100) |
| Volume sons | 60 | Volume effets sonores (0-100) |
| Muet | false | Desactiver tous les sons |

### Onglet Affichage

| Option | Defaut | Description |
|--------|-------|-------------|
| Plein ecran | true | Lancer en plein ecran |
| Horloge | true | Afficher l'heure |
| Sous-titres | true | Afficher les sous-titres |
| Masquer consoles vides | false | Ne montrer que consoles avec jeux |

### Onglet Interface

| Option | Defaut | Description |
|--------|-------|-------------|
| Grain cinematique | 35 | Intensite grain (0-100) |
| Taille curseur | 12 | Taille du curseur (6-24) |
| Vitesse transition | normal | Vitesse animations (fast/normal/slow/none) |
| FPS | 60 | Limite FPS (30/60/120/144/240) |

### Onglet Manette

Mapping personnalisable pour chaque action:
- Haut/Bas/ Gauche/Droite
- Jouer/Quitter/Screenshots/Favori
- Options (Select)
- Deadzone (%)

### Onglet Langue

6 langues disponibles:
- Francais (fr)
- English (en)
- Espanol (es)
- Deutsch (de)
- Italiano (it)
- 日本語 (ja)

### Onglet Data

| Option | Description |
|--------|-------------|
| Cree XML | Genere fichier XML depuis dossier ROMs |
| Compteur ROMs | Affiche nombre de ROMs par console |
| Vider cache | Vide le cache IndexedDB |

---

## API IPC

Le projet utilise Electron IPC pour les communications renderer/main process:

### Handlers principaux

| Channel | Parametres | Retour | Description |
|---------|------------|--------|-------------|
| `get-config` | - | Object | Configuration globale |
| `get-all-consoles` | - | Array | Liste toutes consoles |
| `get-console-config` | consoleName | Object | Config d'une console |
| `get-xml-timestamp` | consoleName | Number | Date modification XML |
| `get-selected-console` | - | String | Console selectionnee |
| `select-console` | consoleName | - | Selectionne console |
| `launch-game` | romPath, consoleName, extensions | - | Lance un jeu |
| `create-xml` | consoleName, romsFolder | Object | Genere XML |
| `select-folder` | - | String | Ouvre dialog |
| `count-roms` | folderPath | Number | Compte ROMs |
| `quit-app` | - | - | Quitte application |

### Evenements

| Evenement | Description |
|----------|-------------|
| `game-started` | Jeu demarre |
| `game-ended` | Jeu termine |
| `scan-progress` | Progression generation XML |

---

## Cache et performances

### Types de cache

| Cache | Emplacement | Description |
|-------|------------|-------------|
| **IndexedDB** | Browser | Jeux parsés (gameCache.js) |
| **LRU** | Memoire | 50 dernieres images (imageCache.js) |
| **Service Worker** | Network | Ressources offline |
| **localStorage** | Browser | Options utilisateur |

### Optimisations

| Technique | Description |
|-----------|-------------|
| Lazy loading | Audio charge a la demande |
| Web Workers | Parsing XML en arriere-plan |
| requestAnimationFrame |batch updates DOM |
| Skeleton loader | UI pendant chargement |
| Preconnect | Connexions pre-etablies |
| WebP | Images compressees |

---

## Technologies employees

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Electron** | 28.x | Desktop framework |
| **JavaScript** | ES2022 | Langage principal |
| **IndexedDB** | - | Stockage local jeux |
| **WebP** | - | Compression images |
| **Web Workers** | - | Parsing XML parallele |
| **Gamepad API** | - | Support manettes |
| **Service Worker** | - | Cache offline |
| **localStorage** | - | Parametres utilisateur |

---

## Commandes utiles

```bash
# Installer les dependances
npm install

# Lancer en mode developpement
npm start

# Executer les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

#Verifier le code avec ESLint
npm run lint

# Formater le code avec Prettier
npm run format

# Build production
npm run build

#Tester avec Electron directement
electron .
```

---

## Tests et CI/CD

Le projet utilise **Vitest** pour les tests unitaires et **GitHub Actions** pour l'intégration continue.

### Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:coverage
```

### Fichiers de tests

- `tests/constants.test.js` - Tests des constantes
- `tests/modules.test.js` - Tests des modules

### CI/CD

À chaque push sur `master`, GitHub Actions exécute automatiquement :
- Installation des dépendances
- Vérification ESLint
- Exécution des tests unitaires

---

## Fichier XML (format HyperList)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<menu>
  <game name="1941">
    <description>1941 - Counter Attack</description>
    <manufacturer>Capcom</manufacturer>
    <year>1990</year>
    <genre>Shooter</genre>
    <players>2</players>
    <rating>14.0</rating>
    <enabled>Yes</enabled>
  </game>
  <game name="1942">
    <description>1942</description>
    <manufacturer>Capcom</manufacturer>
    <year>1984</year>
    <genre>Shooter</genre>
    <players>2</players>
    <rating>14.0</rating>
    <enabled>Yes</enabled>
  </game>
</menu>
```

---

## Changelog

### 2.5.0 (Avril 2026)
- 🎮 Gamepad persistant (deadzone + mapping sauvegardés)
- 📊 Barre de progression au chargement
- 🔔 Toasts améliorés (icônes, couleurs par type)
- ♻️ Cache LRU optimisé avec constantes
- ✅ Validation IPC renforcée (chemins + throttling)
- 🐛 Fix: bouton B retourne au menu console
- 🐛 Fix: navigation gamepad dans console-select
- 📝 Documentation complète

### 2.4.x (Versions précédentes)
- Support 70+ consoles
- Musique par jeu
- Favoris
- Internationalisation (6 langues)
- Generation XML automatique
- Cache IndexedDB
- Images WebP

---

## Contribution

1. Fork le projet
2. Creer une branche (`git checkout -b feature/ma-feature`)
3. Commiter vos changements (`git commit -m 'Ajout feature'`)
4. Pusher (`git push origin feature/ma-feature`)
5. Creer une Pull Request

### Standards de code

- ESLint: `npm run lint`
- Tests: `npm test` (min 32 tests)
- Format: Prettier

---

## Licence

MIT License

---

## Auteurs

- Developpement: AURA
- Version: 2.5.0
- Derniere mise a jour: Avril 2026

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MAIN PROCESS (main.js)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Config    │  │   IPC       │  │   Game      │             │
│  │   Loader    │  │   Handlers  │  │   Launcher  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │ IPC (contextBridge)
┌─────────────────────────────────────────────────────────────────┐
│                      RENDERER PROCESS                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      UI Layer                            │   │
│  │  index.html  │  console-select.html  │  options.html    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   JavaScript Modules                     │   │
│  │                                                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐   │   │
│  │  │  state   │  │  games   │  │   i18n   │  │options  │   │   │
│  │  │   .js    │  │   .js    │  │   .js    │  │  .js    │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐   │   │
│  │  │  ui      │  │navigation│  │ gamepad  │  │ audio   │   │   │
│  │  │   .js    │  │   .js    │  │   .js    │  │  .js    │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │   │
│  │  │  music   │  │ image    │  │  aura    │                │   │
│  │  │   .js    │  │ Cache.js │  │   .js    │                │   │
│  │  └──────────┘  └──────────┘  └──────────┘                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Data Layer                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐    │   │
│  │  │ IndexedDB    │  │ localStorage │  │ File System │    │   │
│  │  │ (gameCache)  │  │ (options)    │  │ (XML/ROMs)  │    │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Flux de données

1. **Chargement jeux:**
   ```
   console-select.html → main.js (IPC) → consoles.json
   → index.html → games.js → XML parser → IndexedDB (cache)
   ```

2. **Lancement jeu:**
   ```
   gamepad.js / keyboard → navigation.js → main.js (IPC)
   → RetroArch (spawn child process)
   ```

3. **Options:**
   ```
   options.js ↔ localStorage (persisté)
         ↓
   gamepad.js / audio.js / ui.js (appliqué en temps réel)
   ```