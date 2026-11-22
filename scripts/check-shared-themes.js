#!/usr/bin/env node
'use strict';

/**
 * Compares the vendored practice theme schema with the canonical COSYdata copy.
 * Usage: COSYDATA_DIR=/path/to/COSYdata node scripts/check-shared-themes.js
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const localPath = path.join(root, 'data', 'schemas', 'themes.json');
const dataDir = process.env.COSYDATA_DIR || '/tmp/COSYdata';
const canonicalPath = path.join(dataDir, 'schemas', 'themes.json');

for (const file of [localPath, canonicalPath]) {
  if (!fs.existsSync(file)) {
    console.error(`Missing theme schema: ${file}`);
    process.exit(1);
  }
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((out, key) => {
      out[key] = stable(value[key]);
      return out;
    }, {});
  }
  return value;
}

const local = stable(JSON.parse(fs.readFileSync(localPath, 'utf8')));
const canonical = stable(JSON.parse(fs.readFileSync(canonicalPath, 'utf8')));

if (JSON.stringify(local) !== JSON.stringify(canonical)) {
  console.error('data/schemas/themes.json is out of sync with COSYdata/schemas/themes.json.');
  console.error('Update the vendored copy from COSYdata.');
  process.exit(1);
}

console.log('Shared theme schema OK: practice copy matches COSYdata.');
