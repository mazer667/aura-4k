/**
 * HyperList Generator for AURA 4K
 * Usage: node generate-hyperlist.js <console-name>
 * Example: node generate-hyperlist.js "Nintendo - Super Nintendo Entertainment System"
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

// Get games from existing XML
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

// Generate HyperList XML
function generateHyperList(games, systemName) {
  const date = new Date().toISOString().slice(0, 10);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<hyperlist>\n`;
  xml += `  <header>\n`;
  xml += `    <listname>${escapeXml(systemName)}</listname>\n`;
  xml += `    <lastlistupdate>${date}</lastlistupdate>\n`;
  xml += `  </header>\n`;
  
  for (const game of games) {
    xml += `  <game name="${escapeXml(game.name)}" index="true" image="${escapeXml(game.name)}.png">\n`;
    xml += `    <description>${escapeXml(game.description)}</description>\n`;
    if (game.manufacturer) xml += `    <manufacturer>${escapeXml(game.manufacturer)}</manufacturer>\n`;
    if (game.year) xml += `    <year>${escapeXml(game.year)}</year>\n`;
    if (game.genre) xml += `    <genre>${escapeXml(game.genre)}</genre>\n`;
    xml += `    <players>${escapeXml(game.players)}</players>\n`;
    xml += `    <rating>${escapeXml(game.rating)}</rating>\n`;
    xml += `  </game>\n`;
  }
  
  xml += `</hyperlist>`;
  return xml;
}

function cleanRomName(filename) {
  let name = path.basename(filename, path.extname(filename));
  // Remove common tags
  name = name.replace(/\s*\((USA|Europe|Japan|France|Germany|Spain|Italy|UK|Brazil|Korea|World|En,Fr|De|Rev \d+)\)/gi, ' ');
  name = name.replace(/\s*\[.*?\]/g, ' ');
  name = name.replace(/\s*(Translated|NP|Remastered|Hack|Alt|Beta)/gi, ' ');
  name = name.replace(/\s+/g, ' ').trim();
  return name;
}

async function main() {
  const consoleName = process.argv[2];
  if (!consoleName) {
    console.log('Usage: node generate-hyperlist.js "<console-name>"');
    console.log('\nExample: node generate-hyperlist.js "Nintendo - Super Nintendo Entertainment System"');
    return;
  }
  
  console.log(`\n=== HyperList Generator ===`);
  console.log(`Console: ${consoleName}\n`);
  
  const romsDir = path.join(ASSETS_DIR, consoleName, 'roms');
  const xmlPath = path.join(DATA_DIR, `${consoleName}.xml`);
  const outputPath = path.join(DATA_DIR, `${consoleName} - HyperList.xml`);
  
  if (!fs.existsSync(romsDir)) {
    console.error(`Dossier ROMs non trouvé: ${romsDir}`);
    return;
  }
  
  // Get existing game data
  const existingGames = getGamesFromXml(xmlPath);
  console.log(`${Object.keys(existingGames).length} jeux trouvés dans XML`);
  
  // Get ROMs
  const romFiles = fs.readdirSync(romsDir)
    .filter(f => !fs.statSync(path.join(romsDir, f)).isDirectory())
    .filter(f => /\.(zip|nes|sfc|smc|sfc|gen|md|gg|sms|gb|gbc|gba|nds|3ds|cue|iso|chd)$/i.test(f));
  
  console.log(`${romFiles.length} ROMs trouvées\n`);
  
  if (romFiles.length === 0) {
    console.error('Aucune ROM trouvée!');
    return;
  }
  
  // Build games list
  const games = [];
  let matched = 0;
  let unmatched = 0;
  
  for (const romFile of romFiles) {
    const cleanName = cleanRomName(romFile);
    const originalName = path.basename(romFile, path.extname(romFile));
    
    // Try to find in existing XML
    let gameData = existingGames[cleanName.toLowerCase()];
    
    // If not found, try partial match
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
      unmatched++;
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
  
  // Sort alphabetically
  games.sort((a, b) => a.name.localeCompare(b.name));
  
  // Generate HyperList
  const hyperListXml = generateHyperList(games, consoleName);
  
  // Save
  fs.writeFileSync(outputPath, hyperListXml, 'utf8');
  
  console.log(`=== Résumé ===`);
  console.log(`Total jeux: ${games.length}`);
  console.log(`Matchés avec XML: ${matched}`);
  console.log(`Non matchés: ${unmatched}`);
  console.log(`\nHyperList créée: ${outputPath}`);
}

main().catch(console.error);
