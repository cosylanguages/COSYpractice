// COSY points scoring system

const COSYScorer = {
  basePoints: 10,
  streakBonus: 5,

  calculate(correct, streak) {
    if (!correct) return 0;
    return this.basePoints + (streak > 2 ? this.streakBonus * Math.floor(streak / 3) : 0);
  }
};
