/**
 * AURA 4K - Tests Unitaires
 * Usage: node tests.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ✗ ${name}`);
    console.log(`    Erreur: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(a, b, message) {
  if (a !== b) throw new Error(message || `${a} !== ${b}`);
}

console.log('\n========================================');
console.log('   AURA 4K - Tests');
console.log('========================================\n');

// === Tests des fichiers ===
console.log('Tests des fichiers...');

test('index.html existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'index.html')));
});

test('console-select.html existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'console-select.html')));
});

test('config.json existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'config.json')));
});

test('main.js existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'main.js')));
});

test('preload.js existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'preload.js')));
});

// === Tests des modules JS ===
console.log('\nTests des modules JS...');

const jsFiles = [
  'js/state.js',
  'js/i18n.js',
  'js/audio.js',
  'js/music.js',
  'js/imageCache.js',
  'js/gameCache.js',
  'js/games.js',
  'js/navigation.js',
  'js/ui.js',
  'js/options.js',
  'js/gamepad.js'
];

jsFiles.forEach(file => {
  test(`${file} existe`, () => {
    assert(fs.existsSync(path.join(ROOT, file)));
  });
});

// === Tests de config.json ===
console.log('\nTests de configuration...');

test('config.json est valide JSON', () => {
  const content = fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8');
  JSON.parse(content);
});

test('consoles.json existe et est valide', () => {
  const consolesPath = path.join(ROOT, 'consoles.json');
  assert(fs.existsSync(consolesPath), 'consoles.json manquant');
  const consoles = JSON.parse(fs.readFileSync(consolesPath, 'utf8'));
  assert(Object.keys(consoles).length > 0, 'Aucune console définie');
});

test('config.json contient retroarch', () => {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
  assert(config.retroarch, 'retroarch manquant');
});

// === Tests de structure ===
console.log('\nTests de structure...');

test('Dossier sounds existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'sounds')));
});

test('Dossier assets existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'assets')));
});

test('Dossier data existe', () => {
  assert(fs.existsSync(path.join(ROOT, 'data')));
});

// === Tests de contenu JS ===
console.log('\nTests de contenu JS...');

test('games.js exporte les fonctions', () => {
  const content = fs.readFileSync(path.join(ROOT, 'js/games.js'), 'utf8');
  assert(content.includes('export function'), 'Pas de fonction exportée');
});

test('i18n.js a les traductions FR', () => {
  const content = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');
  assert(content.includes('fr:'), 'Pas de traductions FR');
});

test('gamepad.js a le mapping', () => {
  const content = fs.readFileSync(path.join(ROOT, 'js/gamepad.js'), 'utf8');
  assert(content.includes('DEFAULT_BTN'), 'Pas de mapping');
});

test('options.js a les settings', () => {
  const content = fs.readFileSync(path.join(ROOT, 'js/options.js'), 'utf8');
  assert(content.includes('DEFAULTS'), 'Pas de settings par défaut');
});

// === Résumé ===
console.log('\n========================================');
console.log('   RÉSULTATS');
console.log('========================================');
console.log(`\nRéussis: ${passed}`);
console.log(`Échoués: ${failed}`);
console.log(`Total: ${passed + failed}\n`);

if (failed > 0) {
  console.log('⚠️  Certains tests ont échoué!\n');
  process.exit(1);
} else {
  console.log('✓ Tous les tests passent!\n');
  process.exit(0);
}
