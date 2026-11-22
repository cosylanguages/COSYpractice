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
| `follow_ups` | Examiner-style follow-ups: one or two on an exam card, up to three on a general card |
| `track` | `"exam"` (default) or `"general"` — a general-course card has no exam and no part |
| `activity` | For general cards, the speaking activity: `brainstorm`, `analyse`, `describe`, `compare`, `discuss`, `narrate`, `role-play`, `problem-solving`, `interview`, `plan`, `present`, `identify` |
| `audience` | Who the card suits: any of `young`, `teen`, `adult`, `senior`. Empty means everyone |
| `theme` | Optional. On French exam cards, the DELF/DALF category id from `data/exam/fr/delf-dalf-themes.json` that the prompt practises (for example `b2-environnement`). The catalogue holds the full theme list and the official task shapes for B1, B2, C1 and C2. |

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

- **Exam track** (`track` absent or `"exam"`) — modelled on a real exam task, with `exam`, `part` and `task`. 829 cards.
- **General-course track** (`"track": "general"`) — no exam at all. The card teaches speaking for its own sake:
  brainstorm a list, analyse a headline, describe a room, compare two options, role-play a shop return, solve a small
  problem, plan something together, present a proposal. 422 cards, so learners who are not preparing for an exam
  still get daily practice.

Both tracks are complete for every band and every language: at least **12 exam cards** and **6 general cards** per
CEFR band per language, and the general track uses all twelve activities in all fourteen languages. So whichever
level a learner picks, in whichever language, there is real practice written for it. In practice every language
carries 13 or more exam cards and 6 or more general cards in each band, so the daily rotation takes at least two
weeks to repeat.

```json
{ "id": "en:speaking:g1",
  "prompt": "Name as many things as you can that you find in a kitchen. Try to say ten. Which ones do you use every day? What do you do with them?",
  "topic": "Name as many as you can", "level": "A0-A1", "curated": true,
  "track": "general", "task": "Name as many as you can", "activity": "brainstorm",
  "audience": ["young", "teen", "adult", "senior"],
  "prep_seconds": 10, "speak_seconds": 45,
  "follow_ups": ["Which one is the most useful?", "Which one is dangerous for children?", "What is in your kitchen that is not in mine?"] }
```

**A general prompt always asks something.** Naming ten objects is only practice if the learner then says what each one
is for, how often they use it, and which one matters most, so the prompt carries its own questions instead of stopping
at an order. The validator rejects a general prompt with no question mark (it accepts the Greek `;`, the Greek
question mark `;`/`;` and the Armenian `՞`). The three follow-ups then push one step further: why, how often, what you
would change, who it helps.

Wording is pitched to the band: A0-A1 stays in the present simple with one clause per question; A2 adds the past and
`will`; B1-B2 uses the perfect, conditionals and connectors; C1-C2 asks for concession, framing and evaluation.

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
  Coverage per band: every language carries at least 8 curated exam prompts per band. French adds the full
  DELF/DALF theme bank: all 55 categories in `data/exam/fr/delf-dalf-themes.json` have at least one speaking card
  and one writing card at the matching exam (DELF B1, DELF B2, DALF C1, DALF C2), and every French exam card names
  its category in `theme`. The general track adds at least 4 cards per band per language. Writing follows the same
  shape with a floor of 6 curated exam cards and 4 general cards per band.
- Exam models in use: IELTS, TOEFL iBT, Cambridge (Pre A1 Starters, Movers, Key, Preliminary, First, Advanced,
  Proficiency), Trinity ISE, ECPE, DELF/DALF, TCF, DELE, SIELE, Goethe-Zertifikat, ÖSD, telc, CILS, CELI, CAPLE,
  Celpe-Bras, ТРКИ (ТЭУ/ТБУ/ТРКИ-1–4), Ελληνομάθεια, the Armenian, Georgian, Tatar, Bashkir and Chuvash state language
  exams, and the Breton Diplom war ar Brezhoneg (DAB). Tasks follow what each band is expected to do: naming and
  describing at A0-A1, narrating and transacting at A2, arguing and comparing at B1-B2, evaluating and synthesising at C1-C2.
- Check the files with `node scripts/validate-daily-prompts.js` (ids, prompts, level tags, the required exam/part/task
  scaffolding, and the curated-band rule: every language needs curated speaking prompts for every band, and the core
  languages every band of writing too). Then run `node scripts/test-speaking-coverage.js` and
  `node scripts/test-writing-coverage.js`, which hold the content floors: at least 8 curated exam cards and 4 general
  cards per band per language for speaking, 6 and 4 for writing, and all twelve activities present in all fourteen
  languages on each track. The writing check also fails if a curated card is missing its genre, word target, time
  limit or self-check list.
- Writing cards carry `genre`, `word_min`/`word_max`, `write_minutes` and a 2–3 point `checklist`; the strip renders
  them as chips, a word target, a time limit and a "Before you finish, check" list. They may also carry `follow_ups`
  (one or two questions): the strip shows them under a "Follow-up questions" heading, the same block the speaking tab
  uses, so a written task can be extended after the draft. The five languages with a live page (en, fr, it, ru, el)
  have follow-ups on every curated writing card. Exam writing tasks follow the
  IELTS Task 1/2, TOEFL integrated and academic-discussion, Cambridge, DELF/DALF, Goethe, DELE and ТРКИ shapes at the
  length each band is expected to produce (A0-A1: 10-40 words, A2: 25-90, B1-B2: 80-280, C1-C2: 140-300).
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
