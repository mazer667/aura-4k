# AURA 4K

![Version](https://img.shields.io/badge/version-2.5.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![Electron](https://img.shields.io/badge/Electron-33-blue)
![Tests](https://img.shields.io/badge/tests-32-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## Description

AURA 4K est un launcher de jeux rétro codé en Electron avec une interface cinéma immersive. Il permet de lancer vos ROMs via RetroArch et supporte **48 consoles** différentes.

### Fonctionnalités

- 🎬 **Interface cinéma** - Design sombre avec effets visuel, animations fluides
- 🎮 **48 consoles** - NES, SNES, Mega Drive, PC Engine, Dreamcast, Saturn, PS1, N64, Game Boy, Arcade (FBNeo), etc.
- 🕹️ **Gamepad support** - Navigation complète avec gamepad
- 🎵 **Musique par jeu** - Lecture automatique de musique pour chaque jeu
- ⭐ **Favoris** - Ajout rapide en jeu avec bouton Y
- 🔍 **Recherche** - Navigation lettre par lettre (A-Z)
- 📦 **Cache IndexedDB** - Chargement rapide des jeux
- 🌍 **Internationalisation** - 6 langues (FR, EN, ES, DE, IT, JA)
- 🖼️ **Images** - Support Image centre et screenshots

---

## Installation

### Prérequis

- Node.js 18+
- Windows 10/11
- RetroArch installé (optionnel mais recommandé)

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/mazer667/aura-4k.git
cd aura-4k

# 2. Installer les dépendances
npm install

# 3. Lancer le launcher
npm start
```

### Première utilisation

1. Lancez l'application
2. Vos ROMs doivent être dans `assets/consoles/[Console]/roms/`
3. Allez dans **Options > Data > Créer XML** pour générer les listes de jeux

---

## Structure du projet

```
aura-4k/
├── index.html              # Écran principal (liste jeux)
├── console-select.html    # Écran sélection console
├── main.js                # Processus principal Electron
├── preload.js            # Bridge secure IPC
├── config.json            # Configuration globale
├── consoles.json         # Définition des consoles (48)
├── package.json           # Dépendances npm
├── js/                    # Modules JavaScript/TypeScript
│   ├── navigation.ts     # Navigation jeux
│   ├── state.ts          # État global
│   ├── games.ts          # Chargement XML + cache
│   ├── ui.ts             # Interface utilisateur
│   ├── options.ts        # Menu options
│   ├── gamepad.ts       # Support gamepad
│   ├── audio.ts         # Sons interface
│   ├── music.ts         # Musique par jeu
│   ├── i18n.ts          # Internationalisation
│   └── ...
├── assets/consoles/       # ROMs, images, musiques
│   ├── [Console]/
│   │   ├── roms/        # ROMs (.zip, .nes, .sms, etc.)
│   │   ├── images/      # Images par jeu
│   │   │   └── [Jeu]/
│   │   │       ├── Image centre/
│   │   │       └── screenshots/
│   │   └── music/       # Musiques (.mp3, .wav)
├── data/                 # Fichiers XML (hyperlists)
├── retroarch/            # Dossier RetroArch (non inclus)
├── sounds/               # Sons interface
├── fonts/                # Polices
└── ui/                   # Images interface
```

---

## Ajout de jeux

### Méthode 1: Création automatique XML

1. Créez le dossier: `assets/consoles/[Nom Console]/roms/`
2. Placez vos ROMs (.zip, .nes, .sms, etc.) dans ce dossier
3. Dans l'app: **Options > Data**
4. Sélectionnez la console dans la liste déroulante
5. Cliquez sur **Créer XML**
6. Attendez la génération (avec barre de progression)
7. Les jeux apparaissent dans la liste

### Méthode 2: Manuel

Éditez directement le fichier XML dans `data/`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<menu>
  <game name="MonJeu">
    <description>Ma Description</description>
    <manufacturer>MonÉditeur</manufacturer>
    <year>1990</year>
    <genre>Action</genre>
    <players>1</players>
    <rating>10.0</rating>
    <enabled>Yes</enabled>
  </game>
</menu>
```

---

## Navigation

| Input | Action |
|-------|--------|
| ← / → | Jeu précédent/suivant |
| ↑ / ↓ | Jeu précédent/suivant |
| Entrée / A | Lancer jeu |
| Y | Ajouter favori |
| B | Screenshots |
| X | Quitter jeu |
| Backspace | Menu options |
| Escape | Retour / Quitter |

---

## Consoles supportées

| ID | Console | Extensions |
|----|---------|------------|
| fbneo | FBNeo - Arcade Games | .zip |
| nes | Nintendo - Nintendo Entertainment System | .nes |
| snes | Nintendo - Super Nintendo Entertainment System | .sfc, .smc |
| md | Sega - Mega Drive - Genesis | .md, .bin, .gen |
| pce | NEC - PC Engine - SuperGrafx | .pce |
| gg | Sega - Game Gear | .gg |
| sms | Sega - Master System - Mark III | .sms |
| gbc | Nintendo - Game Boy Color | .gbc |
| gb | Nintendo - Game Boy | .gb |
| gba | Nintendo - Game Boy Advance | .gba |
| n64 | Nintendo - Nintendo 64 | .n64, .z64 |
| nds | Nintendo - DS | .nds |
| psx | Sony - PlayStation | .bin, .iso |
| sat | Sega - Saturn | .iso |
| dc | Sega - Dreamcast - NAOMI | .iso |
| ngcd | SNK - Neo Geo AES-MVS | .neo |
| neogeo | SNK - Neo Geo CD | .iso |
| psp | Sony - PlayStation Portable | .iso |
| ps2 | Sony - PlayStation 2 | .iso |

*(et autres)*

---

## Commandes utiles

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm start

# Exécuter les tests
npm test

# Vérifier le code avec ESLint
npm run lint

# Formater le code avec Prettier
npm run format

# Build production
npm run build

# Tester avec Electron directement
electron .
```

---

## À télécharger séparément

En raison de la taille et des droits d'auteur, certains éléments ne sont pas inclus :

- **ROMs** - À placer dans `assets/consoles/[Console]/roms/`
- **Images jeux** - À placer dans `assets/consoles/[Console]/images/[Jeu]/`
- **Musiques** - À placer dans `assets/consoles/[Console]/music/`
- **RetroArch** - Télécharger sur [retroarch.com](https://www.retroarch.com/)

---

## Fonctionnalités spéciales

### Musique par jeu

Placez un fichier MP3 ou WAV nommé selon le jeu dans le dossier `music/` de la console correspondante. La musique sera lue automatiquement lors de la sélection du jeu.

### Images

Chaque jeu peut avoir :
- **Image centre** : Image principale affichée au centre
- **Sscreenshots** : Images latérales

### Favoris

Appuyez sur **Y** pendant la sélection d'un jeu pour l'ajouter aux favoris. Appuyez à nouveau pour retirer.

### Filtre lettre

Utilisez les flèches haut/bas pour naviguer entre les lettres (A-Z) et voir uniquement les jeux commençant par cette lettre.

---

## Dépannage

### Le jeu ne launch pas

1. Vérifiez que RetroArch est installé et configuré dans Options > Data
2. Vérifiez que le core correspondant est présent dans `retroarch/cores/`
3. Vérifiez le chemin du core dans `consoles.json`

### Les images ne s'affichent pas

1. Vérifiez que les images sont dans le bon dossier (`Image centre/` ou `screenshots/`)
2. Les formats supportés sont : .png, .jpg, .webp

### Le son ne fonctionne pas

1. Vérifiez le volume dans Options > Audio
2. Vérifiez que les fichiers sons sont présents dans `sounds/`

---

## Licence

MIT License

---

## Auteurs

- Développement: AURA
- Version: 2.5.0
- Dernière mise à jour: Avril 2026