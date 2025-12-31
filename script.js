const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

/* ========= Canvas ========= */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ========= 音效解鎖（桌機） ========= */
let soundUnlocked = false;

function unlockSound() {
    if (soundUnlocked) return;

    const unlock = new Audio("firework.wav");
    unlock.volume = 0;
    unlock.play().then(() => {
        unlock.pause();
        unlock.currentTime = 0;
        soundUnlocked = true;
    }).catch(() => {});
}

window.addEventListener("mousedown", unlockSound, { once: true });

/* ========= 煙花粒子 ========= */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.speed = Math.random() * 5 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.life = 100;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.life--;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let particles = [];

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;
    const colors = ["#ff3333", "#ffcc00", "#66ffcc", "#66ccff", "#ff66ff"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, color));
    }

    if (soundUnlocked) {
        const boom = new Audio("firework.wav");
        boom.volume = 0.4;
        boom.play().catch(() => {});
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

setInterval(createFirework, 900);
animate();

/* ========= 橫幅控制 ========= */
const banner = document.getElementById("banner");

function showBanner() {
    banner.classList.remove("show");
    void banner.offsetWidth; // 強制重繪，讓動畫可重播
    banner.classList.add("show");
}

/* 每 10 秒飛一次 */
setInterval(showBanner, 15000);

/* 頁面載入後 3 秒先飛一次 */
setTimeout(showBanner, 3000);
