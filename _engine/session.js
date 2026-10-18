// Practice session engine
// Manages state for a single practice session: score, streak, progress, current item.

const COSYSession = {
  language: null,
  level: null,
  type: null,
  items: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  startTime: null,

  init(language, level, type, items) {
    this.language = language;
    this.level = level;
    this.type = type;
    this.items = items;
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.startTime = Date.now();
  },

  current() {
    return this.items[this.currentIndex] || null;
  },

  advance() {
    this.currentIndex++;
  },

  isComplete() {
    return this.currentIndex >= this.items.length;
  },

  recordAnswer(correct) {
    if (correct) {
      this.score++;
      this.streak++;
    } else {
      this.streak = 0;
    }
  }
};
