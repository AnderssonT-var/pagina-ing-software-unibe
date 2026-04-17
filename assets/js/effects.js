window.addEventListener("load", () => {

// Controla la pantalla de carga y su progreso visual.
const intro = document.getElementById("intro");
const bar = document.getElementById("progress");
let arcadePerformanceMode = false;

window.addEventListener("arcade:performance", (event) => {
  arcadePerformanceMode = Boolean(event?.detail?.enabled);
});

if (intro && bar) {
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
}

// Efecto matrix en canvas para el fondo del intro.
const canvas = document.getElementById("matrix");
if (canvas) {
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
}

// Fondo principal estilo hacker/dev con lluvia de caracteres y lineas de codigo.
const bgCanvas = document.getElementById("bg");
if (bgCanvas) {
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
    "await api.post('/logs', payload);",
  ];

  let streamColumns = [];
  const streamSpacing = 11;   // columnas mas juntas = mas densidad
  const streamFontSize = 13;
  let codeTickers = [];

  function createTicker() {
    const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    return {
      text,
      x: Math.random() * (bgCanvas.width + 400) - 200,
      y: Math.random() * bgCanvas.height,
      speed: 0.3 + Math.random() * 0.55,
      alpha: 0.14 + Math.random() * 0.20  // mas visibles
    };
  }

  function resetCodeBackground() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    streamColumns = new Array(Math.ceil(bgCanvas.width / streamSpacing))
      .fill(0)
      .map(() => Math.random() * (bgCanvas.height / streamFontSize));
    codeTickers = new Array(22).fill(0).map(() => createTicker()); // mas tickers
  }

  function drawCodeBackground() {
    if (arcadePerformanceMode) {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      requestAnimationFrame(drawCodeBackground);
      return;
    }

    // Trail mas corto = caracteres mas persistentes = fondo mas lleno
    bgCtx.fillStyle = "rgba(2, 8, 18, 0.12)";
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    const overlay = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
    overlay.addColorStop(0, "rgba(8, 40, 65, 0.06)");
    overlay.addColorStop(1, "rgba(0, 0, 0, 0.18)");
    bgCtx.fillStyle = overlay;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    bgCtx.font = `${streamFontSize}px monospace`;
    bgCtx.textBaseline = "top";

    for (let i = 0; i < streamColumns.length; i++) {
      const char = codeChars.charAt(Math.floor(Math.random() * codeChars.length));
      const x = i * streamSpacing;
      const y = streamColumns[i] * streamFontSize;
      const glow = 0.35 + Math.random() * 0.55; // mas brillo

      bgCtx.shadowBlur = 12;
      bgCtx.shadowColor = "rgba(75, 255, 210, 0.65)";
      bgCtx.fillStyle = `rgba(115, 255, 225, ${glow})`;
      bgCtx.fillText(char, x, y);

      // destellos blancos mas frecuentes
      if (Math.random() > 0.984) {
        bgCtx.fillStyle = "rgba(220, 255, 248, 0.94)";
        bgCtx.fillText(char, x, y);
      }

      if (y > bgCanvas.height && Math.random() > 0.968) {
        streamColumns[i] = -6;
      } else {
        streamColumns[i] += 1;
      }
    }

    bgCtx.shadowBlur = 0;
    bgCtx.font = "12px monospace";
    codeTickers.forEach((ticker) => {
      bgCtx.fillStyle = `rgba(120, 220, 255, ${ticker.alpha})`;
      bgCtx.fillText(ticker.text, ticker.x, ticker.y);
      ticker.x += ticker.speed;
      if (ticker.x > bgCanvas.width + 120) {
        ticker.x = -Math.max(260, ticker.text.length * 8);
        ticker.y = Math.random() * bgCanvas.height;
        ticker.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        ticker.speed = 0.3 + Math.random() * 0.55;
        ticker.alpha = 0.14 + Math.random() * 0.20;
      }
    });

    requestAnimationFrame(drawCodeBackground);
  }

  resetCodeBackground();
  window.addEventListener("resize", resetCodeBackground);
  drawCodeBackground();
}

