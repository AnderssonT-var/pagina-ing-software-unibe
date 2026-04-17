window.addEventListener("load", () => {

// Controla la pantalla de carga y su progreso visual.
const intro = document.getElementById("intro");
const bar = document.getElementById("progress");
let progress = 0;

const interval = setInterval(() => {
  progress += 5;
  bar.style.width = progress + "%";
  if (progress >= 100) {
    clearInterval(interval);
    setTimeout(() => {
      intro.style.opacity = "0";
      intro.style.transition = "1s";
      setTimeout(() => (intro.style.display = "none"), 1000);
    }, 500);
  }
}, 100);

setTimeout(() => (intro.style.display = "none"), 4000);

// Efecto matrix en canvas para el fondo del intro.
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
for (let i = 0; i < columns; i++) drops[i] = 1;

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00e0ff";
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(draw, 33);

// Fondo principal estilo hacker/dev con lluvia de caracteres y lineas de codigo.
const bgCanvas = document.getElementById("bg");
const bgCtx = bgCanvas.getContext("2d");
const codeChars = "01{}[]<>/\\$#_*+=-;:()functionconstletvar";
const codeSnippets = [
  "const app = initSystem();",
  "if (isAuthenticated) deployBuild();",
  "SELECT * FROM users WHERE active = 1;",
  "npm run build && npm run test",
  "git commit -m \"hotfix: patch security\"",
  "while(true){ monitorNetwork(); }",
  "class SecureGateway extends Node {}",
  "await api.post('/logs', payload);"
];
let streamColumns = [];
let streamSpacing = 16;
let streamFontSize = 15;
let codeTickers = [];

function createTicker() {
  const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  return {
    text,
    x: Math.random() * (bgCanvas.width + 400) - 200,
    y: Math.random() * bgCanvas.height,
    speed: 0.25 + Math.random() * 0.45,
    alpha: 0.08 + Math.random() * 0.12
  };
}

function resetCodeBackground() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  streamColumns = new Array(Math.ceil(bgCanvas.width / streamSpacing))
    .fill(0)
    .map(() => Math.random() * (bgCanvas.height / streamFontSize));
  codeTickers = new Array(10).fill(0).map(() => createTicker());
}

function drawCodeBackground() {
  bgCtx.fillStyle = "rgba(2, 8, 18, 0.18)";
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  const overlay = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
  overlay.addColorStop(0, "rgba(8, 40, 65, 0.08)");
  overlay.addColorStop(1, "rgba(0, 0, 0, 0.25)");
  bgCtx.fillStyle = overlay;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  bgCtx.font = `${streamFontSize}px monospace`;
  bgCtx.textBaseline = "top";

  for (let i = 0; i < streamColumns.length; i++) {
    const char = codeChars.charAt(Math.floor(Math.random() * codeChars.length));
    const x = i * streamSpacing;
    const y = streamColumns[i] * streamFontSize;
    const glow = 0.25 + Math.random() * 0.45;

    bgCtx.shadowBlur = 10;
    bgCtx.shadowColor = "rgba(75, 255, 210, 0.55)";
    bgCtx.fillStyle = `rgba(115, 255, 225, ${glow})`;
    bgCtx.fillText(char, x, y);

    if (Math.random() > 0.992) {
      bgCtx.fillStyle = "rgba(220, 255, 248, 0.92)";
      bgCtx.fillText(char, x, y);
    }

    if (y > bgCanvas.height && Math.random() > 0.974) {
      streamColumns[i] = -6;
    } else {
      streamColumns[i] += 1;
    }
  }

  bgCtx.shadowBlur = 0;
  bgCtx.font = "13px monospace";
  codeTickers.forEach((ticker) => {
    bgCtx.fillStyle = `rgba(120, 220, 255, ${ticker.alpha})`;
    bgCtx.fillText(ticker.text, ticker.x, ticker.y);
    ticker.x += ticker.speed;
    if (ticker.x > bgCanvas.width + 120) {
      ticker.x = -Math.max(260, ticker.text.length * 8);
      ticker.y = Math.random() * bgCanvas.height;
      ticker.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      ticker.speed = 0.25 + Math.random() * 0.45;
      ticker.alpha = 0.08 + Math.random() * 0.12;
    }
  });

  requestAnimationFrame(drawCodeBackground);
}

resetCodeBackground();
window.addEventListener("resize", resetCodeBackground);
drawCodeBackground();

// Aparicion progresiva de tarjetas cuando entran en viewport.
const cards = document.querySelectorAll(".menu-card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("show"), index * 120);
      }
    });
  },
  { threshold: 0.25 }
);

cards.forEach((card) => observer.observe(card));

// Expande/colapsa submenu al hacer click en cada tarjeta.
document.querySelectorAll(".menu-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("expanded");
  });
});

});
