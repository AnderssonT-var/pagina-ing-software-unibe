# UNIBE - Ingeniería de Software

Sitio web institucional de la carrera Ingeniería de Software, construido con HTML, CSS y JavaScript vanilla, con enfoque visual dinámico (intro tipo matrix, fondo animado, cards interactivas y sistema de modales por secciones).

## Vista General

- Landing con introducción animada y barra de progreso.
- Fondo animado en canvas con efecto estilo hacker/dev.
- Menú por tarjetas expandibles con submenús.
- Sistema de modales cargados por partes desde archivos HTML independientes.
- Arcade secreto accesible desde el logo (launcher + modal dedicado para juegos).
- Modo de rendimiento para pausar efectos pesados mientras un juego está activo.
- Galería de eventos con filtros y visor de imágenes (zoom/arrastre).
- Calendario de eventos con selección de fecha.

## Metodología y Arquitectura

Este proyecto no usa un framework como React/Vue ni implementa MVC formal al 100%.

El enfoque aplicado es:

- Front-end modular por responsabilidades.
- Programación orientada a eventos del DOM.
- Separación de capas por tipo de recurso:
  - Estructura: HTML.
  - Estilos: CSS dividido por dominio.
  - Lógica: JS dividido por dominio.

### Organización actual

- `index.html`: estructura principal y registro de estilos/scripts.
- `pages/modals/`: modales separados por secciones del menú.
- `pages/modals/games/modal-juegos-secreto.html`: launcher del arcade y modal de jugador dedicado.
- `assets/css/index.css`: estilos de la portada y componentes principales del index.
- `assets/css/modal.css`: estilos de modales, galería, calendario, visor y animaciones de modal.
- `assets/css/logo.css`: estilos específicos del bloque de logo.
- `assets/css/effects.css`: estilos visuales globales para efectos del sitio.
- `assets/css/games/secret-games.css`: estilos del arcade secreto (launcher y player).
- `assets/js/index.js`: lógica del index (intro, canvas matrix, fondo animado, tarjetas).
- `assets/js/modal.js`: carga e interacción de modales (apertura/cierre, galería y calendario).
- `assets/js/image-viewer.js`: lógica aislada del visor de imágenes (zoom, drag, reset).
- `assets/js/logo.js`: animación de partículas y comportamiento visual del logo.
- `assets/js/effects.js`: efectos dinámicos globales con soporte de modo rendimiento para arcade.
- `assets/js/games/secret-games.js`: lógica del launcher de juegos, apertura de player y carga por iframe.
- `assets/games/`: juegos integrados de terceros (Mario, Pinball y Pac-Man).

## Juegos Incorporados

### Juegos completos

- `FullScreenMario` en `assets/games/fullscreenmario/Source/index.html`.
- `Pinball Schminball` en `assets/games/pinball-xr/dist/index.html` (versión gráfica, sin wireframe).
- `Pac-Man` en `assets/games/pacman/index.html`.

### Juegos en beta (placeholder)

- `Firewall Defender`.
- `Bug Hunter`.

## Flujo del Arcade Secreto

1. Usuario abre el acceso secreto desde el logo (`Abrir sistema secreto de juegos`).
2. Se muestra un launcher con miniaturas de juegos.
3. Al seleccionar un juego, el launcher se cierra y abre un modal dedicado solo al juego.
4. Durante el juego se activa `arcade:performance` para reducir carga visual de fondo.
5. Al cerrar el player, se desactiva el modo rendimiento y se restauran efectos del sitio.

## Tecnologías Usadas (con imágenes)

### Stack principal

![Tecnologías](https://skillicons.dev/icons?i=html,css,js)

### Librerías y servicios externos

![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google%20Fonts-4285F4?style=for-the-badge&logo=googlefonts&logoColor=white)

## Recursos utilizados

### 1) Tipografía

- Orbitron desde Google Fonts.
- Cargada desde `index.html`.

### 2) Efectos de texto (título principal)

- Gradiente animado y glow pulsante por CSS.
- Definidos en `assets/css/index.css`.

### 3) Fondo animado

- Canvas 2D con caracteres y líneas de código en movimiento.
- Implementado en `assets/js/index.js`.

### 4) Intro tipo matrix

- Pantalla inicial con barra de progreso y animación matrix.
- Implementado entre `index.html`, `assets/css/index.css` y `assets/js/index.js`.

### 5) Modales por secciones

- Estructura HTML modular por archivo en `pages/modals/`.
- Estilos en `assets/css/modal.css`.
- Lógica de carga y eventos en `assets/js/modal.js`.

### 6) Visor de imágenes

- Zoom con rueda, botones de zoom, doble clic y arrastre.
- Lógica separada en `assets/js/image-viewer.js`.

### 7) Galería de ejemplo

- Imágenes temporales (placeholder) desde Picsum.
- Referenciadas en `pages/modals/menu-eventos.html`.

### 8) Iconografía del menú

- Iconos locales en `assets/images/`.

### 9) Sistema de juegos secreto

- Modal de launcher + modal player dedicado.
- Carga de juegos vía iframe desde `assets/games/`.
- Estilos dedicados del arcade en `assets/css/games/secret-games.css`.
- Lógica dedicada en `assets/js/games/secret-games.js`.

### 10) Optimización durante gameplay

- Evento personalizado `arcade:performance` para reducir efectos pesados.
- Integración en `assets/js/effects.js`.

## Cómo ejecutar localmente

### Opción rápida

Abre `index.html` en el navegador.

### Opción recomendada (servidor local)

Desde la raíz del proyecto:

```bash
python3 -m http.server 8000
```

Luego abre:

- http://localhost:8000

## Flujo de interacción de modales

1. `modal.js` inyecta los modales desde `pages/modals/` dentro de `#modal-root`.
2. Al terminar, dispara el evento `modals:ready`.
3. `image-viewer.js` escucha ese evento y conecta el visor de imágenes.
4. El usuario interactúa con enlaces del menú para abrir cada modal.

## Estructura de carpetas

```text
.
├─ index.html
├─ README.md
├─ assets/
│  ├─ css/
│  │  ├─ index.css
│  │  ├─ effects.css
│  │  ├─ modal.css
│  │  ├─ logo.css
│  │  └─ games/
│  │     └─ secret-games.css
│  ├─ js/
│  │  ├─ effects.js
│  │  ├─ games/
│  │  │  └─ secret-games.js
│  │  ├─ index.js
│  │  ├─ modal.js
│  │  ├─ image-viewer.js
│  │  └─ logo.js
│  ├─ games/
│  │  ├─ fullscreenmario/
│  │  ├─ pinball-xr/
│  │  └─ pacman/
│  ├─ images/
│  └─ docs/
└─ pages/
   └─ modals/
  ├─ games/
  │  └─ modal-juegos-secreto.html
      ├─ menu-carrera.html
      ├─ menu-que-aprenderas.html
      ├─ menu-plan-estudios.html
      ├─ menu-proyectos.html
      ├─ menu-certificaciones.html
      ├─ menu-admisiones.html
      ├─ menu-eventos.html
      └─ shared.html
```
