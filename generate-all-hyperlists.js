/**
 * HyperList Generator for AURA 4K
 * Génère les HyperLists pour toutes les consoles
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const ASSETS_DIR = path.join(ROOT, 'assets', 'consoles');

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getGamesFromXml(xmlPath) {
  const games = {};
  if (!fs.existsSync(xmlPath)) return games;
  
  const content = fs.readFileSync(xmlPath, 'utf8');
  const gameMatches = content.match(/<game name="([^"]+)">([\s\S]*?)<\/game>/g) || [];
  
  for (const match of gameMatches) {
    const nameMatch = match.match(/<game name="([^"]+)">/);
    const name = nameMatch ? nameMatch[1] : null;
    if (!name) continue;
    
    const cleanName = name.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    
    games[cleanName.toLowerCase()] = {
      name: name,
      description: (match.match(/<description>([^<]*)<\/description>/) || [])[1] || name,
      manufacturer: (match.match(/<manufacturer>([^<]*)<\/manufacturer>/) || [])[1] || '',
      year: (match.match(/<year>([^<]*)<\/year>/) || [])[1] || '',
      genre: (match.match(/<genre>([^<]*)<\/genre>/) || [])[1] || '',
      players: (match.match(/<players>([^<]*)<\/players>/) || [])[1] || '1',
      rating: (match.match(/<rating>([^<]*)<\/rating>/) || [])[1] || '12.0'
    };
  }
  
  return games;
}

function generateHyperList(games, systemName) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<menu>\n`;
  
  for (const game of games) {
    xml += `  <game name="${escapeXml(game.name)}">\n`;
    xml += `    <description>${escapeXml(game.description)}</description>\n`;
    if (game.manufacturer) xml += `    <manufacturer>${escapeXml(game.manufacturer)}</manufacturer>\n`;
    if (game.year) xml += `    <year>${escapeXml(game.year)}</year>\n`;
    if (game.genre) xml += `    <genre>${escapeXml(game.genre)}</genre>\n`;
    xml += `    <players>${escapeXml(game.players)}</players>\n`;
    xml += `    <rating>${escapeXml(game.rating)}</rating>\n`;
    xml += `    <enabled>Yes</enabled>\n`;
    xml += `  </game>\n`;
  }
  
  xml += `</menu>`;
  return xml;
}

function cleanRomName(filename) {
  let name = path.basename(filename, path.extname(filename));
  name = name.replace(/\s*\((USA|Europe|Japan|France|Germany|Spain|Italy|UK|Brazil|Korea|World|En,Fr|De|Rev \d+)\)/gi, ' ');
  name = name.replace(/\s*\[.*?\]/g, ' ');
  name = name.replace(/\s*(Translated|NP|Remastered|Hack|Alt|Beta)/gi, ' ');
  name = name.replace(/\s+/g, ' ').trim();
  return name;
}

function getExtensions(consoleName) {
  const extMap = {
    'FBNeo - Arcade Games': ['zip'],
    'Nintendo - Nintendo Entertainment System': ['nes', 'zip'],
    'Nintendo - Super Nintendo Entertainment System': ['sfc', 'smc', 'zip'],
    'Sega - Mega Drive - Genesis': ['md', 'gen', 'zip'],
    'Nintendo - Game Boy': ['gb', 'gbc', 'zip'],
    'Nintendo - Game Boy Advance': ['gba', 'zip'],
    'Nintendo - Game Boy Color': ['gbc', 'zip'],
    'Sega - Game Gear': ['gg', 'zip'],
    'Sega - Master System': ['sms', 'zip'],
    'Sony - PlayStation': ['cue', 'iso', 'pbp'],
    'Nintendo - Nintendo 64': ['n64', 'z64', 'v64', 'zip'],
    'Sega - Saturn': ['cue', 'iso', 'chd'],
    'Nintendo - DS': ['nds', 'zip'],
    'Sega - Dreamcast - NAOMI': ['cue', 'iso', 'gdi', 'chd'],
    'SNK - Neo Geo AES-MVS': ['neo', 'zip'],
  };
  return extMap[consoleName] || ['zip', 'nes', 'sfc', 'smc', 'md', 'gen', 'gb', 'gba', 'gbc', 'gg', 'sms'];
}

function main() {
  console.log('\n=== HyperList Generator for AURA 4K ===\n');
  
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  
  const consoles = fs.readdirSync(ASSETS_DIR)
    .filter(f => {
      const romsDir = path.join(ASSETS_DIR, f, 'roms');
      return fs.existsSync(romsDir) && fs.readdirSync(romsDir).some(rom => {
        const ext = path.extname(rom).toLowerCase().slice(1);
        return getExtensions(f).includes(ext);
      });
    });
  
  console.log(`${consoles.length} consoles avec ROMs trouvées\n`);
  
  let totalGames = 0;
  
  for (const consoleName of consoles) {
    const romsDir = path.join(ASSETS_DIR, consoleName, 'roms');
    const xmlPath = path.join(DATA_DIR, `${consoleName}.xml`);
    
    const existingGames = getGamesFromXml(xmlPath);
    
    const extensions = getExtensions(consoleName);
    const romFiles = fs.readdirSync(romsDir)
      .filter(f => {
        const ext = path.extname(f).toLowerCase().slice(1);
        return extensions.includes(ext);
      });
    
    console.log(`\n${consoleName}`);
    console.log(`  ROMs: ${romFiles.length}`);
    console.log(`  XML existant: ${Object.keys(existingGames).length} jeux`);
    
    if (romFiles.length === 0) {
      console.log(`  ⚠️ Aucune ROM`);
      continue;
    }
    
    const games = [];
    let matched = 0;
    
    for (const romFile of romFiles) {
      const cleanName = cleanRomName(romFile);
      const originalName = path.basename(romFile, path.extname(romFile));
      
      let gameData = existingGames[cleanName.toLowerCase()];
      
      if (!gameData) {
        for (const [key, data] of Object.entries(existingGames)) {
          if (key.includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(key)) {
            gameData = data;
            break;
          }
        }
      }
      
      if (gameData) {
        matched++;
        games.push({
          name: gameData.name || originalName,
          description: gameData.description || originalName,
          manufacturer: gameData.manufacturer || '',
          year: gameData.year || '',
          genre: gameData.genre || '',
          players: gameData.players || '1',
          rating: gameData.rating || '12.0'
        });
      } else {
        games.push({
          name: originalName,
          description: originalName,
          manufacturer: '',
          year: '',
          genre: '',
          players: '1',
          rating: '12.0'
        });
      }
    }
    
    games.sort((a, b) => a.name.localeCompare(b.name));
    
    const xml = generateHyperList(games, consoleName);
    fs.writeFileSync(xmlPath, xml, 'utf8');
    
    console.log(`  Matchés: ${matched}`);
    console.log(`  ✓ ${xmlPath}`);
    totalGames += games.length;
  }
  
  console.log(`\n=== Terminé ===`);
  console.log(`Total: ${totalGames} jeux`);
}

main();
