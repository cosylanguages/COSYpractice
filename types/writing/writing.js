/**
 * js/practice/daily-challenge.js
 * Logic for the daily challenge feature, including streaks and point tracking.
 */
/**
 * DAILY CHALLENGE PAGE LOGIC
 * Handles level switching, timer, streak, and point tracking.
 */

(function() {
    function localDateKey(d) {
        const x = d || new Date();
        return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
    }
    let currentLevel = 'b';
    let currentChallenge = null;
    let timerInterval = null;
    let timeLeft = 120;
    const TOTAL_TIME = 120;
    let dailyCtx = null;   // { category, dayOfYear, today } for today
    let dailyData = null;  // today's data from COSY_DailySource, or null: the English DAILY_BANK is shown instead
    let rendered = false;

    // Load state from localStorage
    function loadState() {
        return {
            totalPts: parseInt(localStorage.getItem('cosy_total_points') || '0'),
            streak: parseInt(localStorage.getItem('practice_streak') || '0'),
            lastCompleted: localStorage.getItem('dc_last_completed') || '',
            weeklyProgress: JSON.parse(localStorage.getItem('dc_weekly_progress') || '[]')
        };
    }

    function saveState(state) {
        localStorage.setItem('cosy_total_points', state.totalPts);
        localStorage.setItem('practice_streak', state.streak);
        localStorage.setItem('dc_last_completed', state.lastCompleted);
        localStorage.setItem('dc_weekly_progress', JSON.stringify(state.weeklyProgress));
    }

    function init() {
        const today = new Date();
        const dayOfWeek = today.getDay();

        // Update header info
        const paintDate = () => {
            const code = (window.COSY_I18N && window.COSY_I18N.currentLang) || 'en';
            const loc = code === 'en' ? 'en-GB' : code;
            document.getElementById('dayBadge').textContent = today.toLocaleDateString(loc, { weekday: 'long' });
            document.getElementById('dateLine').textContent = today.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' });
        };
        paintDate();
        document.addEventListener('cosyI18nReady', paintDate);
        document.addEventListener('cosyLanguageChanged', paintDate);
        document.addEventListener('cosyI18nReady', updateUI);
        document.addEventListener('cosyLanguageChanged', updateUI);

        // Load Challenge
        const category = window.DAILY_SCHEDULE[dayOfWeek];
        const bank = window.DAILY_BANK[category];
        // Day of year cycles through the English bank, and picks from the data files
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        currentChallenge = bank[dayOfYear % bank.length];
        const source = window.COSY_DailySource;
        const pickIdx = source ? source.occurrenceIndex(today, window.DAILY_SCHEDULE) : dayOfYear;
        dailyCtx = { category: category, dayOfYear: dayOfYear, pickIdx: pickIdx, today: today };

        updateUI();
        renderWeekGrid();

        // Prompts and words come from the COSY data in the learner's language. The interface language is only known
        // once the i18n file has loaded (it announces itself with cosyI18nReady), so wait for that instead of loading
        // English first and flashing it. Without the i18n script there is nothing to wait for.
        document.addEventListener('cosyI18nReady', loadDaily);
        document.addEventListener('cosyLanguageChanged', loadDaily);
        if (!window.COSY_I18N) loadDaily();
        // never leave "Loading prompt..." on screen if the interface language never reports in
        setTimeout(function () { if (!rendered) loadDaily(); }, 4000);
    }

    let loadSeq = 0;
    function loadDaily() {
        const loadingEl = document.getElementById('speakingPrompt');
        if (loadingEl) loadingEl.textContent = label('ui.loading_prompt', 'Loading prompt...');
        const source = window.COSY_DailySource;
        if (!source || !dailyCtx) { renderChallenge(); return Promise.resolve(); }
        const lang = (window.COSY_I18N && window.COSY_I18N.currentLang) || 'en';
        const seq = ++loadSeq;  // a slower, older response must not overwrite a newer one
        return source.loadData(lang, dailyCtx.category, dailyCtx.today)
            .catch(function () { return null; })
            .then(function (data) {
                if (seq !== loadSeq) return;
                dailyData = data;
                renderChallenge();
            });
    }

    function label(key, fallback) {
        return (window.t && window.t(key)) || fallback;
    }

    function renderFlatChallenge(c) {
        document.getElementById('typeBadge').textContent = c.badge;
        document.getElementById('cardNum').textContent = c.id;
        document.getElementById('challengeTitle').textContent = c.title;
        document.getElementById('challengeSubtitle').textContent = c.subtitle;
        document.getElementById('speakingPrompt').textContent = c.prompt;
        document.getElementById('speakingTip').textContent = c.tip;
        document.getElementById('microLabel').textContent = label('ui.micro_task_4917', 'Micro-task');
        document.getElementById('microTitle').textContent = c.micro.title;
        document.getElementById('microInstruction').textContent = c.micro.instruction;
        document.getElementById('microExample').textContent = c.micro.example ? (label('daily.example', 'Example') + ': ' + c.micro.example) : '';
    }

    function renderChallenge() {
        rendered = true;
        const promptEl = document.getElementById('speakingPrompt');

        // data files first (learner's language); the English bank below is the fallback
        const source = window.COSY_DailySource;
        const flat = source && dailyData && dailyCtx ? source.buildChallenge(dailyCtx.category, dailyData, currentLevel, dailyCtx.dayOfYear, dailyCtx.pickIdx) : null;
        if (flat) { renderFlatChallenge(flat); return; }

        if (!currentChallenge || !currentChallenge.levels || !currentChallenge.levels[currentLevel]) {
            if (promptEl) promptEl.textContent = label('daily.prompt_unavailable', "Today's prompt is unavailable right now. Try again in a moment.");
            return;
        }

        document.getElementById('typeBadge').textContent = currentChallenge.title.split(' ')[0] + ' Challenge';
        document.getElementById('cardNum').textContent = '#' + currentChallenge.id;
        document.getElementById('challengeTitle').textContent = currentChallenge.title;
        document.getElementById('challengeSubtitle').textContent = currentChallenge.subtitle;

        const levelData = currentChallenge.levels[currentLevel];
        if (promptEl) promptEl.textContent = levelData?.prompt || label('daily.prompt_unavailable', "Today's prompt is unavailable right now. Try again in a moment.");
        document.getElementById('speakingTip').textContent = '💡 ' + label('daily.tip.label', 'Tip') + ': ' + (levelData?.tip || 'Focus on practice and consistency.');

        document.getElementById('microLabel').textContent = label('ui.micro_task_4917', 'Micro-task');
        document.getElementById('microTitle').textContent = levelData?.micro?.title || label('ui.quick_drill', 'Quick Drill');
        document.getElementById('microInstruction').textContent = levelData?.micro?.instruction || '';
        document.getElementById('microExample').textContent = levelData?.micro?.example ? (label('daily.example', 'Example') + ': ' + levelData.micro.example) : '';
    }

    function updateUI() {
        const state = loadState();
        const todayStr = localDateKey();

        document.getElementById('streakCount').textContent = state.streak;

        const todayPill = document.getElementById('todayPill');
        if (state.lastCompleted === todayStr) {
            todayPill.textContent = label('daily.challenge_complete', '✓ Challenge complete');
            document.getElementById('btnComplete').disabled = true;
            document.getElementById('btnComplete').textContent = label('daily.challenge_complete_today', '✓ Challenge completed for today');
        } else {
            todayPill.textContent = label('ui.today_s_task_pending_46ff', "⏳ Today's task pending");
        }
    }

    function renderWeekGrid() {
        const grid = document.getElementById('weekGrid');
        grid.innerHTML = '';
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const state = loadState();
        const today = new Date();
        const currentDay = today.getDay();

        // Get start of week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = localDateKey(date);
            const isDone = state.weeklyProgress.includes(dateStr);
            const isToday = i === currentDay;

            const cell = document.createElement('div');
            cell.className = 'day-cell';
            cell.innerHTML = `
                <div class="day-name">${dayNames[i]}</div>
                <div class="day-dot ${isDone ? 'done' : ''} ${isToday ? 'current' : ''}">
                    ${isDone ? '✓' : date.getDate()}
                </div>
            `;
            grid.appendChild(cell);
        }
    }

    window.setLevel = function(level) {
        currentLevel = level;
        document.querySelectorAll('.ltab').forEach(t => t.classList.remove('on'));
        document.getElementById('tab-' + level).classList.add('on');
        renderChallenge();
    };

    window.toggleMicro = function() {
        const block = document.querySelector('.micro-block');
        block.classList.toggle('open');
    };

    window.startTimer = function() {
        if (timerInterval) return;

        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('doneBanner').style.display = 'none';

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                stopTimer();
                document.getElementById('doneBanner').style.display = 'block';
            }
        }, 1000);
    };

    window.stopTimer = function() {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('startBtn').textContent = label('daily.resume', '▶ Resume');
        document.getElementById('stopBtn').disabled = true;
    };

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

        const pct = (timeLeft / TOTAL_TIME) * 100;
        document.getElementById('timerBar').style.width = pct + '%';
    }

    window.markComplete = function() {
        const state = loadState();
        const todayStr = localDateKey();

        if (state.lastCompleted === todayStr) return;

        // Update the canonical streak day shared with the practice engine.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = localDateKey(yesterday);
        const lastStreakDay = localStorage.getItem('last_practice_date') || '';

        if (lastStreakDay !== todayStr) {
            state.streak = lastStreakDay === yesterdayStr ? state.streak + 1 : 1;
            localStorage.setItem('last_practice_date', todayStr);
        }

        state.lastCompleted = todayStr;
        if (!state.weeklyProgress.includes(todayStr)) {
            state.weeklyProgress.push(todayStr);
        }

        saveState(state);
        updateUI();
        renderWeekGrid();

        // Success feedback
        const btn = document.getElementById('btnComplete');
        btn.textContent = label('daily.challenge_done', '🎉 Awesome! Challenge completed');
        btn.disabled = true;

        // Dispatch event for any listeners (like nav)
        document.dispatchEvent(new CustomEvent('cosyPointsUpdated', { detail: state }));
    };

    document.addEventListener('DOMContentLoaded', init);
})();
