import { prepareWithSegments, layoutNextLineRange, materializeLineRange } from 'https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.4/+esm';

const canvas = document.getElementById('umbrella-canvas');
const stage = document.getElementById('umbrella-stage');
const textInput = document.getElementById('umbrella-text');
const speedInput = document.getElementById('umbrella-speed');
const sizeInput = document.getElementById('umbrella-size');
const toggleButton = document.getElementById('umbrella-toggle');

const ctx = canvas.getContext('2d');

const DPR = Math.max(1, window.devicePixelRatio || 1);
const FONT_SIZE = 24;
const LINE_HEIGHT = 34;
const FONT = `${FONT_SIZE}px Georgia, "Times New Roman", serif`;
const PADDING_X = 32;
const PADDING_Y = 36;
const STAGE_HEIGHT = 620;
const TEXT_COLOR = '#233142';
const GUIDE_COLOR = 'rgba(50, 80, 120, 0.12)';

let state = {
  prepared: null,
  playing: true,
  lastTime: 0,
  umbrellaX: 260,
  direction: 1,
};

function resizeCanvas() {
  const width = stage.clientWidth;
  canvas.width = Math.floor(width * DPR);
  canvas.height = Math.floor(STAGE_HEIGHT * DPR);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${STAGE_HEIGHT}px`;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makePrepared() {
  const text = textInput.value.trim() || 'Pretext umbrella reflow demo';
  state.prepared = prepareWithSegments(text, FONT, {
    whiteSpace: 'normal',
    wordBreak: 'normal',
  });
}

function getStageMetrics() {
  return {
    width: stage.clientWidth,
    height: STAGE_HEIGHT,
    left: PADDING_X,
    right: stage.clientWidth - PADDING_X,
    top: PADDING_Y,
    bottom: STAGE_HEIGHT - PADDING_Y,
  };
}

function getUmbrellaShape() {
  const { width, top } = getStageMetrics();
  const radius = Number(sizeInput.value);
  const x = clamp(state.umbrellaX, radius + 20, width - radius - 20);
  const canopyCenterY = top + 170;
  const canopyBottomY = canopyCenterY + radius * 0.12;

  return {
    x,
    radius,
    canopyCenterY,
    canopyBottomY,
    handleTopY: canopyBottomY + 8,
    handleBottomY: canopyBottomY + radius * 1.25,
    handleHookRadius: radius * 0.16,
  };
}

function umbrellaBlockedRangeAtY(y) {
  const u = getUmbrellaShape();
  const dy = y - u.canopyCenterY;

  let blocked = null;

  // 반원 캐노피
  if (dy >= 0 && dy <= u.radius) {
    const halfWidth = Math.sqrt(Math.max(0, u.radius * u.radius - dy * dy));
    blocked = [u.x - halfWidth, u.x + halfWidth];
  }

  // 손잡이 축
  if (y >= u.handleTopY && y <= u.handleBottomY - u.handleHookRadius * 0.8) {
    const handleHalf = 6;
    const handleRange = [u.x - handleHalf, u.x + handleHalf];
    blocked = mergeRanges(blocked, handleRange);
  }

  // 손잡이 갈고리
  const hookCy = u.handleBottomY - u.handleHookRadius;
  const hookDx = y - hookCy;
  if (Math.abs(hookDx) <= u.handleHookRadius) {
    const horizontal = Math.sqrt(Math.max(0, u.handleHookRadius * u.handleHookRadius - hookDx * hookDx));
    const left = u.x - u.handleHookRadius;
    const hookRange = [left - horizontal, left + horizontal];
    blocked = mergeRanges(blocked, hookRange);
  }

  return blocked;
}

function mergeRanges(a, b) {
  if (!a) return b;
  if (!b) return a;
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
}

function getAvailableSlots(lineY) {
  const { left, right } = getStageMetrics();
  const blocked = umbrellaBlockedRangeAtY(lineY - FONT_SIZE * 0.55);

  if (!blocked) {
    return [{ x: left, width: right - left }];
  }

  const pad = 10;
  const bx1 = clamp(blocked[0] - pad, left, right);
  const bx2 = clamp(blocked[1] + pad, left, right);

  const slots = [];
  if (bx1 > left + 24) {
    slots.push({ x: left, width: bx1 - left });
  }
  if (bx2 < right - 24) {
    slots.push({ x: bx2, width: right - bx2 });
  }

  if (slots.length === 0) {
    return [{ x: left, width: right - left }];
  }

  return slots;
}

function chooseSlotForWidth(slots, width) {
  for (const slot of slots) {
    if (slot.width >= width) return slot;
  }

  return slots.reduce((best, slot) => {
    if (!best) return slot;
    return slot.width > best.width ? slot : best;
  }, null);
}

function buildLinesAroundUmbrella() {
  if (!state.prepared) return [];

  const lines = [];
  let cursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = PADDING_Y + FONT_SIZE;

  for (let guard = 0; guard < 500; guard += 1) {
    const slots = getAvailableSlots(y);
    const primarySlot = chooseSlotForWidth(slots, Infinity) || slots[0];
    const maxWidth = primarySlot.width;

    const range = layoutNextLineRange(state.prepared, cursor, maxWidth);
    if (!range) break;

    const text = materializeLineRange(state.prepared, range);
    const slot = chooseSlotForWidth(slots, range.width) || slots[0];

    lines.push({
      text,
      x: slot.x,
      y,
      width: range.width,
      slotWidth: slot.width,
      start: range.start,
      end: range.end,
    });

    cursor = {
      segmentIndex: range.end.segmentIndex,
      graphemeIndex: range.end.graphemeIndex,
    };

    y += LINE_HEIGHT;
    if (y > STAGE_HEIGHT - 20) break;
  }

  return lines;
}

function drawBackground() {
  const { width, height } = getStageMetrics();
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = GUIDE_COLOR;
  ctx.lineWidth = 1;

  for (let y = PADDING_Y; y < height - PADDING_Y; y += LINE_HEIGHT) {
    ctx.beginPath();
    ctx.moveTo(PADDING_X, y + FONT_SIZE * 0.45);
    ctx.lineTo(width - PADDING_X, y + FONT_SIZE * 0.45);
    ctx.stroke();
  }
}

function drawUmbrella() {
  const u = getUmbrellaShape();

  ctx.save();

  // canopy
  const grad = ctx.createLinearGradient(u.x, u.canopyCenterY, u.x, u.canopyCenterY + u.radius);
  grad.addColorStop(0, '#506d92');
  grad.addColorStop(1, '#314764');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(u.x, u.canopyCenterY, u.radius, Math.PI, 0, false);

  const scallop = 4;
  const step = (u.radius * 2) / scallop;
  for (let i = 0; i < scallop; i += 1) {
    const cx = u.x - u.radius + step * (i + 0.5);
    ctx.arc(cx, u.canopyCenterY, step / 2, 0, Math.PI, true);
  }
  ctx.closePath();
  ctx.fill();

  // shaft
  ctx.strokeStyle = '#405066';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(u.x, u.handleTopY);
  ctx.lineTo(u.x, u.handleBottomY - u.handleHookRadius);
  ctx.stroke();

  // hook
  ctx.beginPath();
  ctx.arc(
    u.x - u.handleHookRadius,
    u.handleBottomY - u.handleHookRadius,
    u.handleHookRadius,
    0,
    Math.PI * 1.2,
    false
  );
  ctx.stroke();

  ctx.restore();
}

function drawText(lines) {
  ctx.save();
  ctx.font = FONT;
  ctx.fillStyle = TEXT_COLOR;
  ctx.textBaseline = 'alphabetic';

  for (const line of lines) {
    ctx.fillText(line.text, line.x, line.y);
  }

  ctx.restore();
}

function stepUmbrella(deltaMs) {
  if (!state.playing) return;

  const speed = Number(speedInput.value);
  const { width } = getStageMetrics();
  const radius = Number(sizeInput.value);
  const minX = radius + 24;
  const maxX = width - radius - 24;
  const velocity = 0.11 * speed * deltaMs;

  state.umbrellaX += velocity * state.direction;

  if (state.umbrellaX >= maxX) {
    state.umbrellaX = maxX;
    state.direction = -1;
  } else if (state.umbrellaX <= minX) {
    state.umbrellaX = minX;
    state.direction = 1;
  }
}

function render(now) {
  if (!state.lastTime) state.lastTime = now;
  const delta = now - state.lastTime;
  state.lastTime = now;

  stepUmbrella(delta);

  drawBackground();
  const lines = buildLinesAroundUmbrella();
  drawText(lines);
  drawUmbrella();

  requestAnimationFrame(render);
}

function rebuild() {
  resizeCanvas();
  ctx.font = FONT;
  makePrepared();
}

textInput.addEventListener('input', rebuild);
sizeInput.addEventListener('input', rebuild);
window.addEventListener('resize', rebuild);

toggleButton.addEventListener('click', () => {
  state.playing = !state.playing;
  toggleButton.textContent = state.playing ? '일시정지' : '재생';
});

rebuild();
requestAnimationFrame(render);