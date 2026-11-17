#!/usr/bin/env node
/**
 * scripts/vendor-cosydata.js
 *
 * Snapshots the COSYdata schema files the hub reads at runtime into
 * `data/cosydata/`, so the site (and the native bundle) works offline instead of
 * depending on raw.githubusercontent.com. Re-run to refresh the snapshot.
 *
 * Usage: node scripts/vendor-cosydata.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'cosydata');

const FILES = [
  { url: 'https://raw.githubusercontent.com/cosylanguages/COSYdata/main/schemas/themes.json', dest: 'themes.json' },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { url, dest } of FILES) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
    const text = await res.text();
    JSON.parse(text);
    fs.writeFileSync(path.join(OUT_DIR, dest), text);
    console.log(`Wrote data/cosydata/${dest} (${(text.length / 1024).toFixed(1)} KB)`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
