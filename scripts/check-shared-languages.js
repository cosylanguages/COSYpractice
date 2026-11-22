#!/usr/bin/env node
/* Fails when the vendored practice language registry drifts from COSYlanguages. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.env.COSYLANGUAGES_DIR;
if (!root) {
  console.log('COSYLANGUAGES_DIR is not set; skipping shared language registry check.');
  process.exit(0);
}

const localFile = path.join(__dirname, '..', 'js', 'languages.js');
const sharedFile = path.join(root, 'js', 'data', 'languages.js');

function load(file) {
  const sandbox = {
    window: {},
    localStorage: { getItem() { return null; } }
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  return sandbox.window;
}

function snapshot(registry) {
  const probes = ['en', 'fr', 'ru', 'Greek', 'A1', 'upper-intermediate', 'C2', 'all'];
  return {
    languages: registry.COSY_LANGUAGES,
    levels: registry.COSY_LEVELS,
    family: registry.FAMILY_MAP,
    withData: registry.COSY_LANGUAGES_WITH_DATA,
    codes: probes.map(value => registry.getLangCode(value)),
    shorts: probes.map(value => registry.levelIdToShort(value)),
    ids: probes.map(value => registry.levelShortToId(value)),
    dirs: probes.map(value => registry.getLevelDir(value))
  };
}

const local = snapshot(load(localFile));
const shared = snapshot(load(sharedFile));

if (JSON.stringify(local) !== JSON.stringify(shared)) {
  console.error('js/languages.js has drifted from COSYlanguages/js/data/languages.js.');
  console.error('Update the practice copy so both registries match.');
  process.exit(1);
}
console.log('Shared language registry OK.');
