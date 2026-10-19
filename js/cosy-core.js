/**
 * COSYpractice core: the small part of the old hub engine that practice sessions need.
 *  - vocabulary comes from COSYdata (remote); nothing is duplicated in this repo
 *  - curriculum units come from COSYplatform (public JSON only)
 * Everything is exposed on window.COSY, as the practice scripts expect.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var ROOT = script ? new URL('../', script.src).href : './';

  function getPrefix() { return ROOT; }

  var COSY = window.COSY = window.COSY || {};
  Object.assign(COSY, {
    getPrefix: getPrefix,

    getUser: function () {
      try {
        var stored = localStorage.getItem('cosy_user') || localStorage.getItem('cosy-auth');
        if (stored) { var parsed = JSON.parse(stored); return parsed.user || parsed; }
      } catch (e) {}
      return window.COSY_USER || null;
    },
    isUserAuthenticated: function () {
      var u = COSY.getUser();
      if (!u) return false;
      var role = String(u.role || (u.user_metadata && u.user_metadata.role) || (u.app_metadata && u.app_metadata.role) || 'student').toLowerCase();
      return role === 'student' || role === 'teacher' || role === 'admin';
    },

    showToast: function (msg) {
      var el = document.getElementById('toast');
      if (!el) return;
      el.textContent = msg; el.classList.add('show');
      clearTimeout(COSY._toastTimer);
      COSY._toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2800);
    },

    async loadLanguageData(lang, levelId, theme) {
        const COSYDATA_BASE = 'https://cosylanguages.github.io/COSYdata/';
        let levelsToLoad = (levelId === 'all')
            ? (window.COSY_LEVELS ? window.COSY_LEVELS.map(l => l.id) : ['starter', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficiency'])
            : [levelId];
        let remoteEntries = [];

        const keys = ['vocabularyData', 'verbsData', 'adjectivesData', 'locationsData', 'peopleData', 'nationalitiesData', 'grammarData', 'grammarElements', 'dishesData'];
        keys.forEach(key => {
            window[key] = window[key] || {};
            window[key][lang] = window[key][lang] || [];
        });

        // Vocabulary lives in COSYdata (index.json maps each entry to a theme file such as "a2/home/rooms.json").
        // Each request has its own timeout, a chosen level only loads that level's files, and "all levels"
        // loads random theme files in parallel batches until the pool is big enough for a session.
        async function getJSON(url, ms) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), ms);
            try {
                const res = await fetch(url, { signal: controller.signal });
                return res.ok ? await res.json() : null;
            } catch (e) { return null; } finally { clearTimeout(timer); }
        }
        const asObj = (x) => (typeof x === 'string' ? { text: x } : x);
        function normalizeItem(item) {
            if (Array.isArray(item.definitions)) item.definitions = item.definitions.map(asObj);
            if (Array.isArray(item.examples)) item.examples = item.examples.map(asObj);
            return item;
        }
        try {
            const indexData = await getJSON(`${COSYDATA_BASE}vocabulary/${lang}/index.json`, 10000);
            if (indexData) {
                let themeFiles = [...new Set(Object.values(indexData))];
                if (levelId && levelId !== 'all') {
                    const short = String(window.levelIdToShort ? window.levelIdToShort(levelId) : levelId).toLowerCase();
                    const matching = themeFiles.filter(f => String(f).split('/')[0].toLowerCase().split('_').includes(short));
                    if (matching.length) themeFiles = matching;
                } else {
                    themeFiles.sort(() => Math.random() - 0.5);
                }
                const TARGET_ITEMS = ((levelId && levelId !== 'all') || (theme && theme !== 'all')) ? Infinity : 900;
                const BATCH = 16;
                const themeResults = [];
                let loadedCount = 0;
                for (let i = 0; i < themeFiles.length && loadedCount < TARGET_ITEMS; i += BATCH) {
                    const batch = await Promise.all(themeFiles.slice(i, i + BATCH).map(tf => getJSON(`${COSYDATA_BASE}vocabulary/${lang}/${tf}`, 20000)));
                    batch.forEach(r => { if (r) { themeResults.push(r); loadedCount += Array.isArray(r) ? r.length : 1; } });
                }
                const seenIds = new Set(window.vocabularyData[lang].map(e => e.id || e.word));
                const loadedEntries = [];

                for (const tData of themeResults) {
                    if (!tData) continue;
                    const items = Array.isArray(tData) ? tData : (tData.id ? [tData] : Object.values(tData));
                    for (const item of items) {
                        if (!item || !item.word) continue;
                        const keyId = item.id || `${item.word.toLowerCase()}|${item.level || ''}`;
                        if (seenIds.has(keyId)) continue;
                        seenIds.add(keyId);

                        // Normalize level and level_code
                        if (!item.level && item.level_code) item.level = item.level_code;
                        if (!item.level_code && item.level) item.level_code = item.level;

                        // Check level filter if applicable
                        if (levelId && levelId !== 'all') {
                            const itemLvl = (item.level_code || item.level || '').toLowerCase();
                            const folderCode = window.getLevelDir ? window.getLevelDir(levelId).toLowerCase() : levelId.toLowerCase();
                            const shortCode = window.levelIdToShort ? window.levelIdToShort(levelId).toLowerCase() : levelId.toLowerCase();
                            if (itemLvl !== levelId.toLowerCase() && itemLvl !== folderCode && itemLvl !== shortCode) {
                                const aliases = { 'starter': 'a1', 'elementary': 'a2', 'intermediate': 'b1', 'upper-intermediate': 'b2', 'advanced': 'c1', 'proficiency': 'c2' };
                                if (aliases[itemLvl] !== shortCode && itemLvl !== shortCode) continue;
                            }
                        }

                        normalizeItem(item);
                        window.vocabularyData[lang].push(item);
                        loadedEntries.push(item);

                        if (item.form === 'verb' || item.pos === 'verb') window.verbsData[lang].push(item);
                        if (item.form === 'adjective' || item.pos === 'adjective') window.adjectivesData[lang].push(item);
                        if (item.theme === 'locations' || item.pos_section === 'locations') window.locationsData[lang].push(item);
                        if (item.theme === 'people' || item.pos_section === 'people') window.peopleData[lang].push(item);
                        if (item.theme === 'nationalities') window.nationalitiesData[lang].push(item);
                        if (item.theme === 'dishes') window.dishesData[lang].push(item);
                    }
                }

                if (loadedEntries.length > 0) {
                    remoteEntries = loadedEntries;
                    if (levelId !== 'all') return remoteEntries;

                    const remoteLevels = new Set(remoteEntries.map(item => {
                        const itemLevel = item.level_code || item.level || '';
                        const shortCode = window.levelIdToShort ? window.levelIdToShort(itemLevel) : itemLevel;
                        return String(shortCode).toUpperCase();
                    }));
                    levelsToLoad = levelsToLoad.filter(lid => {
                        const shortCode = window.levelIdToShort ? window.levelIdToShort(lid) : lid;
                        return !remoteLevels.has(String(shortCode).toUpperCase());
                    });
                    if (levelsToLoad.length === 0) return remoteEntries;
                }
            }
        } catch (err) {
            console.warn(`[COSYdata] COSYdata fetch failed for ${lang}, falling back to local files:`, err);
        }

        // No local copy of the vocabulary lives in this repo: COSYdata is the single source.
        return remoteEntries;
    },


    async loadCurriculum(lang, level) {
        if (!lang || !level) return [];

        const prefix = getPrefix();
        const levelUp = level.toUpperCase();
        const levelLow = level.toLowerCase();
        const langLow = lang.toLowerCase();

        const standardPath = `https://raw.githubusercontent.com/cosylanguages/COSYplatform/main/curriculums/${lang}/general/${levelUp}.json`;
        const v2Path = `https://raw.githubusercontent.com/cosylanguages/COSYplatform/main/curriculums/${lang}/general/${levelUp}_v2.json`;

        try {
            const res = await fetch(standardPath);
            const data = res.ok ? await res.json() : await fetch(v2Path).then(r => r.ok ? r.json() : null);
            if (data && data.units) {
                const units = data.units;
                window.curriculumData = window.curriculumData || {};
                const key = `${langLow}_${levelLow}`;
                window.curriculumData[key] = units;
                if (window.cosyDays) window.cosyDays.state.curriculum = units;
                return units;
            }
        } catch (e) {
            console.warn(`Failed to load curriculum for ${lang} ${level}:`, e);
        }

        const key = `${langLow}_${levelLow}`;
        return (window.curriculumData && window.curriculumData[key]) || [];
    },

    // Morphology tables are not shipped with practice (they live with the reference tools), so this stays a no-op.
    async loadMorphologyData(lang) {
      window.morphologyData = window.morphologyData || {};
      var key = String(lang || '').toLowerCase();
      return window.morphologyData[key] || (window.morphologyData[key] = []);
    }
  });
})();
