import { prepareWithSegments, layoutWithLines } from 'https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.4/+esm';

const canvas = document.getElementById('sand-canvas');
const stage = document.getElementById('sand-stage');
const textInput = document.getElementById('sand-text');
const speedInput = document.getElementById('sand-speed');
const replayButton = document.getElementById('sand-replay');

const ctx = canvas.getContext('2d');

const DPR = Math.max(1, window.devicePixelRatio || 1);
const FONT_SIZE = 42;
const LINE_HEIGHT = 58;
const FONT_FAMILY = '"Georgia", "Times New Roman", serif';
const FONT = `${FONT_SIZE}px ${FONT_FAMILY}`;
const PADDING_X = 40;
const PADDING_Y = 56;

let state = {
  prepared: null,
  lines: [],
  startedAt: 0,
  duration: 5000,
  rafId: 0,
  text: '',
};

function resizeCanvas() {
  const width = stage.clientWidth;
  const height = 520;

  canvas.width = Math.floor(width * DPR);
  canvas.height = Math.floor(height * DPR);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function buildLayout() {
  const text = textInput.value.trim() || 'Pretext sand writing';
  const availableWidth = stage.clientWidth - PADDING_X * 2;

  ctx.font = FONT;

  state.text = text;
  state.prepared = prepareWithSegments(text, FONT, {
    whiteSpace: 'pre-wrap',
  });

  const result = layoutWithLines(state.prepared, availableWidth, LINE_HEIGHT);
  state.lines = result.lines.map((line, index) => ({
    ...line,
    x: PADDING_X,
    y: PADDING_Y + index * LINE_HEIGHT,
    revealStart: index * 0.16,
    revealEnd: index * 0.16 + 0.42,
  }));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function drawSandBackground(width, height) {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const alpha = Math.random() * 0.08;
    const size = Math.random() * 1.8 + 0.2;
    ctx.fillStyle = `rgba(90, 60, 20, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTextReveal(line, progress) {
  const local = clamp((progress - line.revealStart) / (line.revealEnd - line.revealStart), 0, 1);
  if (local <= 0) return;

  const eased = easeOutCubic(local);
  const revealWidth = line.width * eased;

  ctx.save();
  ctx.beginPath();
  ctx.rect(line.x - 2, line.y - FONT_SIZE, revealWidth + 20, LINE_HEIGHT);
  ctx.clip();

  ctx.font = FONT;
  ctx.textBaseline = 'alphabetic';

  ctx.lineWidth = 1.1;
  ctx.strokeStyle = 'rgba(96, 67, 29, 0.55)';
  ctx.strokeText(line.text, line.x, line.y);

  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(255, 235, 190, 0.18)';
  ctx.fillStyle = '#5f4320';
  ctx.fillText(line.text, line.x, line.y);

  ctx.shadowBlur = 0;

  const dustX = line.x + revealWidth;
  for (let i = 0; i < 22; i++) {
    const dx = dustX + (Math.random() - 0.2) * 18;
    const dy = line.y - FONT_SIZE * 0.45 + Math.random() * FONT_SIZE * 0.85;
    const r = Math.random() * 1.7 + 0.2;
    const a = (1 - local) * 0.28 * Math.random();
    ctx.fillStyle = `rgba(120, 88, 38, ${a})`;
    ctx.beginPath();
    ctx.arc(dx, dy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function renderFrame(now) {
  const width = stage.clientWidth;
  const height = 520;
  const elapsed = now - state.startedAt;
  const speed = Number(speedInput.value);
  const progress = clamp(elapsed / (state.duration / speed), 0, 1);

  drawSandBackground(width, height);

  for (const line of state.lines) {
    drawTextReveal(line, progress);
  }

  if (progress < 1) {
    state.rafId = requestAnimationFrame(renderFrame);
  }
}

function replay() {
  cancelAnimationFrame(state.rafId);
  resizeCanvas();
  buildLayout();
  state.startedAt = performance.now();
  state.rafId = requestAnimationFrame(renderFrame);
}

window.addEventListener('resize', replay);
textInput.addEventListener('input', replay);
speedInput.addEventListener('input', replay);
replayButton.addEventListener('click', replay);

resizeCanvas();
replay();