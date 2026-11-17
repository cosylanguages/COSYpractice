#!/usr/bin/env node
/**
 * scripts/build-app.js
 *
 * Assembles the static COSYpractice site into `native/www`, the single web bundle
 * consumed by both native shells (Capacitor for Android/iOS, Electron for
 * desktop).
 *
 * The site is already 100% client-side, so the bundle is a filtered copy of the
 * repository. Build-only paths (git metadata, node_modules, CI, scripts, the
 * native project itself) and the GitHub Pages-only files (`404.html`'s
 * `<base href="/COSYpractice/">`, robots/sitemap) are excluded.
 *
 * Usage:
 *   node scripts/build-app.js            # build native/www
 *   node scripts/build-app.js --check    # verify native/www is up to date
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'native', 'www');
const MANIFEST = path.join(ROOT, 'native', '.www-manifest.json');

const EXCLUDE_NAMES = new Set([
  '.git',
  '.github',
  'node_modules',
  'native',
  'scripts',
  'docs',
  'package.json',
  'package-lock.json',
  'README.md',
  'LICENSE',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  '.nojekyll',
]);

function shouldSkip(name) {
  if (EXCLUDE_NAMES.has(name)) return true;
  if (name.endsWith('.md')) return true;
  if (name === '.gitignore') return true;
  return false;
}

function collectFiles(dir, relBase, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
    if (shouldSkip(entry.name)) continue;
    if (entry.isDirectory()) collectFiles(abs, rel, acc);
    else if (entry.isFile()) acc.push(rel);
  }
  return acc;
}

function hashFiles(files) {
  return files.slice().sort().map((rel) => {
    const buf = fs.readFileSync(path.join(ROOT, rel));
    return `${rel}\t${crypto.createHash('sha256').update(buf).digest('hex')}`;
  }).join('\n') + '\n';
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const files = collectFiles(ROOT, '', []);
  let bytes = 0;
  for (const rel of files) {
    const src = path.join(ROOT, rel);
    const dest = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    bytes += fs.statSync(src).size;
  }

  fs.writeFileSync(MANIFEST, hashFiles(files));
  console.log(`Built native/www: ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB.`);
}

function check() {
  if (!fs.existsSync(MANIFEST)) {
    console.error('native/.www-manifest.json is missing. Run: node scripts/build-app.js');
    process.exit(1);
  }
  if (fs.readFileSync(MANIFEST, 'utf8') !== hashFiles(collectFiles(ROOT, '', []))) {
    console.error('native/www is out of date. Run: node scripts/build-app.js');
    process.exit(1);
  }
  console.log('native/www is up to date.');
}

if (process.argv.includes('--check')) check();
else build();
