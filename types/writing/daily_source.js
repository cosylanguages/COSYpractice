/**
 * types/writing/daily_source.js
 * Chooses what today's Daily Challenge shows, from data the COSY sites already publish:
 *   speaking / writing days   prompts from data/daily/<lang>/{speaking,writing}.json (curated prompts win per level band)
 *   vocabulary day            the word of the day from the COSYdata calendar
 *   grammar day               the verb + preposition of the day (else the verb of the day) from the COSYdata calendar
 * Anything missing falls back to the English DAILY_BANK in daily_data.js, so the page always shows a challenge.
 * Practice levels are 'a' (A1 beginner), 'b' (B1 intermediate), 'c' (C1 advanced).
 */
(function (root) {
    'use strict';

    var script = typeof document !== 'undefined' ? document.currentScript : null;
    var DATA_ROOT = script && script.src ? new URL('../../data/daily/', script.src).href : './data/daily/';
    var CALENDAR_ROOT = 'https://cosylanguages.github.io/COSYdata/daily/';
    var CAL_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    // Prompt bands, most wanted first. Beginners alternate between the two low bands day by day.
    function promptBands(level, dayIdx) {
        if (level === 'a') return dayIdx % 2 === 0 ? ['a0-a1', 'a2'] : ['a2', 'a0-a1'];
        if (level === 'c') return ['c1-c2'];
        return ['b1-b2'];
    }

    // Same rule as the COSYlanguages daily strip: curated prompts for the band win, then loosely tagged ones,
    // then the nearest adjacent level, then anything.
    function pickItemForBand(items, band, dayIdx) {
        if (!items || items.length === 0) return null;
        function isMatch(itemLevel) {
            if (!itemLevel) return false;
            var lvl = itemLevel.toLowerCase();
            if (band === 'a0-a1') return lvl.indexOf('a0') > -1 || lvl.indexOf('a1') > -1;
            if (band === 'a2') return lvl.indexOf('a2') > -1 && lvl.indexOf('b2') < 0;
            if (band === 'b1-b2') return lvl.indexOf('b1') > -1 || lvl.indexOf('b2') > -1;
            if (band === 'c1-c2') return lvl.indexOf('c1') > -1 || lvl.indexOf('c2') > -1;
            return false;
        }
        var matching = items.filter(function (it) { return isMatch(it && it.level); });
        if (matching.length > 0) {
            var curated = matching.filter(function (it) { return it.curated; });
            var pool = curated.length > 0 ? curated : matching;
            return pool[dayIdx % pool.length];
        }
        function levelHas(it, tags) { var u = (it.level || '').toUpperCase(); return tags.some(function (t) { return u.indexOf(t) > -1; }); }
        if (band === 'c1-c2') {
            var high = items.filter(function (it) { return levelHas(it, ['B1', 'B2']); });
            if (high.length > 0) return high[dayIdx % high.length];
        } else if (band === 'a0-a1') {
            var low = items.filter(function (it) { return levelHas(it, ['A1', 'A2']); });
            if (low.length > 0) return low[dayIdx % low.length];
        }
        return items[dayIdx % items.length];
    }

    function pickPrompt(items, level, dayIdx) {
        return pickItemForBand(items, promptBands(level, dayIdx)[0], dayIdx);
    }

    // Calendar days hold one card per CEFR level ({"A2": {...}, "B1": {...}}); languages publish only some levels.
    function calendarLevels(level, dayIdx) {
        var odd = dayIdx % 2 === 1;
        if (level === 'a') return odd ? ['A1', 'A0', 'A2'] : ['A0', 'A1', 'A2'];
        if (level === 'c') return odd ? ['C2', 'C1'] : ['C1', 'C2'];
        return odd ? ['B2', 'B1'] : ['B1', 'B2'];
    }

    function pickCalendarCard(day, level, dayIdx) {
        if (!day || typeof day !== 'object') return null;
        var available = Object.keys(day).filter(function (l) { return day[l] && day[l].word; });
        if (!available.length) return null;
        var prefs = calendarLevels(level, dayIdx);
        for (var i = 0; i < prefs.length; i++) {
            if (available.indexOf(prefs[i]) > -1) return day[prefs[i]];
        }
        var want = CAL_LEVELS.indexOf(prefs[0]);
        available.sort(function (a, b) { return Math.abs(CAL_LEVELS.indexOf(a) - want) - Math.abs(CAL_LEVELS.indexOf(b) - want); });
        return day[available[0]];
    }

    // English defaults for every daily.* string; fr, it, ru and el have translations in i18n/<lang>.json
    var EN = {
        'daily.cat.speaking': 'Speaking', 'daily.cat.writing': 'Writing', 'daily.cat.vocabulary': 'Vocabulary', 'daily.cat.grammar': 'Grammar',
        'daily.title.speaking': 'Speaking challenge', 'daily.title.writing': 'Writing challenge', 'daily.title.vocabulary': 'Word of the day',
        'daily.title.grammar': 'Verb + preposition of the day', 'daily.title.verb': 'Verb of the day',
        'daily.subtitle.speaking': 'Say your answer out loud.', 'daily.subtitle.writing': 'Write your answer in the language you are learning.',
        'daily.subtitle.vocabulary': "Learn today's word and use it.", 'daily.subtitle.grammar': 'Notice how the verb is used.',
        'daily.tip.label': 'Tip', 'daily.tip.speaking': 'Answer in full sentences, not single words.',
        'daily.tip.writing': 'Check spelling and verb forms before you finish.', 'daily.tip.vocabulary': 'Say the word out loud and picture what it means.',
        'daily.tip.grammar': 'Watch the small word (preposition or case) that follows the verb.',
        'daily.micro.speaking.title': 'Say it again', 'daily.micro.speaking.instruction': 'Repeat your answer out loud and add one more detail.',
        'daily.micro.writing.title': 'Improve it', 'daily.micro.writing.instruction': 'Rewrite your first sentence with one more detail or a linking word.',
        'daily.micro.vocabulary.title': 'Use the word', 'daily.micro.vocabulary.instruction': "Write one sentence of your own with today's word.",
        'daily.micro.grammar.title': 'Spot the pattern', 'daily.micro.grammar.instruction': 'Find what follows the verb in the example, then write your own sentence in the same pattern.',
        'daily.example': 'Example'
    };

    function tr(key) {
        var v = root.t ? root.t(key) : '';
        return v || EN[key] || '';
    }

    function withArticle(card) {
        var art = card.article ? card.article + (/['’]$/.test(card.article) ? '' : ' ') : '';
        return art + card.word;
    }

    // Normalised challenge for rendering: { id, category, title, subtitle, prompt, tip, micro: { title, instruction, example } }
    function buildChallenge(category, data, level, dayIdx, pickIdx) {
        if (pickIdx === undefined) pickIdx = dayIdx;
        if (!data) return null;
        var c = { id: '#' + dayIdx, category: category };
        var tip = function () { return '💡 ' + tr('daily.tip.label') + ': ' + tr('daily.tip.' + category); };
        if (category === 'speaking' || category === 'writing') {
            var item = pickPrompt(data.items, level, pickIdx);
            if (!item || !item.prompt) return null;
            c.title = tr('daily.title.' + category);
            c.prompt = item.prompt;
            c.micro = { title: tr('daily.micro.' + category + '.title'),
                        instruction: tr('daily.micro.' + category + '.instruction'), example: '' };
        } else {
            var card = pickCalendarCard(data.day, level, dayIdx);
            if (!card) return null;
            var isVocab = category === 'vocabulary';
            c.title = isVocab ? tr('daily.title.vocabulary')
                : (data.slot === 'verb' ? tr('daily.title.verb') : tr('daily.title.grammar'));
            c.prompt = (card.emoji ? card.emoji + ' ' : '') + withArticle(card) + (card.definition ? ': ' + card.definition : '');
            c.micro = { title: tr('daily.micro.' + category + '.title'),
                        instruction: tr('daily.micro.' + category + '.instruction'), example: card.example || '' };
        }
        c.subtitle = tr('daily.subtitle.' + category);
        c.tip = tip();
        c.badge = tr('daily.cat.' + category);
        return c;
    }

    // Which occurrence of its category today is: 0, 1, 2... counting every day of that category since the epoch.
    // Picking by this index (instead of day of year) walks through the pool one item per occurrence. Day of year
    // would repeat badly: speaking falls every 3rd day, so a pool of 3 prompts would show the same one forever.
    function occurrenceIndex(date, schedule) {
        var days = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
        var dow = date.getDay();
        var category = schedule[dow];
        var perWeek = 0, slot = 0;
        for (var d = 0; d < 7; d++) {
            if (schedule[d] === category) { if (d < dow) slot++; perWeek++; }
        }
        var weekIdx = Math.floor((days + 4) / 7); // 1 Jan 1970 was a Thursday; weeks here start on Sunday
        return weekIdx * perWeek + slot;
    }

    function localKey(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    var cache = {};
    function getJson(url, fetchFn) {
        if (!cache[url]) {
            cache[url] = fetchFn(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .catch(function () { return null; });
        }
        return cache[url];
    }

    function calendarDay(lang, slot, dateKey, fetchFn) {
        return getJson(CALENDAR_ROOT + lang + '/calendar/' + slot + '/' + dateKey.slice(0, 7) + '.json', fetchFn)
            .then(function (cal) { return (cal && cal.days && cal.days[dateKey]) || null; });
    }

    // Resolves to the data buildChallenge needs for this category, or null (the page then uses the English bank).
    function loadData(lang, category, date, fetchFn) {
        fetchFn = fetchFn || root.fetch.bind(root);
        var dateKey = localKey(date);
        if (category === 'speaking' || category === 'writing') {
            return getJson(DATA_ROOT + lang + '/' + category + '.json', fetchFn).then(function (items) {
                return Array.isArray(items) && items.length ? { items: items } : null;
            });
        }
        if (category === 'vocabulary') {
            return calendarDay(lang, 'word', dateKey, fetchFn).then(function (day) { return day ? { day: day, slot: 'word' } : null; });
        }
        if (category === 'grammar') {
            return calendarDay(lang, 'verb-prep', dateKey, fetchFn).then(function (day) {
                if (day) return { day: day, slot: 'verb-prep' };
                return calendarDay(lang, 'verb', dateKey, fetchFn).then(function (vday) { return vday ? { day: vday, slot: 'verb' } : null; });
            });
        }
        return Promise.resolve(null);
    }

    root.COSY_DailySource = {
        promptBands: promptBands, pickItemForBand: pickItemForBand, pickPrompt: pickPrompt, calendarLevels: calendarLevels,
        pickCalendarCard: pickCalendarCard, occurrenceIndex: occurrenceIndex, buildChallenge: buildChallenge, loadData: loadData, localKey: localKey,
        _resetCache: function () { cache = {}; }
    };
})(typeof window !== 'undefined' ? window : globalThis);
