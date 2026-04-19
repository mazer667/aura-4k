/**
 * ScreenScraper Downloader for AURA 4K
 * Usage: node download-screenscraper.js <console-name>
 * Example: node download-screenscraper.js "Nintendo - Super Nintendo Entertainment System"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// === CONFIGURATION ===
// Configure tes identifiants ScreenScraper ici (ou via variables d'environnement SS_USER et SS_PASS)
const SCREENSCRAPER_USER = process.env.SS_USER || 'bactino';
const SCREENSCRAPER_PASS = process.env.SS_PASS || 'sexions';
const SCREENSCRAPER_DEV_ID = process.env.SS_DEV_ID || 'bactino';
const SCREENSCRAPER_DEV_PASS = process.env.SS_DEV_PASS || 'grvhoQrDvvB';

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const ASSETS_DIR = path.join(ROOT, 'assets', 'consoles');

// === API ScreenScraper ===
function apiRequest(gameName, romPath, consoleId) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      softname: 'Aura4K',
      devid: SCREENSCRAPER_DEV_ID,
      devpassword: SCREENSCRAPER_DEV_PASS,
      ssid: SCREENSCRAPER_USER,
      sspassword: SCREENSCRAPER_PASS,
      systemeid: consoleId,
      rom: gameName,
      romtaille: fs.existsSync(romPath) ? fs.statSync(romPath).size : 0
    });

    const url = `https://www.screenscraper.fr/api2/gameInfos.php?${params.toString()}`;
    
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// === CONSOLE IDs ScreenScraper ===
const CONSOLE_IDS = {
  'Nintendo - Super Nintendo Entertainment System': 49,
  'Nintendo - Nintendo Entertainment System': 7,
  'Sega - Mega Drive - Genesis': 1,
  'FBNeo - Arcade Games': 74,
  'Nintendo - Game Boy': 4,
  'Nintendo - Game Boy Advance': 5,
  'Nintendo - Game Boy Color': 41,
  'Sega - Game Gear': 35,
  'Sega - Master System': 33,
  'Sony - PlayStation': 11,
  'Nintendo - Nintendo 64': 3,
  'Atari - Lynx': 13,
  'Sega - Saturn': 16,
  'Nintendo - DS': 8,
  'Sega - Dreamcast - NAOMI': 57,
  'SNK - Neo Geo AES-MVS': 142,
  'ScummVM': 20,
  'Doom': 2228,
};

// === EXTRACT ROM NAME ===
function extractRomName(filename) {
  return path.basename(filename, path.extname(filename));
}

// === GET EXISTING GAMES FROM XML ===
function getExistingGames(xmlPath) {
  if (!fs.existsSync(xmlPath)) return new Set();
  const content = fs.readFileSync(xmlPath, 'utf8');
  const matches = content.match(/<game name="([^"]+)"/g) || [];
  return new Set(matches.map(m => m.match(/<game name="([^"]+)"/)[1]));
}

// === BUILD XML ===
function buildXml(games) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<menu>\n';
  for (const game of games) {
    xml += `  <game name="${escapeXml(game.name)}">\n`;
    xml += `    <description>${escapeXml(game.description || game.name)}</description>\n`;
    if (game.manufacturer) xml += `    <manufacturer>${escapeXml(game.manufacturer)}</manufacturer>\n`;
    if (game.year) xml += `    <year>${game.year}</year>\n`;
    if (game.genre) xml += `    <genre>${escapeXml(game.genre)}</genre>\n`;
    if (game.players) xml += `    <players>${game.players}</players>\n`;
    if (game.rating) xml += `    <rating>${game.rating}</rating>\n`;
    xml += `    <enabled>Yes</enabled>\n`;
    xml += `  </game>\n`;
  }
  xml += '</menu>';
  return xml;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// === DOWNLOAD IMAGES ===
async function downloadImage(url, destPath) {
  if (fs.existsSync(destPath)) return true;
  
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else {
        file.close();
        fs.unlinkSync(destPath);
        resolve(false);
      }
    }).on('error', () => { file.close(); resolve(false); });
  });
}

// === MAIN ===
async function main() {
  const consoleName = process.argv[2];
  if (!consoleName) {
    console.log('Usage: node download-screenscraper.js "<console-name>"');
    console.log('\nConsoles disponibles:');
    for (const name of Object.keys(CONSOLE_IDS)) {
      console.log(`  - ${name}`);
    }
    return;
  }

  const consoleId = CONSOLE_IDS[consoleName];
  if (!consoleId) {
    console.error(`Console non trouvée: ${consoleName}`);
    return;
  }

  console.log(`\n=== ScreenScraper Downloader ===`);
  console.log(`Console: ${consoleName}`);
  console.log(`Console ID: ${consoleId}`);
  console.log(`Utilisateur: ${SCREENSCRAPER_USER}\n`);

  const romsDir = path.join(ASSETS_DIR, consoleName, 'roms');
  const imagesDir = path.join(ASSETS_DIR, consoleName, 'images');
  const xmlPath = path.join(DATA_DIR, `${consoleName}.xml`);

  if (!fs.existsSync(romsDir)) {
    console.error(`Dossier ROMs non trouvé: ${romsDir}`);
    return;
  }

  // Créer dossier data si nécessaire
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  // Lire les ROMs existantes
  const romFiles = fs.readdirSync(romsDir).filter(f => 
    !fs.statSync(path.join(romsDir, f)).isDirectory()
  );
  console.log(`${romFiles.length} ROMs trouvées`);

  // Vérifier les jeux déjà dans le XML
  const existingGames = getExistingGames(xmlPath);
  const newRoms = romFiles.filter(rom => !existingGames.has(extractRomName(rom)));
  console.log(`${existingGames.size} jeux déjà dans XML`);
  console.log(`${newRoms.length} nouvelles ROMs à traiter\n`);

  if (newRoms.length === 0) {
    console.log('Rien à faire !');
    return;
  }

  const games = [];
  let processed = 0;
  let downloaded = 0;

  for (const romFile of newRoms) {
    processed++;
    const romName = extractRomName(romFile);
    const romPath = path.join(romsDir, romFile);
    
    console.log(`[${processed}/${newRoms.length}] ${romName}`);

    try {
      const data = await apiRequest(romName, romPath, consoleId);
      
      if (data.response && data.response.game) {
        const game = data.response.game;
        
        // Créer dossier image
        const gameImageDir = path.join(imagesDir, romName);
        if (!fs.existsSync(gameImageDir)) {
          fs.mkdirSync(gameImageDir, { recursive: true });
          fs.mkdirSync(path.join(gameImageDir, 'Image centre'), { recursive: true });
          fs.mkdirSync(path.join(gameImageDir, 'screenshots'), { recursive: true });
        }

        // Télécharger image centre (boxart)
        if (game.boxart) {
          const boxartUrl = `https://www.screenscraper.fr${game.boxart}`;
          const boxartPath = path.join(gameImageDir, 'Image centre', 'boxart.webp');
          if (await downloadImage(boxartUrl, boxartPath)) {
            downloaded++;
            console.log(`  ✓ Boxart`);
          }
        }

        // Télécharger screenshots
        if (game.screenshots && game.screenshots.screenshot) {
          const screenshots = Array.isArray(game.screenshots.screenshot) 
            ? game.screenshots.screenshot 
            : [game.screenshots.screenshot];
          
          for (let i = 0; i < Math.min(screenshots.length, 5); i++) {
            const ssUrl = `https://www.screenscraper.fr${screenshots[i].url}`;
            const ssPath = path.join(gameImageDir, 'screenshots', `ss${i + 1}.webp`);
            if (await downloadImage(ssUrl, ssPath)) {
              downloaded++;
            }
          }
          if (screenshots.length > 0) console.log(`  ✓ ${screenshots.length} screenshots`);
        }

        games.push({
          name: romName,
          description: game.names?.name || game.names?.ename || romName,
          manufacturer: game.publishers?.publisher?.name || game.developers?.developer?.name || '',
          year: game.releaseDate ? game.releaseDate.slice(0, 4) : '',
          genre: game.genres?.genre ? (Array.isArray(game.genres.genre) ? game.genres.genre[0].text : game.genres.genre.text) : '',
          players: game.players || '1',
          rating: game.rating ? (parseFloat(game.rating) / 2).toFixed(1) : '12.0'
        });
      } else {
        // Jeu non trouvé, créer entrée basique
        games.push({
          name: romName,
          description: romName,
          manufacturer: '',
          year: '',
          genre: '',
          players: '1',
          rating: '12.0'
        });
        console.log(`  ⚠ Non trouvé sur ScreenScraper`);
      }
    } catch (e) {
      games.push({
        name: romName,
        description: romName,
        manufacturer: '',
        year: '',
        genre: '',
        players: '1',
        rating: '12.0'
      });
      console.log(`  ✗ Erreur: ${e.message}`);
    }

    // Sauvegarder toutes les 50 ROMs
    if (processed % 50 === 0) {
      const existingXml = fs.existsSync(xmlPath) ? fs.readFileSync(xmlPath, 'utf8') : '<?xml version="1.0" encoding="UTF-8"?>\n<menu>\n';
      const endMenu = '</menu>';
      const existingContent = existingXml.replace(/<\/?menu>/g, '').trim();
      const newContent = games.map(g => {
        let xml = `  <game name="${escapeXml(g.name)}">\n`;
        xml += `    <description>${escapeXml(g.description || g.name)}</description>\n`;
        if (g.manufacturer) xml += `    <manufacturer>${escapeXml(g.manufacturer)}</manufacturer>\n`;
        if (g.year) xml += `    <year>${g.year}</year>\n`;
        if (g.genre) xml += `    <genre>${escapeXml(g.genre)}</genre>\n`;
        if (g.players) xml += `    <players>${g.players}</players>\n`;
        if (g.rating) xml += `    <rating>${g.rating}</rating>\n`;
        xml += `    <enabled>Yes</enabled>\n`;
        xml += `  </game>`;
        return xml;
      }).join('\n');
      
      fs.writeFileSync(xmlPath, `<?xml version="1.0" encoding="UTF-8"?>\n<menu>\n${existingContent}\n${newContent}\n</menu>`);
      console.log(`\n→ Sauvegarde auto (${processed} jeux)\n`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  // Sauvegarde finale
  const existingXml = fs.existsSync(xmlPath) ? fs.readFileSync(xmlPath, 'utf8') : '<?xml version="1.0" encoding="UTF-8"?>\n<menu>\n';
  const existingContent = existingXml.replace(/<\/?menu>/g, '').trim();
  const newContent = games.map(g => {
    let xml = `  <game name="${escapeXml(g.name)}">\n`;
    xml += `    <description>${escapeXml(g.description || g.name)}</description>\n`;
    if (g.manufacturer) xml += `    <manufacturer>${escapeXml(g.manufacturer)}</manufacturer>\n`;
    if (g.year) xml += `    <year>${g.year}</year>\n`;
    if (g.genre) xml += `    <genre>${escapeXml(g.genre)}</genre>\n`;
    if (g.players) xml += `    <players>${g.players}</players>\n`;
    if (g.rating) xml += `    <rating>${g.rating}</rating>\n`;
    xml += `    <enabled>Yes</enabled>\n`;
    xml += `  </game>`;
    return xml;
  }).join('\n');
  
  fs.writeFileSync(xmlPath, `<?xml version="1.0" encoding="UTF-8"?>\n<menu>\n${existingContent}\n${newContent}\n</menu>`);

  console.log(`\n=== Terminé ===`);
  console.log(`${processed} ROMs traitées`);
  console.log(`${downloaded} images téléchargées`);
  console.log(`XML: ${xmlPath}`);
}

main().catch(console.error);
