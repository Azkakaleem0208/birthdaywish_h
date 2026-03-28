
// React component for the "Crazy Party" Background
const PartyBackground = () => {
    const canvasRef = React.useRef(null);
    const [dimensions, setDimensions] = React.useState({ width: window.innerWidth, height: window.innerHeight });

    React.useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Particle system for floating "bubbles/balloons"
        const particles = [];
        const particleCount = 40;
        const colors = ['#ef4444', '#f87171', '#fee2e2', '#fbbf24', '#f59e0b', '#7f1d1d'];

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 200;
                this.size = Math.random() * 15 + 5;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.2;
                this.pulse = Math.random() * 0.02;
                this.pulseDir = 1;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                
                // Pulse effect
                this.opacity += this.pulse * this.pulseDir;
                if (this.opacity > 0.7 || this.opacity < 0.2) this.pulseDir *= -1;

                if (this.y + this.size < 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                
                // Add a little highlight for a "balloon" look
                ctx.beginPath();
                ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = this.opacity * 0.5;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Confetti burst every 4 seconds
        const burstConfetti = () => {
            if (typeof confetti === 'function') {
                // Left side burst
                confetti({
                    particleCount: 80,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: colors
                });
                // Right side burst
                confetti({
                    particleCount: 80,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: colors
                });
                // Center burst
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 100,
                        origin: { y: 0.7 },
                        colors: colors
                    });
                }, 500);
            }
        };

        const intervalId = setInterval(burstConfetti, 4000);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();
        burstConfetti(); // Initial burst

        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationFrameId);
            clearInterval(intervalId);
        };
    }, []);

    return React.createElement('canvas', {
        ref: canvasRef,
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.6
        }
    });
};

// Mount the component
const domContainer = document.querySelector('#party-root');
if (domContainer) {
    const root = ReactDOM.createRoot(domContainer);
    root.render(React.createElement(PartyBackground));
}

// Audio Control Logic
document.addEventListener('DOMContentLoaded', () => {
    const celebrateBtn = document.querySelector('#celebrate-btn');
    const audio = document.querySelector('#birthday-song');

    if (!celebrateBtn || !audio) return;

    const togglePlay = () => {
        if (audio.paused) {
            audio.play();
            celebrateBtn.childNodes[0].textContent = 'Pause Music ';
            celebrateBtn.querySelector('span').textContent = 'pause';
        } else {
            audio.pause();
            celebrateBtn.childNodes[0].textContent = 'Celebrate Now ';
            celebrateBtn.querySelector('span').textContent = 'celebration';
        }
    };

    celebrateBtn.addEventListener('click', togglePlay);

    // Surprise Section Logic
    const surpriseBox = document.querySelector('#surprise-box');
    const flipCard = document.querySelector('#flip-card');
    const mainCandle = document.querySelector('#main-candle');
    const wishMessage = document.querySelector('#wish-message');

    if (surpriseBox && flipCard) {
        surpriseBox.addEventListener('click', () => {
            flipCard.classList.toggle('flipped');
        });
    }

    if (mainCandle) {
        mainCandle.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't re-flip the card
            if (!mainCandle.classList.contains('blown')) {
                mainCandle.classList.add('blown');
                wishMessage.classList.remove('hidden');
                
                // Trigger a special confetti burst for the wish
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#ef4444', '#fbbf24', '#f59e0b']
                    });
                }
            }
        });
    }

    // Timeline Scroll Animation Logic
    const timelineCards = document.querySelectorAll('.timeline-card-container');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "-10% 0px -10% 0px"
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            } else {
                // Remove class to animate out (fade off) when scrolling past
                entry.target.classList.remove('reveal');
            }
        });
    }, observerOptions);

    timelineCards.forEach(card => {
        timelineObserver.observe(card);
    });
});