// Mejoras visuales con Anime.js (si la libreria esta disponible).
function initAnimeEnhancements() {
  if (typeof window.anime !== "function") return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = Array.from(document.querySelectorAll(".menu-card"));

  // Efecto wipe cinematografico en el titulo: barre de izquierda a derecha
  // con un glow flash al terminar, sin romper el gradiente ni el texto.
  const heroH1 = document.querySelector(".hero h1");
  const heroP  = document.querySelector(".hero p");

  if (heroH1) {
    heroH1.style.opacity = "1";

    // Wiper: barra de luz que cruza por encima del titulo.
    const wiper = document.createElement("span");
    wiper.className = "title-wiper";
    heroH1.style.position = "relative";
    heroH1.style.overflow = "hidden";
    heroH1.appendChild(wiper);

    window.anime
      .timeline({ easing: "easeInOutQuart" })
      .add({
        targets: heroH1,
        clipPath: ["inset(0 102% 0 0)", "inset(0 0% 0 0)"],
        translateY: [16, 0],
        duration: 920,
        begin: () => { heroH1.style.opacity = "1"; }
      })
      .add(
        {
          targets: wiper,
          left: ["-18%", "118%"],
          duration: 880,
          easing: "easeInOutQuart"
        },
        "-=920"
      )
      .add(
        {
          targets: heroH1,
          scale: [1, 1.024, 1],
          filter: [
            "drop-shadow(0 0 0px rgba(0,224,255,0))",
            "drop-shadow(0 0 28px rgba(0,224,255,0.72)) drop-shadow(0 0 54px rgba(140,80,255,0.44))",
            "drop-shadow(0 0 10px rgba(0,210,255,0.28)) drop-shadow(0 0 22px rgba(60,190,255,0.2))"
          ],
          duration: 640,
          easing: "easeOutExpo",
          complete: () => wiper.remove()
        },
        "-=120"
      );
  }

  // Efecto "sistema roto" al hacer click en el titulo.
  if (heroH1) {
    heroH1.style.cursor = "pointer";
    let crashRunning = false;

    heroH1.addEventListener("click", () => {
      if (crashRunning) return;
      crashRunning = true;

      const body = document.body;
      const heroSection = document.querySelector(".hero");
      const originalText = heroH1.textContent;

      // Overlay de estática/ruido
      const staticOverlay = document.createElement("div");
      staticOverlay.style.cssText = `
        position:fixed; inset:0; z-index:9999; pointer-events:none;
        background: repeating-linear-gradient(
          0deg,
          rgba(0,255,80,0.04) 0px, rgba(0,255,80,0.04) 1px,
          transparent 1px, transparent 4px
        );
        mix-blend-mode: screen;
      `;
      document.body.appendChild(staticOverlay);

      // Pantalla de error tipo BSOD
      const errorScreen = document.createElement("div");
      errorScreen.style.cssText = `
        position:fixed; inset:0; z-index:10000; pointer-events:none;
        background:#0a0a0a; display:flex; flex-direction:column;
        align-items:center; justify-content:center; opacity:0;
        font-family:monospace; color:#00ff41;
      `;
      errorScreen.innerHTML = `
        <div style="font-size:clamp(1rem,3vw,2rem);font-weight:bold;color:#ff003c;margin-bottom:16px;">
          !! SYSTEM FAILURE !!
        </div>
        <div style="font-size:clamp(0.6rem,1.4vw,1rem);line-height:1.9;text-align:left;max-width:520px;color:#00ff41;">
          KERNEL_PANIC: 0x0000C2<br>
          MEMORY_EXCEPTION at 0xFFFF8000<br>
          Stack trace corrupted...<br>
          Dumping registers...<br>
          <span style="color:#ff003c;">ACCESS VIOLATION — CRITICAL PROCESS DIED</span><br>
          Attempting recovery...
        </div>
        <div style="margin-top:28px;font-size:clamp(0.7rem,1.2vw,0.95rem);color:#555;">
          Press any key to restart... <span style="color:#00ff41;">█</span>
        </div>
      `;
      document.body.appendChild(errorScreen);

      // Lineas de glitch sobre el hero
      const lines = [];
      for (let i = 0; i < 8; i++) {
        const l = document.createElement("div");
        l.className = "hack-glitch-line";
        l.style.top  = `${Math.random() * 96}%`;
        l.style.width = `${40 + Math.random() * 55}%`;
        l.style.left  = `${Math.random() * 25}%`;
        l.style.height = "2px";
        if (heroSection) heroSection.appendChild(l);
        lines.push(l);
      }

      // Timeline de colapso
      window.anime.timeline({ easing: "easeOutQuad" })
        // 1. Titulo tiembla y se distorsiona
        .add({
          targets: heroH1,
          translateX: [0, -12, 10, -8, 6, -4, 0],
          skewX:      [0,  -8,  6, -4,  3,  0],
          scale:      [1, 1.04, 0.97, 1.02, 1],
          color:      ["", "#ff003c"],
          filter:     ["none", "blur(2px) brightness(1.8)"],
          duration:   420,
          easing: "easeInOutSine",
        })
        // 2. Shake del body
        .add({
          targets: body,
          translateX: [0, -9, 7, -5, 3, -2, 0],
          duration: 420,
          easing: "easeInOutSine"
        }, "-=420")
        // 3. Lineas de glitch
        .add({
          targets: lines,
          opacity: [0, 0.95, 0],
          translateX: () => [0, window.anime.random(-280, 280)],
          delay: window.anime.stagger(40),
          duration: 280,
        }, "-=300")
        // 4. Texto se rompe en binario caótico
        .add({
          targets: heroH1,
          duration: 1,
          begin: () => {
            let scrambleFrame;
            const chaos = "01#@!%$&*?<>{}[]░▒▓█";
            let tick = 0;
            function scramble() {
              heroH1.textContent = originalText.split("").map(ch =>
                ch === " " ? " " : chaos[Math.floor(Math.random() * chaos.length)]
              ).join("");
              tick++;
              if (tick < 22) scrambleFrame = requestAnimationFrame(scramble);
            }
            scramble();
          }
        })
        // 5. Pantalla de error aparece
        .add({
          targets: errorScreen,
          opacity: [0, 1],
          duration: 180,
        })
        // 6. Mantiene pantalla de error ~1.4s
        .add({
          targets: errorScreen,
          opacity: 1,
          duration: 1400,
        })
        // 7. Pantalla de error desaparece con glitch
        .add({
          targets: errorScreen,
          opacity: [1, 0],
          translateY: [0, -18],
          duration: 320,
          complete: () => errorScreen.remove()
        })
        // 8. Overlay de estática se disuelve
        .add({
          targets: staticOverlay,
          opacity: [1, 0],
          duration: 480,
          complete: () => staticOverlay.remove()
        }, "-=200")
        // 9. Titulo se recupera letra a letra
        .add({
          targets: heroH1,
          duration: 1,
          begin: () => {
            const chaos = "01#@!%$&*?<>{}";
            let resolved = 0;
            const total = originalText.length;
            const RESOLVE_MS = 700;
            const startT = Date.now();
            function resolve() {
              const p = Math.min((Date.now() - startT) / RESOLVE_MS, 1);
              resolved = Math.floor(p * total);
              heroH1.textContent = originalText.split("").map((ch, i) => {
                if (ch === " ") return " ";
                if (i < resolved) return originalText[i];
                return chaos[Math.floor(Math.random() * chaos.length)];
              }).join("");
              if (p < 1) requestAnimationFrame(resolve);
              else heroH1.textContent = originalText;
            }
            resolve();
          }
        })
        // 10. Titulo vuelve a su estado visual normal
        .add({
          targets: heroH1,
          color:  "#ffffff",
          filter: "none",
          translateX: 0,
          skewX: 0,
          scale: 1,
          duration: 480,
          easing: "easeOutExpo",
          complete: () => {
            heroH1.style.color  = "";
            heroH1.style.filter = "";
            lines.forEach(l => l.remove());
            crashRunning = false;
          }
        }, "-=300");
    });
  }

  window.anime
    .timeline({ easing: "easeOutExpo" })
    .add(
      {
        targets: heroP,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 680
      },
      heroH1 ? "+=20" : "0"
    )
    .add(
      {
        targets: cards,
        opacity: [0, 1],
        translateY: [34, 0],
        rotateX: [10, 0],
        scale: [0.94, 1],
        delay: window.anime.stagger(90),
        duration: 760
      },
      "-=360"
    );

  window.anime({
    targets: ".card-icon",
    scale: [1, 1.1],
    rotateZ: [0, 2],
    direction: "alternate",
    easing: "easeInOutSine",
    delay: window.anime.stagger(120),
    duration: 1500,
    loop: true
  });

  if (!isMobile && !reduceMotion) {
    window.anime({
      targets: cards,
      translateY: [0, -4],
      direction: "alternate",
      easing: "easeInOutSine",
      delay: window.anime.stagger(120),
      duration: 2600,
      loop: true
    });
  }

  cards.forEach((card) => {
    const header = card.querySelector(".card-header") || card;

    card.addEventListener("click", (event) => {
      const burst = document.createElement("span");
      burst.className = "card-burst";
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      burst.style.left = `${x}px`;
      burst.style.top = `${y}px`;
      card.appendChild(burst);

      window.anime({
        targets: burst,
        scale: [0.15, 3.2],
        opacity: [0.35, 0],
        easing: "easeOutExpo",
        duration: 680,
        complete: () => burst.remove()
      });

      window.anime({
        targets: header,
        scale: [1, 1.06, 1],
        duration: 520,
        easing: "easeOutElastic(1, .7)"
      });
    });

    if (!isMobile && !reduceMotion) {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const rotateX = (-dy / rect.height) * 9;
        const rotateY = (dx / rect.width) * 9;

        window.anime.remove(header);
        window.anime({
          targets: header,
          rotateX,
          rotateY,
          translateZ: 10,
          duration: 220,
          easing: "easeOutQuad"
        });

        window.anime.remove(card);
        window.anime({
          targets: card,
          boxShadow: [
            "0 20px 60px rgba(0,80,150,0.24), inset 0 0 0.5px rgba(255,255,255,0.08)",
            `0 30px 95px rgba(0,140,220,0.34), inset ${-rotateY * 0.4}px ${rotateX * 0.4}px 1px rgba(255,255,255,0.14)`
          ],
          duration: 220,
          easing: "easeOutQuad"
        });
      });

      card.addEventListener("mouseleave", () => {
        window.anime.remove(header);
        window.anime.remove(card);
        window.anime({
          targets: header,
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          duration: 360,
          easing: "easeOutExpo"
        });
        window.anime({
          targets: card,
          boxShadow: "0 20px 60px rgba(0,80,150,0.24), inset 0 0 0.5px rgba(255,255,255,0.08)",
          duration: 360,
          easing: "easeOutExpo"
        });
      });
    }
  });
}

