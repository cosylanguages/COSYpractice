/**
 * js/data/phonology_data.js
 * Asynchronous loader for reference phonology datasets (sounds, stress, intonation).
 */

(function() {
    'use strict';

    window.phonologyData = window.phonologyData || {};

    function getPrefix() {
        if (window.COSY && typeof window.COSY.getPrefix === 'function') {
            return window.COSY.getPrefix();
        }
        const path = window.location.pathname;
        if (path.includes('/practice/') || path.includes('/languages/') || path.includes('/manuals/')) {
            return '../../';
        }
        return '';
    }

    async function loadPhonologyData(lang) {
        if (!lang) return {};

        const langLow = lang.toLowerCase();

        if (window.phonologyData[langLow]) {
            return window.phonologyData[langLow];
        }

        const prefix = getPrefix();
        const categories = ['sounds', 'stress', 'intonation'];
        const result = { sounds: [], stress: [], intonation: [] };

        const fetchPromises = categories.map(async (cat) => {
            const path = `https://raw.githubusercontent.com/cosylanguages/COSYmanuals/main/data/grammar/reference/${langLow}/phonology/${cat}.json`;
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
