#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'shared.js'), 'utf8');
const window = {
  localStorage: { getItem: () => null },
  speechSynthesis: { cancel() {}, getVoices() { return []; }, speak() {} },
  getLevelCode: value => String(value || '').toLowerCase(),
  COSY_VOCAB_CONFUSION_PAIRS: {
    a1: [
      { id: 'arrive-vs-leave', label: 'arrive vs leave', group: 'Movement', level: 'a1', termA: 'arrive', termB: 'leave' },
      { id: 'get-up-vs-stand-up', label: 'get up vs stand up', group: 'Phrasal Verbs', level: 'a1', termA: 'get up', termB: 'stand up' }
    ]
  },
  vocabularyData: {
    en: [
      { word: 'arrive', form: 'verb', level: 'a1' },
      { word: 'leave', form: 'verb', level: 'a2' },
      { word: 'go', form: 'verb', level: 'a1' },
      { word: 'get up', form: 'phrase', level: 'a1' }
    ]
  }
};
const sandbox = {
  window,
  localStorage: window.localStorage,
  SpeechSynthesisUtterance: function () {},
  console,
  setTimeout,
  clearTimeout
};
vm.runInNewContext(code, sandbox, { filename: 'js/shared.js' });

const { pairForTheme, isThemeMatch, filterVocabulary, getVocabPool } = window.gameUtils;

assert.strictEqual(pairForTheme('pair:arrive-vs-leave').termA, 'arrive');
assert.strictEqual(pairForTheme('pair:missing'), null);
assert.strictEqual(pairForTheme('movement'), null);

assert.strictEqual(isThemeMatch('movement', 'pair:arrive-vs-leave', { word: 'arrive' }), true);
assert.strictEqual(isThemeMatch('movement', 'pair:arrive-vs-leave', { word: 'Leave' }), true);
assert.strictEqual(isThemeMatch('movement', 'pair:arrive-vs-leave', { word: 'go' }), false);
assert.strictEqual(isThemeMatch('movement', 'pair:get-up-vs-stand-up', { word: 'get up' }), true);
assert.strictEqual(isThemeMatch('movement', 'pair:get-up-vs-stand-up', { word: 'stand up' }), true);
assert.strictEqual(isThemeMatch('movement', 'pair:get-up-vs-stand-up', { word: 'wake up' }), false);
assert.strictEqual(isThemeMatch('movement', 'pair:missing', { word: 'arrive' }), false);

const filtered = filterVocabulary(window.vocabularyData.en, {
  lang: 'en',
  level: 'all',
  theme: 'pair:arrive-vs-leave',
  subTheme: '',
  category: 'Vocabulary'
});
assert.deepStrictEqual(Array.from(filtered, item => item.word), ['arrive', 'leave']);

// The pair's level must not drop a term that sits at another CEFR level.
const filteredAtPairLevel = filterVocabulary(window.vocabularyData.en, {
  lang: 'en',
  level: 'a1',
  theme: 'pair:arrive-vs-leave',
  subTheme: '',
  category: 'Vocabulary'
});
assert.deepStrictEqual(Array.from(filteredAtPairLevel, item => item.word), ['arrive', 'leave']);

const pool = getVocabPool('en', 'all', 'pair:get-up-vs-stand-up', '');
assert.deepStrictEqual(Array.from(pool, item => item.word), ['get up']);

const poolAtPairLevel = getVocabPool('en', 'a1', 'pair:arrive-vs-leave', '');
assert.deepStrictEqual(Array.from(poolAtPairLevel, item => item.word), ['arrive', 'leave']);

console.log('Vocabulary pair matching tests passed.');
