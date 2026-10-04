// Matrix rain effect
let animationInterval = null;
let resizeHandler = null;

export function initMatrixRain() {
    const canvas = document.querySelector('.matrix-rain');
    if (!canvas) return;

    // Clear any existing animation interval
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Reduced motion: no falling rain, just the still background
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animationInterval = setInterval(() => { if (!document.hidden) drawMatrix(); }, 33);
    }

    // Handle window resize (one listener, replaced on re-init)
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = () => {
        resizeCanvas();
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    };
    window.addEventListener('resize', resizeHandler);
}
