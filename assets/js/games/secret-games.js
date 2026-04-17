let secretGamesInitialized = false;
const MARIO_GAME_PATH = "assets/games/fullscreenmario/Source/index.html";
const PINBALL_GAME_PATH = "assets/games/pinball-xr/dist/index.html";
const PACMAN_GAME_PATH = "assets/games/pacman/index.html";

function initSecretGamesModal() {
  if (secretGamesInitialized) return;

  const secretModal = document.getElementById("modal-juegos-secreto");
  if (!secretModal) return;

  const panel = secretModal.querySelector(".secret-games-content");
  const fxLayer = secretModal.querySelector(".secret-console-fx");
  const gridLayer = secretModal.querySelector(".secret-console-grid");
  const vignetteLayer = secretModal.querySelector(".secret-console-vignette");
  const bootline = secretModal.querySelector("#secret-bootline");
  const subtitle = secretModal.querySelector("#secret-subtitle");
  const thumbs = Array.from(secretModal.querySelectorAll(".secret-thumb"));
  const launcherHint = secretModal.querySelector(".secret-launcher-hint");
  const footnote = secretModal.querySelector(".secret-footnote");

  const playerModal = document.getElementById("modal-juego-player");
  const playerFrame = document.getElementById("player-game-frame");
  const playerOverlay = document.getElementById("player-game-overlay");
  const playerTitle = document.getElementById("player-game-title");
  const playerStatus = document.getElementById("player-game-status");

  if (!panel || !launcherHint || !playerModal || !playerFrame || !playerOverlay || !playerTitle || !playerStatus) return;

  secretGamesInitialized = true;

  function setPlayerState(state) {
    playerStatus.textContent = state;
  }

  function showPlayerOverlay(text) {
    playerOverlay.textContent = text;
    playerOverlay.classList.remove("is-hidden");
  }

  function hidePlayerOverlay() {
    playerOverlay.classList.add("is-hidden");
  }

  function openModalDirect(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove("is-closing");
    modalElement.style.display = "block";
    void modalElement.offsetWidth;
    modalElement.classList.add("is-open");
  }

  function closeModalDirect(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove("is-open");
    modalElement.classList.add("is-closing");
    setTimeout(() => {
      modalElement.classList.remove("is-closing");
      modalElement.style.display = "none";
    }, 220);
  }

  function launchMarioInPlayer() {
    playerTitle.textContent = "Juego: FullScreenMario";
    showPlayerOverlay("Inicializando motor Mario...");
    setPlayerState("CARGANDO");

    const onLoad = () => {
      setPlayerState("ONLINE");
      hidePlayerOverlay();
      playerFrame.removeEventListener("load", onLoad);
      playerFrame.removeEventListener("error", onError);
      playerFrame.dataset.ready = "true";
    };

    const onError = () => {
      setPlayerState("ERROR");
      showPlayerOverlay("No se pudo cargar Mario. Revisa ruta/servidor.");
      playerFrame.removeEventListener("load", onLoad);
      playerFrame.removeEventListener("error", onError);
    };

    playerFrame.addEventListener("load", onLoad);
    playerFrame.addEventListener("error", onError);

    // Abrir el modal dedicado elimina capas del launcher y mejora rendimiento.
    if (fxLayer) fxLayer.style.display = "none";
    if (gridLayer) gridLayer.style.display = "none";
    if (vignetteLayer) vignetteLayer.style.display = "none";
    closeModalDirect(secretModal);
    openModalDirect(playerModal);
    window.dispatchEvent(new CustomEvent("arcade:performance", {
      detail: { enabled: true }
    }));
    playerFrame.src = `${MARIO_GAME_PATH}?t=${Date.now()}`;
  }

  function launchPinballInPlayer() {
    playerTitle.textContent = "Juego: Pinball XR";
    showPlayerOverlay("Inicializando Pinball XR...");
    setPlayerState("CARGANDO");

    const onLoad = () => {
      setPlayerState("ONLINE");
      hidePlayerOverlay();
      playerFrame.removeEventListener("load", onLoad);
      playerFrame.removeEventListener("error", onError);
      playerFrame.dataset.ready = "true";
    };

    const onError = () => {
      setPlayerState("ERROR");
      showPlayerOverlay("No se pudo cargar Pinball XR. Revisa ruta/servidor.");
      playerFrame.removeEventListener("load", onLoad);
      playerFrame.removeEventListener("error", onError);
    };

    playerFrame.addEventListener("load", onLoad);
    playerFrame.addEventListener("error", onError);

    // Performan optimization: disable FX layers during gameplay
    if (fxLayer) fxLayer.style.display = "none";
    if (gridLayer) gridLayer.style.display = "none";
    if (vignetteLayer) vignetteLayer.style.display = "none";
    closeModalDirect(secretModal);
    openModalDirect(playerModal);
    window.dispatchEvent(new CustomEvent("arcade:performance", {
      detail: { enabled: true }
    }));
    playerFrame.src = `${PINBALL_GAME_PATH}?t=${Date.now()}`;
  }

  function launchPacmanInPlayer() {
    playerTitle.textContent = "Juego: Pac-Man";
    showPlayerOverlay("Inicializando Pac-Man...");
    setPlayerState("CARGANDO");

    const onLoad = () => {
      setPlayerState("ONLINE");
      hidePlayerOverlay();
      playerFrame.removeEventListener("load", onLoad);
      playerFrame.removeEventListener("error", onError);
      playerFrame.dataset.ready = "true";
    };

    const onError = () => {
      setPlayerState("ERROR");
      showPlayerOverlay("No se pudo cargar Pac-Man. Revisa ruta/servidor.");
      playerFrame.removeEventListener("load", onLoad);
      playerFrame.removeEventListener("error", onError);
    };

    playerFrame.addEventListener("load", onLoad);
    playerFrame.addEventListener("error", onError);

    // Performance optimization: disable FX layers during gameplay
    if (fxLayer) fxLayer.style.display = "none";
    if (gridLayer) gridLayer.style.display = "none";
    if (vignetteLayer) vignetteLayer.style.display = "none";
    closeModalDirect(secretModal);
    openModalDirect(playerModal);
    window.dispatchEvent(new CustomEvent("arcade:performance", {
      detail: { enabled: true }
    }));
    playerFrame.src = `${PACMAN_GAME_PATH}?t=${Date.now()}`;
  }

  function selectThumb(activeGame) {
    thumbs.forEach((thumb) => {
      thumb.classList.toggle("is-active", thumb.dataset.game === activeGame);
    });
  }

  function openGameByKey(gameKey) {
    selectThumb(gameKey);

    if (gameKey === "mario") {
      launchMarioInPlayer();
      return;
    }

    if (gameKey === "pinball") {
      launchPinballInPlayer();
      return;
    }

    if (gameKey === "pacman") {
      launchPacmanInPlayer();
      return;
    }

    playerTitle.textContent = gameKey === "firewall" ? "Juego: Firewall Defender" : "Juego: Bug Hunter";
    setPlayerState("BETA");
    showPlayerOverlay("Modulo en desarrollo. Selecciona FullScreenMario, Pinball XR o Pac-Man para jugar ahora.");
    playerFrame.src = "about:blank";
    closeModalDirect(secretModal);
    openModalDirect(playerModal);
    window.dispatchEvent(new CustomEvent("arcade:performance", {
      detail: { enabled: true }
    }));
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const gameKey = thumb.dataset.game || "mario";
      openGameByKey(gameKey);
    });
  });

  window.addEventListener("modal:opened", (event) => {
    if (!event.detail || event.detail.id !== "modal-juegos-secreto") return;
    if (fxLayer) fxLayer.style.display = "";
    if (gridLayer) gridLayer.style.display = "";
    if (vignetteLayer) vignetteLayer.style.display = "";
    selectThumb("mario");
    panel.style.filter = "none";

    if (typeof window.anime === "function") {
      const bootText = "[ BOOT // UNIBE ARCADE CORE ]";
      bootline.textContent = "";

      // Efecto de tipeo para reforzar la entrada estilo consola.
      let i = 0;
      const typeTimer = window.setInterval(() => {
        bootline.textContent = bootText.slice(0, i);
        i += 1;
        if (i > bootText.length) window.clearInterval(typeTimer);
      }, 24);

      window.anime.remove([panel, subtitle, thumbs, launcherHint, footnote]);
      window.anime.timeline({ easing: "easeOutExpo" })
        .add({
          targets: panel,
          opacity: [0.5, 1],
          duration: 430
        }, 0)
        .add({
          targets: subtitle,
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 360
        }, 170)
        .add({
          targets: thumbs,
          opacity: [0, 1],
          translateY: [16, 0],
          delay: window.anime.stagger(70),
          duration: 360
        }, 210)
        .add({
          targets: launcherHint,
          opacity: [0, 1],
          translateY: [16, 0],
          scale: [0.98, 1],
          duration: 320
        }, 300)
        .add({
          targets: footnote,
          opacity: [0, 1],
          duration: 260
        }, 500);
    }
  });

  window.addEventListener("modal:closed", (event) => {
    if (!event.detail || event.detail.id !== "modal-juegos-secreto") return;
    panel.style.filter = "none";
  });

  window.addEventListener("modal:closed", (event) => {
    if (!event.detail || event.detail.id !== "modal-juego-player") return;
    setPlayerState("LISTO");
    playerFrame.src = "about:blank";
    showPlayerOverlay("Inicializando juego...");
    window.dispatchEvent(new CustomEvent("arcade:performance", {
      detail: { enabled: false }
    }));
    if (fxLayer) fxLayer.style.display = "";
    if (gridLayer) gridLayer.style.display = "";
    if (vignetteLayer) vignetteLayer.style.display = "";
  });
}

window.addEventListener("modals:ready", initSecretGamesModal);
window.addEventListener("load", initSecretGamesModal);
