import { initMatrixRain } from './matrix.js';

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize page state - ensures everything is visible on load/back navigation
function initializePage() {
    const choiceScreen = document.getElementById('choiceScreen');
    const redOutcome = document.getElementById('redOutcome');
    const blueOutcome = document.getElementById('blueOutcome');

    // Reset choice screen to visible state
    if (choiceScreen) {
        choiceScreen.style.display = 'block';
        choiceScreen.style.opacity = '1';
        choiceScreen.style.transition = 'opacity 1s ease-in';
    }

    // Hide outcome screens
    if (redOutcome) {
        redOutcome.classList.remove('active');
        redOutcome.style.display = 'none';
    }

    if (blueOutcome) {
        blueOutcome.classList.remove('active');
        blueOutcome.style.display = 'none';
    }

    // Initialize matrix rain effect
    initMatrixRain();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    // DOM already loaded (e.g., back navigation)
    initializePage();
}

// Handle pageshow event (fires on back/forward navigation)
window.addEventListener('pageshow', (event) => {
    // If page was loaded from cache (back navigation)
    if (event.persisted) {
        initializePage();
    }
});

// Pill choice logic: red pill -> /red, blue pill -> /blue
function choosePill(color) {
    const choiceScreen = document.getElementById('choiceScreen');
    const target = color === 'red' ? '/red' : '/blue';

    if (!choiceScreen || reduceMotion()) {
        window.location.href = target;
        return;
    }

    // Add transition effect
    choiceScreen.style.opacity = '0';
    choiceScreen.style.transition = 'opacity 1s ease-out';

    // Wait for fade out animation
    setTimeout(() => { window.location.href = target; }, 1000);
}

function goBack() {
    initializePage();
}

document.querySelectorAll('[data-pill]').forEach((pill) => {
    pill.addEventListener('click', () => choosePill(pill.dataset.pill));
});
document.querySelectorAll('[data-back]').forEach((btn) => btn.addEventListener('click', goBack));
