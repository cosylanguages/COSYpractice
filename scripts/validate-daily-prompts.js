#!/usr/bin/env node
/**
 * Validates data/daily/<lang>/{speaking,writing}.json, the prompts shown by the COSYlanguages daily strip.
 *   node scripts/validate-daily-prompts.js
 *
 * Every entry needs a unique id, a prompt and a CEFR level tag (e.g. "A2", "B1-B2"). Entries flagged
 * "curated": true are preferred by the strip when one matches the learner's level band, so every language
 * must cover every band (A0-A1, A2, B1-B2, C1-C2) with curated prompts: that is what guarantees a different
 * task at each level.
 *
 * Curated speaking entries also carry the exam-style scaffolding the strip renders:
 *   exam           exam the task is modelled on, and the level ("IELTS", "DELF B1", "DAB 2")
 *   part           the speaking part of that exam ("Part 2 · Long turn (cue card)")
 *   task           short name of the task type ("Cue card talk", "Structured argument")
 *   prep_seconds   preparation time before speaking
 *   speak_seconds  target speaking time
 *   follow_ups     one or two examiner-style follow-up questions
 *
 * exam and part are required so a learner always sees which exam task they are practising; the
 * part names must match the real structure of each exam (IELTS Part 1/2/3, DELF/DALF exposé and
 * entretien, Goethe Sprechen Teil 1-3, DELE Tarea 1-4, CILS Parte, ТРКИ задания, and so on).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'data', 'daily');
const CORE = ['en', 'fr', 'it', 'ru', 'el'];
const BANDS = { 'A0-A1': /A0|A1/, 'A2': /A2/, 'B1-B2': /B1|B2/, 'C1-C2': /C1|C2/ };
const LEVEL = /^(A0|A1|A2|B1|B2|C1|C2)(-(A0|A1|A2|B1|B2|C1|C2))?$/;
// Exam names that belong to one language only. A card must never name another language's exam, so an
// English card may say IELTS/TOEFL/Cambridge but never DELF/DELE/Goethe, and so on.
const EXAM_OWNERS = {
  fr: /\b(DELF|DALF|TCF)\b/,
  it: /\b(CILS|CELI)\b/,
  ru: /(ТРКИ|ТЭУ|ТБУ|TORFL)/,
  el: /(Ελληνομάθεια)/,
  es: /\b(DELE|SIELE)\b/,
  de: /\b(Goethe|ÖSD|telc)\b/,
  pt: /\b(CAPLE|Celpe-Bras)\b/,
  en: /\b(IELTS|TOEFL|Cambridge|Trinity|ECPE)\b/,
  br: /\bDAB\b|Diplom war ar Brezhoneg/
};
const MIN_PER_BAND = { speaking: 3, writing: 1 };
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

      if (type === 'speaking' && e.curated) {
        if (typeof e.task !== 'string' || !e.task.trim()) errors.push(`${at}: curated speaking needs a task`);
        if (typeof e.exam !== 'string' || !e.exam.trim()) errors.push(`${at}: curated speaking needs an exam`);
        if (typeof e.part !== 'string' || !e.part.trim()) errors.push(`${at}: curated speaking needs a part`);
        for (const key of ['prep_seconds', 'speak_seconds']) {
          if (!Number.isInteger(e[key]) || e[key] <= 0) errors.push(`${at}: ${key} must be a positive integer`);
        }
        if (!Array.isArray(e.follow_ups) || e.follow_ups.length < 1 || e.follow_ups.length > 2) {
          errors.push(`${at}: follow_ups must list one or two questions`);
        } else if (e.follow_ups.some((q) => typeof q !== 'string' || q.trim().length < 5)) {
          errors.push(`${at}: follow_ups entries must be questions`);
        }

        // Never name another language's exam on a card: English cards are English-exam only, etc.
        const text = [e.exam, e.part, e.task, e.prompt, ...(Array.isArray(e.follow_ups) ? e.follow_ups : [])].join(' ');
        for (const [owner, re] of Object.entries(EXAM_OWNERS)) {
          if (owner !== lang && re.test(text)) errors.push(`${at}: names a ${owner} exam on a ${lang} card`);
        }
      }
    });

    for (const [band, re] of Object.entries(BANDS)) {
      const curated = data.filter((e) => e.curated && re.test(String(e.level).toUpperCase()));
      // Writing is not yet curated outside the core languages; speaking is curated for every language.
      const required = type === 'speaking' || CORE.includes(lang) ? MIN_PER_BAND[type] : 0;
      if (curated.length < required) {
        errors.push(`${rel}: needs ${required} curated prompt(s) for band ${band}, has ${curated.length}`);
      }
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log('daily prompt files OK');
