# Daily speaking and writing prompts

One short prompt per entry, per language: `data/daily/<lang>/speaking.json` and `data/daily/<lang>/writing.json`
(14 languages; English has 30 prompts per file, the others 10 placeholders awaiting native review, see `TODO.md`).

```json
{ "id": "fr:speaking:1", "prompt": "Quel est votre endroit préféré pour passer les vacances et pourquoi ?",
  "topic": "travel", "level": "A2" }
```

- `"curated": true` marks hand-written prompts that were written for one level band (`A0-A1`, `A2`, `B1-B2`, `C1-C2`). When any curated
  prompt matches the learner's band, the strip chooses among those only; otherwise it chooses among all matching entries. English, French,
  Italian, Russian and Greek have curated prompts for every band, which guarantees a different task at each level. Other languages have none
  yet, so they use their own (placeholder) prompts instead of falling back to English.
- Check the files with `node scripts/validate-daily-prompts.js` (ids, prompts, level tags, and the curated-band rule for the core languages).
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
