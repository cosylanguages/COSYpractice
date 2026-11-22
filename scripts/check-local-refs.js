#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_BASE = '/COSYpractice/';
const SKIP_DIRS = new Set(['.git', 'node_modules', '.cosy', 'scripts']);
const SCAN_EXTENSIONS = new Set(['.html', '.css', '.js', '.json', '.xml']);
const ASSET_EXTENSION = /\.(?:html|css|js|json|xml|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|ogg|mp3|wav|mp4|webm|pdf)$/i;

const missing = [];
let checked = 0;

function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

function isExternal(ref) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref);
}

function cleanRef(ref) {
  const trimmed = String(ref || '').trim();
  if (!trimmed || isExternal(trimmed)) return null;
  if (trimmed.includes('${') || trimmed.includes('{{') || trimmed.includes('+')) return null;
  const withoutQuery = trimmed.split('#')[0].split('?')[0];
  return withoutQuery || null;
}

function resolveRef(file, ref) {
  let local = ref;
  if (local.startsWith(SITE_BASE)) {
    local = local.slice(SITE_BASE.length);
  }
  const rootRelative = local.startsWith('/');
  if (rootRelative) local = local.replace(/^\/+/, '');
  const base = rootRelative ? ROOT : path.dirname(file);
  const abs = path.resolve(base, local);
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) return null;
  return abs;
}

function exists(abs) {
  if (fs.existsSync(abs)) return true;
  if (!path.extname(abs) && fs.existsSync(abs + '.html')) return true;
  return false;
}

function addRef(file, ref, index, source) {
  const cleaned = cleanRef(ref);
  if (!cleaned) return;
  if (!ASSET_EXTENSION.test(cleaned) && !cleaned.endsWith('/')) return;
  const abs = resolveRef(file, cleaned);
  if (!abs) return;
  checked += 1;
  if (!exists(abs)) {
    missing.push({ file: path.relative(ROOT, file), line: lineAt(source, index), ref: cleaned });
  }
}

function scanHtml(file, content) {
  const attr = /\b(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']/gi;
  for (const match of content.matchAll(attr)) addRef(file, match[1], match.index, content);

  const srcset = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  for (const match of content.matchAll(srcset)) {
    for (const part of match[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      addRef(file, url, match.index, content);
    }
  }
}

function scanCss(file, content) {
  const urlRef = /\burl\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const match of content.matchAll(urlRef)) addRef(file, match[1], match.index, content);

  const importRef = /@import\s+(?:url\(\s*)?["']([^"']+)["']/gi;
  for (const match of content.matchAll(importRef)) addRef(file, match[1], match.index, content);
}

function scanServiceWorker(file, content) {
  const list = content.match(/ASSETS_TO_CACHE\s*=\s*\[([\s\S]*?)\]/);
  if (!list) return;
  const offset = list.index + list[0].indexOf(list[1]);
  for (const match of list[1].matchAll(/["']([^"']+)["']/g)) {
    addRef(file, match[1], offset + match.index, content);
  }
}

function scanManifest(file, content) {
  let manifest;
  try {
    manifest = JSON.parse(content);
  } catch (error) {
    missing.push({ file: path.relative(ROOT, file), line: 1, ref: `invalid JSON: ${error.message}` });
    return;
  }
  const refs = [manifest.start_url];
  for (const icon of manifest.icons || []) refs.push(icon.src);
  for (const screenshot of manifest.screenshots || []) refs.push(screenshot.src);
  for (const ref of refs) addRef(file, ref, 0, content);
}

function scanSitemap(file, content) {
  for (const match of content.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = match[1].trim();
    if (!url.startsWith(`https://cosylanguages.github.io${SITE_BASE}`)) continue;
    addRef(file, url, match.index, content);
  }
}

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file);
  if (ext === '.html') scanHtml(file, content);
  else if (ext === '.css') scanCss(file, content);
  else if (ext === '.js' && path.basename(file) === 'sw.js') scanServiceWorker(file, content);
  else if (ext === '.json' && path.basename(file) === 'manifest.json') scanManifest(file, content);
  else if (ext === '.xml' && path.basename(file) === 'sitemap.xml') scanSitemap(file, content);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name));
      continue;
    }
    const file = path.join(dir, entry.name);
    if (SCAN_EXTENSIONS.has(path.extname(file))) scanFile(file);
  }
}

walk(ROOT);

if (missing.length) {
  console.error(`Missing ${missing.length} local reference(s):`);
  for (const item of missing) console.error(`  ${item.file}:${item.line} -> ${item.ref}`);
  process.exit(1);
}

console.log(`Checked ${checked} local reference(s); 0 missing.`);
