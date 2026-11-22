# Native-speaker review: daily speaking and writing prompts

These files were initialised with 10 placeholder prompts per language (30 for English) and moved from COSYdata, which now holds vocabulary only. Speaking has since been expanded twice: first to curated prompts for every CEFR band in every language, then again so that every language carries at least 13 exam and 6 general cards per band (1251 curated speaking cards in total), with exam-style scaffolding (`task`, `exam`, `prep_seconds`, `speak_seconds`, `follow_ups`). Those additions still need a native-speaker read for wording, register and cultural fit before they are treated as final. Writing is still at 10 placeholders per language and needs the same expansion.

---

### 1. French (`fr`)
- [x] Review `data/daily/fr/speaking.json` prompts for natural phrasing across CEFR levels A2–B2.
- [x] Review `data/daily/fr/writing.json` prompts for situational accuracy and variety.
- [x] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [x] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.
- [x] Map every DELF B1, DELF B2, DALF C1 and DALF C2 theme category to at least one speaking card and one writing
  card, using `data/exam/fr/delf-dalf-themes.json` and the `theme` field (55 categories, 545 themes).
- [ ] Native-speaker proofread of the 55 new theme-mapped speaking cards and 55 new theme-mapped writing cards.

### 2. Italian (`it`)
- [ ] Review `data/daily/it/speaking.json` prompts for natural conversational style.
- [ ] Review `data/daily/it/writing.json` prompts for level progression.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 3. Russian (`ru`)
- [ ] Review `data/daily/ru/speaking.json` prompts for natural modern Russian usage.
- [ ] Review `data/daily/ru/writing.json` prompts for stylistics.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 4. Greek (`el`)
- [ ] Review `data/daily/el/speaking.json` prompts for natural modern Greek (Demotic).
- [ ] Review `data/daily/el/writing.json` prompts for accuracy.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 5. Spanish (`es`)
- [ ] Review `data/daily/es/speaking.json` prompts for dialect neutrality (Peninsular / Latin American).
- [ ] Review `data/daily/es/writing.json` prompts for clarity.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 6. German (`de`)
- [ ] Review `data/daily/de/speaking.json` prompts for formal vs. informal register consistency.
- [ ] Review `data/daily/de/writing.json` prompts for task clarity.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 7. Portuguese (`pt`)
- [ ] Review `data/daily/pt/speaking.json` prompts for European / Brazilian variant tags.
- [ ] Review `data/daily/pt/writing.json` prompts for level appropriateness.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 8. Armenian (`hy`)
- [ ] Review `data/daily/hy/speaking.json` prompts for Eastern Armenian standard literary usage.
- [ ] Review `data/daily/hy/writing.json` prompts.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 9. Georgian (`ka`)
- [ ] Review `data/daily/ka/speaking.json` prompts for standard literary Georgian.
- [ ] Review `data/daily/ka/writing.json` prompts.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 10. Bashkir (`ba`)
- [ ] Review `data/daily/ba/speaking.json` prompts for standard literary Bashkir usage.
- [ ] Review `data/daily/ba/writing.json` prompts for grammar and style.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 11. Breton (`br`)
- [ ] Review `data/daily/br/speaking.json` prompts for standard Peurunvan orthography and natural phrasing.
- [ ] Review `data/daily/br/writing.json` prompts.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 12. Chuvash (`cv`)
- [ ] Review `data/daily/cv/speaking.json` prompts for standard literary Chuvash phrasing.
- [ ] Review `data/daily/cv/writing.json` prompts for task variety.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### 13. Tatar (`tt`)
- [ ] Review `data/daily/tt/speaking.json` prompts for standard literary Tatar orthography and phrasing.
- [ ] Review `data/daily/tt/writing.json` prompts for clarity.
- [ ] Review the added curated speaking prompts (4 bands, exam-style tasks) for natural phrasing and level fit.
- [ ] Expand writing from 10 to 30 prompts per file, with curated prompts for every CEFR band.

### Interface strings for the Daily Challenge (`i18n/<lang>.json`, keys `daily.*`)
- [ ] Native-speaker review of the 27 `daily.*` strings in `i18n/fr.json`, `i18n/it.json`, `i18n/ru.json` and `i18n/el.json`
  (card titles and subtitles, tips, micro-task wording). They were written without a native check; English is the fallback in `types/writing/daily_source.js`.
