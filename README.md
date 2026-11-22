# COSYpractice

Free vocabulary, grammar and speaking practice in 5 languages (English, French, Italian, Russian, Greek). Static site, no build step, no backend, no account.
Live at https://cosylanguages.github.io/COSYpractice/

## What is here
- `index.html` + `hub.js`: start a session, quick start, daily challenge, SRS memory review, weak spots, wheel, projector mode.
- `_engine/`: the exercise engine (sessions, scoring, feedback, renderers). `types/`: vocabulary, writing (daily challenge) and concept check.
- `progress-dashboard.html`: cross-course CEFR progress, stored in the browser.
- `css/`: `core.css` (tokens, fonts, base) + `practice-new.css`, `daily.css`, `shell.css`, `practice-modern.css` (design layer, light and dark).
- `js/shell.js`: top bar and footer shared with the other COSY sites. Theme and language live in localStorage and follow the reader across COSY sites.
- `i18n/`: interface strings for the same 5 languages.

## Data & Content Integration
Lesson content is dynamically integrated from **COSYdata** and **COSYtools**:
- `schemas/themes.json` and `vocabulary/<lang>/index.json` from **COSYdata** (https://cosylanguages.github.io/COSYdata/ and raw.githubusercontent.com/cosylanguages/COSYdata/main/)
- Spaced repetition (SRS) algorithms and practice tools shared with **COSYtools**
- Grammar lessons from **COSYplatform**, CCQ files from **COSYmanuals**
- `data/vocabulary/<level>/<theme>.js` and `data/grammar/<level>/<theme>.js` are bundled here (about 38 MB) and loaded on demand per session.

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
- COSYdata stores definitions and examples as plain strings; the loader converts them to `{ text }` objects the engine expects.
- Interface language (`i18n/`): static text uses `data-i18n` / `data-translate-key`; engine text (session header, feedback, buttons) is translated at run time from `_phrases` and `_patterns` in each language file. To add a string, add it to all five files.
- `growing-thread.html` stays in the old hub (it depends on hub curriculum files).
