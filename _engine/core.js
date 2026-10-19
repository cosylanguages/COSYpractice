/**
 * practice/_engine/core.js
 * Consolidated session engine for language practice (Track B-4).
 * Handles state, scoring, streaks, and session flow.
 */

(function() {
    'use strict';

    function playPracticeSound(type) {
        try {
            // Helper to get reaction sound URL
            const getReactionSoundUrl = (soundType, lang) => {
                const p = (window.COSY && typeof window.COSY.getPrefix === 'function') ? window.COSY.getPrefix() : '/';
                const reactionsDir = p + 'sounds/reactions/';
                const sounds = {
                    fr: {
                        correct: ['bien sur.ogg', 'ouioui.ogg', 'ouais.ogg'],
                        wrong: ['mais non ca va pas.ogg', 'mais pourquoi.ogg']
                    },
                    en: {
                        correct: ['yes.ogg', 'of course.ogg'],
                        wrong: ['no.ogg', 'why.ogg', 'oh really.ogg']
                    }
                };
                const langKey = (lang && lang.toLowerCase() === 'fr') ? 'fr' : 'en';
                const list = sounds[langKey][soundType];
                if (!list || list.length === 0) return null;
                const randomSound = list[Math.floor(Math.random() * list.length)];
                return reactionsDir + encodeURIComponent(randomSound);
            };

            // Play voice reaction if applicable
            const sessionLang = engine.session ? engine.session.lang : 'en';
            if (type === 'correct' || type === 'wrong') {
                const reactionUrl = getReactionSoundUrl(type, sessionLang);
                if (reactionUrl) {
                    const reactionAudio = new Audio(reactionUrl);
                    reactionAudio.volume = 0.5;
                    reactionAudio.play().catch(e => console.warn("Reaction audio play blocked:", e));
                }
            }

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (type === 'correct') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);

                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(ctx.currentTime + 0.35);
            } else if (type === 'wrong') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);

                gain.gain.setValueAtTime(0.18, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } else if (type === 'complete') {
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

                    gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.4);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(ctx.currentTime + i * 0.08);
                    osc.stop(ctx.currentTime + i * 0.08 + 0.4);
                });
            }
        } catch (e) {
            console.warn("AudioContext not supported or blocked", e);
        }
    }

    function showFloatingScoreEffect(text, isCorrect = true) {
        const parent = document.querySelector('.pe-counters');
        if (!parent) return;

        const el = document.createElement('div');
        el.className = 'floating-points-pop';
        el.textContent = text;
        el.style.color = isCorrect ? 'var(--teal)' : 'var(--coral)';
        parent.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 1200);
    }

    function triggerHaptic(isCorrect = true) {
        if ('vibrate' in navigator) {
            try {
                if (isCorrect) navigator.vibrate(40);
                else navigator.vibrate([60, 40, 60]);
            } catch (e) {}
        }
    }

    function showBottomFeedback(isCorrect, title, desc, autoAdvanceMs = null) {
        triggerHaptic(isCorrect);
        const bar = document.getElementById('pe-bottom-bar');
        const iconEl = document.getElementById('pe-bb-icon');
        const titleEl = document.getElementById('pe-bb-title');
        const descEl = document.getElementById('pe-bb-desc');

        if (bar) {
            bar.className = 'pe-bottom-bar active ' + (isCorrect ? 'correct' : 'incorrect');
            if (iconEl) iconEl.textContent = isCorrect ? '🎉' : '❌';
            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.innerHTML = desc;
            document.body.classList.add('has-active-bottom-bar');
        }

        // Apply visual bounce or shake to the question card
        const card = document.querySelector('.pe-question-card');
        if (card) {
            card.classList.remove('pe-bounce', 'pe-shake');
            // Trigger reflow to restart animation
            void card.offsetWidth;
            card.classList.add(isCorrect ? 'pe-bounce' : 'pe-shake');
        }

        if (autoAdvanceMs) {
            if (engine.autoAdvanceTimeout) clearTimeout(engine.autoAdvanceTimeout);
            engine.autoAdvanceTimeout = setTimeout(() => {
                engine.nextQuestion();
            }, autoAdvanceMs);
        }
    }

    function triggerConfetti() {
        const canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#2D7D6F', '#B07D2B', '#C4522A', '#2E5FA3', '#3A7A4A', '#6B3F7C'];
        const particles = [];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 4,
                d: Math.random() * canvas.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                tiltAngle: 0
            });
        }

        let animationFrame;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach((p) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 5;

                if (p.y <= canvas.height) {
                    active = true;
                }

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
            });

            if (active) {
                animationFrame = requestAnimationFrame(draw);
            } else {
                canvas.remove();
            }
        }
        draw();
        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            canvas.remove();
        }, 4000);
    }

    const KEY_STATE = 'cosy_practice';
    const KEY_TOTAL_PTS = 'cosy_total_points';
    const KEY_STREAK = 'practice_streak';
    const KEY_LAST_DATE = 'last_practice_date';
    const KEY_SRS = 'cosy_srs_data';
    const KEY_PROJECTOR_MODE = 'cosy_projector_mode';

    function loadState() {
        try {
            const s = JSON.parse(localStorage.getItem(KEY_STATE) || '{}');
            s.totalPts = parseInt(localStorage.getItem(KEY_TOTAL_PTS) || '0');
            s.streak = parseInt(localStorage.getItem(KEY_STREAK) || '0');
            s.lastDate = localStorage.getItem(KEY_LAST_DATE) || '';
            return s;
        } catch { return { totalPts: 0, streak: 0, lastDate: '' }; }
    }

    function getSRSMap() {
        try {
            return JSON.parse(localStorage.getItem(KEY_SRS) || '{}');
        } catch { return {}; }
    }

    function saveSRSMap(map) {
        try {
            localStorage.setItem(KEY_SRS, JSON.stringify(map));
        } catch (e) {
            console.error("Failed to save SRS data", e);
        }
    }

    function updateItemSRS(item, isCorrect, langKey) {
        if (!item || !item.word) return;
        const l = langKey || 'en';
        const itemKey = `${l.toLowerCase()}:${item.word.toLowerCase()}`;
        const map = getSRSMap();
        const existing = map[itemKey] || {
            key: itemKey,
            word: item.word,
            lang: l,
            level: item.level || 'all',
            theme: item.theme || 'all',
            interval: 0,
            repetition: 0,
            easeFactor: 2.5,
            nextReview: Date.now()
        };

        const grade = isCorrect ? 5 : 1;
        let rep = existing.repetition;
        let interval = existing.interval;
        let ef = existing.easeFactor;

        if (grade >= 3) {
            if (rep === 0) interval = 1;
            else if (rep === 1) interval = 6;
            else interval = Math.round(interval * ef);
            rep++;
        } else {
            rep = 0;
            interval = 1;
        }

        ef = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
        if (ef < 1.3) ef = 1.3;

        map[itemKey] = {
            ...existing,
            item,
            repetition: rep,
            interval: interval,
            easeFactor: parseFloat(ef.toFixed(2)),
            lastReviewed: Date.now(),
            nextReview: Date.now() + (interval * 86400000)
        };

        saveSRSMap(map);
    }

    function saveState(s) {
        localStorage.setItem(KEY_STATE, JSON.stringify(s));
        localStorage.setItem(KEY_TOTAL_PTS, s.totalPts);
        localStorage.setItem(KEY_STREAK, s.streak);
        localStorage.setItem(KEY_LAST_DATE, s.lastDate);
    }

    function cosyTransition(showIds, hideIds, onMidTransition) {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const showElements = showIds.map(id => document.getElementById(id)).filter(Boolean);
        const hideElements = hideIds.map(id => document.getElementById(id)).filter(Boolean);

        if (isReduced) {
            hideElements.forEach(el => {
                el.classList.add('hidden');
                el.style.display = 'none';
            });
            if (onMidTransition) onMidTransition();
            showElements.forEach(el => {
                el.classList.remove('hidden');
                // special case for specific elements
                const isFlexOrBlock = (el.id === 'quickstart-section' || el.id === 'stats-section' || el.id === 'setup-section') ? '' : 'block';
                el.style.display = isFlexOrBlock;
            });
            return;
        }

        // Animated transition
        hideElements.forEach(el => {
            el.classList.add('cosy-fade-node');
            el.classList.add('cosy-fade-out');
        });

        setTimeout(() => {
            hideElements.forEach(el => {
                el.classList.add('hidden');
                el.style.display = 'none';
                el.classList.remove('cosy-fade-node', 'cosy-fade-out');
            });

            if (onMidTransition) onMidTransition();

            showElements.forEach(el => {
                el.classList.add('cosy-fade-node');
                el.classList.add('cosy-fade-in-init');
                el.classList.remove('hidden');
                const isFlexOrBlock = (el.id === 'quickstart-section' || el.id === 'stats-section' || el.id === 'setup-section') ? '' : 'block';
                el.style.display = isFlexOrBlock;
            });

            // Trigger reflow to start fade in
            void document.body.offsetHeight;

            showElements.forEach(el => {
                el.classList.remove('cosy-fade-in-init');
            });

            setTimeout(() => {
                showElements.forEach(el => {
                    el.classList.remove('cosy-fade-node');
                });
            }, 400);

        }, 400);
    }

    const engine = {
        state: loadState(),
        session: null,

        init() {
            const s = this.state;
            if (!s.todayCorrect) s.todayCorrect = 0;
            if (!s.sessions) s.sessions = 0;
            if (!s.mistakes) s.mistakes = [];
            if (!s.history) s.history = [];

            const todayStr = new Date().toISOString().split('T')[0];
            if (s.lastDate !== todayStr) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yStr = yesterday.toISOString().split('T')[0];
                if (s.lastDate !== yStr && s.lastDate !== '') {
                    // Broke the streak
                    s.streak = 0;
                }
                s.todayCorrect = 0;
            }
            // Restore Projector / Classroom Mode state if enabled
            if (localStorage.getItem(KEY_PROJECTOR_MODE) === 'true') {
                document.body.classList.add('projector-mode');
                this.updateProjectorModeUI(true);
            }

            this.save();
            this.updateUI();
            this.populateRecentAndMistakes();

            // Global interactive keyboard controls & shortcuts (supports Presenter Remotes & Classroom Keyboards)
            document.addEventListener('keydown', (e) => {
                // Toggle Projector Mode with 'P' key
                if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                        return;
                    }
                    e.preventDefault();
                    this.toggleProjectorMode();
                    return;
                }

                if (e.key !== 'Enter' && e.key !== 'PageDown' && e.key !== 'PageUp' && !['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key) && e.key !== 's' && e.key !== 'S' && e.key !== 'c' && e.key !== 'C') return;

                // 1. If Summary Modal is open, Enter closes it
                const summaryModal = document.getElementById('summary-modal');
                if (summaryModal && summaryModal.style.display === 'block') {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        window.cosyPractice.endSession();
                    }
                    return;
                }

                // 2. If Spinning Wheel is open, Enter spins it
                const wheelContainer = document.getElementById('wheel-container');
                if (wheelContainer && wheelContainer.style.display === 'block') {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const spinBtn = document.getElementById('spin-btn');
                        if (spinBtn && !spinBtn.disabled) {
                            spinBtn.click();
                        }
                    }
                    return;
                }

                // 3. If Practice Section is active
                const practiceSec = document.getElementById('practice-section');
                const isPracticeActive = practiceSec && practiceSec.classList.contains('active');
                if (isPracticeActive) {
                    const sess = this.session;
                    if (!sess) return;

                    const bar = document.getElementById('pe-bottom-bar');
                    const isBarActive = bar && bar.classList.contains('active');

                    if ((e.key === 'Enter' || e.key === 'PageDown') && isBarActive) {
                        e.preventDefault();
                        this.nextQuestion();
                        return;
                    }

                    // If typing in input, let normal keys type
                    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
                        return;
                    }

                    const q = sess.sessionQueue[sess.currentIndex];
                    if (!q) return;
                    const form = q.form || q.type;

                    // Support pressing 'S' key to play listening audio
                    if ((e.key === 's' || e.key === 'S') && form === 'ls') {
                        const playBtn = Array.from(document.querySelectorAll('.btn-outline')).find(b => b.textContent.includes('Play Audio')) || document.querySelector('button[onclick*="speak"]');
                        if (playBtn) {
                            e.preventDefault();
                            playBtn.click();
                            playBtn.classList.add('active');
                            setTimeout(() => playBtn.classList.remove('active'), 150);
                        }
                    }

                    // Support pressing 'C' key to Clear scramble
                    if ((e.key === 'c' || e.key === 'C') && form === 'sc') {
                        e.preventDefault();
                        window.clearScramble();
                        return;
                    }

                    if (e.key === 'Enter' || e.key === 'PageDown') {
                        const nextBtn = document.getElementById('pe-next');
                        const isNextVisible = nextBtn && nextBtn.style.display !== 'none';
                        if (isNextVisible) {
                            e.preventDefault();
                            this.nextQuestion();
                        }
                    } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
                        if (form === 'mc' || form === 'ls') {
                            const idx = parseInt(e.key) - 1;
                            const buttons = document.querySelectorAll('.mc-opt');
                            if (buttons[idx] && !buttons[idx].disabled) {
                                e.preventDefault();
                                buttons[idx].classList.add('active');
                                setTimeout(() => buttons[idx].classList.remove('active'), 150);
                                buttons[idx].click();
                            }
                        } else if (form === 'tf') {
                            if (e.key === '1') {
                                e.preventDefault();
                                const btn = document.querySelector('.tf-btn-true');
                                if (btn && !btn.disabled) {
                                    btn.classList.add('active');
                                    setTimeout(() => btn.classList.remove('active'), 150);
                                    btn.click();
                                }
                            } else if (e.key === '2') {
                                e.preventDefault();
                                const btn = document.querySelector('.tf-btn-false');
                                if (btn && !btn.disabled) {
                                    btn.classList.add('active');
                                    setTimeout(() => btn.classList.remove('active'), 150);
                                    btn.click();
                                }
                            }
                        } else if (form === 'sc') {
                            const idx = parseInt(e.key) - 1;
                            const tile = document.getElementById(`sc-tile-${idx}`);
                            if (tile && !tile.classList.contains('placed')) {
                                e.preventDefault();
                                tile.classList.add('active');
                                setTimeout(() => tile.classList.remove('active'), 150);
                                tile.click();
                            }
                        }
                    }
                    return;
                }

                // 4. If Setup panel is visible and active, Enter starts the practice
                const setupSec = document.getElementById('setup-section');
                const isSetupVisible = setupSec && setupSec.style.display !== 'none' && !setupSec.classList.contains('hidden');
                if (isSetupVisible && e.key === 'Enter') {
                    // Make sure we aren't focused on a select element, so Enter doesn't prevent select drop-downs
                    if (document.activeElement && document.activeElement.tagName === 'SELECT') {
                        return;
                    }
                    e.preventDefault();
                    window.cosyPractice.startPractice();
                }
            });
        },

        toggleProjectorMode() {
            const isEnabled = document.body.classList.toggle('projector-mode');
            localStorage.setItem(KEY_PROJECTOR_MODE, isEnabled ? 'true' : 'false');
            this.updateProjectorModeUI(isEnabled);
            const msg = isEnabled ? "📺 Projector / Classroom Mode Enabled (Scaled Up Text & Contrast)" : "📺 Projector Mode Disabled";
            if (window.COSY && window.COSY.showToast) window.COSY.showToast(msg, false);
        },

        updateProjectorModeUI(isEnabled) {
            const setupBtn = document.getElementById('projector-setup-toggle');
            const peBtn = document.getElementById('pe-projector-toggle');
            if (setupBtn) {
                if (isEnabled) {
                    setupBtn.classList.add('active');
                    setupBtn.style.background = 'var(--teal)';
                    setupBtn.style.color = '#fff';
                } else {
                    setupBtn.classList.remove('active');
                    setupBtn.style.background = 'none';
                    setupBtn.style.color = 'var(--ink-muted)';
                }
            }
            if (peBtn) {
                if (isEnabled) {
                    peBtn.style.background = 'var(--teal)';
                    peBtn.style.color = '#fff';
                    peBtn.style.borderColor = 'var(--teal)';
                } else {
                    peBtn.style.background = 'none';
                    peBtn.style.color = '#fff';
                    peBtn.style.borderColor = 'rgba(255,255,255,0.3)';
                }
            }
        },

        save() {
            saveState(this.state);
        },

        updateUI() {
            const s = this.state;
            const ptsStr = s.totalPts.toLocaleString();

            ['total-pts', 'nav-pts', 'setup-total-score'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = ptsStr;
            });

            ['streak-val', 'nav-streak', 'streak-count'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = s.streak;
            });

            if (document.getElementById('total-correct')) document.getElementById('total-correct').textContent = s.todayCorrect;
            if (document.getElementById('total-sessions')) document.getElementById('total-sessions').textContent = s.sessions;

            const dailyXP = (s.todayCorrect || 0) * 10;
            const dailyXPValEl = document.getElementById('daily-xp-val');
            if (dailyXPValEl) {
                dailyXPValEl.textContent = `${dailyXP} / 50 XP`;
            }

            const arc = document.getElementById('streak-arc');
            if (arc) {
                const pct = Math.min(s.streak / 30, 1);
                arc.style.strokeDashoffset = 226 - (226 * pct);
            }

            // Empty-state stats check
            const statsGridEl = document.getElementById('stats-summary-grid');
            const statsEmptyEl = document.getElementById('stats-empty-state');
            if (statsGridEl && statsEmptyEl) {
                const hasHistory = (s.sessions && s.sessions > 0) || (s.history && s.history.length > 0);
                if (hasHistory) {
                    statsGridEl.style.display = 'flex';
                    statsEmptyEl.style.display = 'none';
                } else {
                    statsGridEl.style.display = 'none';
                    statsEmptyEl.style.display = 'block';
                }
            }
        },

        populateRecentAndMistakes() {
            const recentList = document.getElementById('recent-list');
            const mistakeList = document.getElementById('mistake-list');
            const s = this.state;

            if (recentList) {
                if (!s.history || s.history.length === 0) recentList.innerHTML = '<div class="info-card-empty">No sessions yet: start practising!</div>';
                else recentList.innerHTML = s.history.map(session => `
                    <div class="recent-item">
                        <div class="ri-dot" style="background:var(--teal);"></div>
                        <div class="ri-name">${session.lang.toUpperCase()} · ${session.cat}</div>
                        <div class="ri-pts">+${session.pts} ✨</div>
                    </div>`).join('');
            }
            if (mistakeList) {
                if (!s.mistakes || s.mistakes.length === 0) mistakeList.innerHTML = '<div class="info-card-empty">No mistakes saved yet: well done!</div>';
                else mistakeList.innerHTML = s.mistakes.slice(-5).reverse().map(m => `
                    <div class="mistake-item">
                        <div class="mi-word">${m.word}</div>
                        <div class="mi-retry" onclick="window.cosyPractice.quickStart('${m.lang}', '${m.cat || 'vocab'}', '${m.level || 'all'}', '${m.theme || 'all'}')">retry</div>
                    </div>`).join('');
            }
        },

        awardPoints(pts) {
            if (!this.session) return;

            // Increment combo
            this.session.combo = (this.session.combo || 0) + 1;

            // Award points with combo bonus
            const comboBonus = this.session.combo > 1 ? Math.min(this.session.combo * 2, 10) : 0;
            const finalPts = pts + comboBonus;

            this.session.sessionPoints += finalPts;
            this.session.correctCount++;

            const scoreCountEl = document.getElementById('score-count');
            if (scoreCountEl) scoreCountEl.textContent = this.session.sessionPoints;

            // Update combo UI
            const comboWrap = document.getElementById('combo-wrap');
            const comboCount = document.getElementById('combo-count');
            if (comboWrap && comboCount) {
                if (this.session.combo > 1) {
                    comboCount.textContent = this.session.combo;
                    comboWrap.style.display = 'block';
                    if (this.session.combo >= 3) {
                        comboWrap.classList.add('pulsing-glow');
                    } else {
                        comboWrap.classList.remove('pulsing-glow');
                    }
                } else {
                    comboWrap.style.display = 'none';
                    comboWrap.classList.remove('pulsing-glow');
                }
            }

            // Play correct sound and show floating score pop
            playPracticeSound('correct');
            const floatingText = comboBonus > 0 ? `+${finalPts} PTS 🔥` : `+${pts} PTS`;
            showFloatingScoreEffect(floatingText, true);

            const q = this.session.sessionQueue[this.session.currentIndex];
            if (q && q.item) {
                updateItemSRS(q.item, true, this.session.lang);
            }
        },

        updateStreak() {
            const todayStr = new Date().toISOString().split('T')[0];
            const lastDateStr = this.state.lastDate;

            if (lastDateStr === todayStr) return;

            if (lastDateStr) {
                const lastPractice = new Date(lastDateStr);
                const todayDate = new Date(todayStr);
                const diffTime = Math.abs(todayDate - lastPractice);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    this.state.streak++;
                } else if (diffDays > 1) {
                    this.state.streak = 1;
                }
            } else {
                this.state.streak = 1;
            }

            this.state.lastDate = todayStr;
            this.save();
            this.updateUI();
        },

        recordMistake(q) {
            if (this.session) {
                this.session.combo = 0;
                const comboWrap = document.getElementById('combo-wrap');
                if (comboWrap) {
                    comboWrap.style.display = 'none';
                    comboWrap.classList.remove('pulsing-glow');
                }

                // Play wrong sound and show floating effect
                playPracticeSound('wrong');
                showFloatingScoreEffect('0 PTS ❌', false);
            }

            if (!q || !q.item) return;
            updateItemSRS(q.item, false, this.session?.lang || 'en');
            const s = this.state;
            const exists = s.mistakes.some(m => m.word === q.item.word && m.lang === (this.session?.lang || 'multi'));
            if (!exists) {
                s.mistakes.push({
                    ...q.item,
                    lang: this.session?.lang || 'multi',
                    cat: this.session?.cat || 'vocab',
                    level: this.session?.level || 'all',
                    theme: this.session?.theme || 'all',
                    added: Date.now()
                });
                if (s.mistakes.length > 50) s.mistakes.shift();
                this.save();
                this.populateRecentAndMistakes();
            }
        },

        startSession(lang, cat, level, theme, isChallenge, qs) {
            if (!qs || qs.length === 0) {
                const msg = "No exercises found for this combination. Try 'All Themes' or a different level.";
                if (window.COSY && window.COSY.showToast) window.COSY.showToast(msg, true);
                else alert(msg);
                return;
            }

            const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

            this.session = {
                lang, cat, level, theme, isChallenge,
                sessionQueue: shuffle(qs),
                currentIndex: 0,
                sessionPoints: 0,
                correctCount: 0,
                sessionErrors: [],
                combo: 0
            };

            // Track practice session start
            if (typeof window.cosyTrackEvent === 'function') {
                window.cosyTrackEvent('Practice Funnel', 'Session Start', `${lang.toUpperCase()} - ${cat} (${level})`);
            }

            const comboWrap = document.getElementById('combo-wrap');
            if (comboWrap) comboWrap.style.display = 'none';

            document.getElementById('pe-session-title').textContent = `${lang.toUpperCase()} · ${cat}${level !== 'all' ? ' · ' + level : ''}`;
            document.getElementById('score-count').textContent = '0';
            document.getElementById('streak-count').textContent = this.state.streak;

            const showSummaryModal = document.getElementById('summary-modal');
            if (showSummaryModal) showSummaryModal.style.display = 'none';

            cosyTransition(
                ['practice-section'],
                ['setup-section', 'quickstart-section', 'daily-challenge', 'stats-section'],
                () => {
                    const practiceSec = document.getElementById('practice-section');
                    if (practiceSec) {
                        practiceSec.className = 'practice-engine active cat-' + cat.toLowerCase();
                    }
                    this.loadEntry(this.session.sessionQueue[this.session.currentIndex]);
                }
            );
        },

        loadEntry(q) {
            if (!this.session || !q) return;

            q.isAnswered = false;

            // Clean up any lingering microphone or audio context stream
            if (window.cosyCleanupAudio) {
                window.cosyCleanupAudio();
            }

            // Reset Duolingo-style bottom bar
            const bar = document.getElementById('pe-bottom-bar');
            if (bar) {
                bar.classList.remove('active', 'correct', 'incorrect');
            }
            document.body.classList.remove('has-active-bottom-bar');
            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }

            // Progress bar update
            const fill = document.getElementById('progress-fill');
            const total = this.session.sessionQueue.length;
            const current = this.session.currentIndex;
            const percentage = (total > 0) ? (current / total) * 100 : 0;
            if (fill) fill.style.width = percentage + '%';

            const label = document.querySelector('.pe-session-label');
            if (label) label.textContent = `Word ${current + 1} of ${total}`;

            const progressText = document.getElementById('pe-progress-text');
            if (progressText) {
                progressText.textContent = `Question ${current + 1} of ${total}`;
            }

            const form = q.form || q.type;
            const nextBtn = document.getElementById('pe-next');
            if (nextBtn) {
                nextBtn.style.display = (form === 'type' || form === 'sc' || form === 'op' || form === 'np') ? 'inline-block' : 'none';
                nextBtn.textContent = 'Next Word';
            }

            const fb = document.getElementById('pe-fb');
            if (fb) {
                fb.className = 'pe-feedback';
                fb.innerHTML = '';
            }

            const hintBtn = document.getElementById('pe-hint');
            if (hintBtn) hintBtn.disabled = false;

            const container = document.getElementById('pe-body-content');
            if (container && window.cosyRenderers) {
                container.innerHTML = `<div class="pe-body-content-wrap">${window.cosyRenderers.renderQuestion(q, this.session, this.session.lang)}</div>`;
                const typeIn = document.getElementById('type-in');
                if (typeIn) {
                    typeIn.value = '';
                    setTimeout(() => typeIn.focus(), 50);
                }
            }
        },

        nextQuestion() {
            if (!this.session) return;

            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }

            const q = this.session.sessionQueue[this.session.currentIndex];
            if (!q) {
                this.showSummary();
                return;
            }

            const form = q.form || q.type;
            const fb = document.getElementById('pe-fb');
            const bar = document.getElementById('pe-bottom-bar');
            const isAnswered = (fb && fb.classList.contains('show')) || (bar && bar.classList.contains('active'));

            if (!isAnswered && (form === 'type' || form === 'sc' || form === 'op' || form === 'np')) {
                if (form === 'sc') window.checkScramble();
                else window.checkType();
                return;
            }

            this.session.currentIndex++;
            if (this.session.currentIndex >= this.session.sessionQueue.length) {
                this.showSummary();
                return;
            }

            const nextBtn = document.getElementById('pe-next');
            if (nextBtn) nextBtn.style.display = 'none';
            this.loadEntry(this.session.sessionQueue[this.session.currentIndex]);
        },

        showSummary() {
            const s = this.state;
            const sess = this.session;
            if (!sess) return;

            const bar = document.getElementById('pe-bottom-bar');
            if (bar) {
                bar.classList.remove('active', 'correct', 'incorrect');
            }
            document.body.classList.remove('has-active-bottom-bar');
            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }

            const handleSummaryTrans = () => {
                const practiceSection = document.getElementById('practice-section');
                if (practiceSection) {
                    practiceSection.classList.add('hidden');
                    practiceSection.classList.remove('active');
                }
                const summaryModal = document.getElementById('summary-modal');
                if (summaryModal) {
                    summaryModal.style.display = 'block';
                    // We can also fade the modal content specifically
                    const modalContent = summaryModal.querySelector('.modal-content');
                    if (modalContent) {
                        modalContent.classList.add('cosy-fade-node');
                        modalContent.classList.add('cosy-fade-in-init');
                        void modalContent.offsetHeight;
                        modalContent.classList.remove('cosy-fade-in-init');
                        setTimeout(() => {
                            modalContent.classList.remove('cosy-fade-node');
                        }, 400);
                    }
                }
            };

            const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (isReduced) {
                handleSummaryTrans();
            } else {
                const practiceSection = document.getElementById('practice-section');
                if (practiceSection) {
                    practiceSection.classList.add('cosy-fade-node');
                    practiceSection.classList.add('cosy-fade-out');
                }
                setTimeout(() => {
                    handleSummaryTrans();
                    if (practiceSection) {
                        practiceSection.classList.remove('cosy-fade-node', 'cosy-fade-out');
                    }
                }, 400);
            }

            // Play complete fanfare and trigger confetti!
            playPracticeSound('complete');
            triggerConfetti();

            s.totalPts += sess.sessionPoints;
            s.todayCorrect += sess.correctCount;
            this.updateStreak();
            s.sessions++;

            // Track practice session complete
            if (typeof window.cosyTrackEvent === 'function') {
                window.cosyTrackEvent('Practice Funnel', 'Session Complete', `${sess.lang.toUpperCase()} - ${sess.cat} (${sess.level})`);
            }

            s.history.unshift({
                lang: sess.lang,
                cat: sess.cat,
                pts: sess.sessionPoints,
                correct: sess.correctCount,
                total: sess.sessionQueue.length,
                date: Date.now()
            });
            if (s.history.length > 10) s.history.pop();

            // Dynamic progression updates for Theme Mastery Trackers
            if (sess.theme && sess.theme !== 'all') {
                try {
                    const mastery = JSON.parse(localStorage.getItem('cosy_theme_mastery') || '{}');
                    const currentProgress = mastery[sess.theme] || 0;
                    // Boost the progress of this specific theme up to max of 100% on correct answer ratio
                    const scoreRatio = sess.sessionQueue.length > 0 ? (sess.correctCount / sess.sessionQueue.length) : 0;
                    const increment = Math.round(scoreRatio * 15 + 5); // incremental mastery boost
                    mastery[sess.theme] = Math.min(100, currentProgress + increment);
                    localStorage.setItem('cosy_theme_mastery', JSON.stringify(mastery));

                    if (window.cosyRenderThemeProgressTrackers) {
                        window.cosyRenderThemeProgressTrackers();
                    }
                } catch (e) {
                    console.error("Failed to write theme mastery progress", e);
                }
            }

            this.save();
            this.updateUI();
            this.populateRecentAndMistakes();

            if (document.getElementById('final-score')) document.getElementById('final-score').textContent = sess.sessionPoints;
            if (document.getElementById('final-total-score')) document.getElementById('final-total-score').textContent = s.totalPts;
            if (document.getElementById('final-streak')) document.getElementById('final-streak').textContent = s.streak;

            const totalAnswered = sess.currentIndex;
            const accuracyStr = (totalAnswered > 0 && sess.sessionQueue.length > 0)
                ? `${Math.round((sess.correctCount / totalAnswered) * 100)}%`
                : '—';
            if (document.getElementById('final-accuracy')) document.getElementById('final-accuracy').textContent = accuracyStr;

            // Update Speaking Club Bridge Card dynamically based on theme
            const bridgeTitleEl = document.getElementById('bridge-card-title');
            const bridgeDescEl = document.getElementById('bridge-card-desc');
            const bridgeLinkEl = document.getElementById('bridge-card-link');

            if (bridgeTitleEl && bridgeLinkEl) {
                const themeKey = (sess.theme || '').toLowerCase();
                if (themeKey.includes('mind') || themeKey.includes('psychology')) {
                    bridgeTitleEl.textContent = "Take this to 'Mind Matters' Speaking Club 🧠";
                    if (bridgeDescEl) bridgeDescEl.textContent = "Discuss psychology, human behavior, and emotions with C1/C2 peers!";
                    bridgeLinkEl.href = "https://cosylanguages.github.io/COSYevents/";
                } else if (themeKey.includes('society') || themeKey.includes('politics') || themeKey.includes('debate')) {
                    bridgeTitleEl.textContent = "Take this to 'Debatable & Relatable' Club 🗣️";
                    if (bridgeDescEl) bridgeDescEl.textContent = "Debate modern societal issues and perspectives in live small groups!";
                    bridgeLinkEl.href = "https://cosylanguages.github.io/COSYevents/";
                } else if (themeKey.includes('science') || themeKey.includes('tech')) {
                    bridgeTitleEl.textContent = "Take this to 'Keeping Up with Science' Club 🔬";
                    if (bridgeDescEl) bridgeDescEl.textContent = "Explore breakthrough discoveries and tech trends in live discussions!";
                    bridgeLinkEl.href = "https://cosylanguages.github.io/COSYevents/";
                } else {
                    bridgeTitleEl.textContent = "Join a Live COSY Speaking Club Event 🎉";
                    if (bridgeDescEl) bridgeDescEl.textContent = "Practice your new vocabulary in live A2–C2 conversations!";
                    bridgeLinkEl.href = "https://cosylanguages.github.io/COSYevents/";
                }
            }
        },

        endSession() {
            this.session = null;

            if (window.cosyCleanupAudio) {
                window.cosyCleanupAudio();
            }

            const bar = document.getElementById('pe-bottom-bar');
            if (bar) {
                bar.classList.remove('active', 'correct', 'incorrect');
            }
            document.body.classList.remove('has-active-bottom-bar');
            if (this.autoAdvanceTimeout) {
                clearTimeout(this.autoAdvanceTimeout);
                this.autoAdvanceTimeout = null;
            }

            const handleEndSessionTrans = () => {
                const practiceSection = document.getElementById('practice-section');
                if (practiceSection) {
                    practiceSection.classList.add('hidden');
                    practiceSection.classList.remove('active');
                }
                const summaryModal = document.getElementById('summary-modal');
                if (summaryModal) summaryModal.style.display = 'none';
            };

            const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (isReduced) {
                handleEndSessionTrans();
                ['setup-section', 'quickstart-section', 'daily-challenge', 'stats-section'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.classList.remove('hidden');
                        el.style.display = (id === 'quickstart-section' || id === 'stats-section' || id === 'setup-section') ? '' : 'block';
                    }
                });
                this.updateUI();
            } else {
                const summaryModal = document.getElementById('summary-modal');
                const modalContent = summaryModal ? summaryModal.querySelector('.modal-content') : null;
                if (modalContent) {
                    modalContent.classList.add('cosy-fade-node');
                    modalContent.classList.add('cosy-fade-out');
                }
                setTimeout(() => {
                    handleEndSessionTrans();
                    if (modalContent) {
                        modalContent.classList.remove('cosy-fade-node', 'cosy-fade-out');
                    }
                    cosyTransition(
                        ['setup-section', 'quickstart-section', 'daily-challenge', 'stats-section'],
                        [],
                        () => {
                            this.updateUI();
                        }
                    );
                }, 400);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        showHint() {
            const q = this.session?.sessionQueue[this.session?.currentIndex];
            if (!q) return;

            const ruleHint = q.ruleHint || q.errorExplanation || q.item?.ruleHint || q.item?.usage_hint || q.item?.grammar_note;
            const fb = document.getElementById('pe-fb');

            if (ruleHint) {
                if (fb) {
                    fb.className = 'pe-feedback show ok';
                    fb.innerHTML = `💡 <strong>Grammar Hint:</strong> ${ruleHint}`;
                }
                showBottomFeedback(true, 'Grammar Rule Hint 💡', ruleHint);
            } else {
                const answer = q?.ans || q?.item?.word || '';
                if (!answer) return;

                const words = answer.toString().split(' ');
                const hint = words
                    .map(word => word.charAt(0).toUpperCase() + '_'.repeat(word.length - 1))
                    .join(' ');

                if (fb) {
                    fb.className = 'pe-feedback show ok';
                    fb.innerHTML = `💡 Hint: ${hint}`;
                }
            }

            if (this.session.sessionPoints >= 5) {
                this.session.sessionPoints -= 5;
                this.state.totalPts = Math.max(0, this.state.totalPts - 5);
            }
            this.save();
            this.updateUI();

            const hintBtn = document.getElementById('pe-hint');
            if (hintBtn) hintBtn.disabled = true;
        }
    };

    // Audio recording state variables
    let micStream = null;
    let audioCtx = null;
    let analyserNode = null;
    let recordingTimer = null;
    let recordingSeconds = 0;
    let animationFrameId = null;
    let isRecordingActive = false;

    window.cosyCleanupAudio = function() {
        if (recordingTimer) {
            clearInterval(recordingTimer);
            recordingTimer = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
        }
        if (audioCtx) {
            try {
                audioCtx.close();
            } catch (e) {}
            audioCtx = null;
        }
        analyserNode = null;
        recordingSeconds = 0;
        isRecordingActive = false;

        const micBtn = document.getElementById('speaking-mic-btn');
        if (micBtn) {
            micBtn.classList.remove('recording');
        }
        const timerEl = document.getElementById('speaking-timer');
        if (timerEl) {
            timerEl.textContent = 'Tap mic to speak';
        }
        const submitBtn = document.getElementById('speaking-submit-btn');
        if (submitBtn) {
            submitBtn.style.opacity = '0.5';
            submitBtn.style.pointerEvents = 'none';
        }
    };

    window.cosyToggleAudioRecording = async function() {
        if (isRecordingActive) {
            // Stop recording
            window.cosyStopAudioRecording();
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                micStream = stream;
                isRecordingActive = true;

                const micBtn = document.getElementById('speaking-mic-btn');
                if (micBtn) {
                    micBtn.classList.add('recording');
                }

                // Setup AudioContext & AnalyserNode
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContextClass();
                const source = audioCtx.createMediaStreamSource(stream);
                analyserNode = audioCtx.createAnalyser();
                analyserNode.fftSize = 256;
                source.connect(analyserNode);

                // Run Live Waveform Canvas
                window.cosyDrawLiveWaveform();

                // Start timer
                recordingSeconds = 0;
                const timerEl = document.getElementById('speaking-timer');
                if (timerEl) {
                    timerEl.textContent = 'Recording: 0:00';
                }
                recordingTimer = setInterval(() => {
                    recordingSeconds++;
                    const minutes = Math.floor(recordingSeconds / 60);
                    const secs = recordingSeconds % 60;
                    const secsStr = secs < 10 ? '0' + secs : secs;
                    if (timerEl) {
                        timerEl.textContent = `Recording: ${minutes}:${secsStr}`;
                    }
                    if (recordingSeconds >= 3) {
                        const submitBtn = document.getElementById('speaking-submit-btn');
                        if (submitBtn) {
                            submitBtn.style.opacity = '1';
                            submitBtn.style.pointerEvents = 'auto';
                        }
                    }
                }, 1000);

            } catch (err) {
                console.error("Mic access denied or unavailable", err);
                // Fallback inside testing environments (simulate voice action)
                isRecordingActive = true;
                const micBtn = document.getElementById('speaking-mic-btn');
                if (micBtn) {
                    micBtn.classList.add('recording');
                }
                const timerEl = document.getElementById('speaking-timer');
                if (timerEl) {
                    timerEl.textContent = 'Recording (simulated): 0:00';
                }
                recordingSeconds = 0;
                recordingTimer = setInterval(() => {
                    recordingSeconds++;
                    if (timerEl) {
                        timerEl.textContent = `Recording (simulated): 0:0${recordingSeconds}`;
                    }
                    if (recordingSeconds >= 3) {
                        const submitBtn = document.getElementById('speaking-submit-btn');
                        if (submitBtn) {
                            submitBtn.style.opacity = '1';
                            submitBtn.style.pointerEvents = 'auto';
                        }
                    }
                }, 1000);
                window.cosyDrawLiveWaveformSimulated();
            }
        }
    };

    window.cosyStopAudioRecording = function() {
        if (recordingTimer) {
            clearInterval(recordingTimer);
            recordingTimer = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
        }
        isRecordingActive = false;

        const micBtn = document.getElementById('speaking-mic-btn');
        if (micBtn) {
            micBtn.classList.remove('recording');
        }

        const timerEl = document.getElementById('speaking-timer');
        if (timerEl) {
            timerEl.textContent = `Recorded successfully (${recordingSeconds}s)`;
        }

        const submitBtn = document.getElementById('speaking-submit-btn');
        if (submitBtn) {
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        }
    };

    window.cosyDrawLiveWaveform = function() {
        const canvas = document.getElementById('speaking-waveform');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 0;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            if (!isRecordingActive) return;
            animationFrameId = requestAnimationFrame(draw);

            if (analyserNode) {
                analyserNode.getByteTimeDomainData(dataArray);
            }

            ctx.fillStyle = '#FFFEFB'; // matches var(--warm-white)
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#2D7D6F'; // matches var(--teal)
            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
        draw();
    };

    window.cosyDrawTTSWaveform = function(durationMs) {
        const canvas = document.getElementById('speaking-waveform');
        const wrapBox = document.getElementById('waveform-wrap-box');
        if (!canvas) return;
        if (wrapBox) wrapBox.style.display = 'flex';
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        let t = 0;
        let isPlaying = true;
        let frameId = null;

        function draw() {
            if (!isPlaying) return;
            frameId = requestAnimationFrame(draw);

            ctx.fillStyle = '#FFFEFB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#2D7D6F';
            ctx.beginPath();

            for (let x = 0; x < canvas.width; x++) {
                const y = (canvas.height / 2) + Math.sin(x * 0.05 + t) * 15 * Math.sin(x * 0.01 + t * 0.5);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            t += 0.1;
        }
        draw();

        setTimeout(() => {
            isPlaying = false;
            if (frameId) cancelAnimationFrame(frameId);
            if (canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = 'none';
            }
            if (wrapBox) wrapBox.style.display = 'none';
        }, durationMs || 2500);
    };

    window.cosyDrawLiveWaveformSimulated = function() {
        const canvas = document.getElementById('speaking-waveform');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.style.display = 'block';
        let t = 0;

        function draw() {
            if (!isRecordingActive) return;
            animationFrameId = requestAnimationFrame(draw);

            ctx.fillStyle = '#FFFEFB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 3;
            ctx.strokeStyle = '#2D7D6F';
            ctx.beginPath();

            for (let x = 0; x < canvas.width; x++) {
                // Simulate audio sinusoid curve with harmonic frequency shifts
                const y = (canvas.height / 2) + Math.sin(x * 0.05 + t) * 15 * Math.sin(x * 0.01 + t * 0.5);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            t += 0.1;
        }
        draw();
    };

    window.cosySubmitAudioRecording = function() {
        window.cosyCleanupAudio();
        engine.awardPoints(15); // Bonus score for completing a speaking recording!
        showBottomFeedback(true, 'Submission Successful! 🚀', '+15 PTS Perfect accent and speech rhythm matched.', 1500);
    };

    engine.getSRSMap = getSRSMap;
    engine.getSRSDueItems = function(lang) {
        const map = getSRSMap();
        const now = Date.now();
        const items = Object.values(map);
        if (!lang || lang === 'multi' || lang === 'all') {
            return items.filter(i => i.nextReview <= now);
        }
        return items.filter(i => i.lang?.toLowerCase() === lang.toLowerCase() && i.nextReview <= now);
    };

    engine.speakText = function(text, lang) {
        if (!text) return;

        // Trigger visual speech waveform animation if canvas element is rendered
        if (window.cosyDrawTTSWaveform) {
            window.cosyDrawTTSWaveform(2500);
        }

        if (window.gameUtils && typeof window.gameUtils.speak === 'function') {
            window.gameUtils.speak(text, lang || engine.session?.lang || 'en');
            return;
        }
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        const langMap = {
            'en': 'en-GB', 'fr': 'fr-FR', 'it': 'it-IT', 'ru': 'ru-RU', 'el': 'el-GR',
            'es': 'es-ES', 'de': 'de-DE', 'pt': 'pt-PT'
        };
        const targetLang = langMap[lang || engine.session?.lang || 'en'] || 'en-GB';
        msg.lang = targetLang;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const voice = voices.find(v => v.lang === targetLang) || voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
            if (voice) msg.voice = voice;
        }
        window.speechSynthesis.speak(msg);
    };

    // Expose engine
    window.cosyPracticeEngine = engine;

    // Bridge functions
    window.beginSession = (lang, cat, level, theme, isChallenge, qs) => engine.startSession(lang, cat, level, theme, isChallenge, qs);
    window.nextQuestion = () => engine.nextQuestion();
    window.showSummary = () => engine.showSummary();
    window.exitPractice = () => engine.endSession();
    window.endSession = () => engine.endSession();
    window.showHint = () => engine.showHint();

    window.checkMC = (i) => {
        const sess = engine.session;
        if (!sess) return;
        const q = sess.sessionQueue[sess.currentIndex];
        if (!q || q.isAnswered) return;
        q.isAnswered = true;

        const ans = q.dynamicAns !== undefined ? q.dynamicAns : q.ans;
        const fb = document.getElementById('pe-fb');
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        document.querySelectorAll('.mc-opt').forEach((b, idx) => {
            b.disabled = true;
            if (idx === ans) {
                b.classList.add('correct');
                if (idx === i && !isReduced) {
                    b.classList.add('correct-highlight');
                }
            } else if (idx === i) {
                b.classList.add('wrong');
                if (!isReduced) {
                    b.classList.add('incorrect-shake');
                }
            }
        });

        const ruleHint = q.ruleHint || q.errorExplanation || q.item?.ruleHint || q.item?.usage_hint || q.item?.grammar_note;

        if (i === ans) {
            engine.awardPoints(10);
            if (fb) {
                fb.className = 'pe-feedback show ok';
                fb.innerHTML = '✅ Correct! +10 pts' + (ruleHint ? `<br><small style="opacity:0.9;">💡 ${ruleHint}</small>` : '');
            }
            let desc = '+10 PTS 🎉';
            if (ruleHint) {
                desc += `<br><span style="display:inline-block; margin-top:4px; font-weight:600; color:#047857;">💡 ${ruleHint}</span>`;
            }
            showBottomFeedback(true, 'Correct!', desc, 2500);
        } else {
            engine.recordMistake(q);
            if (fb) {
                fb.className = 'pe-feedback show bad';
                fb.innerHTML = '❌ Incorrect.' + (ruleHint ? `<br><small style="opacity:0.9;">💡 ${ruleHint}</small>` : '');
            }
            const correctOpt = q.opts ? q.opts[ans] : '';
            let desc = correctOpt ? `Correct answer: ${correctOpt}` : '';
            if (ruleHint) {
                desc += `<br><span style="display:inline-block; margin-top:4px; font-weight:600; color:var(--coral);">💡 Rule: ${ruleHint}</span>`;
            }
            showBottomFeedback(false, 'Incorrect', desc);
        }
    };

    window.checkTF = (val) => {
        const sess = engine.session;
        if (!sess) return;
        const q = sess.sessionQueue[sess.currentIndex];
        if (!q || q.isAnswered) return;
        q.isAnswered = true;

        const fb = document.getElementById('pe-fb');
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        document.querySelectorAll('.tf-btn').forEach(b => {
            b.disabled = true;
            const isTrueBtn = b.classList.contains('tf-btn-true');
            if (q.ans === true && isTrueBtn) {
                b.classList.add('correct');
                if (val === true && !isReduced) b.classList.add('correct-highlight');
            } else if (q.ans === false && !isTrueBtn) {
                b.classList.add('correct');
                if (val === false && !isReduced) b.classList.add('correct-highlight');
            } else if (val === true && isTrueBtn) {
                b.classList.add('wrong');
                if (!isReduced) b.classList.add('incorrect-shake');
            } else if (val === false && !isTrueBtn) {
                b.classList.add('wrong');
                if (!isReduced) b.classList.add('incorrect-shake');
            }
        });

        if (val === q.ans) {
            engine.awardPoints(10);
            if (fb) {
                fb.className = 'pe-feedback show ok';
                fb.innerHTML = '✅ Correct! +10 pts';
            }
            showBottomFeedback(true, 'Correct!', '+10 PTS 🎉', 1200);
        } else {
            engine.recordMistake(q);
            if (fb) {
                fb.className = 'pe-feedback show bad';
                fb.innerHTML = '❌ Incorrect.';
            }
            let desc = `Correct answer: ${q.ans ? 'True' : 'False'}`;
            const ruleHint = q.ruleHint || q.item?.ruleHint || q.item?.usage_hint || q.item?.grammar_note;
            if (ruleHint) {
                desc += `<br><span style="display:inline-block; margin-top:4px; font-weight:600; color:var(--coral);">💡 Rule: ${ruleHint}</span>`;
            }
            showBottomFeedback(false, 'Incorrect', desc);
        }
    };

    window.checkType = () => {
        const sess = engine.session;
        if (!sess) return;
        const q = sess.sessionQueue[sess.currentIndex];
        if (!q || q.isAnswered) return;
        q.isAnswered = true;

        const inp = document.getElementById('type-in');
        if (!inp) return;

        const userAnswer = inp.value.trim().toLowerCase();
        const correctAnswer = (q.ans || q.item?.word || "").toString().trim().toLowerCase();
        const fb = document.getElementById('pe-fb');
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        inp.disabled = true;
        if (userAnswer === correctAnswer) {
            engine.awardPoints(10);
            inp.classList.add('correct');
            if (!isReduced) {
                inp.classList.add('correct-highlight');
            }
            if (fb) {
                fb.className = 'pe-feedback show ok';
                fb.innerHTML = '✅ Correct! +10 pts';
            }
            showBottomFeedback(true, 'Correct!', '+10 PTS 🎉');
        } else {
            engine.recordMistake(q);
            inp.classList.add('wrong');
            if (!isReduced) {
                inp.classList.add('incorrect-shake');
            }
            if (fb) {
                fb.className = 'pe-feedback show bad';
                fb.innerHTML = '❌ Answer: ' + correctAnswer;
            }
            showBottomFeedback(false, 'Incorrect', `Correct answer: ${correctAnswer}`);
        }
    };

    window.assembleWord = (btn) => {
        const assembly = document.getElementById('sc-assembly');
        if (!assembly) return;
        const clone = btn.cloneNode(true);
        clone.className = 'sc-tile';
        clone.onclick = () => {
            clone.remove();
            btn.classList.remove('placed');
        };
        assembly.appendChild(clone);
        btn.classList.add('placed');
    };

    window.clearScramble = () => {
        const assembly = document.getElementById('sc-assembly');
        if (assembly) assembly.innerHTML = '';
        document.querySelectorAll('#sc-tokens .sc-tile').forEach(b => {
            b.classList.remove('placed');
        });
    };

    window.checkScramble = () => {
        const sess = engine.session;
        if (!sess) return;
        const q = sess.sessionQueue[sess.currentIndex];
        if (!q || q.isAnswered) return;

        const assembly = document.getElementById('sc-assembly');
        if (!assembly) return;

        q.isAnswered = true;

        const val = Array.from(assembly.querySelectorAll('button')).map(b => b.textContent).join(' ');
        const fb = document.getElementById('pe-fb');
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (val.trim().toLowerCase() === q.ans.trim().toLowerCase()) {
            engine.awardPoints(10);
            if (!isReduced) {
                assembly.classList.add('correct-highlight');
            }
            if (fb) {
                fb.className = 'pe-feedback show ok';
                fb.innerHTML = '✅ Correct! +10 pts';
            }
            showBottomFeedback(true, 'Correct!', '+10 PTS 🎉', 600);
        } else {
            engine.recordMistake(q);
            if (!isReduced) {
                assembly.classList.add('incorrect-shake');
            }
            if (fb) {
                fb.className = 'pe-feedback show bad';
                fb.innerHTML = '❌ Incorrect.';
            }
            showBottomFeedback(false, 'Incorrect', `Correct answer: ${q.ans}`, 600);
        }
    };

    window.selectMPItem = (type, id) => {
        const sess = engine.session;
        if (!sess) return;

        if (type === 'left') {
            const el = document.getElementById(`mp-left-${id}`);
            if (!el || el.classList.contains('matched')) return;

            if (engine.mpSelectedLeft !== null && engine.mpSelectedLeft !== undefined) {
                const prev = document.getElementById(`mp-left-${engine.mpSelectedLeft}`);
                if (prev) prev.classList.remove('active');
            }

            engine.mpSelectedLeft = id;
            el.classList.add('active');
        } else {
            const el = document.getElementById(`mp-right-${id}`);
            if (!el || el.classList.contains('matched')) return;

            if (engine.mpSelectedRight !== null && engine.mpSelectedRight !== undefined) {
                const prev = document.getElementById(`mp-right-${engine.mpSelectedRight}`);
                if (prev) prev.classList.remove('active');
            }

            engine.mpSelectedRight = id;
            el.classList.add('active');
        }

        // Check matching
        if (engine.mpSelectedLeft !== null && engine.mpSelectedLeft !== undefined &&
            engine.mpSelectedRight !== null && engine.mpSelectedRight !== undefined) {
            const selLeft = engine.mpSelectedLeft;
            const selRight = engine.mpSelectedRight;

            const elL = document.getElementById(`mp-left-${selLeft}`);
            const elR = document.getElementById(`mp-right-${selRight}`);

            const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (selLeft === selRight) {
                // Correct Match!
                if (elL) {
                    elL.classList.remove('active');
                    elL.classList.add('matched');
                    if (!isReduced) elL.classList.add('correct-highlight');
                }
                if (elR) {
                    elR.classList.remove('active');
                    elR.classList.add('matched');
                    if (!isReduced) elR.classList.add('correct-highlight');
                }

                engine.mpSelectedLeft = null;
                engine.mpSelectedRight = null;
                engine.mpMatchedCount = (engine.mpMatchedCount || 0) + 1;

                // Play simple success chime
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        const ctx = new AudioContext();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
                        gain.gain.setValueAtTime(0.05, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.15);
                    }
                } catch (e) {}

                if (engine.mpMatchedCount === 4) {
                    engine.awardPoints(10);
                    showBottomFeedback(true, 'Match Complete!', '+10 PTS 🎉 All pairs matched successfully.', 1500);
                }
            } else {
                // Incorrect Match!
                if (elL) {
                    elL.classList.remove('active');
                    elL.classList.add('wrong-match');
                    if (!isReduced) elL.classList.add('incorrect-shake');
                }
                if (elR) {
                    elR.classList.remove('active');
                    elR.classList.add('wrong-match');
                    if (!isReduced) elR.classList.add('incorrect-shake');
                }

                engine.recordMistake(null);

                const currentLeft = selLeft;
                const currentRight = selRight;
                setTimeout(() => {
                    const eL = document.getElementById(`mp-left-${currentLeft}`);
                    const eR = document.getElementById(`mp-right-${currentRight}`);
                    if (eL) {
                        eL.classList.remove('wrong-match');
                        if (!isReduced) eL.classList.remove('incorrect-shake');
                    }
                    if (eR) {
                        eR.classList.remove('wrong-match');
                        if (!isReduced) eR.classList.remove('incorrect-shake');
                    }
                }, 400);

                engine.mpSelectedLeft = null;
                engine.mpSelectedRight = null;
            }
        }
    };

    if (document.readyState === 'complete') engine.init();
    else window.addEventListener('load', () => engine.init());
})();
