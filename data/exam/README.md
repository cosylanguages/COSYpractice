# Exam theme catalogues

Canonical theme lists for official language exams. They are static JSON, fetched at runtime by
the pages that render them, so no build step is needed.

## French — `fr/delf-dalf-themes.json`

Themes supplied for DELF B1, DELF B2, DALF C1 and DALF C2, grouped by category. The file also
records the official speaking and writing parts, timings and word targets for each level.

```json
{
  "lang": "fr",
  "updated": "2026-11-22",
  "levels": {
    "B2": {
      "exam": "DELF B2",
      "speaking": { "duration": "20 min", "preparation": "30 min", "parts": [] },
      "writing":  { "duration": "60 min", "words": "250", "parts": [] },
      "categories": [
        { "id": "b2-environnement", "label": "L'environnement", "themes": ["le réchauffement climatique"] }
      ]
    }
  }
}
```

Category ids are stable and are used as the `theme` value on French cards in
`data/daily/fr/speaking.json` and `data/daily/fr/writing.json`.

Consumers:

- COSYlanguages `courses/exam-preparation.html` through `js/exam-themes.js`.
- COSYplatform `curriculums/fr/exam/*.json` (lesson `themeIds`).
- COSYmanuals `manuals/fr/exam/` and `curriculums/fr/exam/` pointers.

Validate with `node scripts/test-exam-themes.js`.
