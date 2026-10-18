/**
 * js/practice/daily-challenge.js
 * Logic for the daily challenge feature, including streaks and point tracking.
 */
/**
 * DAILY CHALLENGE PAGE LOGIC
 * Handles level switching, timer, streak, and point tracking.
 */

(function() {
    let currentLevel = 'b';
    let currentChallenge = null;
    let timerInterval = null;
    let timeLeft = 120;
    const TOTAL_TIME = 120;

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
        const dateStr = today.toISOString().split('T')[0];

        // Update header info
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        document.getElementById('dayBadge').textContent = dayNames[dayOfWeek];
        document.getElementById('dateLine').textContent = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        // Load Challenge
        const category = window.DAILY_SCHEDULE[dayOfWeek];
        const bank = window.DAILY_BANK[category];
        // For simplicity, we use day of year to cycle through bank items if more than 1
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        currentChallenge = bank[dayOfYear % bank.length];

        renderChallenge();
        updateUI();
        renderWeekGrid();
    }

    function renderChallenge() {
        const promptEl = document.getElementById('speakingPrompt');

        if (!currentChallenge || !currentChallenge.levels || !currentChallenge.levels[currentLevel]) {
            if (promptEl) promptEl.textContent = "Today's prompt is unavailable right now. Try again in a moment.";
            return;
        }

        document.getElementById('typeBadge').textContent = currentChallenge.title.split(' ')[0] + ' Challenge';
        document.getElementById('cardNum').textContent = '#' + currentChallenge.id;
        document.getElementById('challengeTitle').textContent = currentChallenge.title;
        document.getElementById('challengeSubtitle').textContent = currentChallenge.subtitle;

        const levelData = currentChallenge.levels[currentLevel];
        if (promptEl) promptEl.textContent = levelData?.prompt || "Today's prompt is unavailable right now. Try again in a moment.";
        document.getElementById('speakingTip').textContent = '💡 Tip: ' + (levelData?.tip || 'Focus on practice and consistency.');

        document.getElementById('microLabel').textContent = 'Micro-task';
        document.getElementById('microTitle').textContent = levelData?.micro?.title || 'Quick Drill';
        document.getElementById('microInstruction').textContent = levelData?.micro?.instruction || '';
        document.getElementById('microExample').textContent = levelData?.micro?.example ? ('Example: ' + levelData.micro.example) : '';
    }

    function updateUI() {
        const state = loadState();
        const todayStr = new Date().toISOString().split('T')[0];

        document.getElementById('streakCount').textContent = state.streak;

        const todayPill = document.getElementById('todayPill');
        if (state.lastCompleted === todayStr) {
            todayPill.textContent = '✓ Challenge complete';
            document.getElementById('btnComplete').disabled = true;
            document.getElementById('btnComplete').textContent = '✓ Challenge completed for today';
        } else {
            todayPill.textContent = '⏳ Today\'s task pending';
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
            const dateStr = date.toISOString().split('T')[0];
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
        document.getElementById('startBtn').textContent = '▶ Resume';
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
        const todayStr = new Date().toISOString().split('T')[0];

        if (state.lastCompleted === todayStr) return;

        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (state.lastCompleted === yesterdayStr) {
            state.streak += 1;
        } else if (state.lastCompleted !== todayStr) {
            state.streak = 1;
        }

        state.lastCompleted = todayStr;
        state.totalPts += 50; // Daily challenge reward
        if (!state.weeklyProgress.includes(todayStr)) {
            state.weeklyProgress.push(todayStr);
        }

        saveState(state);
        updateUI();
        renderWeekGrid();

        // Update nav if exists
        const navPts = document.getElementById('nav-pts');
        if (navPts) navPts.textContent = state.totalPts.toLocaleString();

        // Success feedback
        const btn = document.getElementById('btnComplete');
        btn.textContent = '🎉 Awesome! +50 Points earned';
        btn.disabled = true;

        // Dispatch event for any listeners (like nav)
        document.dispatchEvent(new CustomEvent('cosyPointsUpdated', { detail: state }));
    };

    document.addEventListener('DOMContentLoaded', init);
})();
