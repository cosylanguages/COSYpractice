/**
 * Cognitive & Immersion Accelerator Page Initializer
 */
document.addEventListener('DOMContentLoaded', () => {
  const curveSlider = document.getElementById('curve-slider');
  if (curveSlider && typeof window.onSliderChange === 'function') {
    curveSlider.addEventListener('input', (e) => {
      window.onSliderChange(e.target.value);
    });
  }
});
