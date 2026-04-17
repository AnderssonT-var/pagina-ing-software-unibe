window.addEventListener("load", async () => {

// Carga los modales desde archivos separados por seccion de menu.
// Estructura: pages/modals/menu-{seccion}.html
const modalRoot = document.getElementById("modal-root");
if (modalRoot) {
  const modalFiles = [
    "pages/modals/menu-carrera.html",
    "pages/modals/menu-que-aprenderas.html",
    "pages/modals/menu-plan-estudios.html",
    "pages/modals/menu-proyectos.html",
    "pages/modals/menu-certificaciones.html",
    "pages/modals/menu-admisiones.html",
    "pages/modals/menu-eventos.html",
    "pages/modals/games/modal-juegos-secreto.html",
    "pages/modals/shared.html",
  ];
  try {
    const responses = await Promise.all(
      modalFiles.map((path) => fetch(path, { cache: "no-store" }))
    );
    const htmlParts = await Promise.all(
      responses.map((res) => (res.ok ? res.text() : ""))
    );
    modalRoot.innerHTML = htmlParts.join("\n");
    window.dispatchEvent(new Event("modals:ready"));
  } catch (error) {
    console.error("No se pudo cargar los modales:", error);
  }
}

const modalLinks = document.querySelectorAll("[data-modal-target]");
const modalCloseButtons = document.querySelectorAll(".close");

function openModal(modalElement) {
  // Abre modal con animacion de entrada.
  if (!modalElement) return;
  modalElement.classList.remove("is-closing");
  modalElement.style.display = "block";
  void modalElement.offsetWidth;
  modalElement.classList.add("is-open");
  window.dispatchEvent(new CustomEvent("modal:opened", {
    detail: { id: modalElement.id, modal: modalElement }
  }));

  // Refuerzo visual con Anime.js sin romper el fallback CSS.
  if (typeof window.anime === "function") {
    const panel = modalElement.querySelector(".modal-content");
    if (panel) {
      window.anime.remove(panel);
      window.anime({
        targets: panel,
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.975, 1],
        duration: 460,
        easing: "easeOutExpo"
      });

    }
  }
}

function closeModal(modalElement) {
  // Cierra modal con animacion de salida.
  if (!modalElement) return;
  modalElement.classList.remove("is-open");
  modalElement.classList.add("is-closing");
  setTimeout(() => {
    modalElement.classList.remove("is-closing");
    modalElement.style.display = "none";
    window.dispatchEvent(new CustomEvent("modal:closed", {
      detail: { id: modalElement.id, modal: modalElement }
    }));
  }, 220);
}

modalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const modalId = link.getAttribute("data-modal-target");
    const modalElement = document.getElementById(modalId);
    openModal(modalElement);
  });
});

// Permite abrir el modal secreto del logo con teclado (Enter/Espacio).
modalLinks.forEach((link) => {
  link.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    const modalId = link.getAttribute("data-modal-target");
    const modalElement = document.getElementById(modalId);
    openModal(modalElement);
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const modalId = event.currentTarget.getAttribute("data-modal");
    const modalElement = document.getElementById(modalId);
    closeModal(modalElement);
  });
});

window.addEventListener("click", (event) => {
  // Cierra modal al hacer click en el backdrop.
  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
});

// Referencias del modal Carrera y disparadores desde submenu.
const carreraModal = document.getElementById("modal-carrera");
const carreraLinks = [
  document.getElementById("perfil-egresado"),
  document.getElementById("objetivos"),
  document.getElementById("campo-laboral")
].filter(Boolean);

// Logica de apertura y filtrado del modal de galeria.
const galeriaEventosLink = document.getElementById("galeria-eventos");
const galeriaModal = document.getElementById("modal-galeria");
const calendarioEventosLink = document.getElementById("calendario-eventos");
const calendarioModal = document.getElementById("modal-calendario");
const mallaCurricularLink = document.getElementById("malla-curricular");
const mallaModal = document.getElementById("modal-malla");
const calendarTitle = document.getElementById("calendar-title");
const calendarGrid = document.getElementById("calendar-grid");
const calendarDayLabel = document.getElementById("calendar-day-label");
const calendarEventsList = document.getElementById("calendar-events-list");
const calendarPrevBtn = document.getElementById("calendar-prev");
const calendarNextBtn = document.getElementById("calendar-next");
const galleryTabs = document.querySelectorAll(".gallery-tab");
const galleryYearTabs = document.querySelectorAll(".gallery-year");
const galleryItems = document.querySelectorAll(".gallery-item");
let selectedCategory = galleryTabs.length ? galleryTabs[0].getAttribute("data-category") : null;
let selectedYear = galleryYearTabs.length ? galleryYearTabs[0].getAttribute("data-year") : null;
const calendarMonthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const calendarEvents = {
  "2026-04-14": ["Conferencia: Tendencias en IA - Auditorio Principal, 10:00 AM"],
  "2026-04-20": ["Feria de Proyectos Integradores - Plaza Tecnologica, 09:00 AM"],
  "2026-05-02": ["Taller de Ciberseguridad - Laboratorio 3, 02:00 PM"],
  "2026-05-12": ["Hackathon UNIBE 2026 - Centro de Innovacion, 08:00 AM"],
  "2026-06-28": ["Graduacion Semestral - Coliseo Universitario, 05:00 PM"],
  "2026-07-08": ["Charla de Empleabilidad TIC - Aula Magna, 11:00 AM"]
};
let calendarCurrentDate = new Date(2026, 3, 1);
let calendarSelectedDateKey = null;

carreraLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openModal(carreraModal);
  });
});

if (galeriaEventosLink && galeriaModal) {
  galeriaEventosLink.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openModal(galeriaModal);
  });
}

if (calendarioEventosLink && calendarioModal) {
  calendarioEventosLink.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    renderCalendar();
    openModal(calendarioModal);
  });
}

if (mallaCurricularLink && mallaModal) {
  mallaCurricularLink.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openModal(mallaModal);
  });
}

function toDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function selectCalendarDate(dateKey) {
  calendarSelectedDateKey = dateKey;
  if (!calendarDayLabel || !calendarEventsList) return;

  const dateObj = new Date(`${dateKey}T00:00:00`);
  const day = dateObj.getDate();
  const month = calendarMonthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  calendarDayLabel.textContent = `Eventos del ${day} de ${month} de ${year}`;

  const events = calendarEvents[dateKey] || [];
  if (events.length === 0) {
    calendarEventsList.innerHTML = "<li>No hay eventos para este dia.</li>";
  } else {
    calendarEventsList.innerHTML = events.map((evt) => `<li>${evt}</li>`).join("");
  }

  document.querySelectorAll(".calendar-day").forEach((btn) => {
    btn.classList.toggle("is-selected", btn.dataset.dateKey === dateKey);
  });
}

function renderCalendar() {
  if (!calendarGrid || !calendarTitle) return;

  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarTitle.textContent = `${calendarMonthNames[month]} ${year}`;
  calendarGrid.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    blank.className = "calendar-day is-muted";
    calendarGrid.appendChild(blank);
  }

  let firstEventKeyInMonth = null;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = toDateKey(year, month, day);
    const hasEvent = Boolean(calendarEvents[dateKey]);
    if (hasEvent && !firstEventKeyInMonth) firstEventKeyInMonth = dateKey;

    const dayBtn = document.createElement("button");
    dayBtn.type = "button";
    dayBtn.className = `calendar-day${hasEvent ? " has-event" : ""}`;
    dayBtn.textContent = String(day);
    dayBtn.dataset.dateKey = dateKey;
    dayBtn.addEventListener("click", () => selectCalendarDate(dateKey));
    calendarGrid.appendChild(dayBtn);
  }

  const defaultKey = firstEventKeyInMonth || toDateKey(year, month, 1);
  selectCalendarDate(defaultKey);
}

if (calendarPrevBtn) {
  calendarPrevBtn.addEventListener("click", () => {
    calendarCurrentDate = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() - 1, 1);
    renderCalendar();
  });
}

if (calendarNextBtn) {
  calendarNextBtn.addEventListener("click", () => {
    calendarCurrentDate = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() + 1, 1);
    renderCalendar();
  });
}

galleryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedCategory = tab.getAttribute("data-category");
    galleryTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    applyGalleryFilters();
  });
});

galleryYearTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedYear = tab.getAttribute("data-year");
    galleryYearTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    applyGalleryFilters();
  });
});

function applyGalleryFilters() {
  // Muestra imagenes segun categoria y ano seleccionados.
  let visibleCount = 0;

  galleryItems.forEach((item) => {
    const itemCategory = item.getAttribute("data-category");
    const itemYear = item.getAttribute("data-year");
    const show = itemCategory === selectedCategory && itemYear === selectedYear;
    item.style.display = show ? "flex" : "none";
    if (show) visibleCount += 1;
  });

  if (visibleCount === 0 && selectedCategory) {
    galleryItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");
      item.style.display = itemCategory === selectedCategory ? "flex" : "none";
    });
  }
}

if (galleryTabs.length > 0 && galleryYearTabs.length > 0) {
  applyGalleryFilters();
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modalElement) => {
      if (modalElement.style.display === "block") {
        closeModal(modalElement);
      }
    });
  }
});

});
