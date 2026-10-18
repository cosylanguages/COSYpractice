/**
 * practice/types/concept-check/concept-check.js
 *
 * Interactive Concept Checking Questions (CCQs).
 * Loads a lesson-stage unit (https://raw.githubusercontent.com/cosylanguages/COSYplatform/main/reference/grammar/{lang}/lessons/{unit}.json,
 * schema/lesson-stage.schema.json) and renders its `meaningCheck` CCQs as
 * yes/no or short-factual checks with immediate feedback.
 *
 * URL params:
 *   ?lang=en&unit=to-be   -> https://raw.githubusercontent.com/cosylanguages/COSYplatform/main/reference/grammar/en/lessons/to-be.json
 *
 * A meaningCheck item may be:
 *   - an inline CCQ object {targetItem, language, ccq, answer, distractor?}
 *   - a string referencing a standalone CCQ file -> https://raw.githubusercontent.com/cosylanguages/COSYmanuals/main/data/grammar/reference/{lang}/ccq/{ref}.json
 */
(function () {
    'use strict';

    var params = new URLSearchParams(window.location.search);
    var lang = params.get('lang') || 'en';
    var unit = params.get('unit') || 'to-be';

    var deck = document.getElementById('ccq-deck');
    var leadIn = document.getElementById('ccq-lead-in');
    var leadInText = document.getElementById('ccq-lead-in-text');
    var unitLabel = document.getElementById('ccq-unit-label');
    var scoreEl = document.getElementById('ccq-score');
    var errorEl = document.getElementById('ccq-error');
    var restartBtn = document.getElementById('ccq-restart');

    var score = 0;
    var total = 0;

    function fail(msg) {
        errorEl.textContent = msg;
        errorEl.hidden = false;
        unitLabel.textContent = 'Could not load lesson';
    }

    function isYesNo(answer) {
        var a = String(answer).trim().toLowerCase();
        return a === 'yes' || a === 'no';
    }

    function norm(s) {
        return String(s == null ? '' : s).trim().toLowerCase();
    }

    // Resolve a meaningCheck entry to a CCQ object (fetch standalone files).
    function resolveCcqs(meaningCheck) {
        if (!Array.isArray(meaningCheck)) return [];
        return Promise.all(meaningCheck.map(function (mc) {
            if (typeof mc === 'string') {
                // standalone reference: https://raw.githubusercontent.com/cosylanguages/COSYmanuals/main/data/grammar/reference/{lang}/ccq/{ref}.json
                var url = 'https://raw.githubusercontent.com/cosylanguages/COSYmanuals/main/data/grammar/reference/' + lang + '/ccq/' + mc + '.json';
                return fetch(url).then(function (r) {
                    if (!r.ok) throw new Error('CCQ not found: ' + url);
                    return r.json();
                }).catch(function () {
                    return { targetItem: mc, language: lang, ccq: '(missing CCQ: ' + mc + ')', answer: '' };
                });
            }
            return Promise.resolve(mc);
        }));
    }

    function renderCard(ccq, index) {
        var card = document.createElement('div');
        card.className = 'ccq-card';
        card.setAttribute('data-index', index);

        var targetText = ccq.targetItem || ccq.targetStructure || '—';
        var questionText = ccq.ccq || ccq.question || ccq.targetItem || '';
        var answerText = ccq.answer || (Array.isArray(ccq.options) && ccq.correctOptionIndex != null ? ccq.options[ccq.correctOptionIndex] : '');

        var target = document.createElement('div');
        target.className = 'ccq-target';
        target.textContent = 'Target: ' + targetText;
        card.appendChild(target);

        var q = document.createElement('p');
        q.className = 'ccq-question';
        q.textContent = (index + 1) + '. ' + questionText;
        card.appendChild(q);

        var actions = document.createElement('div');
        actions.className = 'ccq-actions';

        var feedback = document.createElement('div');
        feedback.className = 'ccq-feedback';
        feedback.hidden = true;

        var answered = false;
        var answer = answerText;

        function markCorrect() {
            card.classList.add('is-correct');
            feedback.classList.add('ok');
            feedback.innerHTML = '✓ Correct. <b>' + answer + '</b>';
            score++;
            updateScore();
        }
        function markWrong(chosen) {
            card.classList.add('is-wrong');
            feedback.classList.add('no');
            feedback.innerHTML = '✗ Not quite. Expected: <b>' + answer + '</b>';
            updateScore();
        }

        if (isYesNo(answer)) {
            ['yes', 'no'].forEach(function (pick) {
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ccq-btn';
                btn.setAttribute('data-pick', pick);
                btn.textContent = pick === 'yes' ? '✓ Yes' : '✗ No';
                btn.addEventListener('click', function () {
                    if (answered) return;
                    answered = true;
                    btn.classList.add('is-chosen');
                    actions.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
                    if (norm(pick) === norm(answer)) {
                        markCorrect();
                    } else {
                        markWrong(pick);
                    }
                    feedback.hidden = false;
                });
                actions.appendChild(btn);
            });
        } else {
            // short factual answer -> text input
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'ccq-btn';
            input.setAttribute('placeholder', 'Type your answer…');
            input.style.flex = '1';
            input.style.minWidth = '160px';
            var submit = document.createElement('button');
            submit.type = 'button';
            submit.className = 'ccq-btn';
            submit.textContent = 'Check';
            submit.addEventListener('click', function () {
                if (answered) return;
                answered = true;
                input.disabled = true;
                submit.disabled = true;
                if (norm(input.value) === norm(answer)) {
                    markCorrect();
                } else {
                    markWrong(input.value);
                }
                feedback.hidden = false;
            });
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') { e.preventDefault(); submit.click(); }
            });
            actions.appendChild(input);
            actions.appendChild(submit);
        }

        card.appendChild(actions);
        card.appendChild(feedback);
        return card;
    }

    function updateScore() {
        scoreEl.textContent = 'Score: ' + score + ' / ' + total;
    }

    function renderUnit(data) {
        unitLabel.textContent = (data.unitId || unit) + ' — Concept Check';
        if (data.leadIn) {
            if (typeof data.leadIn === 'object') {
                leadInText.textContent = data.leadIn.content || data.leadIn.title || '';
            } else {
                leadInText.textContent = data.leadIn;
            }
            leadIn.hidden = !leadInText.textContent;
        }
        resolveCcqs(data.meaningCheck).then(function (ccqs) {
            ccqs = ccqs.filter(Boolean);
            total = ccqs.length;
            updateScore();
            if (!ccqs.length) {
                deck.innerHTML = '<p class="ccq-error">No CCQs in this lesson yet.</p>';
                return;
            }
            ccqs.forEach(function (ccq, i) {
                deck.appendChild(renderCard(ccq, i));
            });
        }).catch(function (e) {
            fail('Error rendering CCQs: ' + e.message);
        });
    }

    function load() {
        var url = 'https://raw.githubusercontent.com/cosylanguages/COSYplatform/main/reference/grammar/' + lang + '/lessons/' + unit + '.json';
        fetch(url).then(function (r) {
            if (!r.ok) throw new Error('Lesson not found: ' + url);
            return r.json();
        }).then(renderUnit).catch(function (e) {
            fail(e.message);
        });
    }

    restartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        deck.innerHTML = '';
        score = 0;
        total = 0;
        leadIn.hidden = true;
        load();
    });

    load();
})();
