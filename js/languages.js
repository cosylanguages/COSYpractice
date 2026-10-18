/**
 * js/data/languages.js
 * Master single-source-of-truth language registry for COSYlanguages.
 */

window.TRANSLATION_MAP = {
    'en': 'js/data/germanic/en/translations.js',
    'fr': 'js/data/romance/fr/translations.js',
    'it': 'js/data/romance/it/translations.js',
    'ru': 'js/data/slavic/ru/translations.js',
    'el': 'js/data/hellenic/el/translations.js',
    'es': 'js/data/romance/es/translations.js',
    'de': 'js/data/germanic/de/translations.js',
    'pt': 'js/data/romance/pt/translations.js',
    'hy': 'js/data/armenian/hy/translations.js',
    'ka': 'js/data/kartvelian/ka/translations.js',
    'tt': 'js/data/turkic/tt/translations.js',
    'ba': 'js/data/turkic/ba/translations.js',
    'br': 'js/data/celtic/br/translations.js',
    'cv': 'js/data/turkic/cv/translations.js'
};

// Master language registry (14 languages).
// status: 'active' (lessons offered) | 'coming-soon' (lessons coming soon)
// groupLessons: true (group lessons offered ONLY in en, fr, it, ru)
// hasFreeVocabulary: true (free vocabulary available in vocabulary/manifest.json)
// icon: national flag emoji OR rounded neutral badge for languages without a national flag

window.COSY_LANGUAGES = [
  { code: 'en', name: 'English',    native: 'English',     status: 'active',      icon: '🇬🇧', flag: '🇬🇧', groupLessons: true,  hasFreeVocabulary: true, family: 'germanic', img: 'cosyenglish.png',   has_cases: false, has_data: true },
  { code: 'fr', name: 'French',     native: 'Français',    status: 'active',      icon: '🇫🇷', flag: '🇫🇷', groupLessons: true,  hasFreeVocabulary: true, family: 'romance',  img: 'cosyfrench.png',    has_cases: false, has_data: true },
  { code: 'it', name: 'Italian',    native: 'Italiano',    status: 'active',      icon: '🇮🇹', flag: '🇮🇹', groupLessons: true,  hasFreeVocabulary: true, family: 'romance',  img: 'cosyitalian.png',   has_cases: false, has_data: true },
  { code: 'ru', name: 'Russian',    native: 'Русский',     status: 'active',      icon: '🇷🇺', flag: '🇷🇺', groupLessons: true,  hasFreeVocabulary: true, family: 'slavic',   img: 'cosyrussian.png',   has_cases: true,  has_data: true },
  { code: 'el', name: 'Greek',      native: 'Ελληνικά',    status: 'active',      icon: '🇬🇷', flag: '🇬🇷', groupLessons: false, hasFreeVocabulary: true, family: 'hellenic', img: 'cosygreek.png',     has_cases: true,  has_data: true },
  { code: 'es', name: 'Spanish',    native: 'Español',     status: 'coming-soon', icon: '🇪🇸', flag: '🇪🇸', groupLessons: false, hasFreeVocabulary: true, family: 'romance',  img: 'cosyspanish.png',   has_cases: false, has_data: true },
  { code: 'de', name: 'German',     native: 'Deutsch',     status: 'coming-soon', icon: '🇩🇪', flag: '🇩🇪', groupLessons: false, hasFreeVocabulary: true, family: 'germanic', img: 'cosygerman.png',    has_cases: true,  has_data: true },
  { code: 'pt', name: 'Portuguese', native: 'Português',   status: 'coming-soon', icon: '🇵🇹', flag: '🇵🇹', groupLessons: false, hasFreeVocabulary: true, family: 'romance',  img: 'cosyportugese.png', has_cases: false, has_data: true },
  { code: 'hy', name: 'Armenian',   native: 'Հայերեն',     status: 'coming-soon', icon: '🇦🇲', flag: '🇦🇲', groupLessons: false, hasFreeVocabulary: true, family: 'armenian', img: 'cosyarmenian.png',  has_cases: true,  has_data: true },
  { code: 'ka', name: 'Georgian',   native: 'ქართული',     status: 'coming-soon', icon: '🇬🇪', flag: '🇬🇪', groupLessons: false, hasFreeVocabulary: true, family: 'kartvelian', img: 'cosygeorgian.png', has_cases: true,  has_data: true },
  { code: 'tt', name: 'Tatar',      native: 'Татарча',     status: 'coming-soon', icon: '<span class="lang-code-badge">TT</span>', flag: 'TT', groupLessons: false, hasFreeVocabulary: true, family: 'turkic',    img: 'cosytatar.png',     has_cases: true,  has_data: true },
  { code: 'ba', name: 'Bashkir',    native: 'Башҡортса',   status: 'coming-soon', icon: '<span class="lang-code-badge">BA</span>', flag: 'BA', groupLessons: false, hasFreeVocabulary: true, family: 'turkic',    img: 'cosybachkir.png',   has_cases: true,  has_data: true },
  { code: 'br', name: 'Breton',     native: 'Brezhoneg',   status: 'coming-soon', icon: '<span class="lang-code-badge">BR</span>', flag: 'BR', groupLessons: false, hasFreeVocabulary: true, family: 'celtic',    img: 'cosybreton.png',    has_cases: false, has_data: true },
  { code: 'cv', name: 'Chuvash',    native: 'Чӑвашла',     status: 'coming-soon', icon: '<span class="lang-code-badge">CV</span>', flag: 'CV', groupLessons: false, hasFreeVocabulary: true, family: 'turkic',    img: 'cosylanguages.png', has_cases: true,  has_data: true }
];

