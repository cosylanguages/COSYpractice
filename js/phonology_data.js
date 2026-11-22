/**
 * js/data/phonology_data.js
 * Asynchronous loader for reference phonology datasets (sounds, stress, intonation).
 */

(function() {
    'use strict';

    window.phonologyData = window.phonologyData || {};

    // The canonical phonology reference lives in COSYmanuals.
    const REFERENCE_BASE = 'https://cosylanguages.github.io/COSYmanuals/data/grammar/reference/';
    function dataUrl(rel) {
        return REFERENCE_BASE + rel;
    }

    async function loadPhonologyData(lang) {
        if (!lang) return {};

        const langLow = lang.toLowerCase();

        if (window.phonologyData[langLow]) {
            return window.phonologyData[langLow];
        }

        const categories = ['sounds', 'stress', 'intonation'];
        const result = { sounds: [], stress: [], intonation: [] };

        const fetchPromises = categories.map(async (cat) => {
            const path = dataUrl(`${langLow}/phonology/${cat}.json`);
            try {
                const res = await fetch(path);
                if (res.ok) {
                    const data = await res.json();
                    result[cat] = (data && data.groups) ? data.groups : [];
                }
            } catch (err) {
                console.warn(`[COSY Phonology] Could not load ${path}:`, err);
            }
        });

        await Promise.all(fetchPromises);

        window.phonologyData[langLow] = result;
        return result;
    }

    // Attach to global COSY object and window
    window.COSY = window.COSY || {};
    window.COSY.loadPhonologyData = loadPhonologyData;
    window.loadPhonologyData = loadPhonologyData;
})();
