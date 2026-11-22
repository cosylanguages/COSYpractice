#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BASE = 'https://cosylanguages.github.io/COSYdata/';
const responses = {
  [`${BASE}vocabulary/en/index.json`]: {
    'en:arrive:verb': 'a1/movement.json',
    'en:leave:verb': 'a1/movement.json',
    'en:go:verb': 'a1/movement.json'
  },
  [`${BASE}vocabulary/en/flat-index.json`]: {
    arrive: [{ id: 'en:arrive:verb', field: 'word' }],
    leave: [{ id: 'en:leave:verb', field: 'word' }]
  },
  [`${BASE}vocabulary/en/a1/movement.json`]: [
    { id: 'en:arrive:verb', word: 'arrive', form: 'verb', level: 'a1', theme: 'movement' },
    { id: 'en:leave:verb', word: 'leave', form: 'verb', level: 'a1', theme: 'movement' },
    { id: 'en:go:verb', word: 'go', form: 'verb', level: 'a1', theme: 'movement' }
  ]
};
const fetched = [];

const window = {
  localStorage: { getItem: () => null },
  COSY_VOCAB_CONFUSION_PAIRS: {
    a1: [
      { id: 'arrive-vs-leave', label: 'arrive vs leave', group: 'Movement', level: 'a1', termA: 'arrive', termB: 'leave' }
    ]
  }
};

const sandbox = {
  window,
  document: { currentScript: null },
  localStorage: window.localStorage,
  fetch: async (url) => {
    fetched.push(url);
    if (!(url in responses)) return { ok: false, json: async () => null };
    return { ok: true, json: async () => responses[url] };
  },
  AbortController,
  URL,
  console,
  setTimeout,
  clearTimeout
};

const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'cosy-core.js'), 'utf8');
vm.runInNewContext(code, sandbox, { filename: 'js/cosy-core.js' });

(async () => {
  const entries = await window.COSY.loadLanguageData('en', 'all', 'pair:arrive-vs-leave', '');
  assert.deepStrictEqual(Array.from(entries, item => item.word), ['arrive', 'leave', 'go']);
  assert.deepStrictEqual(Array.from(window.vocabularyData.en, item => item.word), ['arrive', 'leave', 'go']);
  assert.deepStrictEqual(Array.from(window.verbsData.en, item => item.word), ['arrive', 'leave', 'go']);

  const themeFetches = fetched.filter(url => url.includes('/vocabulary/en/a1/'));
  assert.deepStrictEqual(themeFetches, [`${BASE}vocabulary/en/a1/movement.json`]);

  console.log('Pair loader tests passed.');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
