window.addEventListener("load", () => {
// Bloquea el menu contextual (click derecho) en toda la pagina.
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

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
  card.addEventListener("click", (event) => {
    // No colapsar tarjeta cuando el usuario intenta pulsar un enlace del submenu.
    if (event.target.closest(".submenu a")) return;

    if (window.matchMedia("(max-width: 768px)").matches) {
      const shouldOpen = !card.classList.contains("expanded");
      document.querySelectorAll(".menu-card.expanded").forEach((openedCard) => {
        openedCard.classList.remove("expanded");
      });
      if (shouldOpen) card.classList.add("expanded");
      return;
    }

    card.classList.toggle("expanded");
  });
});

});
