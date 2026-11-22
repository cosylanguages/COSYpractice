#!/usr/bin/env node
/* Audits lesson-level can-do coverage in the canonical COSYplatform curriculum. */
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.env.COSYPLATFORM_DIR;
if (!root) {
  console.log('COSYPLATFORM_DIR is not set; skipping can-do coverage audit.');
  process.exit(0);
}

const curriculumDir = path.join(root, 'curriculums', 'en');
const rows = new Map();
const failures = [];
let total = 0;
let authoredCovered = 0;
let placeholders = 0;

function isPlaceholder(lesson) {
  return lesson.status === 'needs_review' && lesson.source === 'ported-from-legacy';
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.json')) audit(target);
  }
}

function audit(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const key = `${data.course_type}/${data.level}`;
  const row = rows.get(key) || { total: 0, authored: 0, authoredCovered: 0, placeholders: 0 };
  for (const unit of data.units || []) {
    for (const lesson of unit.lessons || []) {
      total += 1;
      row.total += 1;
      const notes = lesson.teacher_notes || '';
      const match = notes.match(/cando:\s*"([^"]+)"/);
      const hasCanDo = Boolean(match && match[1].trim());
      if (isPlaceholder(lesson)) {
        placeholders += 1;
        row.placeholders += 1;
      } else {
        row.authored += 1;
        if (hasCanDo) {
          authoredCovered += 1;
          row.authoredCovered += 1;
        } else {
          failures.push(`${key} lesson ${lesson.lesson}: ${lesson.title}`);
        }
      }
    }
  }
  rows.set(key, row);
}

walk(curriculumDir);

console.log('Can-do coverage by course/level (authored lessons):');
for (const [key, row] of [...rows].sort()) {
  const missing = row.authored - row.authoredCovered;
  const suffix = row.placeholders ? `, ${row.placeholders} placeholders` : '';
  console.log(`  ${key}: ${row.authoredCovered}/${row.authored} authored (${missing} missing${suffix})`);
}
console.log(`Authored lessons: ${authoredCovered}/${total - placeholders} have a can-do statement.`);
console.log(`Placeholder lessons: ${placeholders}/${total} (no lesson content yet).`);

if (failures.length) {
  console.error('Authored lessons without a can-do statement:');
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

