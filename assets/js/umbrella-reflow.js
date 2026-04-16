import {
  prepareWithSegments,
  layoutWithLines,
} from "https://esm.sh/@chenglou/pretext";

const canvas = document.getElementById("umbrella-rain-canvas");
if (!canvas) {
  throw new Error("Canvas element #umbrella-rain-canvas not found.");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("2D context is not available.");
}

const DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

const COL_SPACING = 11;
const CHAR_HEIGHT = 12;
const FONT_SIZE = 12;
const FONT_FAMILY =
  `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
const FONT = `${FONT_SIZE}px ${FONT_FAMILY}`;

const UMBRELLA_RADIUS = 65;
const HANDLE_LEN = 80;
const CANOPY_HEIGHT = UMBRELLA_RADIUS * 0.75;

const SPLASH_GRAVITY = 120;
const MAX_SPLASHES = 500;

const PHRASE =
  "umbrella reflow sheltered text rain ";
const MOBILE_MEDIA = window.matchMedia("(pointer: coarse), (max-width: 768px)");

let width = 0;
let height = 0;

let columns = [];
let splashes = [];

let lastTime = performance.now();

const pointer = {
  x: 0,
  y: 0,
  active: false,
};

const umbrella = {
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;

  canvas.width = Math.floor(width * DPR);
  canvas.height = Math.floor(height * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  umbrella.x = width * 0.5;
  umbrella.y = height * 0.42;
  umbrella.tx = umbrella.x;
  umbrella.ty = umbrella.y;

  createColumns();
}

function buildColumnGlyphs(phrase, targetHeight) {
  // Enough text to fill 2x canvas height for seamless wrap
  const charsNeeded = Math.ceil((targetHeight * 2) / CHAR_HEIGHT) + 10;

  let raw = "";
  while (raw.length < charsNeeded) {
    raw += phrase;
  }

  // Visible separator for whitespace in vertical flow
  raw = raw.replace(/ /g, "·");

  // Use Pretext to force very narrow line layout so each grapheme becomes a line.
  const prepared = prepareWithSegments(raw, FONT, {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
  });

  const { lines } = layoutWithLines(prepared, 1, CHAR_HEIGHT);

  const glyphs = [];
  for (const line of lines) {
    const text = line.text;
    if (!text) continue;
    glyphs.push(text);
  }

  return glyphs;
}

function createColumns() {
  columns = [];
  const colCount = Math.floor(width / COL_SPACING);
  const glyphs = buildColumnGlyphs(PHRASE, height);

  for (let i = 0; i < colCount; i++) {
    columns.push({
      x: i * COL_SPACING + COL_SPACING / 2,
      glyphs,
      y: Math.random() * height,
      speed: 60 + Math.random() * 50,
    });
  }
}

function updatePointerTarget(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = clientX - rect.left;
  pointer.y = clientY - rect.top;
  pointer.active = true;
}

canvas.addEventListener("mousemove", (e) => {
  if (MOBILE_MEDIA.matches) return;
  updatePointerTarget(e.clientX, e.clientY);
});

canvas.addEventListener(
  "touchmove",
  (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    updatePointerTarget(touch.clientX, touch.clientY);
  },
  { passive: true }
);

canvas.addEventListener("mouseleave", () => {
  pointer.active = false;
});

function updateUmbrellaTarget(nowMs) {
  if (MOBILE_MEDIA.matches) {
    const t = nowMs * 0.001;
    umbrella.tx = width * 0.5 + Math.sin(t * 1.4) * Math.min(70, width * 0.14);
    umbrella.ty = height * 0.40 + Math.sin(t * 2.1) * 10;
    return;
  }

  umbrella.tx = pointer.active ? pointer.x : width * 0.5;
  umbrella.ty = pointer.active ? pointer.y : height * 0.42;
}

function lerp(current, target, factor) {
  return current + (target - current) * factor;
}

function isUnderUmbrella(px, py, ux, uy) {
  const R = UMBRELLA_RADIUS;
  const canopyH = R * 0.75;

  if (py < uy - canopyH) return false;

  if (py < uy + HANDLE_LEN + 20) {
    return Math.abs(px - ux) < R;
  }

  return false;
}

function spawnSplash(x) {
  const count = 2 + Math.floor(Math.random() * 2);

  for (let i = 0; i < count; i++) {
    if (splashes.length >= MAX_SPLASHES) break;

    splashes.push({
      x,
      y: height - 4,
      vx: (Math.random() - 0.5) * 30,
      vy: -(20 + Math.random() * 40),
      life: 1,
      size: 1 + Math.random() * 1.5,
    });
  }
}

function updateAndDrawSplashes(dt) {
  const next = [];

  for (const sp of splashes) {
    sp.x += sp.vx * dt;
    sp.y += sp.vy * dt;
    sp.vy += SPLASH_GRAVITY * dt;
    sp.life -= dt * 2.5;

    if (sp.life <= 0) continue;

    ctx.globalAlpha = Math.max(0, sp.life * 0.7);
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
    ctx.fillStyle = "#4a8ed4";
    ctx.fill();

    next.push(sp);
  }

  ctx.globalAlpha = 1;
  splashes = next;
}

function drawRain(dt) {
  ctx.font = FONT;
  ctx.fillStyle = "#4a8ed4";

  for (const col of columns) {
    col.y += col.speed * dt;

    const blockH = col.glyphs.length * CHAR_HEIGHT;
    if (col.y >= blockH) col.y -= blockH;

    for (let i = 0; i < col.glyphs.length; i++) {
      const baseY = i * CHAR_HEIGHT + col.y;

      // Draw two copies for seamless vertical wrap
      const drawPositions = [baseY - blockH, baseY];

      for (const drawY of drawPositions) {
        if (drawY < -CHAR_HEIGHT || drawY > height + CHAR_HEIGHT) continue;
        if (isUnderUmbrella(col.x, drawY, umbrella.x, umbrella.y)) continue;

        ctx.fillText(col.glyphs[i], col.x, drawY);

        if (drawY > height - CHAR_HEIGHT * 2 && Math.random() < 0.02) {
          spawnSplash(col.x);
        }
      }
    }
  }
}

function drawUmbrella(x, y) {
  const R = UMBRELLA_RADIUS;
  const canopyH = R * 0.75;
  const panelW = (R * 2) / 3;
  const tipDrop = R * 0.35;

  const leftX = x - R;
  const rightX = x + R;
  const domeTop = y - canopyH;
  const panelBaseY = y;

  ctx.save();

  // canopy fill
  ctx.beginPath();
  ctx.moveTo(leftX, y + tipDrop * 0.5);
  ctx.bezierCurveTo(
    leftX,
    y - canopyH * 1.6,
    rightX,
    y - canopyH * 1.6,
    rightX,
    panelBaseY
  );

  let currentX = rightX;
  for (let i = 2; i >= 0; i--) {
    const startX = x - R + panelW * i;
    const endX = x - R + panelW * (i + 1);
    const midX = (startX + endX) / 2;
    ctx.quadraticCurveTo(midX, y + tipDrop, startX, y);
    currentX = startX;
  }

  ctx.closePath();
  ctx.fillStyle = "#6aa2df";
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#2e5d91";
  ctx.stroke();

  // ribs
  ctx.beginPath();
  ctx.moveTo(x, y - canopyH * 0.9);
  ctx.lineTo(x, y + tipDrop * 0.15);
  ctx.moveTo(x - R * 0.52, y - canopyH * 0.48);
  ctx.lineTo(x - R * 0.34, y + tipDrop * 0.12);
  ctx.moveTo(x + R * 0.52, y - canopyH * 0.48);
  ctx.lineTo(x + R * 0.34, y + tipDrop * 0.12);
  ctx.strokeStyle = "rgba(46, 93, 145, 0.45)";
  ctx.stroke();

  // pole
  ctx.beginPath();
  ctx.moveTo(x, domeTop + 4);
  ctx.lineTo(x, y + 80);
  ctx.strokeStyle = "#27496d";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // J-hook handle
  ctx.beginPath();
  ctx.arc(x - 12, y + 80, 12, 0, Math.PI, false);
  ctx.stroke();

  ctx.restore();
}

function drawGroundGlow() {
  const grad = ctx.createLinearGradient(0, height - 90, 0, height);
  grad.addColorStop(0, "rgba(74, 142, 212, 0)");
  grad.addColorStop(1, "rgba(74, 142, 212, 0.08)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, height - 90, width, 90);
}

function render(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  updateUmbrellaTarget(now);
  umbrella.x = lerp(umbrella.x, umbrella.tx, 0.12);
  umbrella.y = lerp(umbrella.y, umbrella.ty, 0.12);

  ctx.clearRect(0, 0, width, height);

  drawGroundGlow();
  drawRain(dt);
  updateAndDrawSplashes(dt);
  drawUmbrella(umbrella.x, umbrella.y);

  requestAnimationFrame(render);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
requestAnimationFrame(render);