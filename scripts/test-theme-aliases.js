#!/usr/bin/env node
'use strict';

const assert = require('assert');
const helpers = require('../js/theme-aliases.js');

helpers.setSchema({
  themes: {
    actions: ['general', 'daily_routines', 'physical_movement'],
    activities: ['general'],
    animals: ['general', 'farm_animals'],
    arts: ['general'],
    body: ['body_parts'],
    business: ['general'],
    clothing: ['general'],
    colors: ['general'],
    communication: ['general', 'greetings', 'social_expressions'],
    crime: ['general'],
    descriptors: ['general'],
    education: ['general', 'learning_activities', 'classroom_language'],
    emotions: ['general', 'positive_feelings', 'negative_feelings'],
    environment: ['general'],
    family: ['general', 'relationships'],
    food: ['general', 'drinks'],
    general: ['miscellaneous', 'common_things', 'abstract_concepts', 'legal_english'],
    geography: ['general', 'nationalities_languages'],
    grammar: ['general', 'pronouns', 'prepositions_spatial', 'conjunctions_connectors', 'auxiliaries_modals'],
    health: ['general'],
    housing: ['daily_life', 'furniture'],
    internet: ['general'],
    law: ['general'],
    leisure: ['general', 'sports'],
    measurement: ['general'],
    media: ['general'],
    money: ['banking', 'payments'],
    nature: ['general'],
    navigation: ['general', 'asking_giving_directions'],
    numbers: ['general'],
    objects: ['general', 'personal_items'],
    personality: ['personality_traits'],
    philosophy: ['general'],
    politics: ['general'],
    religion: ['general'],
    science: ['general'],
    shapes: ['general'],
    shopping: ['general', 'stores_shops', 'transactions_pricing'],
    society: ['general', 'culture'],
    sports: ['general'],
    technology: ['general', 'devices_hardware', 'communication_tech'],
    time: ['general', 'days_months_seasons'],
    transport: ['general'],
    travel: ['general'],
    weather: ['general'],
    work: ['general', 'professions_jobs', 'office_business']
  }
});

function category(key) {
  return helpers.normalizeCategoryKey(key);
}

function checkCategory(key, theme, subTheme) {
  assert.deepStrictEqual(category(key), { theme, subTheme }, key);
}

checkCategory('daily_verbs', 'actions', '');
checkCategory('social_expressions/socializing', 'communication', 'social_expressions');
checkCategory('general/professions_jobs', 'work', 'professions_jobs');
checkCategory('objects/containers', 'objects', 'general');
checkCategory('technology/digital_devices', 'technology', 'devices_hardware');
checkCategory('general/legal_english', 'general', 'legal_english');
checkCategory('positive_feelings/positive_feelings', 'emotions', 'positive_feelings');

function checkEntry(raw, file, theme, subTheme) {
  const entry = helpers.normalizeEntry(Object.assign({}, raw), file);
  assert.strictEqual(entry.theme, theme, JSON.stringify(raw) + ' @ ' + file);
  assert.strictEqual(entry.sub_theme, subTheme, JSON.stringify(raw) + ' @ ' + file);
}

checkEntry({ theme: 'daily_verbs' }, 'a0_a1/daily_verbs.json', 'actions', 'daily_routines');
checkEntry({}, 'a2/work.json', 'work', 'general');
checkEntry({}, 'b1/idiom.json', 'uncategorized', '');
checkEntry({ theme: 'general', sub_theme: 'professions_jobs' }, 'a2/work.json', 'work', 'professions_jobs');
checkEntry({ theme: 'positive_feelings', sub_theme: 'positive_feelings' }, '', 'emotions', 'positive_feelings');
checkEntry({ theme: 'technology', sub_theme: 'digital_devices' }, '', 'technology', 'devices_hardware');
checkEntry({ theme: 'work', sub_theme: 'general' }, '', 'work', 'general');
checkEntry({ theme: 'body', sub_theme: 'general' }, '', 'body', 'body_parts');

const indexData = {
  'en:a': 'a2/work.json',
  'en:b': 'a2/daily_verbs.json',
  'en:c': 'b1/idiom.json',
  'en:d': 'a2/food.json'
};
const themesIndex = {
  'general/professions_jobs': ['en:a'],
  'daily_verbs': ['en:b'],
  food: ['en:d']
};

const all = helpers.computeCounts(indexData, themesIndex, 'all');
assert.strictEqual(all.total, 4);
assert.strictEqual(all.themes.work, 1);
assert.strictEqual(all.themes.actions, 1);
assert.strictEqual(all.themes.food, 1);
assert.strictEqual(all.uncategorized, 1);
assert.strictEqual(all.subThemes['work/professions_jobs'], 1);
assert.strictEqual(all.subThemes['actions/daily_routines'], 1);
assert.strictEqual(all.subThemes['food/general'], 1);

const elementary = helpers.computeCounts(indexData, themesIndex, 'elementary');
assert.strictEqual(elementary.total, 3);
assert.strictEqual(elementary.uncategorized, 0);
assert.strictEqual(elementary.themes.work, 1);
assert.strictEqual(elementary.themes.actions, 1);
assert.strictEqual(elementary.themes.food, 1);

const intermediate = helpers.computeCounts(indexData, themesIndex, 'intermediate');
assert.strictEqual(intermediate.total, 1);
assert.strictEqual(intermediate.uncategorized, 1);

assert.deepStrictEqual(
  helpers.rawKeysForCategory('work/professions_jobs', themesIndex),
  ['general/professions_jobs']
);
assert.deepStrictEqual(
  helpers.rawKeysForCategory('actions/daily_routines', themesIndex),
  ['daily_verbs']
);
assert.deepStrictEqual(
  helpers.rawKeysForCategory('professions_jobs', themesIndex),
  ['general/professions_jobs']
);
assert.deepStrictEqual(
  helpers.rawKeysForCategory('to_be', { to_be: ['en:x'], grammar: ['en:y'] }),
  ['to_be']
);
assert.strictEqual(helpers.levelIdForFile('a0_a1/food.json'), 'starter');
assert.strictEqual(helpers.levelIdForFile('c2/work.json'), 'proficiency');

console.log('theme-aliases: all checks passed');
