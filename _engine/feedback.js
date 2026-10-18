// Feedback and hint system
// All hints are in the target language. No translation fallback.
// Navigation hints use emojis so they are language-independent.

const COSYFeedback = {
  correct: ['✅', '⭐', '🎉', '💚', '🌟'],
  incorrect: ['❌', '💭', '🔄', '💡'],

  showHint(hintText, hintEmoji) {
    // hintText must already be in the target language
    const el = document.getElementById('cosy-hint');
    if (el) {
      el.textContent = (hintEmoji || '💡') + ' ' + hintText;
      el.style.display = 'block';
    }
  },

  showResult(correct) {
    const icons = correct ? this.correct : this.incorrect;
    return icons[Math.floor(Math.random() * icons.length)];
  }
};
