/**
 * practice/_engine/progress.js
 *
 * Cross-course progress store (gap-analysis A4). Generalises the COSYtools
 * irregular-verbs SRS (practice/types in COSYtools/js/spaced_repetition.js)
 * to work across every course + level, and adds a level-up rule.
 *
 *  - Reuses the same SRS intervals [0,1,3,7,14,30] days and 0-5 mastery model.
 *  - Keys any item (lesson/unit/grammar point) by a string id tagged with
 *    {course, level} so it aggregates across the general, professional, spoken,
 *    exam, travelling and relocation tracks.
 *  - Level-up rule (mirrors Skyeng's guarantee, adapted for self-study):
 *        a CEFR level is "ready to level up" when
 *          (a) >= 80% of its lessons have been reviewed, AND
 *          (b) the average mastery of reviewed items is >= 3 (mature).
 *
 * Standalone + dependency-free. Consumed by practice/progress-dashboard.html
 * and available as window.COSYProgress for any practice type to record into.
 */
(function () {
    'use strict';

    var MASTERY_MAX = 5;
    var INTERVALS = [0, 1, 3, 7, 14, 30]; // days, indexed by mastery level
    var LEVEL_UP_REVIEW_PCT = 0.8;
    var LEVEL_UP_MIN_MASTERY = 3;

    // Safe storage: localStorage when available, in-memory fallback
    // (private browsing, blocked iframes, quota-exceeded).
    var _memStore = {};
    var _storage = {
        getItem: function (k) { try { return localStorage.getItem(k); } catch (e) { return _memStore[k] || null; } },
        setItem: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { _memStore[k] = v; } }
    };

    function CrossCourseProgress(opts) {
        opts = opts || {};
        this.progressKey = opts.progressKey || 'cosy-progress-v1';
        this.streakKey = opts.streakKey || 'cosy-progress-streak-v1';
        this.progress = this._load(this.progressKey, {});
        this.streak = this._load(this.streakKey, { streakDays: 0, lastDate: null, todayCount: 0 });
    }

    CrossCourseProgress.prototype._load = function (key, fallback) {
        try {
            var raw = _storage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    };

    CrossCourseProgress.prototype._save = function (key, value) {
        try { _storage.setItem(key, JSON.stringify(value)); }
        catch (e) { /* storage full or blocked */ }
    };

    function norm(id) { return String(id == null ? '' : id).trim().toLowerCase(); }

    // ---- SRS core (reused from COSYtools spaced_repetition.js) ----
    CrossCourseProgress.prototype.getItem = function (itemId) {
        var id = norm(itemId);
        return this.progress[id] || {
            masteryLevel: 0, dueDate: null,
            timesCorrect: 0, timesWrong: 0, lastSeen: null,
            course: null, level: null
        };
    };

    CrossCourseProgress.prototype.recordAnswer = function (itemId, isCorrect, meta) {
        var id = norm(itemId);
        var cur = this.getItem(id);
        var now = new Date();
        var newLevel = cur.masteryLevel;
        var daysToAdd = 1;

        if (isCorrect) {
            newLevel = Math.min(MASTERY_MAX, cur.masteryLevel + 1);
            daysToAdd = INTERVALS[newLevel] || 30;
        } else {
            newLevel = Math.max(0, cur.masteryLevel - 1);
            daysToAdd = INTERVALS[newLevel] || 1;
        }
        var due = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        this.progress[id] = {
            masteryLevel: newLevel,
            dueDate: due.toISOString(),
            timesCorrect: cur.timesCorrect + (isCorrect ? 1 : 0),
            timesWrong: cur.timesWrong + (isCorrect ? 0 : 1),
            lastSeen: now.toISOString(),
            course: (meta && meta.course) || cur.course || null,
            level: (meta && meta.level) || cur.level || null
        };
        this._save(this.progressKey, this.progress);
        return this.progress[id];
    };

    // ---- Streaks (reused) ----
    CrossCourseProgress.prototype.recordSessionCompletion = function () {
        var today = new Date().toISOString().split('T')[0];
        if (this.streak.lastDate === today) {
            this.streak.todayCount += 1;
        } else {
            var yest = new Date(); yest.setDate(yest.getDate() - 1);
            var yestStr = yest.toISOString().split('T')[0];
            this.streak.streakDays = (this.streak.lastDate === yestStr)
                ? this.streak.streakDays + 1 : 1;
            this.streak.lastDate = today;
            this.streak.todayCount = 1;
        }
        this._save(this.streakKey, this.streak);
    };

    CrossCourseProgress.prototype.getStreakInfo = function () {
        var today = new Date().toISOString().split('T')[0];
        if (this.streak.lastDate && this.streak.lastDate !== today) {
            var yest = new Date(); yest.setDate(yest.getDate() - 1);
            if (this.streak.lastDate !== yest.toISOString().split('T')[0]) {
                this.streak.streakDays = 0;
            }
            this.streak.todayCount = 0;
        }
        return { streakDays: this.streak.streakDays || 0, todayCount: this.streak.todayCount || 0 };
    };

    // ---- Cross-course aggregation + level-up rule ----
    /**
     * Summarise a single CEFR level within a course.
     * @param totalLessons total lesson count for this course+level
     *   (from data/levels/cefr-outcomes.json). If unknown, uses the count
     *   of distinct reviewed items.
     */
    CrossCourseProgress.prototype.getLevelStatus = function (course, level, totalLessons) {
        var reviewed = [];
        var courseLc = norm(course), levelUp = String(level).toUpperCase();
        for (var id in this.progress) {
            var it = this.progress[id];
            if (it.course === courseLc && it.level === levelUp) reviewed.push(it);
        }
        var reviewedCount = reviewed.length;
        var denom = totalLessons && totalLessons > 0 ? totalLessons : reviewedCount;
        var masterySum = reviewed.reduce(function (s, it) { return s + (it.masteryLevel || 0); }, 0);
        var masteryAvg = reviewedCount ? masterySum / reviewedCount : 0;
        var matureCount = reviewed.filter(function (it) { return (it.masteryLevel || 0) >= LEVEL_UP_MIN_MASTERY; }).length;
        var reviewPct = denom ? reviewedCount / denom : 0;
        var readyToLevelUp = reviewedCount > 0
            && reviewPct >= LEVEL_UP_REVIEW_PCT
            && masteryAvg >= LEVEL_UP_MIN_MASTERY;
        return {
            course: courseLc, level: levelUp,
            reviewed: reviewedCount, total: denom,
            reviewPct: Math.round(reviewPct * 100),
            masteryAvg: Math.round(masteryAvg * 10) / 10,
            mature: matureCount, readyToLevelUp: readyToLevelUp
        };
    };

    CrossCourseProgress.prototype.getCourseSummary = function (course, levels) {
        // levels: [{level, totalLessons}, ...] from CEFR outcomes
        var self = this;
        return (levels || []).map(function (lv) {
            return self.getLevelStatus(course, lv.level, lv.totalLessons);
        });
    };

    // ---- Seed/demo helper ----
    // Seeds `count` items, each reviewed up to `masteryTarget` times (correct),
    // so a level can be demoed as mature/ready-to-level-up.
    CrossCourseProgress.prototype.seedDemo = function (course, level, count, correctRatio, masteryTarget) {
        masteryTarget = masteryTarget || 1;
        for (var i = 1; i <= count; i++) {
            var id = course + ':' + level + ':L' + i;
            var ok = Math.random() < correctRatio;
            var reps = ok ? Math.max(1, masteryTarget) : 1;
            for (var r = 0; r < reps; r++) {
                this.recordAnswer(id, r < reps - 1 ? true : ok, { course: course, level: level });
            }
        }
    };

    CrossCourseProgress.prototype.reset = function () {
        this.progress = {};
        this.streak = { streakDays: 0, lastDate: null, todayCount: 0 };
        this._save(this.progressKey, this.progress);
        this._save(this.streakKey, this.streak);
    };

    window.COSYProgress = CrossCourseProgress;
})();
