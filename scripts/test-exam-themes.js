#!/usr/bin/env node
/**
 * Checks the DELF/DALF theme catalogue and its use by the French daily prompts.
 *   node scripts/test-exam-themes.js
 *
 * The catalogue in data/exam/fr/delf-dalf-themes.json is the source of truth for the
 * themes supplied for DELF B1, DELF B2, DALF C1 and DALF C2. Every category must carry
 * themes, every category must be practised by at least one speaking card and one writing
 * card at the matching exam, and every card theme must exist in the catalogue.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'data/exam/fr/delf-dalf-themes.json'), 'utf8'));
const speaking = JSON.parse(fs.readFileSync(path.join(root, 'data/daily/fr/speaking.json'), 'utf8'));
const writing = JSON.parse(fs.readFileSync(path.join(root, 'data/daily/fr/writing.json'), 'utf8'));
const errors = [];

const EXPECTED = {
  B1: { exam: 'DELF B1', categories: 11, themes: 107 },
  B2: { exam: 'DELF B2', categories: 14, themes: 157 },
  C1: { exam: 'DALF C1', categories: 17, themes: 175 },
  C2: { exam: 'DALF C2', categories: 13, themes: 106 },
};

if (catalogue.lang !== 'fr') errors.push('catalogue: lang must be "fr"');
if (!catalogue.updated) errors.push('catalogue: updated date missing');

const known = new Set();
for (const [level, expected] of Object.entries(EXPECTED)) {
  const data = catalogue.levels && catalogue.levels[level];
  if (!data) { errors.push(`catalogue: level ${level} missing`); continue; }
  if (data.exam !== expected.exam) errors.push(`catalogue: ${level} exam must be ${expected.exam}`);
  if (!Array.isArray(data.categories) || data.categories.length !== expected.categories) {
    errors.push(`catalogue: ${level} must have ${expected.categories} categories, found ${data.categories ? data.categories.length : 0}`);
  }
  let themes = 0;
  for (const category of data.categories || []) {
    if (!category.id || known.has(category.id)) errors.push(`catalogue: ${level} category id missing or duplicated: ${category.id}`);
    if (!category.label) errors.push(`catalogue: ${category.id} label missing`);
    if (!Array.isArray(category.themes) || category.themes.length < 3) {
      errors.push(`catalogue: ${category.id} must list at least three themes`);
    }
    themes += (category.themes || []).length;
    known.add(category.id);
  }
  if (themes !== expected.themes) errors.push(`catalogue: ${level} must list ${expected.themes} themes, found ${themes}`);
}

function checkCards(cards, type) {
  const tagged = cards.filter((card) => card.theme);
  for (const card of tagged) {
    if (!known.has(card.theme)) errors.push(`data/daily/fr/${type}.json: ${card.id} uses unknown theme ${card.theme}`);
  }
  for (const [level, expected] of Object.entries(EXPECTED)) {
    const levelData = catalogue.levels[level];
    for (const category of (levelData && levelData.categories) || []) {
      const match = tagged.some((card) => card.theme === category.id && card.exam === expected.exam);
      if (!match) errors.push(`data/daily/fr/${type}.json: ${level} category ${category.id} has no ${expected.exam} card`);
    }
  }
}

checkCards(speaking, 'speaking');
checkCards(writing, 'writing');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('DELF/DALF theme coverage OK (55 categories, 545 themes, speaking and writing at every level)');
