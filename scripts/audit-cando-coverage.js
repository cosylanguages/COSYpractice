#!/usr/bin/env node
/* Reports lesson-level can-do coverage in the canonical COSYplatform curriculum. */
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
let total = 0;
let covered = 0;

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
  const row = rows.get(key) || { total: 0, covered: 0 };
  for (const unit of data.units || []) {
    for (const lesson of unit.lessons || []) {
      total += 1;
      row.total += 1;
      const notes = lesson.teacher_notes || '';
      const match = notes.match(/cando:\s*"([^"]+)"/);
      if (match && match[1].trim()) {
        covered += 1;
        row.covered += 1;
      }
    }
  }
  rows.set(key, row);
}

walk(curriculumDir);

console.log('Can-do coverage by course/level:');
for (const [key, row] of [...rows].sort()) {
  const missing = row.total - row.covered;
  console.log(`  ${key}: ${row.covered}/${row.total} (${missing} missing)`);
}
console.log(`Can-do coverage: ${covered}/${total} lessons (${total - covered} missing)`);
