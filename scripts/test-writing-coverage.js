#!/usr/bin/env node
// Guards the writing-content contract the daily strip relies on: every language has enough curated
// cards per CEFR band on both tracks, general cards use every writing activity, and each card carries
// the scaffolding the strip renders (genre, word target, time limit, self-check).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'data', 'daily');
const BANDS = {
  'A0-A1': /A0|A1/,
  A2: /A2/,
  'B1-B2': /B1|B2/,
  'C1-C2': /C1|C2/,
};
const ACTIVITIES = ['describe', 'narrate', 'inform', 'persuade', 'explain', 'instruct',
  'summarise', 'review', 'personal-message', 'formal-message', 'creative-writing', 'journal'];
const MIN_EXAM = 6;
const MIN_GENERAL = 4;

const errors = [];
const langs = fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory()).sort();

for (const lang of langs) {
  const file = path.join(root, lang, 'writing.json');
  if (!fs.existsSync(file)) { errors.push(`${lang}: missing writing.json`); continue; }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const curated = data.filter((e) => e.curated);
  const exam = curated.filter((e) => (e.track === 'general' ? 'general' : 'exam') === 'exam');
  const general = curated.filter((e) => e.track === 'general');

  for (const [band, re] of Object.entries(BANDS)) {
    const n = exam.filter((e) => re.test(String(e.level).toUpperCase())).length;
    if (n < MIN_EXAM) errors.push(`${lang}: ${n} curated exam cards in ${band}, need ${MIN_EXAM}`);
    const g = general.filter((e) => re.test(String(e.level).toUpperCase())).length;
    if (g < MIN_GENERAL) errors.push(`${lang}: ${g} general cards in ${band}, need ${MIN_GENERAL}`);
  }

  for (const card of curated) {
    const at = `${lang}:${card.id}`;
    if (!card.genre) errors.push(`${at}: missing genre`);
    if (!Number.isInteger(card.word_min) || !Number.isInteger(card.word_max)) errors.push(`${at}: missing word target`);
    if (!Number.isInteger(card.write_minutes)) errors.push(`${at}: missing time limit`);
    if (!Array.isArray(card.checklist) || card.checklist.length < 2) errors.push(`${at}: missing self-check`);
    if ((card.track === 'general' ? 'general' : 'exam') === 'exam' && (!card.exam || !card.part)) {
      errors.push(`${at}: exam card missing exam or part`);
    }
  }

  const used = new Set(general.map((e) => e.activity));
  const missing = ACTIVITIES.filter((a) => !used.has(a));
  if (missing.length) errors.push(`${lang}: general track never uses ${missing.join(', ')}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`writing coverage OK (${langs.length} languages: >=${MIN_EXAM} exam and >=${MIN_GENERAL} general cards per band, scaffolding complete, all activities used)`);
