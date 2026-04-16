---
layout: page
title: About
sidebar_link: true
---

<!-- markdownlint-disable MD025 MD033 -->

# pretext 테스트

`@chenglou/pretext`를 사용해서 텍스트의 줄 수와 높이를 DOM 측정 없이 계산하는 예제다.

<div class="pretext-demo">
  <label for="pretext-width"><strong>너비(px)</strong></label>
  <input id="pretext-width" type="range" min="180" max="720" step="10" value="360" />
  <p>현재 너비: <span id="pretext-width-value">360px</span></p>

  <label for="pretext-input"><strong>텍스트</strong></label>
  <textarea id="pretext-input" rows="8" style="width: 100%; margin-bottom: 1rem;">
안녕하세요.
이 페이지는 pretext를 Jekyll GitHub Pages 블로그에 붙인 예제입니다.
한글 문장에서 줄바꿈이 어떻게 계산되는지 확인할 수 있습니다.
  </textarea>

  <p>예상 높이: <strong id="pretext-height">0px</strong></p>
  <p>예상 줄 수: <strong id="pretext-lines">0</strong></p>

  <div
    id="pretext-preview"
    style="border: 1px solid #d0d7de; padding: 16px; border-radius: 8px; background: #fff;"
  ></div>
</div>

<script type="module" src="/assets/js/pretext-demo.js"></script>

---

<style>
  .manuscript-shell {
    --paper: #f4ebd0;
    --ink: #2f2418;
    --muted: #6d5d49;
    --accent: #9b2c2c;
    --gold: #b78628;
    max-width: 1200px;
    margin: 0 auto;
    color: var(--ink);
  }

  .manuscript-hero {
    padding: 24px 0 8px;
  }

  .manuscript-kicker {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .manuscript-title {
    font-size: clamp(2rem, 5vw, 4.5rem);
    line-height: 0.95;
    margin: 0 0 10px;
    font-weight: 700;
  }

  .manuscript-subtitle {
    max-width: 720px;
    font-size: 1rem;
    line-height: 1.8;
    color: var(--muted);
    margin: 0;
  }

  .manuscript-grid {
    display: grid;
    grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
    gap: 28px;
    align-items: start;
    margin-top: 28px;
  }

  .manuscript-panel,
  .manuscript-stage {
    background: linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08)), var(--paper);
    border: 1px solid rgba(65, 45, 18, 0.15);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(47, 36, 24, 0.08);
  }

  .manuscript-panel {
    padding: 20px;
    position: sticky;
    top: 24px;
  }

  .manuscript-panel h2,
  .manuscript-stage h2 {
    margin: 0 0 12px;
    font-size: 1rem;
  }

  .manuscript-field {
    margin-bottom: 16px;
  }

  .manuscript-field label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 8px;
    color: var(--muted);
  }

  .manuscript-field textarea {
    width: 100%;
    min-height: 220px;
    resize: vertical;
    border: 1px solid rgba(65, 45, 18, 0.18);
    border-radius: 14px;
    background: rgba(255,255,255,0.55);
    color: var(--ink);
    padding: 14px;
    font: 400 16px/1.7 Georgia, "Times New Roman", serif;
    box-sizing: border-box;
  }

  .manuscript-field input[type="range"] {
    width: 100%;
  }

  .manuscript-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
  }

  .manuscript-stat {
    background: rgba(255,255,255,0.42);
    border-radius: 14px;
    padding: 12px;
    border: 1px solid rgba(65, 45, 18, 0.12);
  }

  .manuscript-stat .label {
    display: block;
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .manuscript-stat .value {
    font-size: 1.05rem;
    font-weight: 700;
  }

  .manuscript-stage {
    padding: 20px;
  }

  .manuscript-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
    color: var(--muted);
    font-size: 0.88rem;
    margin-bottom: 14px;
  }

  .manuscript-canvas {
    position: relative;
    min-height: 860px;
    border-radius: 18px;
    overflow: hidden;
    padding: 38px;
    background:
      radial-gradient(circle at top left, rgba(183, 134, 40, 0.16), transparent 28%),
      radial-gradient(circle at bottom right, rgba(155, 44, 44, 0.10), transparent 22%),
      linear-gradient(180deg, rgba(255,255,255,0.26), rgba(255,255,255,0.1)),
      var(--paper);
    box-sizing: border-box;
  }

  .manuscript-canvas::before {
    content: "";
    position: absolute;
    inset: 16px;
    border: 1px solid rgba(65, 45, 18, 0.1);
    border-radius: 12px;
    pointer-events: none;
  }

  .manuscript-copy {
    position: relative;
    z-index: 1;
    font: 400 28px/1.45 Georgia, "Times New Roman", serif;
    color: var(--ink);
    min-height: 720px;
  }

  .manuscript-line {
    position: absolute;
    white-space: pre;
    transform-origin: left center;
  }

  .manuscript-dropcap {
    position: absolute;
    z-index: 2;
    width: 196px;
    height: 196px;
    cursor: grab;
    user-select: none;
    touch-action: none;
    filter: drop-shadow(0 16px 26px rgba(47, 36, 24, 0.18));
  }

  .manuscript-dropcap:active {
    cursor: grabbing;
  }

  .manuscript-note {
    margin-top: 14px;
    color: var(--muted);
    font-size: 0.88rem;
    line-height: 1.6;
  }

  .manuscript-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 6px 12px;
    background: rgba(255,255,255,0.42);
    border: 1px solid rgba(65, 45, 18, 0.1);
  }

  @media (max-width: 960px) {
    .manuscript-grid {
      grid-template-columns: 1fr;
    }

    .manuscript-panel {
      position: static;
    }

    .manuscript-canvas {
      min-height: 760px;
      padding: 24px;
    }

    .manuscript-copy {
      font-size: 24px;
    }

    .manuscript-dropcap {
      width: 168px;
      height: 168px;
    }
  }
