#!/usr/bin/env node
/**
 * Unit tests for types/writing/daily_source.js (what the Daily Challenge shows). No dependencies:
 *   node scripts/test-daily-source.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

function load(t) {
    const ctx = { window: null, document: { currentScript: null }, URL, console, Promise, JSON, Math, Date, Object, Array, String };
    ctx.window = ctx;
    ctx.t = t || (() => '');
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../types/writing/daily_source.js'), 'utf8'), ctx);
    return ctx.COSY_DailySource;
}

let failed = 0;
async function test(name, fn) {
    try { await fn(); console.log('ok   ' + name); } catch (e) { failed++; console.log('FAIL ' + name + '\n     ' + (e && e.message)); }
}
const day = new Date(2026, 10, 18); // 18 Nov 2026

(async () => {
    await test('prompt bands: beginners alternate, B and C are single bands', () => {
        const s = load();
        assert.deepStrictEqual(Array.from(s.promptBands('a', 0)), ['a0-a1', 'a2']);
        assert.deepStrictEqual(Array.from(s.promptBands('a', 1)), ['a2', 'a0-a1']);
        assert.deepStrictEqual(Array.from(s.promptBands('b', 5)), ['b1-b2']);
        assert.deepStrictEqual(Array.from(s.promptBands('c', 5)), ['c1-c2']);
    });

    await test('curated prompts win for the band, then loosely tagged ones, then neighbours', () => {
        const s = load();
        const items = [
            { prompt: 'loose A2-B1', level: 'A2-B1' }, { prompt: 'curated A2', level: 'A2', curated: true },
            { prompt: 'loose B2-C1', level: 'B2-C1' }, { prompt: 'curated B1-B2', level: 'B1-B2', curated: true }];
        for (let d = 0; d < 5; d++) {
            assert.strictEqual(s.pickItemForBand(items, 'a2', d).prompt, 'curated A2');
            assert.strictEqual(s.pickItemForBand(items, 'b1-b2', d).prompt, 'curated B1-B2');
        }
        const seen = new Set();
        for (let d = 0; d < 5; d++) seen.add(s.pickItemForBand(items, 'c1-c2', d).prompt);
        assert.deepStrictEqual(Array.from(seen), ['loose B2-C1']);               // matches C1-C2 via its C1
        assert.strictEqual(s.pickItemForBand([{ prompt: 'only B1', level: 'B1' }], 'c1-c2', 0).prompt, 'only B1'); // neighbour
        assert.strictEqual(s.pickItemForBand([], 'a2', 0), null);
    });

    await test('calendar cards: preferred levels, nearest published level, nothing', () => {
        const s = load();
        const fr = { A0: { word: 'a0' }, A2: { word: 'a2' } };
        assert.strictEqual(s.pickCalendarCard(fr, 'a', 0).word, 'a0');
        assert.strictEqual(s.pickCalendarCard(fr, 'a', 1).word, 'a0');            // A1 preferred but not published: A0
        assert.strictEqual(s.pickCalendarCard(fr, 'b', 0).word, 'a2');            // nearest to B1 is A2
        assert.strictEqual(s.pickCalendarCard({ B1: { word: 'b1' }, B2: { word: 'b2' } }, 'b', 1).word, 'b2');
        assert.strictEqual(s.pickCalendarCard({}, 'a', 0), null);
        assert.strictEqual(s.pickCalendarCard(null, 'a', 0), null);
    });

    await test('occurrence index: every speaking day takes the next prompt, whatever the pool size', () => {
        const s = load();
        const schedule = { 0: 'speaking', 1: 'writing', 2: 'grammar', 3: 'speaking', 4: 'writing', 5: 'vocabulary', 6: 'speaking' };
        const seq = { speaking: [], writing: [], grammar: [], vocabulary: [] };
        for (let i = 0; i < 70; i++) {
            const d = new Date(2026, 10, 1 + i);
            seq[schedule[d.getDay()]].push(s.occurrenceIndex(d, schedule));
        }
        for (const [cat, list] of Object.entries(seq)) {
            for (let i = 1; i < list.length; i++) assert.strictEqual(list[i] - list[i - 1], 1, `${cat} occurrences must be consecutive`);
        }
        // the old rule (day of year) showed the same prompt every time for a pool of 3 on a 3-day cycle
        const old = [0, 3, 6, 9].map((d) => (326 + d) % 3);
        assert.strictEqual(new Set(old).size, 1);
        const pool = ['p0', 'p1', 'p2'];
        assert.strictEqual(new Set(seq.speaking.slice(0, 3).map((i) => pool[i % 3])).size, 3, 'three consecutive speaking days show three different prompts');
    });

    await test('speaking card: prompt from data, strings fall back to English, translated when available', () => {
        const data = { items: [{ prompt: 'Décrivez votre journée.', level: 'B1', curated: true }] };
        const en = load().buildChallenge('speaking', data, 'b', 3);
        assert.strictEqual(en.prompt, 'Décrivez votre journée.');
        assert.strictEqual(en.title, 'Speaking challenge');
        assert.strictEqual(en.micro.title, 'Say it again');
        assert.ok(en.tip.startsWith('💡 Tip'));
        const fr = load((k) => ({ 'daily.title.speaking': "Défi d'expression orale", 'daily.tip.label': 'Astuce', 'daily.tip.speaking': 'Répondez par des phrases complètes.', 'daily.cat.speaking': 'Expression orale' })[k] || '').buildChallenge('speaking', data, 'b', 3);
        assert.strictEqual(fr.title, "Défi d'expression orale");
        assert.strictEqual(fr.tip, '💡 Astuce: Répondez par des phrases complètes.');
        assert.strictEqual(fr.badge, 'Expression orale');
        assert.strictEqual(load().buildChallenge('speaking', { items: [] }, 'b', 3), null);
    });

    await test('every category has a complete English card (no blank tip, subtitle or micro-task) without any translations', () => {
        const s = load();
        const cal = { B1: { word: 'depend', definition: 'To rely on something.', example: 'It depends on the weather.' } };
        const cards = {
            speaking: s.buildChallenge('speaking', { items: [{ prompt: 'p', level: 'B1' }] }, 'b', 1, 1),
            writing: s.buildChallenge('writing', { items: [{ prompt: 'p', level: 'B1' }] }, 'b', 1, 1),
            vocabulary: s.buildChallenge('vocabulary', { day: cal, slot: 'word' }, 'b', 1),
            grammar: s.buildChallenge('grammar', { day: cal, slot: 'verb-prep' }, 'b', 1)
        };
        for (const [cat, c] of Object.entries(cards)) {
            for (const field of ['title', 'subtitle', 'badge', 'prompt']) assert.ok(c[field] && c[field].trim(), `${cat}.${field} is blank`);
            assert.ok(c.micro.title.trim() && c.micro.instruction.trim(), `${cat} micro-task is blank`);
            assert.ok(/^💡 Tip: \S/.test(c.tip), `${cat} tip is blank: ${c.tip}`);
        }
    });

    await test('vocabulary card: emoji, article (no space after l\'), definition and example', () => {
        const day1 = { A0: { word: 'orage', article: "l'", definition: 'Pluie et tonnerre.', example: "Un grand orage a éclaté.", emoji: '⛈️' } };
        const c = load().buildChallenge('vocabulary', { day: day1, slot: 'word' }, 'a', 0);
        assert.strictEqual(c.prompt, "⛈️ l'orage: Pluie et tonnerre.");
        assert.strictEqual(c.micro.example, 'Un grand orage a éclaté.');
        assert.strictEqual(c.title, 'Word of the day');
        const la = load().buildChallenge('vocabulary', { day: { A0: { word: 'gare', article: 'la', definition: 'x' } }, slot: 'word' }, 'a', 0);
        assert.strictEqual(la.prompt, 'la gare: x');
    });

    await test('grammar card: verb + preposition title, or verb title when only the verb calendar exists', () => {
        const d = { B1: { word: 'depend', definition: 'To rely on something.', example: 'It depends on the weather.' } };
        assert.strictEqual(load().buildChallenge('grammar', { day: d, slot: 'verb-prep' }, 'b', 0).title, 'Verb + preposition of the day');
        assert.strictEqual(load().buildChallenge('grammar', { day: d, slot: 'verb' }, 'b', 0).title, 'Verb of the day');
        assert.strictEqual(load().buildChallenge('grammar', { day: d, slot: 'verb' }, 'b', 0).micro.example, 'It depends on the weather.');
    });

    await test('loadData: prompts from the data files, cached, 404 gives null', async () => {
        const s = load(); const urls = [];
        const f = async (u) => { urls.push(u); return u.endsWith('/fr/speaking.json') ? { ok: true, json: async () => [{ prompt: 'x', level: 'A2' }] } : { ok: false, status: 404 }; };
        assert.strictEqual((await s.loadData('fr', 'speaking', day, f)).items.length, 1);
        assert.ok(urls[0].endsWith('/data/daily/fr/speaking.json'));
        await s.loadData('fr', 'speaking', day, f);
        assert.strictEqual(urls.length, 1, 'second call is served from the cache');
        assert.strictEqual(await s.loadData('ka', 'speaking', day, f), null);
    });

    await test('loadData: vocabulary reads the word calendar for the local date', async () => {
        const s = load(); const urls = [];
        const f = async (u) => { urls.push(u); return { ok: true, json: async () => ({ days: { '2026-11-18': { A0: { word: 'x' } } } }) }; };
        const d = await s.loadData('fr', 'vocabulary', day, f);
        assert.strictEqual(d.slot, 'word');
        assert.ok(urls[0].endsWith('/COSYdata/daily/fr/calendar/word/2026-11.json'));
        assert.strictEqual(await s.loadData('fr', 'vocabulary', new Date(2026, 10, 19), f), null); // that date is not in the file
    });

    await test('loadData: grammar tries verb-prep, then verb, then gives up', async () => {
        const cal = (slots) => async (u) => {
            const m = u.match(/calendar\/([\w-]+)\//);
            return slots.includes(m[1]) ? { ok: true, json: async () => ({ days: { '2026-11-18': { B1: { word: 'v' } } } }) } : { ok: false, status: 404 };
        };
        assert.strictEqual((await load().loadData('en', 'grammar', day, cal(['verb-prep', 'verb']))).slot, 'verb-prep');
        assert.strictEqual((await load().loadData('ru', 'grammar', day, cal(['verb']))).slot, 'verb');
        assert.strictEqual(await load().loadData('xx', 'grammar', day, cal([])), null);
    });

    if (failed) { console.log(`\n${failed} test(s) failed`); process.exit(1); }
    console.log('\nall daily_source tests passed');
})();
