#!/usr/bin/env node
/* Validates the internal shape of the CEFR outcomes snapshot used by the progress dashboard. */
'use strict';

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'levels', 'cefr-outcomes.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const errors = [];
let levels = 0;

for (const [course, entries] of Object.entries(data.courses || {})) {
  if (!Array.isArray(entries) || entries.length === 0) {
    errors.push(`${course}: no levels`);
    continue;
  }
  for (const entry of entries) {
    levels += 1;
    const label = `${course} ${entry.level || '?'}`;
    if (!entry.level) errors.push(`${label}: missing level`);
    if (!Number.isInteger(entry.lessons) || entry.lessons < 1) {
      errors.push(`${label}: lessons must be a positive integer`);
    }
    if (!Number.isInteger(entry.units) || entry.units < 1) {
      errors.push(`${label}: units must be a positive integer`);
    }
    const statements = Array.isArray(entry.can_do_statements) ? entry.can_do_statements : [];
    if (statements.length !== entry.lessons) {
      errors.push(`${label}: ${statements.length} can-do statements for ${entry.lessons} lessons`);
    }
    if (statements.some(text => typeof text !== 'string' || !text.trim())) {
      errors.push(`${label}: empty can-do statement`);
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error(`CEFR outcomes: ${error}`);
  process.exit(1);
}

console.log(`CEFR outcomes OK: ${levels} levels, one can-do statement per lesson.`);