</style>

<div class="manuscript-shell">
  <section class="manuscript-hero">
    <div class="manuscript-kicker">Interactive illuminated typography</div>
    <h1 class="manuscript-title">Pretext Manuscript Demo</h1>
    <p class="manuscript-subtitle">
      장식 이니셜을 드래그하면 본문 줄이 즉시 다시 흐르도록 만든 데모입니다.
      `pretext`의 수동 라인 레이아웃 API로 각 줄의 너비를 바꿔가며 배치합니다.
    </p>
  </section>

  <section class="manuscript-grid">
    <aside class="manuscript-panel">
      <h2>Controls</h2>

      <div class="manuscript-field">
        <label for="demo-text">본문</label>
        <textarea id="demo-text">Behold the patient parchment, where the letter is not merely read but inhabited. Drag the illuminated initial and watch the text yield around it, as if the margin itself were alive.

In a medieval manuscript, ornament was not decoration alone. It was threshold, rhythm, and emphasis. Here we reinterpret that behavior with browser typography and live reflow.

This page uses Pretext to measure and lay out each line without DOM reflow-based height guessing.</textarea>
      </div>

      <div class="manuscript-field">
        <label for="demo-font-size">본문 크기: <strong id="demo-font-size-value">28px</strong></label>
        <input id="demo-font-size" type="range" min="20" max="40" step="1" value="28" />
      </div>

      <div class="manuscript-field">
        <label for="demo-column-width">본문 너비: <strong id="demo-column-width-value">640px</strong></label>
        <input id="demo-column-width" type="range" min="360" max="820" step="10" value="640" />
      </div>

      <div class="manuscript-stats">
        <div class="manuscript-stat">
          <span class="label">Lines</span>
          <span class="value" id="demo-line-count">0</span>
        </div>
        <div class="manuscript-stat">
          <span class="label">Height</span>
          <span class="value" id="demo-height">0px</span>
        </div>
        <div class="manuscript-stat">
          <span class="label">Inset</span>
          <span class="value" id="demo-inset">0px</span>
        </div>
      </div>

      <p class="manuscript-note">
        드롭 캡은 마우스나 터치로 움직일 수 있습니다. 오브젝트가 차지하는 세로 구간에서는 줄 너비가 줄어들고,
        그 아래 구간부터는 전체 너비로 다시 배치됩니다.
      </p>
    </aside>

    <section class="manuscript-stage">
      <h2>Canvas</h2>
      <div class="manuscript-meta">
        <span class="manuscript-chip">`prepareWithSegments()`</span>
        <span class="manuscript-chip">`layoutNextLineRange()`</span>
        <span class="manuscript-chip">manual line rendering</span>
      </div>

      <div id="demo-canvas" class="manuscript-canvas">
        <svg id="demo-dropcap" class="manuscript-dropcap" viewBox="0 0 220 220" aria-hidden="true">
          <defs>
            <linearGradient id="capGold" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#d8b35d" />
              <stop offset="100%" stop-color="#9d6c17" />
            </linearGradient>
            <linearGradient id="capRed" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#b33a3a" />
              <stop offset="100%" stop-color="#6b1717" />
            </linearGradient>
          </defs>
          <rect x="12" y="12" width="196" height="196" rx="28" fill="#f8f1da" stroke="url(#capGold)" stroke-width="6" />
          <rect x="24" y="24" width="172" height="172" rx="20" fill="none" stroke="#a8832d" stroke-width="1.5" stroke-dasharray="4 7" />
          <path d="M62 164V58h54c28 0 47 14 47 38 0 18-9 30-28 36l34 32h-35l-29-28H95v28H62zm33-53h18c12 0 19-6 19-16 0-10-7-15-19-15H95v31z" fill="url(#capRed)" />
          <path d="M157 46c18 9 28 24 30 46-12-10-22-15-31-15 4 14 2 29-7 45-5-11-12-19-22-24 12-5 21-14 27-27-10 2-19 1-29-4 12-13 23-20 32-21z" fill="url(#capGold)" opacity="0.92" />
          <circle cx="164" cy="68" r="4" fill="#4c2b12" />
          <path d="M43 47c12 2 24 8 35 20-11 0-19 3-24 8-2-10-6-19-11-28z" fill="#8f2323" opacity="0.8" />
        </svg>
        <div id="demo-copy" class="manuscript-copy"></div>
      </div>
      <p class="manuscript-note">
        목표는 원본 사이트를 복제하는 것이 아니라, 그 무드와 핵심 상호작용을 GitHub Pages/Jekyll에서 바로 테스트 가능한 형태로 옮기는 것입니다.
      </p>
    </section>
  </section>
