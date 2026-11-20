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
 *   follow_ups     one or two examiner-style follow-up questions (exam cards) or up to three
 *                  practice questions (general-course cards), and a general prompt must ask something
 *
 * exam and part are required on exam-track cards so a learner always sees which exam task they are
 * practising; the part names must match the real structure of each exam (IELTS Part 1/2/3, DELF/DALF
 * exposé and entretien, Goethe Sprechen Teil 1-3, DELE Tarea 1-4, CILS Parte, ТРКИ задания, and so on).
 * A card never names another language's exam.
 *
 * General-course cards (track: "general") practise speaking for its own sake and name no exam. They
 * carry an activity instead, and every curated speaking card carries the audiences it suits, so young
 * learners, teens, adults and seniors each get material that fits them.
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
const MIN_PER_BAND = { speaking: 3, writing: 2 };
const TRACKS = ['exam', 'general'];
// General-course speaking is organised by the activity a learner actually does, not by an exam task.
const ACTIVITIES = ['brainstorm', 'analyse', 'describe', 'compare', 'discuss', 'narrate', 'role-play',
  'problem-solving', 'interview', 'plan', 'present', 'identify'];
const AUDIENCES = ['young', 'teen', 'adult', 'senior'];
// General-course writing is organised by what the learner actually produces.
const WRITING_ACTIVITIES = ['describe', 'narrate', 'inform', 'persuade', 'explain', 'instruct',
  'summarise', 'review', 'personal-message', 'formal-message', 'creative-writing', 'journal'];
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
    const prompts = new Map();
    data.forEach((e, i) => {
      const at = `${rel}[${i}]`;
      if (!e || typeof e.id !== 'string' || !e.id) errors.push(`${at}: id missing`);
      else if (ids.has(e.id)) errors.push(`${at}: duplicate id ${e.id}`);
      else ids.add(e.id);
      if (typeof e.prompt !== 'string' || e.prompt.trim().length < 10) errors.push(`${at}: prompt missing or too short`);
      else {
        // The strip rotates through the pool, so a repeated prompt shows the same task twice.
        const key = e.prompt.trim().toLowerCase().replace(/\s+/g, ' ');
        if (prompts.has(key)) errors.push(`${at}: duplicate prompt (same as ${prompts.get(key)})`);
        else prompts.set(key, e.id || at);
      }
      if (typeof e.level !== 'string' || !LEVEL.test(e.level)) errors.push(`${at}: invalid level "${e.level}"`);
      if (e.curated !== undefined && typeof e.curated !== 'boolean') errors.push(`${at}: curated must be a boolean`);

      if (type === 'speaking' && e.curated) {
        if (typeof e.task !== 'string' || !e.task.trim()) errors.push(`${at}: curated speaking needs a task`);

        const track = e.track === undefined ? 'exam' : e.track;
        if (!TRACKS.includes(track)) errors.push(`${at}: invalid track "${e.track}"`);
        if (track === 'exam') {
          if (typeof e.exam !== 'string' || !e.exam.trim()) errors.push(`${at}: curated speaking needs an exam`);
          if (typeof e.part !== 'string' || !e.part.trim()) errors.push(`${at}: curated speaking needs a part`);
        } else {
          // General-course cards practise speaking for its own sake: no exam, but an activity to do.
          if (e.exam !== undefined || e.part !== undefined) errors.push(`${at}: general card must not name an exam`);
          if (!ACTIVITIES.includes(e.activity)) {
            errors.push(`${at}: general card needs an activity (${ACTIVITIES.join(', ')})`);
          }
        }

        if (!Array.isArray(e.audience) || e.audience.length === 0) {
          errors.push(`${at}: curated speaking needs an audience list`);
        } else if (e.audience.some((a) => !AUDIENCES.includes(a))) {
          errors.push(`${at}: audience must use ${AUDIENCES.join(', ')}`);
        } else if (new Set(e.audience).size !== e.audience.length) {
          errors.push(`${at}: audience has duplicates`);
        }

        for (const key of ['prep_seconds', 'speak_seconds']) {
          if (!Number.isInteger(e[key]) || e[key] <= 0) errors.push(`${at}: ${key} must be a positive integer`);
        }
        // An exam card mirrors a real examiner, who asks one or two follow-ups. A general-course card is a
        // practice conversation, so it carries up to three deeper questions.
        const maxFollowUps = track === 'exam' ? 2 : 3;
        if (!Array.isArray(e.follow_ups) || e.follow_ups.length < 1 || e.follow_ups.length > maxFollowUps) {
          errors.push(`${at}: follow_ups must list one to ${maxFollowUps} questions`);
        } else if (e.follow_ups.some((q) => typeof q !== 'string' || q.trim().length < 5)) {
          errors.push(`${at}: follow_ups entries must be questions`);
        }

        // A general-course prompt must ask something, not just issue an order: naming ten kitchen objects is
        // only practice if the learner then says what they are for and how often they use them. Greek and
        // Armenian end a question with their own mark, so accept those too.
        if (track === 'general' && !/[?;\u037E\u055E]/.test(e.prompt)) {
          errors.push(`${at}: general prompt must contain a question`);
        }

        // Never name another language's exam on a card: English cards are English-exam only, etc.
        const text = [e.exam, e.part, e.task, e.prompt, ...(Array.isArray(e.follow_ups) ? e.follow_ups : [])].join(' ');
        for (const [owner, re] of Object.entries(EXAM_OWNERS)) {
          if (owner !== lang && re.test(text)) errors.push(`${at}: names a ${owner} exam on a ${lang} card`);
        }
      }

      // Curated writing cards carry the task scaffolding the strip renders: the exam (or the activity on the
      // general track), the part, the task type, the genre, a word target and a time limit, plus a self-check.
      if (type === 'writing' && e.curated) {
        if (typeof e.task !== 'string' || !e.task.trim()) errors.push(`${at}: curated writing needs a task`);
        if (typeof e.genre !== 'string' || !e.genre.trim()) errors.push(`${at}: curated writing needs a genre`);

        const track = e.track === undefined ? 'exam' : e.track;
        if (!TRACKS.includes(track)) errors.push(`${at}: invalid track "${e.track}"`);
        if (track === 'exam') {
          if (typeof e.exam !== 'string' || !e.exam.trim()) errors.push(`${at}: curated writing needs an exam`);
          if (typeof e.part !== 'string' || !e.part.trim()) errors.push(`${at}: curated writing needs a part`);
        } else {
          if (e.exam !== undefined || e.part !== undefined) errors.push(`${at}: general writing card must not name an exam`);
          if (!WRITING_ACTIVITIES.includes(e.activity)) {
            errors.push(`${at}: general writing card needs an activity (${WRITING_ACTIVITIES.join(', ')})`);
          }
        }

        for (const key of ['word_min', 'word_max', 'write_minutes']) {
          if (!Number.isInteger(e[key]) || e[key] <= 0) errors.push(`${at}: ${key} must be a positive integer`);
        }
        if (Number.isInteger(e.word_min) && Number.isInteger(e.word_max) && e.word_min > e.word_max) {
          errors.push(`${at}: word_min must not exceed word_max`);
        }
        if (!Array.isArray(e.checklist) || e.checklist.length < 2) {
          errors.push(`${at}: curated writing needs a checklist of at least two points`);
        } else if (e.checklist.some((c) => typeof c !== 'string' || c.trim().length < 5)) {
          errors.push(`${at}: checklist entries must be short sentences`);
        }
        if (!Array.isArray(e.audience) || e.audience.length === 0) {
          errors.push(`${at}: curated writing needs an audience list`);
        } else if (e.audience.some((a) => !AUDIENCES.includes(a))) {
          errors.push(`${at}: audience must use ${AUDIENCES.join(', ')}`);
        }

        const text = [e.exam, e.part, e.task, e.genre, e.prompt, ...(Array.isArray(e.checklist) ? e.checklist : [])].join(' ');
        for (const [owner, re] of Object.entries(EXAM_OWNERS)) {
          if (owner !== lang && re.test(text)) errors.push(`${at}: names a ${owner} exam on a ${lang} card`);
        }
      }
    });

    for (const [band, re] of Object.entries(BANDS)) {
      const curated = data.filter((e) => e.curated && re.test(String(e.level).toUpperCase()));
      // Both tracks are curated for every language: a learner at any level always gets a task written for it.
      const required = MIN_PER_BAND[type];
      if (curated.length < required) {
        errors.push(`${rel}: needs ${required} curated prompt(s) for band ${band}, has ${curated.length}`);
      }
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log('daily prompt files OK');
