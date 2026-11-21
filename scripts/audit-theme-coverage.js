#!/usr/bin/env node
'use strict';

/**
 * Preview the effect of the practice theme normaliser on a COSYdata checkout.
 *
 * Usage:
 *   COSYDATA_DIR=/path/to/COSYdata node scripts/audit-theme-coverage.js
 */

const fs = require('fs');
const path = require('path');
const helpers = require('../js/theme-aliases.js');

const dataDir = process.env.COSYDATA_DIR || '/tmp/COSYdata';
const vocabularyDir = path.join(dataDir, 'vocabulary');
const schemaPath = path.join(dataDir, 'schemas', 'themes.json');

if (!fs.existsSync(vocabularyDir) || !fs.existsSync(schemaPath)) {
  console.error(`COSYdata not found at ${dataDir}. Set COSYDATA_DIR to a checkout.`);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
helpers.setSchema(schema);
const schemaThemes = schema.themes || schema;

function isCanonicalTheme(value) {
  const wanted = helpers.slug(value);
  return !!wanted && Object.keys(schemaThemes).some(key => helpers.slug(key) === wanted);
}

function walkJsonFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.json') && !['index.json', 'themes-index.json', 'search-index.json'].includes(entry.name)) out.push(full);
  }
  return out;
}

const languages = fs.readdirSync(vocabularyDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !entry.name.startsWith('_'))
  .map(entry => entry.name)
  .sort();

const totals = {
  total: 0,
  rawCanonical: 0,
  rawLegacy: 0,
  rawMissing: 0,
  normalizedThemed: 0,
  uncategorized: 0,
  specificSub: 0,
  generalSub: 0,
  noSub: 0
};
const uncategorizedFiles = new Map();
const rows = [];

for (const lang of languages) {
  const langDir = path.join(vocabularyDir, lang);
  const files = walkJsonFiles(langDir);
  const row = { lang, total: 0, rawCanonical: 0, rawLegacy: 0, rawMissing: 0, normalizedThemed: 0, uncategorized: 0, specificSub: 0, generalSub: 0, noSub: 0 };

  for (const file of files) {
    const relPath = path.relative(langDir, file).split(path.sep).join('/');
    let entries;
    try {
      entries = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      console.warn(`Skipping malformed file ${file}: ${error.message}`);
      continue;
    }
    if (!Array.isArray(entries)) continue;

    for (const entry of entries) {
      if (!entry || !entry.word) continue;
      const rawTheme = helpers.slug(entry.theme);
      const rawIsCanonical = isCanonicalTheme(rawTheme);

      row.total += 1;
      if (!rawTheme) row.rawMissing += 1;
      else if (rawIsCanonical) row.rawCanonical += 1;
      else row.rawLegacy += 1;

      const normalized = helpers.normalizeEntry(Object.assign({}, entry), relPath);
      if (normalized.theme === 'uncategorized') {
        row.uncategorized += 1;
        const key = `${lang}/${relPath}`;
        uncategorizedFiles.set(key, (uncategorizedFiles.get(key) || 0) + 1);
      } else {
        row.normalizedThemed += 1;
        if (!normalized.sub_theme) row.noSub += 1;
        else if (normalized.sub_theme === 'general') row.generalSub += 1;
        else row.specificSub += 1;
      }
    }
  }

  rows.push(row);
  Object.keys(totals).forEach(key => { totals[key] += row[key]; });
}

function pct(value, total) {
  return total ? `${(value / total * 100).toFixed(1)}%` : '—';
}

console.log(`COSYdata: ${dataDir}`);
console.log('');
console.log('| Language | Entries | Raw canonical | Raw legacy | Raw missing | Normalized themed | Uncategorised | Specific sub-theme | General sub-theme | No sub-theme |');
console.log('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const row of rows) {
  console.log(`| ${row.lang} | ${row.total} | ${row.rawCanonical} (${pct(row.rawCanonical, row.total)}) | ${row.rawLegacy} (${pct(row.rawLegacy, row.total)}) | ${row.rawMissing} (${pct(row.rawMissing, row.total)}) | ${row.normalizedThemed} (${pct(row.normalizedThemed, row.total)}) | ${row.uncategorized} (${pct(row.uncategorized, row.total)}) | ${row.specificSub} (${pct(row.specificSub, row.total)}) | ${row.generalSub} (${pct(row.generalSub, row.total)}) | ${row.noSub} (${pct(row.noSub, row.total)}) |`);
}
console.log(`| **all** | **${totals.total}** | **${totals.rawCanonical} (${pct(totals.rawCanonical, totals.total)})** | **${totals.rawLegacy} (${pct(totals.rawLegacy, totals.total)})** | **${totals.rawMissing} (${pct(totals.rawMissing, totals.total)})** | **${totals.normalizedThemed} (${pct(totals.normalizedThemed, totals.total)})** | **${totals.uncategorized} (${pct(totals.uncategorized, totals.total)})** | **${totals.specificSub} (${pct(totals.specificSub, totals.total)})** | **${totals.generalSub} (${pct(totals.generalSub, totals.total)})** | **${totals.noSub} (${pct(totals.noSub, totals.total)})** |`);

console.log('');
console.log('Largest uncategorised files after normalisation:');
console.log('| File | Entries |');
console.log('|---|---:|');
Array.from(uncategorizedFiles.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([file, count]) => console.log(`| ${file} | ${count} |`));
