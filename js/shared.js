// --- Shared practice helpers: vocabulary pools, theme matching and speech ---

(function() {
    'use strict';

    const speak = (text, lang, rate) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance();
        let textToSpeak = text;
        if (/^\d+$/.test(text) && typeof window.numbersData !== 'undefined' && window.numbersData[lang]) {
            const langData = window.numbersData[lang];
            if (langData[text]) textToSpeak = langData[text];
        }
        msg.text = textToSpeak;
        if (rate) {
            msg.rate = rate;
        } else {
            const isSlow = localStorage.getItem('cosy_slow_speech') === 'true';
            msg.rate = isSlow ? 0.6 : 1.0;
        }
        const pitch = localStorage.getItem('cosy_voice_pitch');
        if (pitch) msg.pitch = parseFloat(pitch);
        const langMap = {
            'en': 'en-GB', 'fr': 'fr-FR', 'it': 'it-IT', 'ru': 'ru-RU', 'el': 'el-GR',
            'es': 'es-ES', 'de': 'de-DE', 'pt': 'pt-PT', 'hy': 'hy-AM', 'ka': 'ka-GE',
            'tt': 'ru-RU', 'ba': 'ru-RU', 'br': 'fr-FR'
        };
        const targetLang = langMap[lang] || lang || 'en-GB';
        msg.lang = targetLang;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoiceName = localStorage.getItem('cosy_preferred_voice');
        if (voices.length > 0) {
            let voice = null;
            if (preferredVoiceName) voice = voices.find(v => v.name === preferredVoiceName);
            if (!voice) voice = voices.find(v => v.lang === targetLang);
            if (!voice) voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
            if (voice) msg.voice = voice;
        }
        window.speechSynthesis.speak(msg);
    };

    const normCategorySlug = (value) => {
        if (window.COSY_THEME_HELPERS && window.COSY_THEME_HELPERS.slug) return window.COSY_THEME_HELPERS.slug(value);
        return String(value || '').toLowerCase().trim().replace(/-/g, '_');
    };

    const normalizeCategory = (value) => {
        if (window.COSY_THEME_HELPERS && window.COSY_THEME_HELPERS.normalizeCategoryKey) {
            return window.COSY_THEME_HELPERS.normalizeCategoryKey(value);
        }
        const slug = normCategorySlug(value);
        const parts = slug.split('/');
        return { theme: parts[0] || '', subTheme: parts[1] || '' };
    };

    const isUncategorizedValue = (value) => {
        const slug = normCategorySlug(value);
        return slug === 'uncategorized' || slug === 'uncategorised';
    };

    const categoryCandidates = (item, itemTheme) => {
        const out = [];
        if (itemTheme) out.push(itemTheme);
        if (item) {
            if (item.theme) out.push(item.theme);
            if (item.theme && item.sub_theme) out.push(`${item.theme}/${item.sub_theme}`);
            if (item.secondary_themes && Array.isArray(item.secondary_themes)) out.push(...item.secondary_themes);
            if (item.themes && Array.isArray(item.themes)) out.push(...item.themes);
        }
        return out;
    };

    const pairForTheme = (theme) => {
        if (!theme || !String(theme).startsWith('pair:')) return null;
        const id = String(theme).slice(5);
        const registry = window.COSY_VOCAB_CONFUSION_PAIRS || {};
        for (const entries of Object.values(registry)) {
            const pair = (entries || []).find(p => p.id === id);
            if (pair) return pair;
        }
        return null;
    };

    const pairTerms = (pair) => [pair.termA, pair.termB, ...(pair.terms || [])]
        .filter(Boolean)
        .map(term => String(term).toLowerCase().trim());

    const pairMatchesItem = (item, pair) => {
        if (!item || !pair) return false;
        const raw = String(item.word || item.term || item.label || item.id || '').toLowerCase().trim();
        if (!raw) return false;
        const words = raw.split(/\s+/);
        return pairTerms(pair).some(term => {
            if (raw === term) return true;
            if (term.includes(' ')) return raw.includes(term);
            return words.includes(term);
        });
    };

    const isThemeMatch = (itemTheme, selectedTheme, item) => {
        if (!selectedTheme || selectedTheme === 'all') return true;

        const pair = pairForTheme(selectedTheme);
        if (pair) return pairMatchesItem(item, pair);

        if (selectedTheme.startsWith('group:')) {
            const parentTheme = selectedTheme.replace('group:', '');
            const children = (window.COSY_THEME_TREE && window.COSY_THEME_TREE[parentTheme]) || [];
            return itemTheme === parentTheme || children.includes(itemTheme);
        }

        const sel = normCategorySlug(selectedTheme);
        if (isUncategorizedValue(sel)) {
            return !itemTheme || isUncategorizedValue(itemTheme) || (item && !item.theme);
        }

        const target = normalizeCategory(selectedTheme);
        if (!target.theme) return false;

        for (const candidate of categoryCandidates(item, itemTheme)) {
            const normal = normalizeCategory(candidate);
            if (!normal.theme || normal.theme !== target.theme) continue;
            // A top-level theme covers all its sub-categories; a full
            // theme/sub-theme selection only matches that exact pair.
            if (target.subTheme && normal.subTheme !== target.subTheme) continue;
            return true;
        }

        if (item) {
            if (item.id) {
                const itemId = normCategorySlug(item.id);
                if (itemId === sel) return true;
            }
            if (item.group) {
                const group = normCategorySlug(item.group);
                if (group === sel) return true;
            }
            if (item.practice_links && Array.isArray(item.practice_links)) {
                for (const link of item.practice_links) {
                    if (typeof link === 'string') {
                        const filename = normCategorySlug(link.split('/').pop().replace(/\.html$/, ''));
                        if (filename === sel) return true;
                    }
                }
            }
        }

        return false;
    };

    const isSubThemeMatch = (item, selectedSubTheme) => {
        if (!selectedSubTheme || selectedSubTheme === 'all') return true;

        const pair = pairForTheme(selectedSubTheme);
        if (pair) return pairMatchesItem(item, pair);

        const sel = normCategorySlug(selectedSubTheme);
        const parts = sel.split('/');
        const targetTheme = parts.length > 1 ? parts[0] : '';
        const targetSubTheme = parts.length > 1 ? parts[1] : parts[0];
        if (!targetSubTheme) return true;

        const candidates = [];
        if (item.sub_theme) candidates.push(item.sub_theme);
        if (item.theme && item.sub_theme) candidates.push(`${item.theme}/${item.sub_theme}`);
        if (item.secondary_themes && Array.isArray(item.secondary_themes)) candidates.push(...item.secondary_themes);

        return candidates.some(candidate => {
            const normal = normalizeCategory(candidate);
            if (!normal.subTheme || normal.subTheme !== targetSubTheme) return false;
            return !targetTheme || normal.theme === targetTheme;
        });
    };

    function filterVocabulary(entries, { lang, level, theme, subTheme, category, room }) {
        const categoryToForm = {
            'Vocabulary': ['noun', 'adjective', 'verb', 'adverb', 'phrase', 'idiom', 'preposition', 'postposition', 'particle', 'pronoun', 'determiner', 'number', 'conjunction', 'article', 'other'],
            'Grammar': ['verb', 'preposition', 'postposition', 'particle', 'conjunction', 'determiner', 'pronoun', 'adverb', 'article'],
            'Speaking': ['speaking'],
            'Pronunciation': ['pronunciation']
        };
        const targetForms = categoryToForm[category];
        const levelId = (level && level !== "all") ? window.getLevelCode(level) : "all";
        const pair = pairForTheme(theme) || pairForTheme(subTheme);
        const seen = new Set();

        return entries.filter(entry => {
            if (lang && entry.language && entry.language.toLowerCase() !== lang.toLowerCase()) if (!entry.lang || entry.lang.toLowerCase() !== lang.toLowerCase()) return false;
            if (levelId && levelId !== 'all') {
                if (!entry.level || window.getLevelCode(entry.level) !== levelId) return false;
            }
            if (category && targetForms && entry.form && !targetForms.includes(entry.form)) return false;
            if (theme && theme !== 'all' && !isThemeMatch(entry.theme, theme, entry)) return false;
            if (!isSubThemeMatch(entry, subTheme)) return false;
            if (room && room !== 'all') {
                const itemRooms = (entry.rooms || (entry.room ? [entry.room] : [])).map(r => String(r).toLowerCase().trim());
                if (!itemRooms.includes(room.toLowerCase().trim())) return false;
            }
            if (pair) {
                const key = entry.id || entry.word;
                if (seen.has(key)) return false;
                seen.add(key);
            }
            return true;
        });
    }

    const getVocabPool = (lang, level, theme, subTheme, options = {}) => {
      let keys = ['vocabularyData', 'verbsData', 'adjectivesData', 'nationalitiesData', 'grammarData', 'grammarElements'];
      if (!options.excludeExtra) keys.push('locationsData', 'peopleData');
      let pool = [];
      keys.forEach(key => { if (window[key] && window[key][lang]) pool = pool.concat(window[key][lang]); });
      const normalizedLevel = (level && level !== 'all') ? window.getLevelCode(level) : 'all';
      const pair = pairForTheme(theme) || pairForTheme(subTheme);
      const seen = new Set();

      return pool.filter(item => {
        if (lang && item.language && item.language.toLowerCase() !== lang.toLowerCase()) if (!item.lang || item.lang.toLowerCase() !== lang.toLowerCase()) return false;
        const levelMatch = normalizedLevel === 'all' || (item.level && window.getLevelCode(item.level) === normalizedLevel);
        const themeMatch = isThemeMatch(item.theme, theme, item);
        const subThemeMatch = isSubThemeMatch(item, subTheme);
        if (options.room && options.room !== 'all') {
            const itemRooms = (item.rooms || (item.room ? [item.room] : [])).map(r => String(r).toLowerCase().trim());
            if (!itemRooms.includes(options.room.toLowerCase().trim())) return false;
        }
        if (pair) {
            const key = item.id || item.word;
            if (seen.has(key)) return false;
            seen.add(key);
        }
        return levelMatch && themeMatch && subThemeMatch;
      });
    };

    window.gameUtils = { getVocabPool, filterVocabulary, isThemeMatch, speak, pairForTheme, pairMatchesItem };
})();
