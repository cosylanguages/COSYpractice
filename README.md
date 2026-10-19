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

## Data
Lesson content is not duplicated here. At run time the page reads:
- `schemas/themes.json` and `vocabulary/<lang>/index.json` from **COSYdata** (https://cosylanguages.github.io/COSYdata/ and raw.githubusercontent.com/cosylanguages/COSYdata/main/)
- grammar lessons from **COSYplatform**, CCQ files from **COSYmanuals**
- `data/vocabulary/<level>/<theme>.js` and `data/grammar/<level>/<theme>.js` are bundled here (about 38 MB) and loaded on demand per session.

## Develop
`python3 -m http.server 8000` and open http://localhost:8000/. Nothing to install.

## Conventions
Never commit tokens or keys. Keep the site free of tracking. Prefer editing `practice-modern.css` over the legacy sheets.

## Notes
- Vocabulary is loaded from COSYdata per request (own timeouts). A chosen level only loads that level's files; "all levels + all themes" loads a random sample of about 900 entries, so a session starts in a second or two instead of pulling every theme file.
- COSYdata stores definitions and examples as plain strings; the loader converts them to `{ text }` objects the engine expects.
- Interface language (`i18n/`): static text uses `data-i18n` / `data-translate-key`; engine text (session header, feedback, buttons) is translated at run time from `_phrases` and `_patterns` in each language file. To add a string, add it to all five files.
- `growing-thread.html` stays in the old hub (it depends on hub curriculum files).
