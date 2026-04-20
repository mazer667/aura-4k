// js/i18n.js
// Système de traduction AURA 4K
// Ajouter une langue : copier le bloc 'fr', changer la clé, traduire les valeurs.

export const TRANSLATIONS = {

  fr: {
    // ── Joueurs ──────────────────────────────────────────────
    'player.one':       'Joueur',
    'player.many':      'Joueurs',
    'player.range':     'Joueurs',

    // ── Navigation principale ────────────────────────────────
    'nav.prev':         'Jeu précédent',
    'nav.next':         'Jeu suivant',
    'nav.letter.prev':  'Lettre précédente',
    'nav.letter.next':  'Lettre suivante',
    'nav.navigate':     'Naviguer',
    // ── Affichage ────────────────────────────────────────
    'display.hideempty.label':   'Masquer consoles vides',
    'display.hideempty.desc':    'N\'affiche que les consoles avec des jeux',

    // ── Ères consoles ─────────────────────────────────────────
    'era.all':          'Tout',
    'era.arcade':       'Arcade',
    'era.8bit':         '8-Bits',
    'era.16bit':        '16-Bits',
    'era.32bit':        '32-Bits',
    'era.64bit':        '64-Bits',
    'era.portable':     'Portable',
    'era.other':        'Autre',

    // ── Info bar ──────────────────────────────────────────────
    'info.games':       'Jeux',

    // ── Console select ───────────────────────────────────────
    'console.title':    'Sélection de la plateforme',
    'page.title':       'Console Select',
    'resume.btn':        'REPRENDRE',
    'card.real':        'réel',
    'card.empty':       'vide',
    'card.game':        'Jeu',
    'card.games':       'Jeux',
    'card.soon':        'BIENTÔT',
    'banner.coming':    'Bientôt disponible',
    'console.fbneo':    'Arcade',
    'console.nes':      'NES',
    'console.md':       'Mega Drive',
    'console.snes':     'SNES',
    'console.gbc':      'GBC',
    'console.gba':      'GBA',
    'console.sms':      'Master System',
    'maker.fbneo':      'FinalBurn Neo',
    'maker.nes':        'Nintendo',
    'maker.md':         'Sega',
    'maker.snes':       'Nintendo',
    'maker.gbc':        'Nintendo',
    'maker.gba':        'Nintendo',
    'maker.sms':        'Sega',
    'console.full.fbneo':    'FBNeo - Jeux d\'Arcade',
    'console.full.nes':       'Nintendo - NES - Famicom',
    'console.full.md':       'Sega - Mega Drive - Genesis',
    'console.full.snes':     'Nintendo - Super Nintendo Entertainment System',
    'console.full.gbc':      'Nintendo - Game Boy Color',
    'console.full.gba':      'Nintendo - Game Boy Advance',
    'console.full.sms':      'Sega - Master System - Mark III',

    // ── Boutons manette ──────────────────────────────────────
    'btn.play':         'Jouer',
    'btn.quit':         'Quitter',
    'btn.screenshots':  'Screenshots',
    'btn.choose':       'Choisir',

    // ── Menu options — titre & fermer ────────────────────────
    'opt.title':        'OPTIONS',
    'opt.title.amp':    '&',
    'opt.title.sub':    'PARAMÈTRES',
    'opt.close':        'Fermer',

    // ── Onglets ──────────────────────────────────────────────
    'tab.audio':        'Audio',
    'tab.display':      'Affichage',
    'tab.interface':    'Interface',
    'tab.gamepad':      'Manette',
    'tab.language':     'Langue',
    'tab.data':         'Données',
    'tab.about':        'À propos',

    // ── Manette ───────────────────────────────────────────
    'gp.mapping':        'Assignation des boutons',
    'gp.deadzone':       'Zone morte des joysticks',
    'gp.dz.label':       'Zone morte',
    'gp.dz.desc':        'Seuil minimum de déplacement du joystick',
    'gp.reset':          'Réinitialiser le mapping',

    // ── Audio ────────────────────────────────────────────────
    'audio.mix':              'Mixage',
    'audio.music.label':      'Volume musique',
    'audio.music.desc':       'Niveau de la bande-son du menu',
    'audio.sfx.label':        'Volume effets',
    'audio.sfx.desc':         'Clics, transitions, navigation',
    'audio.behavior':         'Comportement',
    'audio.mute.label':       'Muet global',
    'audio.mute.desc':        'Désactive tout le son de l\'interface',

    // ── Affichage ────────────────────────────────────────────
    'display.mode':           'Mode d\'affichage',
    'display.fs.label':       'Fullscreen',
    'display.fs.desc':        'Occupe toute la surface de l\'écran',
    'display.clock.label':    'Afficher l\'horloge',
    'display.clock.desc':     'Horloge dans le panneau de droite',
    'display.perf':           'Performances',
    'display.fps.label':      'Limite FPS',
    'display.fps.desc':       '30 / 60 / 120 / 144 / 240 fps',

    // ── Interface ────────────────────────────────────────────
    'ui.anim':                'Navigation & Animations',
    'ui.speed.label':         'Vitesse de transition',
    'ui.speed.desc':          'Durée des animations entre les jeux',
    'ui.speed.fast':          'Rapide',
    'ui.speed.normal':        'Normal',
    'ui.speed.slow':          'Lent',
    'ui.grain.label':         'Intensité du grain',
    'ui.grain.desc':          'Texture de grain cinématique sur le fond',
    'ui.cursor':              'Curseur & Couleur',
    'ui.cursize.label':       'Taille du curseur',
    'ui.cursize.desc':        'Diamètre du pointeur personnalisé',
    'ui.accent.label':        'Couleur d\'accentuation',
    'ui.accent.desc':         'Teinte principale de l\'interface',

    // ── Langue ───────────────────────────────────────────────
    'lang.select':            'Sélectionner la langue',
    'lang.subs':              'Sous-titres',
    'lang.subs.show.label':   'Afficher les sous-titres',
    'lang.subs.show.desc':    'Dans les bandes-annonces intégrées',

    // ── À propos ─────────────────────────────────────────────
    'about.version':          'Version',
    'about.build':            'Build',
    'about.engine':           'Moteur',
    'about.platform':         'Plateforme',
    'about.maxres':           'Résolution max',
    'about.maintenance':      'Maintenance',
    'about.cache.label':      'Vider le cache',
    'about.cache.desc':       'Supprime miniatures et données temporaires',
    'about.cache.btn':        'Vider',
    'about.reset.label':      'Réinitialiser les paramètres',
    'about.reset.desc':       'Restaure tous les réglages par défaut',
    'about.reset.btn':        'Reset',
    'about.reset.confirm':    'Réinitialiser tous les paramètres ?',

    // ── Footer ───────────────────────────────────────────────
    'footer.tab':             'Onglet',
    'footer.close':           'Fermer',
    'footer.toggle':          'Ouvrir/Fermer',
    'footer.saved':           'Sauvegardé',
  },

  en: {
    // ── Joueurs ──────────────────────────────────────────────
    'player.one':       'Player',
    'player.many':      'Players',
    'player.range':     'Players',

    // ── Navigation principale ────────────────────────────────
    'nav.prev':         'Previous game',
    'nav.next':         'Next game',
    'nav.letter.prev':  'Previous letter',
    'nav.letter.next':  'Next letter',
    'nav.navigate':     'Navigate',

    // ── Ères consoles ─────────────────────────────────────────
    'era.all':          'All',
    'era.arcade':       'Arcade',
    'era.8bit':         '8-Bits',
    'era.16bit':        '16-Bits',
    'era.32bit':        '32-Bits',
    'era.64bit':        '64-Bits',
    'era.portable':     'Portable',
    'era.other':        'Other',

    // ── Info bar ──────────────────────────────────────────────
    'info.games':       'Games',

    // ── Console select ───────────────────────────────────────
    'console.title':    'Platform Selection',
    'page.title':       'Console Select',
    'resume.btn':        'RESUME',
    'card.real':        'real',
    'card.empty':       'empty',
    'card.game':        'Game',
    'card.games':       'Games',
    'card.soon':        'COMING SOON',
    'banner.coming':    'Coming soon',
    'console.fbneo':    'Arcade',
    'console.nes':      'NES',
    'console.md':       'Mega Drive',
    'console.snes':     'SNES',
    'console.gbc':      'GBC',
    'console.gba':      'GBA',
    'console.sms':      'Master System',
    'maker.fbneo':      'FinalBurn Neo',
    'maker.nes':        'Nintendo',
    'maker.md':         'Sega',
    'maker.snes':       'Nintendo',
    'maker.gbc':        'Nintendo',
    'maker.gba':        'Nintendo',
    'maker.sms':        'Sega',
    'console.full.fbneo':    'FBNeo - Arcade Games',
    'console.full.nes':       'Nintendo - NES - Famicom',
    'console.full.md':       'Sega - Mega Drive - Genesis',
    'console.full.snes':     'Nintendo - Super Nintendo Entertainment System',
    'console.full.gbc':      'Nintendo - Game Boy Color',
    'console.full.gba':      'Nintendo - Game Boy Advance',
    'console.full.sms':      'Sega - Master System - Mark III',

    // ── Boutons manette ──────────────────────────────────────
    'btn.play':         'Play',
    'btn.quit':         'Quit',
    'btn.screenshots':  'Screenshots',
    'btn.choose':       'Choose',

    // ── Menu options — titre & fermer ────────────────────────
    'opt.title':        'OPTIONS',
    'opt.title.amp':    '&',
    'opt.title.sub':    'SETTINGS',
    'opt.close':        'Close',

    // ── Onglets ──────────────────────────────────────────────
    'tab.audio':        'Audio',
    'tab.display':      'Display',
    'tab.interface':    'Interface',
    'tab.gamepad':      'Controller',
    'tab.language':     'Language',
    'tab.data':         'Data',
    'tab.about':        'About',

    // ── Data tab ─────────────────────────────────────────────
    'data.title':       'ScreenScraper',
    'data.user':        'ScreenScraper User',
    'data.password':     'Password',
    'data.save':        'Save',
    'data.xmltitle':    'Generate HyperList XML',
    'data.step1':       '1. Choose ROMs folder',
    'data.step1desc':   'Folder containing the games',
    'data.browse':      'Browse...',
    'data.selected':    'Selected folder',
    'data.nofolder':    'No folder chosen',
    'data.games':       'games',
    'data.step2':       '2. Console name (for XML)',
    'data.step2desc':   'XML will be: data/[name].xml',
    'data.choose':      '-- Choose a console --',
    'data.step3':       '3. Create the XML file',
    'data.step3desc':   'Creates data/[name].xml with all games',
    'data.createxml':   'Create XML',
    'data.progress':    'Progress',
    'data.saved':       'Credentials saved',
    'data.novailable':  'Function not available',
    'data.selectfolder':'Choose a ROMs folder first',
    'data.selectconsole':'Choose the console name',
    'data.created':     'XML created!',
    'data.error':       'Error',

    // ── Manette ──────────────────────────────────────────────
    'gp.mapping':       'Button mapping',
    'gp.deadzone':      'Joystick dead zone',
    'gp.dz.label':      'Dead zone',
    'gp.dz.desc':       'Minimum joystick movement threshold',
    'gp.reset':         'Reset mapping',

    // ── Audio ────────────────────────────────────────────────
    'audio.mix':              'Mixing',
    'audio.music.label':      'Music volume',
    'audio.music.desc':       'Background soundtrack level',
    'audio.sfx.label':        'Effects volume',
    'audio.sfx.desc':         'Clicks, transitions, navigation',
    'audio.behavior':         'Behavior',
    'audio.mute.label':       'Global mute',
    'audio.mute.desc':        'Disables all interface sounds',

    // ── Affichage ────────────────────────────────────────────
    'display.mode':           'Display mode',
    'display.fs.label':       'Fullscreen',
    'display.fs.desc':        'Takes up the full screen surface',
    'display.clock.label':    'Show clock',
    'display.clock.desc':     'Clock in the right panel',
    'display.perf':           'Performance',
    'display.fps.label':      'FPS limit',
    'display.fps.desc':       '30 / 60 / 120 / 144 / 240 fps',

    // ── Interface ────────────────────────────────────────────
    'ui.anim':                'Navigation & Animations',
    'ui.speed.label':         'Transition speed',
    'ui.speed.desc':          'Duration of animations between games',
    'ui.speed.fast':          'Fast',
    'ui.speed.normal':        'Normal',
    'ui.speed.slow':          'Slow',
    'ui.grain.label':         'Grain intensity',
    'ui.grain.desc':          'Cinematic grain texture on the background',
    'ui.cursor':              'Cursor & Color',
    'ui.cursize.label':       'Cursor size',
    'ui.cursize.desc':        'Diameter of the custom pointer',
    'ui.accent.label':        'Accent color',
    'ui.accent.desc':         'Main interface tint',

    // ── Langue ───────────────────────────────────────────────
    'lang.select':            'Select language',
    'lang.subs':              'Subtitles',
    'lang.subs.show.label':   'Show subtitles',
    'lang.subs.show.desc':    'In embedded trailers',

    // ── À propos ─────────────────────────────────────────────
    'about.version':          'Version',
    'about.build':            'Build',
    'about.engine':           'Engine',
    'about.platform':         'Platform',
    'about.maxres':           'Max resolution',
    'about.maintenance':      'Maintenance',
    'about.cache.label':      'Clear cache',
    'about.cache.desc':       'Removes thumbnails and temporary data',
    'about.cache.btn':        'Clear',
    'about.reset.label':      'Reset settings',
    'about.reset.desc':       'Restores all default settings',
    'about.reset.btn':        'Reset',
    'about.reset.confirm':    'Reset all settings?',

    // ── Footer ───────────────────────────────────────────────
    'footer.tab':             'Tab',
    'footer.close':           'Close',
    'footer.toggle':          'Open/Close',
    'footer.saved':           'Saved',
  },

  es: {
    // ── Joueurs ──────────────────────────────────────────────
    'player.one':       'Jugador',
    'player.many':      'Jugadores',
    'player.range':     'Jugadores',

    // ── Navigation principale ────────────────────────────────
    'nav.prev':         'Juego anterior',
    'nav.next':         'Juego siguiente',
    'nav.letter.prev':  'Letra anterior',
    'nav.letter.next':  'Letra siguiente',
    'nav.navigate':     'Navegar',

    // ── Ères consoles ─────────────────────────────────────────
    'era.all':          'Todo',
    'era.arcade':       'Arcade',
    'era.8bit':         '8-Bit',
    'era.16bit':        '16-Bit',
    'era.32bit':        '32-Bit',
    'era.64bit':        '64-Bit',
    'era.portable':     'Portátil',
    'era.other':        'Otro',

    // ── Info bar ──────────────────────────────────────────────
    'info.games':       'Juegos',

    // ── Console select ───────────────────────────────────────
    'console.title':    'Selección de plataforma',
    'page.title':       'Seleccionar Consola',
    'resume.btn':        'CONTINUAR',
    'card.real':        'real',
    'card.empty':       'vacío',
    'card.game':        'Juego',
    'card.games':       'Juegos',
    'card.soon':        'PRÓXIMAMENTE',
    'banner.coming':    'Próximamente disponible',
    'console.fbneo':    'Arcade',
    'console.nes':      'NES',
    'console.md':       'Mega Drive',
    'console.snes':     'SNES',
    'console.gbc':      'GBC',
    'console.gba':      'GBA',
    'console.sms':      'Master System',
    'maker.fbneo':      'FinalBurn Neo',
    'maker.nes':        'Nintendo',
    'maker.md':         'Sega',
    'maker.snes':       'Nintendo',
    'maker.gbc':        'Nintendo',
    'maker.gba':        'Nintendo',
    'maker.sms':        'Sega',
    'console.full.fbneo':    'FBNeo - Jeux d\'Arcade',
    'console.full.nes':       'Nintendo - NES - Famicom',
    'console.full.md':       'Sega - Mega Drive - Genesis',
    'console.full.snes':     'Nintendo - Super Nintendo Entertainment System',
    'console.full.gbc':      'Nintendo - Game Boy Color',
    'console.full.gba':      'Nintendo - Game Boy Advance',
    'console.full.sms':      'Sega - Master System - Mark III',

    // ── Boutons manette ──────────────────────────────────────
    'btn.play':         'Jugar',
    'btn.quit':         'Salir',
    'btn.screenshots':  'Capturas',
    'btn.choose':       'Elegir',

    // ── Menu options — titre & fermer ────────────────────────
    'opt.title':        'OPCIONES',
    'opt.title.amp':    '&',
    'opt.title.sub':    'AJUSTES',
    'opt.close':        'Cerrar',

    // ── Onglets ──────────────────────────────────────────────
    'tab.audio':        'Audio',
    'tab.display':      'Pantalla',
    'tab.interface':    'Interfaz',
    'tab.gamepad':      'Mando',
    'tab.language':     'Idioma',
    'tab.data':         'Datos',
    'tab.about':        'Acerca de',

    // ── Data tab ─────────────────────────────────────────────
    'data.title':       'ScreenScraper',
    'data.user':        'Usuario ScreenScraper',
    'data.password':    'Contraseña',
    'data.save':        'Guardar',
    'data.xmltitle':    'Generar HyperList XML',
    'data.step1':       '1. Elegir carpeta ROMs',
    'data.step1desc':   'Carpeta con los juegos',
    'data.browse':      'Examinar...',
    'data.selected':    'Carpeta seleccionada',
    'data.nofolder':    'Ninguna carpeta elegida',
    'data.games':       'juegos',
    'data.step2':       '2. Nombre de la consola (para el XML)',
    'data.step2desc':   'El XML será: data/[nombre].xml',
    'data.choose':      '-- Elegir una consola --',
    'data.step3':       '3. Crear el archivo XML',
    'data.step3desc':   'Crea data/[nombre].xml con todos los juegos',
    'data.createxml':   'Crear XML',
    'data.progress':    'Progreso',
    'data.saved':       'Credenciales guardadas',
    'data.novailable':  'Función no disponible',
    'data.selectfolder':'Elige primero una carpeta ROMs',
    'data.selectconsole':'Elige el nombre de la consola',
    'data.created':     '¡XML creado!',
    'data.error':       'Error',

    // ── Manette ──────────────────────────────────────────────
    'gp.mapping':       'Asignación de botones',
    'gp.deadzone':      'Zona muerta del joystick',
    'gp.dz.label':      'Zona muerta',
    'gp.dz.desc':       'Umbral mínimo de movimiento del joystick',
    'gp.reset':         'Restablecer asignación',

    // ── Audio ────────────────────────────────────────────────
    'audio.mix':              'Mezcla',
    'audio.music.label':      'Volumen música',
    'audio.music.desc':       'Nivel de la banda sonora del menú',
    'audio.sfx.label':        'Volumen efectos',
    'audio.sfx.desc':         'Clics, transiciones, navegación',
    'audio.behavior':         'Comportamiento',
    'audio.mute.label':       'Silencio global',
    'audio.mute.desc':        'Desactiva todo el sonido de la interfaz',

    // ── Affichage ────────────────────────────────────────────
    'display.mode':           'Modo de pantalla',
    'display.fs.label':       'Fullscreen',
    'display.fs.desc':        'Ocupa toda la superficie de la pantalla',
    'display.clock.label':    'Mostrar reloj',
    'display.clock.desc':     'Reloj en el panel derecho',
    'display.perf':           'Rendimiento',
    'display.fps.label':      'Límite FPS',
    'display.fps.desc':       '30 / 60 / 120 / 144 / 240 fps',

    // ── Interface ────────────────────────────────────────────
    'ui.anim':                'Navegación y animaciones',
    'ui.speed.label':         'Velocidad de transición',
    'ui.speed.desc':          'Duración de las animaciones entre juegos',
    'ui.speed.fast':          'Rápido',
    'ui.speed.normal':        'Normal',
    'ui.speed.slow':          'Lento',
    'ui.grain.label':         'Intensidad del grano',
    'ui.grain.desc':          'Textura de grano cinematográfico en el fondo',
    'ui.cursor':              'Cursor y color',
    'ui.cursize.label':       'Tamaño del cursor',
    'ui.cursize.desc':        'Diámetro del puntero personalizado',
    'ui.accent.label':        'Color de acento',
    'ui.accent.desc':         'Tono principal de la interfaz',

    // ── Langue ───────────────────────────────────────────────
    'lang.select':            'Seleccionar idioma',
    'lang.subs':              'Subtítulos',
    'lang.subs.show.label':   'Mostrar subtítulos',
    'lang.subs.show.desc':    'En los tráilers integrados',

    // ── À propos ─────────────────────────────────────────────
    'about.version':          'Versión',
    'about.build':            'Compilación',
    'about.engine':           'Motor',
    'about.platform':         'Plataforma',
    'about.maxres':           'Resolución máx.',
    'about.maintenance':      'Mantenimiento',
    'about.cache.label':      'Vaciar caché',
    'about.cache.desc':       'Elimina miniaturas y datos temporales',
    'about.cache.btn':        'Vaciar',
    'about.reset.label':      'Restablecer ajustes',
    'about.reset.desc':       'Restaura todos los valores predeterminados',
    'about.reset.btn':        'Restablecer',
    'about.reset.confirm':    '¿Restablecer todos los ajustes?',

    // ── Footer ───────────────────────────────────────────────
    'footer.tab':             'Pestaña',
    'footer.close':           'Cerrar',
    'footer.toggle':          'Abrir/Cerrar',
    'footer.saved':           'Guardado',
  },

  ja: {
    // ── Joueurs ──────────────────────────────────────────────
    'player.one':       'プレイヤー',
    'player.many':      'プレイヤー',
    'player.range':     'プレイヤー',

    // ── Navigation principale ────────────────────────────────
    'nav.prev':         '前のゲーム',
    'nav.next':         '次のゲーム',
    'nav.letter.prev':  '前の文字',
    'nav.letter.next':  '次の文字',
    'nav.navigate':     '移動',

    // ── Ères consoles ─────────────────────────────────────────
    'era.all':          'すべて',
    'era.arcade':       'アーケード',
    'era.8bit':         '8ビット',
    'era.16bit':        '16ビット',
    'era.32bit':        '32ビット',
    'era.64bit':        '64ビット',
    'era.portable':     '携帯',
    'era.other':        'その他',

    // ── Info bar ──────────────────────────────────────────────
    'info.games':       'ゲーム',

    // ── Console select ───────────────────────────────────────
    'console.title':    'プラットフォーム選択',
    'page.title':       'コンソール選択',
    'resume.btn':        '再開',
    'card.real':        'リアル',
    'card.empty':       '空',
    'card.game':        'ゲーム',
    'card.games':       'ゲーム',
    'card.soon':        '近日公開',
    'banner.coming':    'まもなく公開',
    'console.fbneo':    'アーケード',
    'console.nes':      'ファミコン',
    'console.md':       'メガドライブ',
    'console.snes':     'スーファミ',
    'console.gbc':      'ゲームボーイカラー',
    'console.gba':      'ゲームボーイアドバンス',
    'console.sms':      'マスターシステム',
    'maker.fbneo':      'FinalBurn Neo',
    'maker.nes':        '任天堂',
    'maker.md':         'セガ',
    'maker.snes':       '任天堂',
    'maker.gbc':        '任天堂',
    'maker.gba':        '任天堂',
    'maker.sms':        'セガ',
    'console.full.fbneo':    'FBNeo - アーケードゲーム',
    'console.full.nes':       '任天堂 - NES - ファミコン',
    'console.full.md':       'セガ - メガドライブ - ジェネシス',
    'console.full.snes':     '任天堂 - スーパーファミコン',
    'console.full.gbc':      '任天堂 - ゲームボーイカラー',
    'console.full.gba':      '任天堂 - ゲームボーイアドバンス',
    'console.full.sms':      'セガ - マスターシステム - マークIII',

    // ── Boutons manette ──────────────────────────────────────
    'btn.play':         'プレイ',
    'btn.quit':         '終了',
    'btn.screenshots':  'スクリーンショット',
    'btn.choose':       '選択',

    // ── Menu options — titre & fermer ────────────────────────
    'opt.title':        'オプション',
    'opt.title.amp':    '&',
    'opt.title.sub':    '設定',
    'opt.close':        '閉じる',

    // ── Onglets ──────────────────────────────────────────────
    'tab.audio':        'オーディオ',
    'tab.display':      'ディスプレイ',
    'tab.interface':    'インターフェース',
    'tab.gamepad':      'コントローラー',
    'tab.language':     '言語',
    'tab.data':         'データ',
    'tab.about':        '情報',

    // ── Data tab ─────────────────────────────────────────────
    'data.title':       'ScreenScraper',
    'data.user':        'ScreenScraperユーザー',
    'data.password':     'パスワード',
    'data.save':        '保存',
    'data.xmltitle':    'HyperList XML生成',
    'data.step1':       '1. ROMフォルダを選択',
    'data.step1desc':   'ゲームが含まれるフォルダ',
    'data.browse':      '参照...',
    'data.selected':    '選択されたフォルダ',
    'data.nofolder':    'フォルダが選択されていません',
    'data.games':       'ゲーム',
    'data.step2':       '2. コンソール名（XML用）',
    'data.step2desc':   'XMLは以下になります: data/[名前].xml',
    'data.choose':      '-- コンソールを選択 --',
    'data.step3':       '3. XMLファイルを作成',
    'data.step3desc':   '全ゲームでdata/[名前].xmlを作成',
    'data.createxml':   'XML作成',
    'data.progress':    '進捗',
    'data.saved':       '認証情報が保存されました',
    'data.novailable':  '機能が利用できません',
    'data.selectfolder':'最初にROMフォルダを選択してください',
    'data.selectconsole':'コンソール名を選択してください',
    'data.created':     'XMLが作成されました！',
    'data.error':       'エラー',

    // ── Manette ──────────────────────────────────────────────
    'gp.mapping':       'ボタン割り当て',
    'gp.deadzone':      'スティックのデッドゾーン',
    'gp.dz.label':      'デッドゾーン',
    'gp.dz.desc':       'スティックの最小入力しきい値',
    'gp.reset':         'マッピングをリセット',

    // ── Audio ────────────────────────────────────────────────
    'audio.mix':              'ミキシング',
    'audio.music.label':      '音楽の音量',
    'audio.music.desc':       'メニューのBGMレベル',
    'audio.sfx.label':        '効果音の音量',
    'audio.sfx.desc':         'クリック、トランジション、ナビゲーション',
    'audio.behavior':         '動作',
    'audio.mute.label':       'ミュート',
    'audio.mute.desc':        'インターフェースの全サウンドを無効にする',

    // ── Affichage ────────────────────────────────────────────
    'display.mode':           '表示モード',
    'display.fs.label':       'Fullscreen',
    'display.fs.desc':        '画面全体を使用する',
    'display.clock.label':    '時計を表示',
    'display.clock.desc':     '右パネルに時計を表示',
    'display.perf':           'パフォーマンス',
    'display.fps.label':      'FPS制限',
    'display.fps.desc':       '30 / 60 / 120 / 144 / 240 fps',

    // ── Interface ────────────────────────────────────────────
    'ui.anim':                'ナビゲーションとアニメーション',
    'ui.speed.label':         'トランジション速度',
    'ui.speed.desc':          'ゲーム間のアニメーション時間',
    'ui.speed.fast':          '速い',
    'ui.speed.normal':        '普通',
    'ui.speed.slow':          '遅い',
    'ui.grain.label':         'グレイン強度',
    'ui.grain.desc':          '背景のフィルムグレイン',
    'ui.cursor':              'カーソルとカラー',
    'ui.cursize.label':       'カーソルサイズ',
    'ui.cursize.desc':        'カスタムポインターの直径',
    'ui.accent.label':        'アクセントカラー',
    'ui.accent.desc':         'インターフェースのメインカラー',

    // ── Langue ───────────────────────────────────────────────
    'lang.select':            '言語を選択',
    'lang.subs':              '字幕',
    'lang.subs.show.label':   '字幕を表示',
    'lang.subs.show.desc':    '内蔵トレーラーで表示',

    // ── À propos ─────────────────────────────────────────────
    'about.version':          'バージョン',
    'about.build':            'ビルド',
    'about.engine':           'エンジン',
    'about.platform':         'プラットフォーム',
    'about.maxres':           '最大解像度',
    'about.maintenance':      'メンテナンス',
    'about.cache.label':      'キャッシュを消去',
    'about.cache.desc':       'サムネイルと一時データを削除する',
    'about.cache.btn':        '消去',
    'about.reset.label':      '設定をリセット',
    'about.reset.desc':       'すべての設定をデフォルトに戻す',
    'about.reset.btn':        'リセット',
    'about.reset.confirm':    'すべての設定をリセットしますか？',

    // ── Footer ───────────────────────────────────────────────
    'footer.tab':             'タブ',
    'footer.close':           '閉じる',
    'footer.toggle':          '開く/閉じる',
    'footer.saved':           '保存済み',
  },

  de: {
    // ── Joueurs ──────────────────────────────────────────────
    'player.one':       'Spieler',
    'player.many':      'Spieler',
    'player.range':     'Spieler',

    // ── Navigation principale ──────────────────────────────
    'nav.prev':         'Vorheriges Spiel',
    'nav.next':         'Nächstes Spiel',
    'nav.letter.prev':  'Vorheriger Buchstabe',
    'nav.letter.next':  'Nächster Buchstabe',
    'nav.navigate':     'Navigieren',

    // ── Ères consoles ─────────────────────────────────────────
    'era.all':          'Alle',
    'era.arcade':       'Arcade',
    'era.8bit':         '8-Bits',
    'era.16bit':        '16-Bits',
    'era.32bit':        '32-Bits',
    'era.64bit':        '64-Bits',
    'era.portable':     'Tragbar',
    'era.other':        'Andere',

    // ── Info bar ──────────────────────────────────────────────
    'info.games':       'Spiele',

    // ── Console select ───────────────────────────────────────
    'console.title':    'Plattform-Auswahl',
    'page.title':       'Konsole Auswählen',
    'resume.btn':        'FORTSETZEN',
    'card.real':        'echt',
    'card.empty':       'leer',
    'card.game':        'Spiel',
    'card.games':       'Spiele',
    'card.soon':        'BALDI',
    'banner.coming':    'Demnächst verfügbar',
    'console.fbneo':    'Arcade',
    'console.nes':      'NES',
    'console.md':       'Mega Drive',
    'console.snes':     'SNES',
    'console.gbc':      'GBC',
    'console.gba':      'GBA',
    'console.sms':      'Master System',
    'maker.fbneo':      'FinalBurn Neo',
    'maker.nes':        'Nintendo',
    'maker.md':         'Sega',
    'maker.snes':       'Nintendo',
    'maker.gbc':        'Nintendo',
    'maker.gba':        'Nintendo',
    'maker.sms':        'Sega',
    'console.full.fbneo':    'FBNeo - Arcade-Spiele',
    'console.full.nes':       'Nintendo - NES - Famicom',
    'console.full.md':       'Sega - Mega Drive - Genesis',
    'console.full.snes':     'Nintendo - Super Nintendo Entertainment System',
    'console.full.gbc':      'Nintendo - Game Boy Color',
    'console.full.gba':      'Nintendo - Game Boy Advance',
    'console.full.sms':      'Sega - Master System - Mark III',

    // ── Boutons manette ──────────────────────────────────────
    'btn.play':         'Spielen',
    'btn.quit':         'Beenden',
    'btn.screenshots':  'Screenshots',
    'btn.choose':       'Auswählen',

    // ── Menu options — titre & fermer ────────────────────────
    'opt.title':        'OPTIONEN',
    'opt.title.amp':    '&',
    'opt.title.sub':    'EINSTELLUNGEN',
    'opt.close':        'Schließen',

    // ── Onglets ──────────────────────────────────────────────
    'tab.audio':        'Audio',
    'tab.display':      'Anzeige',
    'tab.interface':    'Oberfläche',
    'tab.gamepad':      'Controller',
    'tab.language':     'Sprache',
    'tab.data':         'Daten',
    'tab.about':        'Über',

    // ── Data tab ─────────────────────────────────────────────
    'data.title':       'ScreenScraper',
    'data.user':        'ScreenScraper Benutzer',
    'data.password':     'Passwort',
    'data.save':        'Speichern',
    'data.xmltitle':    'HyperList XML erstellen',
    'data.step1':       '1. ROMs-Ordner wählen',
    'data.step1desc':   'Ordner mit den Spielen',
    'data.browse':      'Durchsuchen...',
    'data.selected':    'Ausgewählter Ordner',
    'data.nofolder':    'Kein Ordner gewählt',
    'data.games':       'Spiele',
    'data.step2':       '2. Konsolenname (für XML)',
    'data.step2desc':   'XML wird: data/[Name].xml',
    'data.choose':      '-- Konsole wählen --',
    'data.step3':       '3. XML-Datei erstellen',
    'data.step3desc':   'Erstellt data/[Name].xml mit allen Spielen',
    'data.createxml':   'XML erstellen',
    'data.progress':    'Fortschritt',
    'data.saved':       'Anmeldedaten gespeichert',
    'data.novailable':  'Funktion nicht verfügbar',
    'data.selectfolder':'Wähle zuerst einen ROMs-Ordner',
    'data.selectconsole':'Wähle den Konsolennamen',
    'data.created':     'XML erstellt!',
    'data.error':       'Fehler',

    // ── Manette ──────────────────────────────────────────────
    'gp.mapping':       'Tastenbelegung',
    'gp.deadzone':      'Joystick-Totzone',
    'gp.dz.label':      'Totzone',
    'gp.dz.desc':       'Minimale Joystick-Bewegungsschwelle',
    'gp.reset':         'Belegung zurücksetzen',

    // ── Audio ────────────────────────────────────────────────
    'audio.mix':              'Mischung',
    'audio.music.label':      'Musiklautstärke',
    'audio.music.desc':       'Pegel des Menü-Soundtracks',
    'audio.sfx.label':        'Effektlautstärke',
    'audio.sfx.desc':         'Klicks, Übergänge, Navigation',
    'audio.behavior':         'Verhalten',
    'audio.mute.label':       'Stummschalten',
    'audio.mute.desc':        'Deaktiviert alle Interface-Sounds',

    // ── Affichage ────────────────────────────────────────────
    'display.mode':           'Anzeigemodus',
    'display.fs.label':       'Fullscreen',
    'display.fs.desc':        'Belegt die gesamte Bildschirmfläche',
    'display.clock.label':    'Uhr anzeigen',
    'display.clock.desc':     'Uhr im rechten Panel',
    'display.perf':           'Leistung',
    'display.fps.label':      'FPS-Limit',
    'display.fps.desc':       '30 / 60 / 120 / 144 / 240 fps',

    // ── Interface ────────────────────────────────────────────
    'ui.anim':                'Navigation & Animationen',
    'ui.speed.label':         'Übergangsgeschwindigkeit',
    'ui.speed.desc':          'Dauer der Animationen zwischen Spielen',
    'ui.speed.fast':          'Schnell',
    'ui.speed.normal':        'Normal',
    'ui.speed.slow':          'Langsam',
    'ui.grain.label':         'Körnung',
    'ui.grain.desc':          'Filmkorn-Textur im Hintergrund',
    'ui.cursor':              'Cursor & Farbe',
    'ui.cursize.label':       'Cursorgröße',
    'ui.cursize.desc':        'Durchmesser des benutzerdefinierten Zeigers',
    'ui.accent.label':        'Akzentfarbe',
    'ui.accent.desc':         'Hauptton der Benutzeroberfläche',

    // ── Langue ───────────────────────────────────────────────
    'lang.select':            'Sprache auswählen',
    'lang.subs':              'Untertitel',
    'lang.subs.show.label':   'Untertitel anzeigen',
    'lang.subs.show.desc':    'In integrierten Trailern',

    // ── À propos ─────────────────────────────────────────────
    'about.version':          'Version',
    'about.build':            'Build',
    'about.engine':           'Engine',
    'about.platform':         'Plattform',
    'about.maxres':           'Max. Auflösung',
    'about.maintenance':      'Wartung',
    'about.cache.label':      'Cache leeren',
    'about.cache.desc':       'Entfernt Vorschaubilder und temporäre Daten',
    'about.cache.btn':        'Leeren',
    'about.reset.label':      'Einstellungen zurücksetzen',
    'about.reset.desc':       'Stellt alle Standardeinstellungen wieder her',
    'about.reset.btn':        'Zurücksetzen',
    'about.reset.confirm':    'Alle Einstellungen zurücksetzen?',

    // ── Footer ───────────────────────────────────────────────
    'footer.tab':             'Tab',
    'footer.close':           'Schließen',
    'footer.toggle':          'Öffnen/Schließen',
    'footer.saved':           'Gespeichert',
  },

  it: {
    // ── Joueurs ──────────────────────────────────────────────
    'player.one':       'Giocatore',
    'player.many':      'Giocatori',
    'player.range':     'Giocatori',

    // ── Navigation principale ────────────────────────────────
    'nav.prev':         'Gioco precedente',
    'nav.next':         'Gioco successivo',
    'nav.letter.prev':  'Lettera precedente',
    'nav.letter.next':  'Lettra successiva',
    'nav.navigate':     'Navigare',

    // ── Ères consoles ─────────────────────────────────────────
    'era.all':          'Tutto',
    'era.arcade':       'Arcade',
    'era.8bit':         '8-Bits',
    'era.16bit':        '16-Bits',
    'era.32bit':        '32-Bits',
    'era.64bit':        '64-Bits',
    'era.portable':     'Portatile',
    'era.other':        'Altro',

    // ── Info bar ──────────────────────────────────────────────
    'info.games':       'Giochi',

    // ── Console select ───────────────────────────────────────
    'console.title':    'Selezione piattaforma',
    'page.title':       'Seleziona Console',
    'resume.btn':        'CONTINUA',
    'card.real':        'reale',
    'card.empty':       'vuoto',
    'card.game':        'Gioco',
    'card.games':       'Giochi',
    'card.soon':        'PRESTO',
    'banner.coming':    'Disponibile a breve',
    'console.fbneo':    'Arcade',
    'console.nes':      'NES',
    'console.md':       'Mega Drive',
    'console.snes':     'SNES',
    'console.gbc':      'GBC',
    'console.gba':      'GBA',
    'console.sms':      'Master System',
    'maker.fbneo':      'FinalBurn Neo',
    'maker.nes':        'Nintendo',
    'maker.md':         'Sega',
    'maker.snes':       'Nintendo',
    'maker.gbc':        'Nintendo',
    'maker.gba':        'Nintendo',
    'maker.sms':        'Sega',
    'console.full.fbneo':    'FBNeo - Giochi Arcade',
    'console.full.nes':       'Nintendo - NES - Famicom',
    'console.full.md':       'Sega - Mega Drive - Genesis',
    'console.full.snes':     'Nintendo - Super Nintendo Entertainment System',
    'console.full.gbc':      'Nintendo - Game Boy Color',
    'console.full.gba':      'Nintendo - Game Boy Advance',
    'console.full.sms':      'Sega - Master System - Mark III',

    // ── Boutons manette ──────────────────────────────────────
    'btn.play':         'Gioca',
    'btn.quit':         'Esci',
    'btn.screenshots':  'Screenshot',
    'btn.choose':       'Scegli',

    // ── Menu options — titre & fermer ────────────────────────
    'opt.title':        'OPZIONI',
    'opt.title.amp':    '&',
    'opt.title.sub':    'IMPOSTAZIONI',
    'opt.close':        'Chiudi',

    // ── Onglets ──────────────────────────────────────────────
    'tab.audio':        'Audio',
    'tab.display':      'Schermo',
    'tab.interface':    'Interfaccia',
    'tab.gamepad':      'Controller',
    'tab.language':     'Lingua',
    'tab.data':         'Dati',
    'tab.about':        'Info',

    // ── Data tab ─────────────────────────────────────────────
    'data.title':       'ScreenScraper',
    'data.user':        'Utente ScreenScraper',
    'data.password':     'Password',
    'data.save':        'Salva',
    'data.xmltitle':    'Genera HyperList XML',
    'data.step1':       '1. Scegli cartella ROMs',
    'data.step1desc':   'Cartella contenente i giochi',
    'data.browse':      'Sfoglia...',
    'data.selected':    'Cartella selezionata',
    'data.nofolder':    'Nessuna cartella scelta',
    'data.games':       'giochi',
    'data.step2':       '2. Nome console (per XML)',
    'data.step2desc':   'XML sarà: data/[nome].xml',
    'data.choose':      '-- Scegli una console --',
    'data.step3':       '3. Crea il file XML',
    'data.step3desc':   'Crea data/[nome].xml con tutti i giochi',
    'data.createxml':   'Crea XML',
    'data.progress':    'Progresso',
    'data.saved':       'Credenziali salvate',
    'data.novailable':  'Funzione non disponibile',
    'data.selectfolder':'Scegli prima una cartella ROMs',
    'data.selectconsole':'Scegli il nome della console',
    'data.created':     'XML creato!',
    'data.error':       'Errore',

    // ── Manette ──────────────────────────────────────────────
    'gp.mapping':       'Assegnazione tasti',
    'gp.deadzone':      'Zona morta joystick',
    'gp.dz.label':      'Zona morta',
    'gp.dz.desc':       'Soglia minima di movimento del joystick',
    'gp.reset':         'Ripristina assegnazione',

    // ── Audio ────────────────────────────────────────────────
    'audio.mix':              'Missaggio',
    'audio.music.label':      'Volume musica',
    'audio.music.desc':       'Livello della colonna sonora del menù',
    'audio.sfx.label':        'Volume effetti',
    'audio.sfx.desc':         'Clic, transizioni, navigazione',
    'audio.behavior':         'Comportamento',
    'audio.mute.label':       'Silenzio globale',
    'audio.mute.desc':        'Disattiva tutti i suoni dell\'interfaccia',

    // ── Affichage ────────────────────────────────────────────
    'display.mode':           'Modalità schermo',
    'display.fs.label':       'Fullscreen',
    'display.fs.desc':        'Occupa tutta la superficie dello schermo',
    'display.clock.label':    'Mostra orologio',
    'display.clock.desc':     'Orologio nel pannello destro',
    'display.perf':           'Prestazioni',
    'display.fps.label':      'Limite FPS',
    'display.fps.desc':       '30 / 60 / 120 / 144 / 240 fps',

    // ── Interface ────────────────────────────────────────────
    'ui.anim':                'Navigazione e animazioni',
    'ui.speed.label':         'Velocità di transizione',
    'ui.speed.desc':          'Durata delle animazioni tra i giochi',
    'ui.speed.fast':          'Veloce',
    'ui.speed.normal':        'Normale',
    'ui.speed.slow':          'Lento',
    'ui.grain.label':         'Intensità grana',
    'ui.grain.desc':          'Texture grana cinematografica sullo sfondo',
    'ui.cursor':              'Cursore e colore',
    'ui.cursize.label':       'Dimensione cursore',
    'ui.cursize.desc':        'Diametro del puntatore personalizzato',
    'ui.accent.label':        'Colore accento',
    'ui.accent.desc':         'Tono principale dell\'interfaccia',

    // ── Langue ───────────────────────────────────────────────
    'lang.select':            'Seleziona lingua',
    'lang.subs':              'Sottotitoli',
    'lang.subs.show.label':   'Mostra sottotitoli',
    'lang.subs.show.desc':    'Nei trailer integrati',

    // ── À propos ─────────────────────────────────────────────
    'about.version':          'Versione',
    'about.build':            'Build',
    'about.engine':           'Motore',
    'about.platform':         'Piattaforma',
    'about.maxres':           'Risoluzione max',
    'about.maintenance':      'Manutenzione',
    'about.cache.label':      'Svuota cache',
    'about.cache.desc':       'Rimuove miniature e dati temporanei',
    'about.cache.btn':        'Svuota',
    'about.reset.label':      'Ripristina impostazioni',
    'about.reset.desc':       'Ripristina tutte le impostazioni predefinite',
    'about.reset.btn':        'Ripristina',
    'about.reset.confirm':    'Ripristinare tutte le impostazioni?',

    // ── Footer ───────────────────────────────────────────────
    'footer.tab':             'Scheda',
    'footer.close':           'Chiudi',
    'footer.toggle':          'Apri/Chiudi',
    'footer.saved':           'Salvato',
  },

};

