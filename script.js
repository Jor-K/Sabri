const SVG_NS = "http://www.w3.org/2000/svg";
const MESSAGE = "sabri, nos tomamos un cafecito?";

const svg = document.getElementById("heart");
const message = document.getElementById("message");
const stage = document.getElementById("stage");

// Puntos del corazón (viewBox 0 0 200 185)
const P = {
  A: [100, 50],  B: [60, 15],   C: [20, 40],   D: [15, 85],
  E: [50, 125],  F: [100, 170], G: [150, 125], H: [185, 85],
  I: [180, 40],  J: [140, 15],
  K: [100, 95],  L: [55, 70],   M: [145, 70],  N: [100, 130],
};

// Cada trozo de papel: tres puntos + color (más claro arriba a la izquierda,
// más oscuro abajo a la derecha, como si la luz viniera de ahí)
const PIECES = [
  ["A", "B", "L", "#ff6b81"],
  ["B", "C", "L", "#ff8fa3"],
  ["C", "D", "L", "#e84d68"],
  ["D", "E", "L", "#d63c5a"],
  ["E", "N", "L", "#c22f4f"],
  ["L", "N", "K", "#e0405f"],
  ["A", "L", "K", "#f0556f"],
  ["A", "K", "M", "#d93d5b"],
  ["A", "M", "J", "#ff7a90"],
  ["J", "M", "I", "#ff94a6"],
  ["I", "M", "H", "#e5506b"],
  ["H", "M", "G", "#c42e4d"],
  ["M", "N", "G", "#a82244"],
  ["M", "K", "N", "#cf3556"],
  ["E", "F", "N", "#b12748"],
  ["F", "G", "N", "#901c3b"],
];

const STAGGER = 0.09;     // segundos entre pieza y pieza
const ASSEMBLE = 1.6;     // duración del vuelo de cada pieza
const TEXT_START = (PIECES.length - 1) * STAGGER + ASSEMBLE - 0.4;

const rand = (min, max) => Math.random() * (max - min) + min;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildHeart() {
  svg.innerHTML = "";
  const group = document.createElementNS(SVG_NS, "g");
  group.setAttribute("class", "heart");

  const order = shuffle(PIECES.map((_, i) => i));

  PIECES.forEach(([a, b, c, color], i) => {
    const poly = document.createElementNS(SVG_NS, "polygon");
    poly.setAttribute("points", [a, b, c].map((k) => P[k].join(",")).join(" "));
    poly.setAttribute("fill", color);
    poly.setAttribute("stroke", color); // evita líneas finas entre piezas
    poly.setAttribute("class", "piece");

    const angle = rand(0, Math.PI * 2);
    const dist = rand(180, 320);
    poly.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    poly.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    poly.style.setProperty("--rot", `${rand(-540, 540)}deg`);
    poly.style.setProperty("--delay", `${order[i] * STAGGER}s`);

    group.appendChild(poly);
  });

  svg.appendChild(group);
}

function buildMessage() {
  message.innerHTML = "";
  let n = 0;

  MESSAGE.split(" ").forEach((word) => {
    const w = document.createElement("span");
    w.className = "word";
    w.setAttribute("aria-hidden", "true");

    [...word].forEach((ch) => {
      const l = document.createElement("span");
      l.className = "letter";
      l.textContent = ch;
      l.style.setProperty("--delay", `${TEXT_START + n * 0.05}s`);
      w.appendChild(l);
      n++;
    });

    message.appendChild(w);
  });
}

function start() {
  buildHeart();
  buildMessage();
}

start();

// Tocar la pantalla (o Enter / Espacio) repite la animación
stage.addEventListener("click", start);
stage.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    start();
  }
});
