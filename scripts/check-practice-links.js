#!/usr/bin/env node
/* Verifies that every practice_links target exists in a COSYmanuals checkout. */
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.env.COSYMANUALS_DIR;
if (!root) {
  console.log('COSYMANUALS_DIR is not set; skipping practice link check.');
  process.exit(0);
}

const files = [
  'data/grammar_confusion_pairs.js',
  'data/french_grammar_confusion_pairs.js',
  'types/vocabulary/vocabulary.js'
];
const prefix = 'https://cosylanguages.github.io/COSYmanuals/';
const links = new Set();

for (const file of files) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  for (const match of source.matchAll(/practice_links\s*:\s*\[([^\]]*)\]/g)) {
    for (const link of match[1].matchAll(/['"]([^'"]+)['"]/g)) links.add(link[1]);
  }
}

const missing = [];
for (const link of links) {
  const target = link.startsWith(prefix) ? link.slice(prefix.length) : link;
  if (/^https?:\/\//.test(target)) continue;
  if (!fs.existsSync(path.join(root, target))) missing.push(link);
}

if (missing.length) {
  for (const link of missing) console.error(`Missing manual page: ${link}`);
  process.exit(1);
}

console.log(`Practice links OK: ${links.size} unique targets.`);
