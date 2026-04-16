(() => {
  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d');

  const sourceText = document.getElementById('sourceText');
  const speedRange = document.getElementById('speedRange');
  const sizeRange = document.getElementById('sizeRange');
  const gapRange = document.getElementById('gapRange');
  const rebuildBtn = document.getElementById('rebuildBtn');
  const toggleBtn = document.getElementById('toggleBtn');

  const DPR = Math.max(1, window.devicePixelRatio || 1);
  const STAGE_HEIGHT = 720;
  const PAD_X = 26;
  const PAD_Y = 24;

  const state = {
    width: 0,
    height: STAGE_HEIGHT,
    chars: [],
    columns: [],
    lastTime: 0,
    playing: true,
    dragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    pointerId: null,
    isCoarse: window.matchMedia('(pointer: coarse)').matches,
    swayPhase: 0,
    umbrella: {
      x: 0,
      y: 0,
      r: 140,
    },
  };

  function getFontSize() {
    return state.width < 700 ? 19 : 22;
  }

  function getColumnGap() {
    return Number(gapRange.value);
  }

  function getFallMultiplier() {
    return Number(speedRange.value);
  }

  function getUmbrellaRadius() {
    return Number(sizeRange.value);
  }

  function normalizeText(text) {
    return (text || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    state.width = Math.max(320, Math.floor(rect.width));
    state.height = STAGE_HEIGHT;

    canvas.width = Math.floor(state.width * DPR);
    canvas.height = Math.floor(state.height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    if (!state.umbrella.x) {
      state.umbrella.x = state.width * 0.5;
    } else {
      state.umbrella.x = clamp(state.umbrella.x, 60, state.width - 60);
    }

    if (!state.umbrella.y) {
      state.umbrella.y = Math.min(260, state.height * 0.35);
    }

    state.umbrella.r = getUmbrellaRadius();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function rebuildColumnsAndChars() {
    state.umbrella.r = getUmbrellaRadius();

    const text = normalizeText(sourceText.value);
    const chars = text.length ? Array.from(text) : Array.from('Umbrella text rain demo');

    const gap = getColumnGap();
    const fontSize = getFontSize();
    const left = PAD_X;
    const right = state.width - PAD_X;
    const topSpawn = -40;
    const bottom = state.height + 40;

    ctx.font = `${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.textBaseline = 'alphabetic';

    const columns = [];
    for (let x = left; x <= right; x += gap) {
      columns.push({
        x,
        yCursor: random(-220, 0),
      });
    }

    if (!columns.length) {
      columns.push({ x: state.width / 2, yCursor: -40 });
    }

    const particles = [];
    let columnIndex = 0;

    for (const char of chars) {
      const col = columns[columnIndex];
      const isSpace = char === ' ';
      const fontJitter = random(-1.5, 1.5);
      const speed = random(58, 115) * getFallMultiplier();

      particles.push({
        char,
        x: col.x + random(-1.1, 1.1),
        y: col.yCursor,
        speed,
        columnIndex,
        alpha: isSpace ? 0 : random(0.5, 0.92),
        fontSize: fontSize + fontJitter,
        resetTop: topSpawn - random(0, 280),
        bottom,
        width: isSpace ? gap * 0.35 : ctx.measureText(char).width,
      });

      col.yCursor -= fontSize * random(1.08, 1.42);

      columnIndex += 1;
      if (columnIndex >= columns.length) {
        columnIndex = 0;
      }
    }

    state.columns = columns;
    state.chars = particles;
  }

  function updateCharMetrics() {
    const fontSize = getFontSize();
    ctx.textBaseline = 'alphabetic';

    for (const particle of state.chars) {
      particle.fontSize = clamp(particle.fontSize, fontSize - 2, fontSize + 2);
      ctx.font = `${particle.fontSize}px Georgia, "Times New Roman", serif`;
      particle.width = particle.char === ' ' ? getColumnGap() * 0.35 : ctx.measureText(particle.char).width;
      particle.bottom = state.height + 40;
    }
  }

  function drawBackground() {
    ctx.clearRect(0, 0, state.width, state.height);

    const g = ctx.createLinearGradient(0, 0, 0, state.height);
    g.addColorStop(0, '#f8fbff');
    g.addColorStop(1, '#eaf2f8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, state.width, state.height);

    ctx.strokeStyle = 'rgba(94, 126, 160, 0.12)';
    ctx.lineWidth = 1;

    const lineGap = 42;
    for (let y = 18; y < state.height; y += lineGap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(state.width, y);
      ctx.stroke();
    }

    for (let i = 0; i < 28; i += 1) {
      const x = (i / 28) * state.width;
      ctx.strokeStyle = 'rgba(120, 150, 180, 0.03)';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, state.height);
      ctx.stroke();
    }
  }

  function getUmbrellaGeometry() {
    const r = state.umbrella.r;
    const x = state.umbrella.x;
    const y = state.umbrella.y;
    const shaftTop = y + r * 0.22;
    const shaftBottom = shaftTop + r * 1.35;
    const hookR = r * 0.18;

    return {
      x,
      y,
      r,
      shaftTop,
      shaftBottom,
      hookR,
    };
  }

  function isBlockedByUmbrella(px, py) {
    const u = getUmbrellaGeometry();

    const canopyDy = py - u.y;
    if (canopyDy >= 0 && canopyDy <= u.r) {
      const dx = px - u.x;
      const canopyEq = (dx * dx) / (u.r * u.r) + (canopyDy * canopyDy) / (u.r * u.r);
      if (canopyEq <= 1) {
        return true;
      }
    }

    if (py >= u.shaftTop && py <= u.shaftBottom - u.hookR * 0.7) {
      if (Math.abs(px - u.x) <= 6) {
        return true;
      }
    }

    const hookCx = u.x - u.hookR;
    const hookCy = u.shaftBottom - u.hookR;
    const hookDx = px - hookCx;
    const hookDy = py - hookCy;
    const hookDist = Math.sqrt(hookDx * hookDx + hookDy * hookDy);

    if (
      hookDist >= u.hookR - 4 &&
      hookDist <= u.hookR + 4 &&
      px <= u.x - 1 &&
      py >= hookCy - u.hookR - 2
    ) {
      return true;
    }

    return false;
  }

  function drawShelteredZoneTint() {
    const u = getUmbrellaGeometry();

    const grad = ctx.createLinearGradient(u.x, u.y + u.r * 0.45, u.x, state.height);
    grad.addColorStop(0, 'rgba(255,255,255,0.00)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.18)');
    grad.addColorStop(1, 'rgba(255,255,255,0.26)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(u.x - u.r * 0.92, u.y + u.r * 0.28);
    ctx.quadraticCurveTo(u.x, u.y + u.r * 0.55, u.x + u.r * 0.92, u.y + u.r * 0.28);
    ctx.lineTo(u.x + u.r * 0.52, state.height);
    ctx.lineTo(u.x - u.r * 0.52, state.height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function drawChars() {
    for (const particle of state.chars) {
      if (particle.char === ' ') continue;

      const blocked = isBlockedByUmbrella(particle.x, particle.y - particle.fontSize * 0.65);
      if (blocked) continue;

      ctx.font = `${particle.fontSize}px Georgia, "Times New Roman", serif`;
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = `rgba(42, 58, 78, ${particle.alpha})`;
      ctx.fillText(particle.char, particle.x - particle.width / 2, particle.y);
    }
  }

  function drawRainStreaks() {
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';

    for (const particle of state.chars) {
      if (particle.char === ' ') continue;

      const blocked = isBlockedByUmbrella(particle.x, particle.y - particle.fontSize * 0.65);
      if (blocked) continue;

      ctx.strokeStyle = 'rgba(110, 145, 180, 0.10)';
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y - particle.fontSize * 1.15);
      ctx.lineTo(particle.x, particle.y - 4);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawUmbrella() {
    const u = getUmbrellaGeometry();

    ctx.save();

    const grad = ctx.createLinearGradient(u.x, u.y, u.x, u.y + u.r);
    grad.addColorStop(0, '#6788b1');
    grad.addColorStop(1, '#455c79');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(u.x, u.y + u.r, u.r, Math.PI, 0, false);

    const scallopCount = 4;
    const span = (u.r * 2) / scallopCount;
    for (let i = 0; i < scallopCount; i += 1) {
      const cx = u.x - u.r + span * (i + 0.5);
      ctx.arc(cx, u.y + u.r, span / 2, 0, Math.PI, true);
    }
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(42, 58, 78, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.strokeStyle = '#4b6078';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(u.x, u.shaftTop);
    ctx.lineTo(u.x, u.shaftBottom - u.hookR);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(u.x - u.hookR, u.shaftBottom - u.hookR, u.hookR, 0, Math.PI * 1.18, false);
    ctx.stroke();

    ctx.restore();
  }

  function drawDragHandleHint() {
    if (state.isCoarse) return;

    const u = getUmbrellaGeometry();
    ctx.save();
    ctx.fillStyle = 'rgba(42, 58, 78, 0.08)';
    ctx.beginPath();
    ctx.arc(u.x, u.y + u.r * 0.55, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function updateParticles(deltaMs) {
    if (!state.playing) return;

    const dt = deltaMs / 1000;

    for (const particle of state.chars) {
      particle.y += particle.speed * dt;

      if (particle.y > particle.bottom) {
        particle.y = particle.resetTop - random(0, 120);
      }
    }
  }

  function updateUmbrellaMotion(deltaMs) {
    state.umbrella.r = getUmbrellaRadius();

    if (state.isCoarse) {
      state.swayPhase += deltaMs * 0.0012 * getFallMultiplier();
      const range = Math.min(140, state.width * 0.18);
      state.umbrella.x = state.width * 0.5 + Math.sin(state.swayPhase) * range;
      state.umbrella.y = Math.min(250, state.height * 0.34) + Math.sin(state.swayPhase * 0.55) * 10;
    } else {
      state.umbrella.x = clamp(state.umbrella.x, 40 + state.umbrella.r, state.width - 40 - state.umbrella.r);
      state.umbrella.y = clamp(state.umbrella.y, 90, state.height * 0.5);
    }
  }

  function render(now) {
    if (!state.lastTime) state.lastTime = now;
    const deltaMs = Math.min(40, now - state.lastTime);
    state.lastTime = now;

    updateUmbrellaMotion(deltaMs);
    updateParticles(deltaMs);

    drawBackground();
    drawShelteredZoneTint();
    drawRainStreaks();
    drawChars();
    drawUmbrella();
    drawDragHandleHint();

    requestAnimationFrame(render);
  }

  function pointerToCanvas(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function isPointerOnUmbrella(px, py) {
    const u = getUmbrellaGeometry();
    const dx = px - u.x;
    const dy = py - (u.y + u.r * 0.9);
    return Math.sqrt(dx * dx + dy * dy) <= u.r * 1.05;
  }

  function onPointerDown(e) {
    if (state.isCoarse) return;

    const p = pointerToCanvas(e);
    if (!isPointerOnUmbrella(p.x, p.y)) return;

    state.dragging = true;
    state.pointerId = e.pointerId;
    state.dragOffsetX = p.x - state.umbrella.x;
    state.dragOffsetY = p.y - state.umbrella.y;

    canvas.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (state.isCoarse) return;
    if (!state.dragging) return;
    if (state.pointerId !== e.pointerId) return;

    const p = pointerToCanvas(e);
    state.umbrella.x = p.x - state.dragOffsetX;
    state.umbrella.y = p.y - state.dragOffsetY;
  }

  function onPointerUp(e) {
    if (state.pointerId !== e.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
  }

  function onResize() {
    resizeCanvas();
    rebuildColumnsAndChars();
    updateCharMetrics();
  }

  function rebuildAll() {
    resizeCanvas();
    rebuildColumnsAndChars();
    updateCharMetrics();
  }

  function togglePlay() {
    state.playing = !state.playing;
    toggleBtn.textContent = state.playing ? '일시정지' : '재생';
  }

  rebuildBtn.addEventListener('click', rebuildAll);
  toggleBtn.addEventListener('click', togglePlay);

  sourceText.addEventListener('input', rebuildAll);
  speedRange.addEventListener('input', rebuildAll);
  sizeRange.addEventListener('input', () => {
    state.umbrella.r = getUmbrellaRadius();
  });
  gapRange.addEventListener('input', rebuildAll);

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('resize', onResize);

  resizeCanvas();
  rebuildColumnsAndChars();
  updateCharMetrics();
  requestAnimationFrame(render);
})();