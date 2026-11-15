#!/usr/bin/env node
/**
 * Validates data/daily/<lang>/{speaking,writing}.json, the prompts shown by the COSYlanguages daily strip.
 *   node scripts/validate-daily-prompts.js
 *
 * Every entry needs a unique id, a prompt and a CEFR level tag (e.g. "A2", "B1-B2"). Entries flagged
 * "curated": true are preferred by the strip when one matches the learner's level band, so for the core
 * languages every band (A0-A1, A2, B1-B2, C1-C2) must have at least one curated prompt: that is what
 * guarantees a different task at each level.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'data', 'daily');
const CORE = ['en', 'fr', 'it', 'ru', 'el'];
const BANDS = { 'A0-A1': /A0|A1/, 'A2': /A2/, 'B1-B2': /B1|B2/, 'C1-C2': /C1|C2/ };
const LEVEL = /^(A0|A1|A2|B1|B2|C1|C2)(-(A0|A1|A2|B1|B2|C1|C2))?$/;
const errors = [];

for (const lang of fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory()).sort()) {
  for (const type of ['speaking', 'writing']) {
    const file = path.join(root, lang, `${type}.json`);
    const rel = `data/daily/${lang}/${type}.json`;
    if (!fs.existsSync(file)) { errors.push(`${rel}: missing`); continue; }
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { errors.push(`${rel}: ${e.message}`); continue; }
    if (!Array.isArray(data) || !data.length) { errors.push(`${rel}: must be a non-empty array`); continue; }
    const ids = new Set();
    data.forEach((e, i) => {
      const at = `${rel}[${i}]`;
      if (!e || typeof e.id !== 'string' || !e.id) errors.push(`${at}: id missing`);
      else if (ids.has(e.id)) errors.push(`${at}: duplicate id ${e.id}`);
      else ids.add(e.id);
      if (typeof e.prompt !== 'string' || e.prompt.trim().length < 10) errors.push(`${at}: prompt missing or too short`);
      if (typeof e.level !== 'string' || !LEVEL.test(e.level)) errors.push(`${at}: invalid level "${e.level}"`);
      if (e.curated !== undefined && typeof e.curated !== 'boolean') errors.push(`${at}: curated must be a boolean`);
    });
    if (CORE.includes(lang)) {
      for (const [band, re] of Object.entries(BANDS)) {
        if (!data.some((e) => e.curated && re.test(String(e.level).toUpperCase()))) {
          errors.push(`${rel}: no curated prompt for band ${band}`);
        }
      }
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log('daily prompt files OK');
