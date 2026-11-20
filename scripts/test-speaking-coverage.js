#!/usr/bin/env node
// Guards the speaking-content contract that the daily strip relies on: every language has
// enough curated cards per CEFR band, and the general-course track uses every activity.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'data', 'daily');
const BANDS = {
  'A0-A1': /A0|A1/,
  A2: /A2/,
  'B1-B2': /B1|B2/,
  'C1-C2': /C1|C2/,
};
const ACTIVITIES = ['brainstorm', 'analyse', 'describe', 'compare', 'discuss', 'narrate', 'role-play',
  'problem-solving', 'interview', 'plan', 'present', 'identify'];
const MIN_EXAM = 8;
const MIN_GENERAL = 4;

const errors = [];
const langs = fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory()).sort();

for (const lang of langs) {
  const file = path.join(root, lang, 'speaking.json');
  if (!fs.existsSync(file)) { errors.push(`${lang}: missing speaking.json`); continue; }
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

  const used = new Set(general.map((e) => e.activity));
  const missing = ACTIVITIES.filter((a) => !used.has(a));
  if (missing.length) errors.push(`${lang}: general track never uses ${missing.join(', ')}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(`speaking coverage OK (${langs.length} languages: >=${MIN_EXAM} exam and >=${MIN_GENERAL} general cards per band, all activities used)`);
