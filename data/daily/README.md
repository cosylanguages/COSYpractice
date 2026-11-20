# Daily speaking and writing prompts

One short prompt per entry, per language: `data/daily/<lang>/speaking.json` and `data/daily/<lang>/writing.json`
(14 languages). Every language now carries curated speaking prompts for all four CEFR bands, so a learner at any
level gets a task written for that level rather than a loosely tagged one.

```json
{ "id": "fr:speaking:1", "prompt": "Quel est votre endroit préféré pour passer les vacances et pourquoi ?",
  "topic": "travel", "level": "A2" }
```

Curated speaking prompts carry the exam-style scaffolding the daily strip renders:

```json
{ "id": "en:speaking:c7", "prompt": "Describe a skill you learned that changed your daily life. Say what it is, how you learned it, and why it mattered.",
  "topic": "a skill", "level": "B1-B2", "curated": true,
  "task": "Cue card talk", "exam": "IELTS Part 2",
  "prep_seconds": 60, "speak_seconds": 120,
  "follow_ups": ["Was it difficult at the beginning?", "Would you recommend it to someone your age?"] }
```

| Field | Meaning |
|---|---|
| `task` | Short name of the task type shown as the primary chip ("Cue card talk", "Structured argument") |
| `exam` | Exam the task is modelled on ("IELTS Part 2", "DELF B1", "ТРКИ-2"); optional |
| `prep_seconds` | Preparation time before speaking |
| `speak_seconds` | Target speaking time |
| `follow_ups` | One or two examiner-style follow-up questions |

- `"curated": true` marks hand-written prompts that were written for one level band (`A0-A1`, `A2`, `B1-B2`, `C1-C2`). When any curated
  prompt matches the learner's band, the strip chooses among those only; otherwise it chooses among all matching entries.
  Coverage per band: English, French, Italian, Russian and Greek 10 curated prompts; Spanish, German and Portuguese 8;
  Armenian, Georgian, Tatar, Bashkir, Breton and Chuvash 4.
- Exam models in use: IELTS, TOEFL, CPE/CAE/ECPE, Trinity ISE, DELF/DALF, TCF, DELE/SIELE, Goethe, ÖSD, telc, CELI, CILS,
  CAPLE/Celpe-Bras, ТРКИ (TEL), Ελληνομάθεια, Հայոց լեզու. Tasks follow what each band is expected to do: naming and
  describing at A0-A1, narrating and transacting at A2, arguing and comparing at B1-B2, evaluating and synthesising at C1-C2.
- Check the files with `node scripts/validate-daily-prompts.js` (ids, prompts, level tags, speaking scaffolding, and the
  curated-band rule: every language needs curated speaking prompts for every band, and the core languages every band of writing too).
- `level` is a CEFR tag or range (`A2`, `A2-B1`, `B1-B2`). The daily strip on COSYlanguages picks among the prompts that
  match the learner's level band, rotating by day of year.
- **Consumers:** the daily strip (`COSYlanguages/js/daily-strip.js`), which reads `https://cosylanguages.github.io/COSYpractice/data/daily/<lang>/<type>.json`.
  Until 2026-11 these files lived in COSYdata (`daily/<lang>/`); the strip still falls back to that location.
- **The Daily Challenge on the Practice homepage** (`types/writing/daily_source.js`) also reads these files. Speaking and writing days
  take their prompt from here for the learner's language and level (curated prompts first); the vocabulary day shows the word of the day and
  the grammar day the verb + preposition of the day (else the verb of the day) from the COSYdata calendars. The English `DAILY_BANK` in
  `types/writing/daily_data.js` is only the fallback when a language has no data or the network fails. Test with `node scripts/test-daily-source.js`.
  The generic tips and micro-task wording are `daily.*` keys in `i18n/<lang>.json`.
- COSYdata holds vocabulary only: idioms, words and other dictionary-backed slots are generated there.