// Efecto 1: titulo en binario -> resuelve al texto original cada ~12s.
function runBinaryTitleEffect(titleEl) {
  if (arcadePerformanceMode) return;
  if (!titleEl || typeof window.anime !== "function") return;
  const original = titleEl.textContent || "";
  if (!original.trim()) return;

  const binaryChars = "01";
  const glitchChars  = "01#$%@!?&*<>{}";
  let frame = null;
  let phase = 0; // 0=scramble-in, 1=hold-binary, 2=resolve
  const totalLen = original.length;
  let revealCount = 0;
  const startTime = { scramble: 0, resolve: 0 };
  const SCRAMBLE_MS  = 420;
  const HOLD_MS      = 600;
  const RESOLVE_MS   = 740;

  function tick() {
    const now = Date.now();
    if (phase === 0) {
      const p = Math.min((now - startTime.scramble) / SCRAMBLE_MS, 1);
      titleEl.textContent = original.split("").map((ch) => {
        if (ch === " ") return " ";
        return binaryChars[Math.floor(Math.random() * binaryChars.length)];
      }).join("");
      if (p >= 1) { phase = 1; startTime.resolve = now + HOLD_MS; }
    } else if (phase === 1) {
      titleEl.textContent = original.split("").map((ch) => {
        if (ch === " ") return " ";
        return Math.random() > 0.5
          ? binaryChars[Math.floor(Math.random() * binaryChars.length)]
          : glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }).join("");
      if (now >= startTime.resolve) { phase = 2; revealCount = 0; startTime.resolve = now; }
    } else {
      const p = Math.min((now - startTime.resolve) / RESOLVE_MS, 1);
      revealCount = Math.floor(p * totalLen);
      titleEl.textContent = original.split("").map((ch, i) => {
        if (ch === " ") return " ";
        if (i < revealCount) return original[i];
        return binaryChars[Math.floor(Math.random() * binaryChars.length)];
      }).join("");
      if (p >= 1) {
        titleEl.textContent = original;
        return; // done
      }
    }
    frame = requestAnimationFrame(tick);
  }

  startTime.scramble = Date.now();
  frame = requestAnimationFrame(tick);
}