</div>

<script type="module">
  import {
    prepareWithSegments,
    layoutNextLineRange,
    materializeLineRange,
  } from 'https://esm.sh/@chenglou/pretext'

  const textEl = document.getElementById('demo-text')
  const fontSizeEl = document.getElementById('demo-font-size')
  const fontSizeValueEl = document.getElementById('demo-font-size-value')
  const columnWidthEl = document.getElementById('demo-column-width')
  const columnWidthValueEl = document.getElementById('demo-column-width-value')
  const lineCountEl = document.getElementById('demo-line-count')
  const heightEl = document.getElementById('demo-height')
  const insetEl = document.getElementById('demo-inset')
  const canvasEl = document.getElementById('demo-canvas')
  const copyEl = document.getElementById('demo-copy')
  const dropcapEl = document.getElementById('demo-dropcap')

  const state = {
    prepared: null,
    fontSize: Number(fontSizeEl.value),
    lineHeight: Number(fontSizeEl.value) * 1.45,
    columnWidth: Number(columnWidthEl.value),
    textInset: 176,
    dropcap: { x: 28, y: 28, width: 196, height: 196 },
    dragging: null,
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function buildFont() {
    return `400 ${state.fontSize}px Georgia, "Times New Roman", serif`
  }

  function getLineMetrics() {
    const paddingX = window.innerWidth <= 960 ? 24 : 38
    const usableWidth = state.columnWidth
    const startX = paddingX
    const startY = paddingX + state.fontSize * 0.95
    return { paddingX, usableWidth, startX, startY }
  }

  function reprepare() {
    state.lineHeight = state.fontSize * 1.45
    state.prepared = prepareWithSegments(textEl.value, buildFont(), {
      whiteSpace: 'pre-wrap',
      wordBreak: 'keep-all',
    })
  }

  function lineInsetAt(y) {
    const { startY } = getLineMetrics()
    const lineTop = y - state.fontSize
    const lineBottom = lineTop + state.lineHeight

    const shapeTop = state.dropcap.y
    const shapeBottom = state.dropcap.y + state.dropcap.height

    const overlaps = lineBottom > shapeTop && lineTop < shapeBottom
    if (!overlaps) return 0

    return state.dropcap.x + state.dropcap.width - getLineMetrics().startX + 20
  }

  function renderText() {
    if (!state.prepared) return

    copyEl.innerHTML = ''
    copyEl.style.font = buildFont()
    copyEl.style.lineHeight = `${state.lineHeight}px`
    copyEl.style.width = `${state.columnWidth}px`

    const { startX, startY, usableWidth, paddingX } = getLineMetrics()
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }
    let lineIndex = 0
    let maxBottom = startY
    let maxInset = 0

    while (true) {
      const y = startY + lineIndex * state.lineHeight
      const inset = lineInsetAt(y)
      const width = Math.max(80, usableWidth - inset)
      const range = layoutNextLineRange(state.prepared, cursor, width)
      if (range === null) break

      const line = materializeLineRange(state.prepared, range)
      const div = document.createElement('div')
      div.className = 'manuscript-line'
      div.textContent = line.text
      div.style.left = `${startX + inset}px`
      div.style.top = `${y}px`
      div.style.width = `${line.width}px`
      copyEl.appendChild(div)

      maxBottom = y + state.lineHeight
      maxInset = Math.max(maxInset, inset)
      cursor = range.end
      lineIndex += 1
    }

    copyEl.style.minHeight = `${Math.max(720, maxBottom - paddingX + 40)}px`
    canvasEl.style.minHeight = `${Math.max(860, maxBottom + 80)}px`
    lineCountEl.textContent = String(lineIndex)
    heightEl.textContent = `${Math.round(maxBottom)}px`
    insetEl.textContent = `${Math.round(maxInset)}px`
  }

  function renderDropcap() {
    dropcapEl.style.left = `${state.dropcap.x}px`
    dropcapEl.style.top = `${state.dropcap.y}px`
    dropcapEl.style.width = `${state.dropcap.width}px`
    dropcapEl.style.height = `${state.dropcap.height}px`
  }

  function syncLabels() {
    fontSizeValueEl.textContent = `${state.fontSize}px`
    columnWidthValueEl.textContent = `${state.columnWidth}px`
  }

  function rerender() {
    syncLabels()
    renderDropcap()
    renderText()
  }

  textEl.addEventListener('input', () => {
    reprepare()
    rerender()
  })

  fontSizeEl.addEventListener('input', () => {
    state.fontSize = Number(fontSizeEl.value)
    reprepare()
    rerender()
  })

  columnWidthEl.addEventListener('input', () => {
    state.columnWidth = Number(columnWidthEl.value)
    rerender()
  })

  function pointerPosition(event) {
    const rect = canvasEl.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      rect,
    }
  }

  dropcapEl.addEventListener('pointerdown', event => {
    const pos = pointerPosition(event)
    state.dragging = {
      offsetX: pos.x - state.dropcap.x,
      offsetY: pos.y - state.dropcap.y,
    }
    dropcapEl.setPointerCapture(event.pointerId)
  })

  dropcapEl.addEventListener('pointermove', event => {
    if (!state.dragging) return

    const pos = pointerPosition(event)
    const maxX = Math.max(24, state.columnWidth - 120)
    const maxY = Math.max(24, copyEl.offsetHeight - 120)

    state.dropcap.x = clamp(pos.x - state.dragging.offsetX, 24, maxX)
    state.dropcap.y = clamp(pos.y - state.dragging.offsetY, 24, maxY)
    rerender()
  })

  function stopDragging(event) {
    if (!state.dragging) return
    state.dragging = null
    if (event.pointerId !== undefined) {
      try {
        dropcapEl.releasePointerCapture(event.pointerId)
      } catch (_) {}
    }
  }

  dropcapEl.addEventListener('pointerup', stopDragging)
  dropcapEl.addEventListener('pointercancel', stopDragging)

  window.addEventListener('resize', rerender)

  reprepare()
  rerender()
</script>