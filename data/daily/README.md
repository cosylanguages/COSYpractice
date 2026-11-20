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
  "exam": "IELTS", "part": "Part 2 · Long turn (cue card)", "task": "Cue card talk",
  "prep_seconds": 60, "speak_seconds": 120,
  "follow_ups": ["Was it difficult at the beginning?", "Would you recommend it to someone your age?"] }
```

| Field | Meaning |
|---|---|
| `exam` | The exam the task is modelled on, including its level ("IELTS", "DELF B1", "ТРКИ-2 (TORFL-II, B2)", "DAB 2") |
| `part` | The speaking part of that exam ("Part 2 · Long turn (cue card)", "Sprechen Teil 1 · Vortrag", "Tarea 1 · Monólogo") |
| `task` | Short name of the task type ("Cue card talk", "Structured argument") |
| `prep_seconds` | Preparation time before speaking |
| `speak_seconds` | Target speaking time |
| `follow_ups` | One or two examiner-style follow-up questions |
| `track` | `"exam"` (default) or `"general"` — a general-course card has no exam and no part |
| `activity` | For general cards, the speaking activity: `brainstorm`, `analyse`, `describe`, `compare`, `discuss`, `narrate`, `role-play`, `problem-solving`, `interview`, `plan`, `present`, `identify` |
| `audience` | Who the card suits: any of `young`, `teen`, `adult`, `senior`. Empty means everyone |

`exam` and `part` are required: a learner always sees which real exam task they are practising. Part names follow each
exam's own structure — IELTS Part 1/2/3; Cambridge Pre A1 Starters (4 parts), A1 Movers (4), A2 Key (2), B1
Preliminary (4), B2 First (4), C1 Advanced (4) and C2 Proficiency (3); Trinity topic and conversation tasks; TOEFL iBT
Speaking Task 1 (Independent) and Tasks 2–4 (Integrated); DELF A1–B2 and DALF C1/C2 part names (*entretien dirigé*,
*monologue suivi*, *exercice en interaction*, *exposé*, *entretien*, *compte rendu*); TCF tâches; Goethe and ÖSD
*Sprechen Teil*; telc *Mündliche Prüfung* parts; DELE and SIELE *Tarea*; CILS *Parte*; CELI *Prova orale*; ТРКИ
задания under ТЭУ/ТБУ/ТРКИ-1–4; CAPLE *Produção e interação orais* and Celpe-Bras *Interação face a face*; and, for
the languages with no CEFR-aligned international exam, the state certification scheme (Armenian, Georgian, Tatar,
Bashkir and Chuvash state language exams, and the Breton **Diplom war ar Brezhoneg**, DAB 1–4).

**A card never names another language's exam.** The validator fails if an English card mentions DELF, DELE, Goethe or
any other language's exam, and likewise for every other language, so the exam chip always matches the language being
practised.

### Two tracks: exam and general course

Every language carries two kinds of speaking card.

- **Exam track** (`track` absent or `"exam"`) — modelled on a real exam task, with `exam`, `part` and `task`. 396 cards.
- **General-course track** (`"track": "general"`) — no exam at all. The card teaches speaking for its own sake:
  brainstorm a list, analyse a headline, describe a room, compare two options, role-play a shop return, solve a small
  problem, plan something together, present a proposal. 172 cards, so learners who are not preparing for an exam
  still get daily practice.

```json
{ "id": "en:speaking:g1", "prompt": "Name as many things as you can in a kitchen, then say which you use most.",
  "topic": "Name as many as you can", "level": "A0-A1", "curated": true,
  "track": "general", "task": "Name as many as you can", "activity": "brainstorm",
  "audience": ["young", "teen", "adult", "senior"],
  "prep_seconds": 10, "speak_seconds": 45, "follow_ups": ["Which do you use every day?"] }
```

General cards are written for **all ages**. Every band has a card for young learners, teens, adults and seniors, with
one deliberate exception: there is no C1-C2 card tagged `young`, because an advanced young learner is rare and the
strip then serves the B1-B2 card instead (see the ranking table below). Nothing in either track assumes a gender,
a relationship status, or an adult life: prompts say "work or school", "the people you live with", "your household".

### How the strip chooses a card

`COSYlanguages/js/daily-strip.js` first works out the audience: a container's own `data-audience`, else the site-wide
preference in `localStorage` (`cosy_audience_preference`: `children`, `teens`, `adults`, `seniors`, mapped onto
`young`, `teen`, `adult`, `senior`), else `<html data-audience>`. It then ranks cards by two things — how well the
audience fits, and how close the level is to the chosen band — and takes the best:

| | same band | nearest band first |
|---|---|---|
| names this audience | 1st | 4th |
| names no audience (neutral) | 2nd | 5th |
| names other audiences only | 3rd | 6th |

Age comes before level on purpose. A twelve-year-old who picks C1-C2 is better served a B1-B2 card about school than
an adult-only card about compulsory voting, because a level measures language, not maturity. The "what this level
expects" guide describes the card actually shown, not the band the learner clicked, so the two never disagree.
`data-track="general"` hides exam tasks and `data-track="exam"` hides course material; unset means both.

- `"curated": true` marks hand-written prompts that were written for one level band (`A0-A1`, `A2`, `B1-B2`, `C1-C2`). When any curated
  prompt matches the learner's band, the strip chooses among those only; otherwise it chooses among all matching entries.
  Coverage per band: English, French, Italian, Russian and Greek 10 exam prompts; Spanish, German and Portuguese 8;
  Armenian, Georgian, Tatar, Bashkir, Breton and Chuvash 4. The general track adds 3-4 cards per band per language
  (English, French, Italian, Russian, Greek, Spanish, German, Portuguese 12-13; Armenian, Georgian, Tatar, Bashkir,
  Breton, Chuvash 9).
- Exam models in use: IELTS, TOEFL iBT, Cambridge (Pre A1 Starters, Movers, Key, Preliminary, First, Advanced,
  Proficiency), Trinity ISE, ECPE, DELF/DALF, TCF, DELE, SIELE, Goethe-Zertifikat, ÖSD, telc, CILS, CELI, CAPLE,
  Celpe-Bras, ТРКИ (ТЭУ/ТБУ/ТРКИ-1–4), Ελληνομάθεια, the Armenian, Georgian, Tatar, Bashkir and Chuvash state language
  exams, and the Breton Diplom war ar Brezhoneg (DAB). Tasks follow what each band is expected to do: naming and
  describing at A0-A1, narrating and transacting at A2, arguing and comparing at B1-B2, evaluating and synthesising at C1-C2.
- Check the files with `node scripts/validate-daily-prompts.js` (ids, prompts, level tags, the required exam/part/task
  scaffolding, and the curated-band rule: every language needs curated speaking prompts for every band, and the core
  languages every band of writing too).
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
