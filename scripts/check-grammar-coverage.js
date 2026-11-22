#!/usr/bin/env node
/* Verifies that every canonical grammar confusion pair has at least one question. */
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.env.COSYDATA_DIR;
if (!root) {
  console.log('COSYDATA_DIR is not set; skipping grammar coverage check.');
  process.exit(0);
}

const banks = [
  {
    language: 'English',
    local: '../data/grammar_confusion_pairs.js',
    canonical: 'taxonomy/grammar-confusion-pairs.json'
  },
  {
    language: 'French',
    local: '../data/french_grammar_confusion_pairs.js',
    canonical: 'taxonomy/french-grammar-confusion-pairs.json'
  }
];

// Local IDs that intentionally differ from the canonical taxonomy.
const aliases = {
  'a-vs-en': 'a-vs-en-pays'
};

const readingModules = new Set(['paragraph-reading', 'paragraphes-lecture']);

function normalise(id) {
  return String(id)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function loadLocal(file) {
  const target = path.join(__dirname, file);
  global.window = {};
  delete require.cache[require.resolve(target)];
  return require(target);
}

let failed = false;

for (const bank of banks) {
  const questions = Object.values(loadLocal(bank.local)).flat();
  const localIds = new Set(questions.map(q => normalise(q.id)));
  const canonical = JSON.parse(fs.readFileSync(path.join(root, bank.canonical), 'utf8'));
  const canonicalPairs = Object.values(canonical.levels).flat()
    .filter(pair => !readingModules.has(pair.id));

  const missing = canonicalPairs.filter(pair => {
    const id = normalise(pair.id);
    return !localIds.has(id) && !localIds.has(normalise(aliases[pair.id] || ''));
  });

  const seen = new Set();
  const duplicates = [];
  for (const question of questions) {
    const key = JSON.stringify([question.q, question.opts]);
    if (seen.has(key)) duplicates.push(question.q);
    seen.add(key);
  }

  console.log(
    `${bank.language}: ${canonicalPairs.length - missing.length}/${canonicalPairs.length} ` +
    `canonical pairs covered, ${questions.length} questions`
  );

  for (const pair of missing) {
    console.error(`  Missing pair: ${pair.level} ${pair.id} (${pair.label})`);
    failed = true;
  }
  for (const question of duplicates) {
    console.error(`  Duplicate question: ${question}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Grammar confusion-pair coverage OK.');
