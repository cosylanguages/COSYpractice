#!/usr/bin/env node
/* Fails when data/levels/curriculum-stats.json drifts from COSYplatform's curriculum. */
'use strict';

const fs = require('fs');
const path = require('path');
const { build, OUTPUT } = require('./curriculum-stats');

const platformDir = process.env.COSYPLATFORM_DIR;
if (!platformDir) {
  console.log('COSYPLATFORM_DIR is not set; skipping curriculum stats check.');
  process.exit(0);
}

const expected = `${JSON.stringify(build(platformDir), null, 2)}\n`;
const actual = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
if (actual !== expected) {
  console.error('data/levels/curriculum-stats.json is stale. Run:');
  console.error('  COSYPLATFORM_DIR=<path-to-COSYplatform> node scripts/curriculum-stats.js');
  process.exit(1);
}
console.log('Curriculum stats OK.');
