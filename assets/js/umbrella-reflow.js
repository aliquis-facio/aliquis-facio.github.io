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

// 가로:세로 비율 = 5:4
const UMBRELLA_WIDTH = 220;   // 이미지 표시 크기
const UMBRELLA_HEIGHT = 176;  // 이미지 표시 크기

// 충돌 판정용 우산 반경/높이
const UMBRELLA_RADIUS = 65;
const HANDLE_LEN = 80;

const SPLASH_GRAVITY = 120;
const MAX_SPLASHES = 500;

const PHRASE = "umbrella reflow sheltered text rain ";
const MOBILE_MEDIA = window.matchMedia("(pointer: coarse), (max-width: 768px)");

const UMBRELLA_SRC = canvas.dataset.umbrellaSrc;

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

const umbrellaImg = new Image();
let umbrellaImgLoaded = false;
umbrellaImg.src = UMBRELLA_SRC;
umbrellaImg.onload = () => {
  umbrellaImgLoaded = true;
};
umbrellaImg.onerror = () => {
  console.error("Failed to load umbrella image:", UMBRELLA_SRC);
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
  const charsNeeded = Math.ceil((targetHeight * 2) / CHAR_HEIGHT) + 10;

  let raw = "";
  while (raw.length < charsNeeded) {
    raw += phrase;
  }

  raw = raw.replace(/ /g, "·");

  const prepared = prepareWithSegments(raw, FONT, {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
  });

  const { lines } = layoutWithLines(prepared, 1, CHAR_HEIGHT);

  const glyphs = [];
  for (const line of lines) {
    if (!line.text) continue;
    glyphs.push(line.text);
  }

  return glyphs;
}

function createColumns() {
  columns = [];
  const colCount = Math.floor(width / COL_SPACING);
  const glyphs = buildColumnGlyphs(PHRASE, height);
  
  for (let i = 0; i < colCount; i++) {
    const depth = Math.random(); // 0: 배경, 1: 전경
    const lightness = 68 - depth * 14; // 전경일수록 조금 더 진하게
    const rainColor = `hsl(212 62% ${lightness}%)`;

    columns.push({
      x: i * COL_SPACING + COL_SPACING / 2,
      glyphs,
      y: Math.random() * height,

      // 전경일수록 조금 빠르게
      speed: 52 + depth * 26 + Math.random() * 14,
      // 전경일수록 더 많이 보이게
      density: 0.28 + depth * 0.32 + Math.random() * 0.12,
      // 전경일수록 진하게
      alpha: 0.20 + depth * 0.45,
      color: rainColor,
      // 전경일수록 살짝 크게
      fontScale: 0.92 + depth * 0.16,
      depth,
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
  const canopyTop = uy - UMBRELLA_HEIGHT * 0.36;
  const canopyBottom = uy + UMBRELLA_HEIGHT * 0.08;
  const groundY = height;

  // 우산 위쪽은 보호 안 됨
  if (py < canopyTop) return false;

  // 1) 캐노피 자체 영역
  // 위쪽은 둥근 우산 느낌 나게 타원으로 판정
  const domeCenterY = uy - UMBRELLA_HEIGHT * 0.10;
  const rx = UMBRELLA_WIDTH * 0.46;
  const ry = UMBRELLA_HEIGHT * 0.30;

  const dx = px - ux;
  const dy = py - domeCenterY;

  const inDome = ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)) <= 1.0;
  if (py <= canopyBottom && inDome) return true;

  // 2) 우산 아래 sheltered zone
  // 우산 밑면에서 시작해서 바닥까지 내려가며 폭이 점점 줄어듦
  if (py > canopyBottom && py <= groundY) {
    const t = (py - canopyBottom) / (groundY - canopyBottom);

    // 완만하게 줄어들도록 ease-out
    const eased = 1 - Math.pow(1 - t, 2);

    const topHalfWidth = UMBRELLA_WIDTH * 0.42;
    const bottomHalfWidth = UMBRELLA_WIDTH * 0.22;

    const currentHalfWidth =
      topHalfWidth + (bottomHalfWidth - topHalfWidth) * eased;

    return Math.abs(px - ux) <= currentHalfWidth;
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

function pseudoRandom(seed) {
  const x = Math.sin(seed * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}

function drawRain(dt) {
  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    const col = columns[colIndex];
    col.y += col.speed * dt;

    const blockH = col.glyphs.length * CHAR_HEIGHT;
    if (col.y >= blockH) col.y -= blockH;

    const fontSize = FONT_SIZE * col.fontScale;
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;

    for (let i = 0; i < col.glyphs.length; i++) {
      const baseY = i * CHAR_HEIGHT + col.y;
      const drawPositions = [baseY - blockH, baseY];

      for (const drawY of drawPositions) {
        if (drawY < -CHAR_HEIGHT || drawY > height + CHAR_HEIGHT) continue;
        // 깊이에 따라 sheltered zone 적용 강도 차등
        // 먼 배경 비는 우산 뒤로 지나가고 가까울수록 차단
        const shelterStrength = Math.max(0, Math.min(1, (col.depth - 0.12) / 0.78));
        const blockedByUmbrella =
          isUnderUmbrella(col.x, drawY, umbrella.x, umbrella.y) &&
          pseudoRandom(colIndex * 10000 + i + 777) < shelterStrength;

        if (blockedByUmbrella) continue;

        const seed = colIndex * 10000 + i;
        const keep = pseudoRandom(seed) < col.density;
        if (!keep) continue;

        // 각 문자마다 약간의 밝기/투명도 차이
        const flicker = 0.82 + pseudoRandom(seed + 31) * 0.28;
        const alpha = Math.min(1, col.alpha * flicker);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = col.color;
        ctx.fillText(col.glyphs[i], col.x, drawY);

        if (drawY > height - CHAR_HEIGHT * 2 && Math.random() < 0.005) {
          spawnSplash(col.x);
        }
      }
    }
  }

  ctx.globalAlpha = 1;
  ctx.font = FONT;
}

function drawUmbrellaImage(x, y) {
  if (!umbrellaImgLoaded) return;

  ctx.save();

  // x, y를 우산 중앙 기준으로 사용
  const drawX = x - UMBRELLA_WIDTH / 2;
  const drawY = y - UMBRELLA_HEIGHT * 0.46;

  ctx.drawImage(
    umbrellaImg,
    drawX,
    drawY,
    UMBRELLA_WIDTH,
    UMBRELLA_HEIGHT
  );

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
  drawUmbrellaImage(umbrella.x, umbrella.y);

  requestAnimationFrame(render);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
requestAnimationFrame(render);