// ─────────────────────────────────────────────────────────────
//  GENRES — traduction des genres FBNeo (valeurs du XML)
//  Clé = chaîne exacte ou normalisée du XML (lowercase, trim)
//  Si un genre du XML ne correspond à aucune clé, il s'affiche tel quel.
// ─────────────────────────────────────────────────────────────
export const GENRES = {

  // ── Shoot 'em up ─────────────────────────────────────────
  "shoot 'em up":       { fr: "Shoot 'em up", en: "Shoot 'em up", es: "Matamarcianos",   de: "Shoot 'em up",  it: "Sparatutto",    ja: "シューティング"   },
  "shooter":            { fr: "Shoot 'em up", en: "Shooter",       es: "Shooter",         de: "Shooter",       it: "Sparatutto",    ja: "シューティング"   },
  "vertical scrolling shooter": { fr: "Shoot vertical", en: "Vertical Shooter", es: "Shooter vertical", de: "Vertikaler Shooter", it: "Sparatutto verticale", ja: "縦スクロール"  },
  "horizontal scrolling shooter": { fr: "Shoot horizontal", en: "Horizontal Shooter", es: "Shooter horizontal", de: "Horizontaler Shooter", it: "Sparatutto orizzontale", ja: "横スクロール" },

  // ── Beat 'em up ───────────────────────────────────────────
  "beat 'em up":        { fr: "Beat 'em up",  en: "Beat 'em up",   es: "Yo contra el barrio", de: "Beat 'em up",  it: "Picchiaduro",   ja: "ベルトアクション" },
  "beat-'em-up":        { fr: "Beat 'em up",  en: "Beat 'em up",   es: "Yo contra el barrio", de: "Beat 'em up",  it: "Picchiaduro",   ja: "ベルトアクション" },

  // ── Combat / Fighting ─────────────────────────────────────
  "fighting":           { fr: "Combat",       en: "Fighting",      es: "Lucha",           de: "Kampfspiel",    it: "Picchiaduro",   ja: "格闘ゲーム"       },
  "versus fighting":    { fr: "Combat",       en: "Fighting",      es: "Lucha",           de: "Kampfspiel",    it: "Picchiaduro",   ja: "格闘ゲーム"       },

  // ── Action / Plateforme ───────────────────────────────────
  "action":             { fr: "Action",       en: "Action",        es: "Acción",          de: "Action",        it: "Azione",        ja: "アクション"       },
  "platform":           { fr: "Plateforme",   en: "Platform",      es: "Plataformas",     de: "Plattform",     it: "Piattaforma",   ja: "プラットフォーム" },
  "platformer":         { fr: "Plateforme",   en: "Platform",      es: "Plataformas",     de: "Plattform",     it: "Piattaforma",   ja: "プラットフォーム" },
  "run and gun":        { fr: "Run and Gun",  en: "Run and Gun",   es: "Run and Gun",     de: "Run and Gun",   it: "Run and Gun",   ja: "ランアンドガン"   },

  // ── Puzzle / Réflexion ────────────────────────────────────
  "puzzle":             { fr: "Puzzle",       en: "Puzzle",        es: "Puzle",           de: "Puzzle",        it: "Puzzle",        ja: "パズル"           },
  "breakout / arkanoid":{ fr: "Casse-briques",en: "Breakout",      es: "Rompeladrillos",  de: "Breakout",      it: "Sparamattoni",  ja: "ブロック崩し"     },
  "mahjong":            { fr: "Mahjong",      en: "Mahjong",       es: "Mahjong",         de: "Mahjong",       it: "Mahjong",       ja: "麻雀"             },
  "board game":         { fr: "Jeu de plateau",en:"Board Game",    es: "Juego de mesa",   de: "Brettspiel",    it: "Gioco da tavolo",ja: "ボードゲーム"    },

  // ── Sport / Course ────────────────────────────────────────
  "sports":             { fr: "Sport",        en: "Sports",        es: "Deportes",        de: "Sport",         it: "Sport",         ja: "スポーツ"         },
  "racing":             { fr: "Course",       en: "Racing",        es: "Carreras",        de: "Rennspiel",     it: "Corsa",         ja: "レーシング"       },
  "racing / driving":   { fr: "Course",       en: "Racing",        es: "Carreras",        de: "Rennspiel",     it: "Corsa",         ja: "レーシング"       },

  // ── Aventure / RPG ────────────────────────────────────────
  "adventure":          { fr: "Aventure",     en: "Adventure",     es: "Aventura",        de: "Abenteuer",     it: "Avventura",     ja: "アドベンチャー"   },
  "role playing":       { fr: "RPG",          en: "RPG",           es: "RPG",             de: "Rollenspiel",   it: "GDR",           ja: "ロールプレイング" },
  "rpg":                { fr: "RPG",          en: "RPG",           es: "RPG",             de: "Rollenspiel",   it: "GDR",           ja: "ロールプレイング" },

  // ── Divers ────────────────────────────────────────────────
  "quiz / trivia":      { fr: "Quiz",         en: "Quiz",          es: "Quiz",            de: "Quiz",          it: "Quiz",          ja: "クイズ"           },
  "casino":             { fr: "Casino",       en: "Casino",        es: "Casino",          de: "Casino",        it: "Casinò",        ja: "カジノ"           },
  "simulation":         { fr: "Simulation",   en: "Simulation",    es: "Simulación",      de: "Simulation",    it: "Simulazione",   ja: "シミュレーション" },
  "misc":               { fr: "Divers",       en: "Misc",          es: "Varios",          de: "Sonstiges",     it: "Varie",         ja: "その他"           },
};

