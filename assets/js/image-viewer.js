let imageViewerInitialized = false;

function initImageViewer() {
  if (imageViewerInitialized) return;

  const imageViewerModal = document.getElementById("image-viewer-modal");
  const imageViewerImg = document.getElementById("image-viewer-img");
  const imageStage = document.getElementById("image-stage");
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");
  const zoomResetBtn = document.getElementById("zoom-reset");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (!imageViewerModal || !imageViewerImg || !imageStage) return;

  imageViewerInitialized = true;

  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove("is-closing");
    modalElement.style.display = "block";
    void modalElement.offsetWidth;
    modalElement.classList.add("is-open");
  }

  function updateViewerTransform() {
    // Aplica transformacion actual de zoom y desplazamiento.
    imageViewerImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  }

  function resetViewer() {
    // Reinicia el visor al estado inicial.
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    updateViewerTransform();
  }

  function openImageViewer(src, altText) {
    // Carga una imagen en grande y abre el modal visor.
    imageViewerImg.src = src;
    imageViewerImg.alt = altText || "Imagen ampliada";
    resetViewer();
    openModal(imageViewerModal);
  }

  galleryItems.forEach((item) => {
    const itemImage = item.querySelector("img");
    if (!itemImage) return;

    itemImage.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openImageViewer(itemImage.src, itemImage.alt);
    });
  });

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      zoomLevel = Math.min(zoomLevel * 1.2, 6);
      updateViewerTransform();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      zoomLevel = Math.max(zoomLevel / 1.2, 1);
      if (zoomLevel === 1) {
        panX = 0;
        panY = 0;
      }
      updateViewerTransform();
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener("click", resetViewer);
  }

  imageStage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.12 : 0.9;
      zoomLevel = Math.min(Math.max(zoomLevel * factor, 1), 6);
      if (zoomLevel === 1) {
        panX = 0;
        panY = 0;
      }
      updateViewerTransform();
    },
    { passive: false }
  );

  imageStage.addEventListener("dblclick", () => {
    zoomLevel = zoomLevel > 1 ? 1 : 2;
    if (zoomLevel === 1) {
      panX = 0;
      panY = 0;
    }
    updateViewerTransform();
  });

  imageStage.addEventListener("mousedown", (event) => {
    if (zoomLevel <= 1) return;
    if (event.button !== 0) return;
    dragging = true;
    imageStage.classList.add("is-dragging");
    dragStartX = event.clientX - panX;
    dragStartY = event.clientY - panY;
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragging) return;
    panX = event.clientX - dragStartX;
    panY = event.clientY - dragStartY;
    updateViewerTransform();
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
    imageStage.classList.remove("is-dragging");
  });
}

window.addEventListener("modals:ready", initImageViewer);

window.addEventListener("load", () => {
  if (document.getElementById("image-viewer-modal")) {
    initImageViewer();
  }
});
