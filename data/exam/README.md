# Exam theme catalogues

Canonical theme lists for official language exams. They are static JSON, fetched at runtime by
the pages that render them, so no build step is needed.

## French — `fr/delf-dalf-themes.json`

Themes supplied for DELF B1, DELF B2, DALF C1 and DALF C2, grouped by category. The file also
records the official speaking and writing parts, timings and word targets for each level, plus
exam-format notes, method advice and example subjects for speaking, writing and reading.

```json
{
  "lang": "fr",
  "updated": "2026-11-22",
  "levels": {
    "B2": {
      "exam": "DELF B2",
      "formatNotes": ["Quatre parties : ..."],
      "speaking": {
        "duration": "20 min",
        "preparation": "30 min",
        "parts": [],
        "method": { "errors": [], "tips": [] },
        "examples": []
      },
      "writing": {
        "duration": "60 min",
        "words": "250",
        "parts": [],
        "method": { "errors": [], "tips": [] },
        "examples": []
      },
      "reading": { "examples": [], "method": { "errors": [], "tips": [] } },
      "categories": [
        { "id": "b2-environnement", "label": "L'environnement", "themes": ["le réchauffement climatique"] }
      ]
    }
  }
}
```

DALF C2 uses a single written task: a structured text of 700 words minimum based on a dossier of
about 2,000 words, in 3 h 30. The speaking is a 5-minute account of the audio document, a
10-minute argument and a 10-minute debate, after 1 h of preparation. Since January 2026, C2
dossiers contain only informative or argumentative texts, with no iconographic documents.

### Source and deduplication

The category lists come from the DELF/DALF preparation material supplied by COSYlanguages. The
format, method and example-subject sections were cross-checked against the Français avec Pierre
pages for DELF B1, DELF B2, DALF C1 and DALF C2. The broad themes on those pages (work, education,
environment, consumption, media, society, tourism, technology, health) were already covered by
the existing categories, so they were not added a second time. Only the format details, method
advice and specific example subjects that were missing were added.

Category ids are stable and are used as the `theme` value on French cards in
`data/daily/fr/speaking.json` and `data/daily/fr/writing.json`.

Consumers:

- COSYlanguages `courses/exam-preparation.html` through `js/exam-themes.js`.
- COSYplatform `curriculums/fr/exam/*.json` (lesson `themeIds`).
- COSYmanuals `manuals/fr/exam/` and `curriculums/fr/exam/` pointers.

Validate with `node scripts/test-exam-themes.js`.
