# COSYpractice

Free vocabulary, grammar and speaking practice in 5 languages (English, French, Italian, Russian, Greek). Static site, no build step, no backend, no account.
Live at https://cosylanguages.github.io/COSYpractice/

## What is here
- `index.html` + `hub.js`: start a session, quick start, daily challenge, SRS memory review, weak spots, wheel, projector mode.
- `_engine/`: the exercise engine (sessions, scoring, feedback, renderers) and the cross-course SRS store (`progress.js`). `types/`: vocabulary, writing (daily challenge) and concept check.
- `progress-dashboard.html`: cross-course CEFR progress, stored in the browser.
- `cognitive-immersion.html`: planning tools for immersion, spacing and retrieval practice.
- `css/`: `core.css` pulls the shared foundation (fonts, tokens, base, layout) from COSYlanguages and keeps only practice components locally; `practice-new.css`, `daily.css`, `shell.css`, `practice-modern.css` are the design layer.
- `js/shell.js`: top bar and footer shared with the other COSY sites. Theme and language live in localStorage and follow the reader across COSY sites.
- `i18n/`: interface strings for the same 5 languages.

## Data & Content Integration
Lesson content is dynamically integrated from **COSYdata** and **COSYplatform**:
- `schemas/themes.json` and `vocabulary/<lang>/index.json` from **COSYdata** (https://cosylanguages.github.io/COSYdata/ and raw.githubusercontent.com/cosylanguages/COSYdata/main/)
- `taxonomy/vocab-confusion-pairs.json`, `taxonomy/grammar-confusion-pairs.json` and `taxonomy/french-grammar-confusion-pairs.json` from **COSYdata**. `js/taxonomy.js` loads them at start-up. The vocabulary file supplies the 273 pair options in the category picker; a pair is selected as `pair:<id>` and `js/shared.js` filters the COSYdata vocabulary pool to the two terms.
- Grammar lessons and curriculum from **COSYplatform**; CCQ and phonology reference from **COSYmanuals** (loaded at runtime from `https://cosylanguages.github.io/COSYmanuals/data/grammar/reference/`)
- The exercise engine and SRS store live in `_engine/`; shared practice helpers (speech, vocabulary filtering, theme matching) live in `js/shared.js`. They depend on practice runtime globals (`vocabularyData`, `getLevelCode`, theme helpers), so they stay practice-owned until COSYtools exposes a shared JS module.
- There are no bundled per-level drill datasets. Vocabulary and grammar sessions are generated at runtime from COSYdata entries, plus the curated grammar banks in `data/grammar_confusion_pairs.js` and `data/french_grammar_confusion_pairs.js`.

### Repository boundaries
| Content | Owner |
|---|---|
| Vocabulary, themes, word/verb of the day | COSYdata |
| Vocabulary and grammar confusion-pair taxonomy | COSYdata (`taxonomy/*-confusion-pairs.json`) |
| Curriculum, grammar lessons | COSYplatform |
| CCQ, phonology reference | COSYmanuals |
| Daily speaking and writing prompts, practice engine, SRS store | COSYpractice |
| Shared fonts, design tokens, base CSS, logo | COSYlanguages |
| Practice data and speech helpers | COSYpractice (`js/shared.js`); COSYtools has no shared JS package yet |

## DELF/DALF theme catalogue
`data/exam/fr/delf-dalf-themes.json` is the canonical list of French exam themes supplied for
DELF B1, DELF B2, DALF C1 and DALF C2: 55 categories and 545 themes, with the official speaking
and writing parts, timings and word targets for each level. It also records exam-format notes,
method advice and example subjects for speaking, writing and reading. French daily cards carry a
`theme` field pointing at a category, so a prompt can be traced back to the exam theme it practises.
COSYlanguages renders the catalogue on its Exam Preparation course page; COSYplatform and
COSYmanuals build their French exam track from the same category ids. DALF C2 writing is a single
structured text of 700 words minimum in 3 h 30. Check it with `node scripts/test-exam-themes.js`.

## Daily elements
This repository owns the daily speaking and writing prompts (`data/daily/<lang>/speaking.json`,
`writing.json`) and the rotating Daily Challenge. The other daily elements live where they belong;
the page links out to them instead of copying their content.

| Element | Owner |
|---|---|
| Speaking and writing prompts, Daily Challenge | COSYpractice (`data/daily/<lang>/`, `hub.js`) |
| Word, verb, verb + preposition, phrasal verb and idiom of the day | [COSYdata](https://github.com/cosylanguages/COSYdata) |
| Fun fact and the hub daily strip | [COSYlanguages](https://github.com/cosylanguages/COSYlanguages) |
| Cultural spotlights | [COSYevents](https://github.com/cosylanguages/COSYevents) |

The page mounts the shared directory from COSYlanguages with
`<div data-daily-directory data-self="practice">`. Validate the prompts with
`node scripts/validate-daily-prompts.js`.

## Develop
`python3 -m http.server 8000` and open http://localhost:8000/. Nothing to install.

## Conventions
Never commit tokens or keys. Keep the site free of tracking. Prefer editing `practice-modern.css` over the legacy sheets.

## Notes
- Vocabulary is loaded from COSYdata per request (own timeouts). A chosen level only loads that level's files; "all levels + all themes" loads a random sample of about 900 entries, so a session starts in a second or two instead of pulling every theme file.
- Confusion-pair sessions use a `pair:<id>` theme. The picker shows the COSYdata taxonomy; selecting a pair sets the level to the pair's level and filters the loaded pool to `termA`/`termB`, so no per-pair drill file is needed. Only pairs marked `covered` (both terms present in COSYdata) are offered; the taxonomy keeps uncovered pairs for future vocabulary work. A pair's level sets the picker, but both terms stay in the session even when their COSYdata entries are tagged at different CEFR levels. Inflected pairs such as `person`/`people` or `relative`/`relatives` are expanded to the surface form the pair names, so the session quizzes the actual contrast.
- Phonology and CCQ reference files are fetched from COSYmanuals GitHub Pages; no local copy is bundled.
- COSYdata stores definitions and examples as plain strings; the loader converts them to `{ text }` objects the engine expects.
- Interface language (`i18n/`): static text uses `data-i18n` / `data-translate-key`; engine text (session header, feedback, buttons) is translated at run time from `_phrases` and `_patterns` in each language file. To add a string, add it to all five files.
- Exercise data covers 14 languages in COSYdata. The interface, setup pills and i18n cover five (en, fr, it, ru, el); the wheel and `quickStart` can still launch the other nine from a URL or the wheel.
- The SRS store in `_engine/progress.js` keeps one record per course item in `localStorage`, with intervals of 0, 1, 3, 7, 14 and 30 days. The progress dashboard reads it; no account or backend is involved.
