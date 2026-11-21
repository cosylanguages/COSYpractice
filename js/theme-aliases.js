/**
 * Normalises COSYdata's historical theme names onto the canonical
 * schemas/themes.json taxonomy used by the practice filter.
 *
 * The map is deliberately conservative: it renames known legacy themes and
 * fills only safe, file-level sub-theme defaults. It never guesses a semantic
 * category for a form-based file (idiom/noun/adjective/verb/phrase); those
 * entries stay in the explicit "uncategorized" bucket until they are reviewed.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.COSY_THEME_HELPERS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var THEME_ALIASES = {
    daily_verbs: 'actions',
    verbs: 'actions',
    general_adjectives: 'descriptors',
    adjectives: 'descriptors',
    descriptions: 'descriptors',
    common_nouns: 'general',
    abstract_nouns: 'general',
    expressions: 'communication',
    social_expressions: 'communication',
    opinions: 'communication',
    greetings: 'communication',
    places_transport: 'travel',
    nationalities: 'geography',
    positive_feelings: 'emotions',
    feelings: 'emotions',
    clothes: 'clothing',
    school: 'education',
    body_health: 'health',
    health_medicine: 'health',
    food_drink: 'food',
    house_furniture: 'housing',
    home: 'housing',
    sports_hobbies: 'leisure',
    recreation: 'leisure',
    money_shopping: 'shopping',
    economy: 'business',
    culture: 'society',
    relationships: 'family',
    properties: 'shapes',
    quantity: 'measurement',
    art_culture: 'arts',
    idioms: 'general',
    cause_effect: 'general',
    prepositions: 'grammar',
    pronouns: 'grammar',
    adverbs_connectors: 'grammar',
    auxiliary_verbs: 'grammar'
  };

  var PAIR_ALIASES = {
    'general/general': 'general/miscellaneous',
    'general/professions_jobs': 'work/professions_jobs',
    'general/office_business': 'work/office_business',
    'objects/containers': 'objects/general',
    'objects/everyday_tools': 'objects/general',
    'objects/household_objects': 'objects/general',
    'technology/digital_devices': 'technology/devices_hardware',
    'technology/digital_media_internet': 'technology/communication_tech',
    'technology/internet': 'internet/general',
    'technology/communication': 'technology/communication_tech',
    'shopping/retail': 'shopping/stores_shops',
    'shopping/prices': 'shopping/transactions_pricing',
    'shopping/transactions': 'shopping/transactions_pricing',
    'shapes/materials_textures': 'shapes/general',
    'nature/environment': 'environment/general',
    'leisure/relaxation': 'leisure/general',
    'actions/movement': 'actions/physical_movement',
    'actions/learning': 'education/learning_activities',
    'actions/work_actions': 'work/general',
    'actions/money': 'money/payments',
    'emotions/positive_emotions': 'emotions/positive_feelings',
    'positive_feelings/positive_feelings': 'emotions/positive_feelings',
    'positive_feelings/negative_feelings': 'emotions/negative_feelings',
    'social_expressions/social_expressions': 'communication/social_expressions',
    'social_expressions/socializing': 'communication/social_expressions',
    'social_expressions/greetings': 'communication/greetings',
    'social_expressions/classroom_language': 'education/classroom_language',
    'social_expressions/reading': 'communication/general',
    'sports/sports': 'sports/general'
  };

  var SUBTHEME_ALIASES = {
    positive_emotions: 'positive_feelings',
    negative_emotions: 'negative_feelings',
    socializing: 'social_expressions'
  };

  // Safe defaults for files whose name already states the topic. These are
  // only applied when the entry itself has no theme, or has a theme but no
  // sub-theme. They are intentionally coarse: "general" is preferable to a
  // wrong specific category.
  var FILE_DEFAULTS = {
    actions: { theme: 'actions', subTheme: 'general' },
    daily_verbs: { theme: 'actions', subTheme: 'daily_routines' },
    verbs: { theme: 'actions', subTheme: 'general' },
    activities: { theme: 'activities', subTheme: 'general' },
    animals: { theme: 'animals', subTheme: 'general' },
    arts: { theme: 'arts', subTheme: 'general' },
    art_culture: { theme: 'arts', subTheme: 'general' },
    body: { theme: 'body', subTheme: 'body_parts' },
    business: { theme: 'business', subTheme: 'general' },
    economy: { theme: 'business', subTheme: 'general' },
    clothes: { theme: 'clothing', subTheme: 'general' },
    clothing: { theme: 'clothing', subTheme: 'general' },
    colors: { theme: 'colors', subTheme: 'general' },
    colours: { theme: 'colors', subTheme: 'general' },
    communication: { theme: 'communication', subTheme: 'general' },
    social_expressions: { theme: 'communication', subTheme: 'social_expressions' },
    expressions: { theme: 'communication', subTheme: 'general' },
    crime: { theme: 'crime', subTheme: 'general' },
    descriptors: { theme: 'descriptors', subTheme: 'general' },
    adjectives: { theme: 'descriptors', subTheme: 'general' },
    general_adjectives: { theme: 'descriptors', subTheme: 'general' },
    education: { theme: 'education', subTheme: 'general' },
    school: { theme: 'education', subTheme: 'general' },
    emotions: { theme: 'emotions', subTheme: 'general' },
    feelings: { theme: 'emotions', subTheme: 'general' },
    positive_feelings: { theme: 'emotions', subTheme: 'positive_feelings' },
    environment: { theme: 'environment', subTheme: 'general' },
    family: { theme: 'family', subTheme: 'general' },
    relationships: { theme: 'family', subTheme: 'relationships' },
    food: { theme: 'food', subTheme: 'general' },
    food_drink: { theme: 'food', subTheme: 'general' },
    general: { theme: 'general', subTheme: 'miscellaneous' },
    common_nouns: { theme: 'general', subTheme: 'common_things' },
    abstract_nouns: { theme: 'general', subTheme: 'abstract_concepts' },
    geography: { theme: 'geography', subTheme: 'general' },
    nationalities: { theme: 'geography', subTheme: 'nationalities_languages' },
    grammar: { theme: 'grammar', subTheme: 'general' },
    pronouns: { theme: 'grammar', subTheme: 'pronouns' },
    prepositions: { theme: 'grammar', subTheme: 'prepositions_spatial' },
    adverbs_connectors: { theme: 'grammar', subTheme: 'conjunctions_connectors' },
    auxiliary_verbs: { theme: 'grammar', subTheme: 'auxiliaries_modals' },
    health: { theme: 'health', subTheme: 'general' },
    body_health: { theme: 'health', subTheme: 'general' },
    housing: { theme: 'housing', subTheme: 'daily_life' },
    house_furniture: { theme: 'housing', subTheme: 'furniture' },
    home: { theme: 'housing', subTheme: 'daily_life' },
    internet: { theme: 'internet', subTheme: 'general' },
    law: { theme: 'law', subTheme: 'general' },
    leisure: { theme: 'leisure', subTheme: 'general' },
    recreation: { theme: 'leisure', subTheme: 'general' },
    sports: { theme: 'sports', subTheme: 'general' },
    sports_hobbies: { theme: 'leisure', subTheme: 'sports' },
    measurement: { theme: 'measurement', subTheme: 'general' },
    quantity: { theme: 'measurement', subTheme: 'general' },
    media: { theme: 'media', subTheme: 'general' },
    money: { theme: 'money', subTheme: 'payments' },
    money_shopping: { theme: 'shopping', subTheme: 'general' },
    nature: { theme: 'nature', subTheme: 'general' },
    navigation: { theme: 'navigation', subTheme: 'general' },
    directions: { theme: 'navigation', subTheme: 'asking_giving_directions' },
    numbers: { theme: 'numbers', subTheme: 'general' },
    objects: { theme: 'objects', subTheme: 'general' },
    personality: { theme: 'personality', subTheme: 'personality_traits' },
    philosophy: { theme: 'philosophy', subTheme: 'general' },
    politics: { theme: 'politics', subTheme: 'general' },
    religion: { theme: 'religion', subTheme: 'general' },
    science: { theme: 'science', subTheme: 'general' },
    shapes: { theme: 'shapes', subTheme: 'general' },
    shopping: { theme: 'shopping', subTheme: 'general' },
    society: { theme: 'society', subTheme: 'general' },
    culture: { theme: 'society', subTheme: 'culture' },
    technology: { theme: 'technology', subTheme: 'general' },
    time: { theme: 'time', subTheme: 'general' },
    calendar: { theme: 'time', subTheme: 'days_months_seasons' },
    transport: { theme: 'transport', subTheme: 'general' },
    travel: { theme: 'travel', subTheme: 'general' },
    tourism: { theme: 'travel', subTheme: 'general' },
    places_transport: { theme: 'travel', subTheme: 'general' },
    weather: { theme: 'weather', subTheme: 'general' },
    work: { theme: 'work', subTheme: 'general' },
    jobs: { theme: 'work', subTheme: 'professions_jobs' }
  };

  var DEFAULT_SUBTHEME_BY_THEME = {
    actions: 'general',
    activities: 'general',
    animals: 'general',
    arts: 'general',
    body: 'body_parts',
    business: 'general',
    clothing: 'general',
    colors: 'general',
    communication: 'general',
    crime: 'general',
    descriptors: 'general',
    education: 'general',
    emotions: 'general',
    environment: 'general',
    family: 'general',
    food: 'general',
    general: 'miscellaneous',
    geography: 'general',
    grammar: 'general',
    health: 'general',
    housing: 'daily_life',
    internet: 'general',
    law: 'general',
    leisure: 'general',
    measurement: 'general',
    media: 'general',
    money: 'payments',
    nature: 'general',
    navigation: 'general',
    numbers: 'general',
    objects: 'general',
    personality: 'personality_traits',
    philosophy: 'general',
    politics: 'general',
    religion: 'general',
    science: 'general',
    shapes: 'general',
    shopping: 'general',
    society: 'general',
    sports: 'general',
    technology: 'general',
    time: 'general',
    transport: 'general',
    travel: 'general',
    weather: 'general',
    work: 'general'
  };

  var LEVEL_BY_PREFIX = {
    a0: 'starter',
    a0_a1: 'starter',
    a1: 'starter',
    a2: 'elementary',
    b1: 'intermediate',
    b2: 'upper_intermediate',
    c1: 'advanced',
    c2: 'proficiency'
  };

  var explicitSchema = null;

  function slug(value) {
    return String(value == null ? '' : value).trim().toLowerCase().replace(/-/g, '_');
  }

  function setSchema(schema) {
    explicitSchema = schema && (schema.themes || schema);
    return explicitSchema;
  }

  function getSchema() {
    if (explicitSchema) return explicitSchema;
    if (typeof window !== 'undefined' && window.COSY_THEMES_SCHEMA) {
      return window.COSY_THEMES_SCHEMA.themes || window.COSY_THEMES_SCHEMA;
    }
    if (typeof globalThis !== 'undefined' && globalThis.COSY_THEMES_SCHEMA) {
      return globalThis.COSY_THEMES_SCHEMA.themes || globalThis.COSY_THEMES_SCHEMA;
    }
    return null;
  }

  function findThemeKey(schema, value) {
    var wanted = slug(value);
    if (!wanted) return '';
    return Object.keys(schema || {}).find(function (key) { return slug(key) === wanted; }) || '';
  }

  function hasSubTheme(schema, theme, subTheme) {
    if (!schema || !schema[theme]) return false;
    var wanted = slug(subTheme);
    return (schema[theme] || []).some(function (item) { return slug(item) === wanted; });
  }

  function canonicalTheme(theme) {
    var value = slug(theme);
    if (!value) return '';
    if (value === 'uncategorized' || value === 'uncategorised') return 'uncategorized';
    var schema = getSchema();
    if (schema) {
      var key = findThemeKey(schema, value);
      if (key) return key;
    }
    return THEME_ALIASES[value] || value;
  }

  function canonicalSubTheme(theme, subTheme) {
    var rawTheme = slug(theme);
    var rawSub = slug(subTheme);
    if (!rawSub) return '';

    var pair = PAIR_ALIASES[rawTheme + '/' + rawSub];
    if (pair) return pair.split('/')[1];

    var canonical = canonicalTheme(rawTheme);
    var schema = getSchema();

    if (rawSub === 'general') {
      if (canonical === 'general') return 'miscellaneous';
      if (schema && schema[canonical] && !hasSubTheme(schema, canonical, 'general')) return '';
      return 'general';
    }

    if (schema && schema[canonical]) {
      var match = (schema[canonical] || []).find(function (item) { return slug(item) === rawSub; });
      if (match) return slug(match);
    }

    return SUBTHEME_ALIASES[rawSub] || rawSub;
  }

  function defaultSubTheme(theme, filePath) {
    var canonical = canonicalTheme(theme);
    var stem = fileStem(filePath);
    var fromFile = stem ? FILE_DEFAULTS[stem] : null;
    if (fromFile && canonicalTheme(fromFile.theme) === canonical && fromFile.subTheme) {
      return fromFile.subTheme;
    }

    var schema = getSchema();
    var preferred = DEFAULT_SUBTHEME_BY_THEME[canonical];
    if (schema && schema[canonical]) {
      if (preferred && hasSubTheme(schema, canonical, preferred)) return preferred;
      if (hasSubTheme(schema, canonical, 'general')) return 'general';
      return '';
    }
    return preferred || '';
  }

  function fileStem(filePath) {
    var path = String(filePath == null ? '' : filePath).split('?')[0].split('#')[0];
    var name = path.split('/').pop() || '';
    return slug(name.replace(/\.json$/i, ''));
  }

  function inferFromFile(filePath) {
    var stem = fileStem(filePath);
    if (!stem) return { theme: '', subTheme: '' };

    var direct = FILE_DEFAULTS[stem];
    if (direct) return { theme: canonicalTheme(direct.theme), subTheme: direct.subTheme };

    var canonical = canonicalTheme(stem);
    var schema = getSchema();
    if (schema && schema[canonical]) {
      return { theme: canonical, subTheme: defaultSubTheme(canonical, filePath) };
    }

    return { theme: '', subTheme: '' };
  }

  function normalizeCategoryKey(rawKey) {
    var raw = String(rawKey == null ? '' : rawKey).trim();
    if (!raw) return { theme: '', subTheme: '' };

    var parts = raw.split('/');
    var rawTheme = parts[0];
    var rawSub = parts.slice(1).join('/');
    var pair = rawSub ? PAIR_ALIASES[slug(rawTheme) + '/' + slug(rawSub)] : null;

    if (pair) {
      var pairParts = pair.split('/');
      return { theme: pairParts[0], subTheme: pairParts[1] || '' };
    }

    var theme = canonicalTheme(rawTheme);
    if (!rawSub) return { theme: theme, subTheme: '' };

    var subTheme = canonicalSubTheme(rawTheme, rawSub);
    var schema = getSchema();
    if (theme && subTheme && schema && schema[theme] && !hasSubTheme(schema, theme, subTheme)) {
      return { theme: theme, subTheme: '' };
    }
    return { theme: theme, subTheme: subTheme };
  }

  function normalizeEntry(entry, filePath) {
    if (!entry || entry._cosy_category_normalized) return entry;

    var rawTheme = slug(entry.theme);
    var rawSub = slug(entry.sub_theme);
    var theme = '';
    var subTheme = '';
    var pair = rawTheme && rawSub ? PAIR_ALIASES[rawTheme + '/' + rawSub] : null;

    if (pair) {
      var pairParts = pair.split('/');
      theme = pairParts[0];
      subTheme = pairParts[1] || '';
    } else if (rawTheme) {
      theme = canonicalTheme(rawTheme);
      subTheme = rawSub ? canonicalSubTheme(rawTheme, rawSub) : '';
    } else {
      var inferred = inferFromFile(filePath);
      theme = inferred.theme;
      subTheme = inferred.subTheme;
    }

    if (!theme) theme = 'uncategorized';
    if (theme === 'uncategorized') {
      subTheme = '';
    } else if (!subTheme) {
      subTheme = defaultSubTheme(theme, filePath);
    }

    var schema = getSchema();
    if (subTheme && schema && schema[theme] && !hasSubTheme(schema, theme, subTheme)) {
      var fallback = defaultSubTheme(theme, filePath);
      subTheme = fallback && hasSubTheme(schema, theme, fallback) ? fallback : '';
    }

    entry._raw_theme = entry.theme;
    entry._raw_sub_theme = entry.sub_theme;
    entry.theme = theme;
    entry.sub_theme = subTheme || '';
    entry._cosy_category_normalized = true;
    return entry;
  }

  function rawKeysForCategory(category, themesIndex) {
    var index = themesIndex || {};
    var raw = String(category == null ? '' : category).trim();
    if (!raw || raw === 'all') return Object.keys(index);

    var value = slug(raw);
    if (value === 'uncategorized' || value === 'uncategorised') return [];

    var target = normalizeCategoryKey(raw);
    var schema = getSchema();
    var isTheme = !!(target.theme && schema && schema[target.theme]);

    function candidatesForKey(key) {
      var out = [normalizeCategoryKey(key)];
      var fromFile = FILE_DEFAULTS[slug(key)];
      if (fromFile) out.push({ theme: canonicalTheme(fromFile.theme), subTheme: fromFile.subTheme });
      return out;
    }

    if (isTheme) {
      return Object.keys(index).filter(function (key) {
        return candidatesForKey(key).some(function (normal) {
          if (normal.theme !== target.theme) return false;
          return target.subTheme ? normal.subTheme === target.subTheme : true;
        });
      });
    }

    // A bare sub-theme such as "professions_jobs": match it under any parent.
    // Also match bare non-schema keys such as Grammar's "to_be".
    return Object.keys(index).filter(function (key) {
      return candidatesForKey(key).some(function (normal) {
        return normal.subTheme === value || (!normal.subTheme && normal.theme === value);
      });
    });
  }

  function levelIdForFile(filePath) {
    var prefix = String(filePath == null ? '' : filePath).split('/')[0].toLowerCase();
    return LEVEL_BY_PREFIX[prefix] || '';
  }

  function computeCounts(indexData, themesIndex, level) {
    var counts = { total: 0, themes: {}, subThemes: {}, uncategorized: 0 };
    var idCategory = new Map();

    Object.keys(themesIndex || {}).forEach(function (rawKey) {
      var normal = normalizeCategoryKey(rawKey);
      if (!normal.theme) return;
      (themesIndex[rawKey] || []).forEach(function (id) {
        var previous = idCategory.get(id);
        // Prefer a specific sub-theme over a theme-only key.
        if (!previous || (!previous.subTheme && normal.subTheme)) {
          idCategory.set(id, normal);
        }
      });
    });

    Object.keys(indexData || {}).forEach(function (id) {
      var file = indexData[id];
      if (level && level !== 'all' && levelIdForFile(file) !== level) return;

      var category = idCategory.get(id);
      if (!category || !category.theme) {
        var inferred = inferFromFile(file);
        category = inferred.theme ? inferred : { theme: 'uncategorized', subTheme: '' };
      } else if (!category.subTheme) {
        var fallback = defaultSubTheme(category.theme, file);
        if (fallback) category = { theme: category.theme, subTheme: fallback };
      }

      counts.total += 1;
      if (!category.theme || category.theme === 'uncategorized') {
        counts.uncategorized += 1;
        return;
      }

      counts.themes[category.theme] = (counts.themes[category.theme] || 0) + 1;
      if (category.subTheme) {
        var key = category.theme + '/' + slug(category.subTheme);
        counts.subThemes[key] = (counts.subThemes[key] || 0) + 1;
      }
    });

    return counts;
  }

  return {
    THEME_ALIASES: THEME_ALIASES,
    PAIR_ALIASES: PAIR_ALIASES,
    FILE_DEFAULTS: FILE_DEFAULTS,
    DEFAULT_SUBTHEME_BY_THEME: DEFAULT_SUBTHEME_BY_THEME,
    slug: slug,
    setSchema: setSchema,
    getSchema: getSchema,
    canonicalTheme: canonicalTheme,
    canonicalSubTheme: canonicalSubTheme,
    defaultSubTheme: defaultSubTheme,
    inferFromFile: inferFromFile,
    normalizeCategoryKey: normalizeCategoryKey,
    normalizeEntry: normalizeEntry,
    rawKeysForCategory: rawKeysForCategory,
    levelIdForFile: levelIdForFile,
    computeCounts: computeCounts
  };
});