// Efecto 2: hackeo de pagina -> glitch en body + ruido en hero -> normalidad.
function runHackEffect() {
  if (arcadePerformanceMode) return;
  if (typeof window.anime !== "function") return;
  const body = document.body;
  const heroSection = document.querySelector(".hero");
  const titleEl = document.querySelector(".hero h1");

  // Overlay de hackeo
  const overlay = document.createElement("div");
  overlay.className = "hack-overlay";
  document.body.appendChild(overlay);

  // Lineas de glitch en el hero
  const glitchLines = [];
  for (let i = 0; i < 5; i++) {
    const line = document.createElement("div");
    line.className = "hack-glitch-line";
    line.style.top = `${10 + Math.random() * 80}%`;
    line.style.width = `${30 + Math.random() * 60}%`;
    line.style.left  = `${Math.random() * 30}%`;
    if (heroSection) heroSection.appendChild(line);
    else document.body.appendChild(line);
    glitchLines.push(line);
  }

  // Timeline de hackeo
  window.anime.timeline({ easing: "easeOutQuad" })
    // fade-in overlay
    .add({ targets: overlay, opacity: [0, 0.92], duration: 180 })
    // body shake
    .add({ targets: body, translateX: [0, -6, 5, -4, 3, 0],
      duration: 320, easing: "easeInOutSine" }, "-=60")
    // glitch lines aparecen
    .add({ targets: glitchLines, opacity: [0, 0.9, 0],
      translateX: () => [0, window.anime.random(-220, 220)],
      delay: window.anime.stagger(60),
      duration: 260, easing: "easeOutQuad" }, "-=200")
    // titulo tiembla
    .add({ targets: titleEl,
      translateX: [0, -8, 6, -5, 4, 0],
      skewX: [0, -4, 3, 0],
      duration: 380, easing: "easeInOutSine",
      begin: () => titleEl && (titleEl.style.color = "#ff003c") }, "-=180")
    // segundo shake
    .add({ targets: body, translateX: [0, 4, -3, 2, 0],
      duration: 240, easing: "easeInOutSine" })
    // overlay fade-out
    .add({ targets: overlay, opacity: [0.92, 0], duration: 320,
      complete: () => overlay.remove() }, "-=100")
    // titulo vuelve a normal
    .add({
      targets: titleEl,
      translateX: 0, skewX: 0,
      duration: 320,
      easing: "easeOutExpo",
      complete: () => {
        if (titleEl) titleEl.style.color = "";
        glitchLines.forEach((l) => l.remove());
      }
    }, "-=180");
}

// Espera a que termine el intro para que el reveal se perciba mejor.
setTimeout(initAnimeEnhancements, 900);

// Lanza efectos periodicos despues de que la pagina este totalmente lista.
setTimeout(() => {
  const titleEl = document.querySelector(".hero h1");
  // Binario a los 28s, luego cada 45s
  setTimeout(() => runBinaryTitleEffect(titleEl), 28000);
  setInterval(() => runBinaryTitleEffect(titleEl), 45000);
  // Hackeo a los 52s, luego cada 70s
  setTimeout(() => runHackEffect(), 52000);
  setInterval(() => runHackEffect(), 70000);
}, 900);

});
