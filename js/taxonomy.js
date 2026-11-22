/**
 * Loads the canonical vocabulary confusion-pair taxonomy from COSYdata.
 * The taxonomy holds metadata only; practice questions are generated from
 * COSYdata vocabulary entries at session time.
 */
(function() {
    'use strict';

    const BASE = 'https://cosylanguages.github.io/COSYdata/taxonomy/';
    const pending = new Map();

    function load(file, target) {
        if (window[target]) return Promise.resolve(window[target]);
        if (pending.has(file)) return pending.get(file);
        const request = fetch(BASE + file)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.levels) {
                    window[target] = data.levels;
                    return data.levels;
                }
                return null;
            })
            .catch(() => null)
            .finally(() => {
                if (!window[target]) pending.delete(file);
            });
        pending.set(file, request);
        return request;
    }

    window.cosyLoadVocabConfusionPairs = () => load('vocab-confusion-pairs.json', 'COSY_VOCAB_CONFUSION_PAIRS');
})();