window.COSY_LEVELS = [
    { id: 'starter',           name: 'Starter (A1)',           short: 'A1' },
    { id: 'elementary',        name: 'Elementary (A2)',        short: 'A2' },
    { id: 'intermediate',      name: 'Intermediate (B1)',      short: 'B1' },
    { id: 'upper_intermediate', name: 'Upper-Intermediate (B2)', short: 'B2' },
    { id: 'advanced',          name: 'Advanced (C1)',          short: 'C1' },
    { id: 'proficiency',       name: 'Proficiency (C2)',       short: 'C2' }
];

window.FAMILY_MAP = window.COSY_LANGUAGES.reduce((acc, l) => {
    acc[l.code] = l.family;
    return acc;
}, {});

/**
 * Normalises a language string/code to a standard ISO code.
 */
window.getLangCode = function(val) {
    if (!val) return localStorage.getItem('language') || 'en';
    const v = val.toLowerCase().trim();

    // 1. Exact matches for code or name
    const match = window.COSY_LANGUAGES.find(l =>
        l.code === v ||
        l.name.toLowerCase() === v ||
        l.native.toLowerCase() === v
    );
    if (match) return match.code;

    // 2. Partial matches (more permissive, but prioritized after exact)
    const partialMatch = window.COSY_LANGUAGES.find(l =>
        v.startsWith(l.code) ||
        v.includes(l.name.toLowerCase()) ||
        v.includes(l.native.toLowerCase())
    );

    return partialMatch ? partialMatch.code : 'en';
};

/**
 * Converts a level ID or short code to short code ('A1').
 */
window.levelIdToShort = function(val) {
    if (!val) return 'A1';
    const v = val.toLowerCase().trim();
    if (v === 'all') return 'all';
    const match = window.COSY_LEVELS.find(l =>
        l.id === v ||
        l.id === v.replace('-', '_') ||
        l.short.toLowerCase() === v ||
        l.name.toLowerCase().includes(v)
    );
    return match ? match.short : 'A1';
};

/**
 * Converts a short code ('A1') or level ID to full ID ('starter').
 */
window.levelShortToId = function(val) {
    if (!val) return 'starter';
    const v = val.toLowerCase().trim();
    if (v === 'all') return 'all';
    const match = window.COSY_LEVELS.find(l =>
        l.id === v ||
        l.id === v.replace('-', '_') ||
        l.short.toLowerCase() === v ||
        l.name.toLowerCase().includes(v)
    );
    return match ? match.id : 'starter';
};

window.getLevelCode = function(val, targetType = 'id') {
    if (targetType === 'short') return window.levelIdToShort(val);
    return window.levelShortToId(val);
};

window.normalizeLevel = function(val) {
    return window.levelIdToShort(val);
};

window.getLevelDir = function(levelId) {
    const match = (window.COSY_LEVELS || []).find(l => l.id === levelId);
    return match ? match.short : levelId.toUpperCase();
};

// Helper getters supporting both status conventions ('coming-soon' and 'coming_soon')
Object.defineProperty(window, 'COSY_ACTIVE_LANGUAGES', {
    get: function() {
        return window.COSY_LANGUAGES.filter(l => l.status === 'active');
    },
    configurable: true,
    enumerable: true
});

Object.defineProperty(window, 'COSY_COMING_SOON_LANGUAGES', {
    get: function() {
        return window.COSY_LANGUAGES.filter(l => l.status === 'coming-soon' || l.status === 'coming_soon');
    },
    configurable: true,
    enumerable: true
});

window.COSY_LANGUAGES_WITH_DATA = window.COSY_LANGUAGES.filter(l => l.hasFreeVocabulary || l.has_data);
