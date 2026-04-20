# AURA 4K

![Version](https://img.shields.io/badge/version-2.5.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

## Description

Launcher de jeux rétro codé en Electron avec une interface cinéma immersive. Il permet de lancer vos ROMs via RetroArch et supporte 48 consoles.

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le launcher
npm start

# ou directement avec Electron
electron .
```

## Structure

```
aura-4k/
├── index.html              # Écran principal
├── console-select.html    # Écran sélection console
├── main.js                # Processus principal Electron
├── config.json           # Configuration globale
├── js/                   # Modules JavaScript/TypeScript
│   ├── navigation.ts    # Navigation (gauche/droite = jeu suivant/précédent)
│   ├── state.ts         # État global
│   ├── games.ts        # Chargement XML + cache
│   ├── ui.ts           # Interface utilisateur
│   └── ...
├── assets/consoles/     # ROMs, images, musiques (non inclus - à télécharger)
├── data/                # Fichiers XML (hyperlists)
├── retroarch/           # RetroArch + cores (non inclus)
├── sounds/              # Sons interface
└── fonts/              # Polices
```

## Ajout de jeux

1. Placez vos ROMs dans `assets/consoles/[Console]/roms/`
2. Lancez l'app et allez dans **Options > Data > Créer XML**

## Navigation

| Input | Action |
|-------|--------|
| ← / → | Jeu précédent/suivant |
| ↑ / ↓ | Jeu précédent/suivant |
| Entrée / A | Lancer jeu |
| Y | Ajouter favori |
| B | Screenshots |
| Backspace | Options |

## À télécharger séparément

- **ROMs** : À placer dans `assets/consoles/[Console]/roms/`
- **Images** : À placer dans `assets/consoles/[Console]/images/[Jeu]/`
- **Musiques** : À placer dans `assets/consoles/[Console]/music/`
- **RetroArch** : À télécharger séparément (retroarch.com)

## Commandes

```bash
npm install    # Dépendances
npm start     # Lancer
npm test      # Tests
npm run lint  # ESLint
```

## Licence

MIT
