'use strict';

const fs = require('fs');
const path = require('path');

const SNAPSHOT = path.join(__dirname, '..', 'data', 'levels', 'cefr-outcomes.json');
const OUTPUT = path.join(__dirname, '..', 'data', 'levels', 'curriculum-stats.json');

function build(platformDir) {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const root = path.join(platformDir, 'curriculums', 'en');
  const courses = {};

  for (const course of Object.keys(snapshot.courses || {})) {
    const levels = [];
    for (const entry of snapshot.courses[course]) {
      const file = path.join(root, course, `${entry.level}.json`);
      if (!fs.existsSync(file)) {
        throw new Error(`Missing curriculum file: ${path.relative(platformDir, file)}`);
      }
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const units = Array.isArray(data.units) ? data.units : [];
      const lessons = units.reduce((sum, unit) => sum + (Array.isArray(unit.lessons) ? unit.lessons.length : 0), 0);
      const authoredLessons = units.reduce((sum, unit) => sum + (unit.lessons || []).filter(
        lesson => !(lesson.status === 'needs_review' && lesson.source === 'ported-from-legacy')
      ).length, 0);
      levels.push({
        level: entry.level,
        units: units.length,
        lessons,
        authored_lessons: authoredLessons,
        placeholder_lessons: lessons - authoredLessons
      });
    }
    courses[course] = levels;
  }

  return {
    language: 'en',
    generated_from: 'COSYplatform curriculums/en/**/*.json',
    courses
  };
}

function write(platformDir) {
  const payload = build(platformDir);
  fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

module.exports = { build, write, OUTPUT };

if (require.main === module) {
  const platformDir = process.env.COSYPLATFORM_DIR;
  if (!platformDir) {
    console.log('COSYPLATFORM_DIR is not set; skipping curriculum stats generation.');
    process.exit(0);
  }
  const payload = write(platformDir);
  const levels = Object.values(payload.courses).reduce((n, arr) => n + arr.length, 0);
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)}: ${levels} course levels.`);
}
