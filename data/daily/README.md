# Daily speaking and writing prompts

One short prompt per entry, per language: `data/daily/<lang>/speaking.json` and `data/daily/<lang>/writing.json`
(14 languages; English has 30 prompts per file, the others 10 placeholders awaiting native review, see `TODO.md`).

```json
{ "id": "fr:speaking:1", "prompt": "Quel est votre endroit préféré pour passer les vacances et pourquoi ?",
  "topic": "travel", "level": "A2" }
```

- `level` is a CEFR tag or range (`A2`, `A2-B1`, `B1-B2`). The daily strip on COSYlanguages picks among the prompts that
  match the learner's level band, rotating by day of year.
- **Consumers:** the daily strip (`COSYlanguages/js/daily-strip.js`), which reads `https://cosylanguages.github.io/COSYpractice/data/daily/<lang>/<type>.json`.
  Until 2026-11 these files lived in COSYdata (`daily/<lang>/`); the strip still falls back to that location.
- **Not the same as the Daily Challenge.** `types/writing/daily_data.js` (`DAILY_BANK`) holds full challenges with tips and
  micro-tasks. These files are the lighter one-line prompts shown in the strip. Unifying the two is a possible follow-up.
- COSYdata holds vocabulary only: idioms, words and other dictionary-backed slots are generated there.
