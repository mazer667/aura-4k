// build.js - Build script for AURA 4K
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const srcDir = __dirname;

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,=+\-<>!&|?()])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function processFile(filePath, minifier, minSuffix = '.min') {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLen = content.length;
    content = minifier(content);
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const outPath = path.join(distDir, name + minSuffix + ext);
    fs.writeFileSync(outPath, content);
    console.log(`  ${path.basename(filePath)} -> ${name}${minSuffix}${ext}`);
    return { original: originalLen, minified: content.length };
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    return { original: 0, minified: 0 };
  }
}

function build() {
  const args = process.argv.slice(2);
  const isProd = args.includes('--prod');
  
  console.log(`\n--- AURA 4K Build ${isProd ? '(PROD)' : '(DEV)'} ---\n`);
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  let totalOriginal = 0;
  let totalMinified = 0;
  
  // JS files
  console.log('Minifying JS files...');
  const jsDir = path.join(srcDir, 'js');
  if (fs.existsSync(jsDir)) {
    fs.readdirSync(jsDir)
      .filter(f => f.endsWith('.js'))
      .forEach(f => {
        const result = processFile(path.join(jsDir, f), minifyJS);
        totalOriginal += result.original;
        totalMinified += result.minified;
      });
  }
  
  // HTML files
  console.log('\nMinifying HTML...');
  const htmlFiles = ['index.html', 'console-select.html'];
  htmlFiles.forEach(f => {
    const filePath = path.join(srcDir, f);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const result = { original: content.length };
      
      // Extract and minify inline CSS
      const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
      if (styleMatch) {
        const minCSS = minifyCSS(styleMatch[1]);
        content = content.replace(styleMatch[1], minCSS);
        result.minified = content.length;
      }
      
      fs.writeFileSync(path.join(distDir, f), content);
      console.log(`  ${f} (inline CSS minified)`);
      totalOriginal += result.original;
      totalMinified += result.minified;
    }
  });
  
  // JSON files (just copy)
  console.log('\nCopying JSON...');
  ['config.json', 'consoles.json'].forEach(f => {
    const srcPath = path.join(srcDir, f);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(distDir, f));
      console.log(`  ${f}`);
    }
  });
  
  // Summary
  const saved = totalOriginal - totalMinified;
  const pct = totalOriginal > 0 ? ((saved / totalOriginal) * 100).toFixed(1) : 0;
  
  console.log('\n--- Build Complete ---');
  console.log(`Original: ${(totalOriginal / 1024).toFixed(1)} KB`);
  console.log(`Minified: ${(totalMinified / 1024).toFixed(1)} KB`);
  console.log(`Saved: ${(saved / 1024).toFixed(1)} KB (${pct}%)`);
  console.log(`\nOutput: ${distDir}\n`);
  
  if (isProd) {
    console.log('Production build ready!\n');
  }
}

build();