/**
 * Traduit un genre du XML dans la langue courante.
 * Fallback : retourne le genre tel quel si non trouvé.
 */

// Langue courante — déclarée ici pour être disponible dans t() et tGenre()
let currentLang = 'fr';

export function tGenre(rawGenre) {
  if (!rawGenre) return '';
  const key = rawGenre.toLowerCase().trim();
  const entry = GENRES[key];
  if (!entry) return rawGenre; // genre inconnu → affiché tel quel
  return entry[currentLang] ?? entry['fr'] ?? rawGenre;
}



/**
 * Retourne la traduction d'une clé dans la langue courante.
 * Fallback sur FR si la clé n'existe pas dans la langue cible.
 */
export function t(key) {
  return TRANSLATIONS[currentLang]?.[key]
      ?? TRANSLATIONS['fr']?.[key]
      ?? key; // dernier recours : la clé elle-même
}

/**
 * Change la langue et met à jour tous les éléments
 * qui ont un attribut data-i18n dans le DOM.
 */
export function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) {
    console.warn(`[i18n] Langue inconnue : "${lang}", fallback sur "fr"`);
    lang = 'fr';
  }
  currentLang = lang;

  // Mettre à jour tous les éléments avec data-i18n
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n || '';
    el.textContent = t(key);
  });

  // Mettre à jour les placeholders si besoin
  document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach(el => {
    const placeholderKey = el.dataset.i18nPlaceholder;
    if (placeholderKey && 'placeholder' in el) {
      (el as HTMLInputElement).placeholder = t(placeholderKey);
    }
  });

  // Mettre à jour l'attribut lang du document
  document.documentElement.lang = lang;

  // Notifier les autres modules qu'ils doivent se rafraîchir
  // (ui.js écoute cet événement pour re-rendre les tags joueurs)
  window.dispatchEvent(new CustomEvent('aura-lang-change', { detail: { lang } }));

  console.log(`[i18n] Langue appliquée : ${lang}`);
}

export function getCurrentLang() { return currentLang; }
