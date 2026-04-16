---
layout: post
comments: true
sitemap:

title: "Umbrella Text Reflow"
excerpt: "Pretext Library Demo Site"

date: 2026-04-16
last_modified_at: 2026-04-16

categories: [WEB]
tags: [DEMO]
---

<!-- markdownlint-disable MD025 MD033 -->

<link rel="stylesheet" href="{{ '/assets/css/umbrella-rain.css' | relative_url }}">

<div class="page">
  <header class="hero">
    <h1>Umbrella Rain Text</h1>
    <p class="hero-desc">
      Move your cursor to drag the umbrella around. Text falls like rain in vertical columns —
      characters under the umbrella are blocked, creating the sheltered zone.
      On mobile, the umbrella sways automatically.
    </p>
  </header>

  <section class="controls">
    <label class="control">
      <span>텍스트</span>
      <textarea id="sourceText" rows="6">Pretext makes it possible to compute text layout quickly enough that text can reflow around moving shapes. This version turns text into rainfall: letters descend in vertical columns, while the umbrella blocks the falling characters and creates a sheltered zone below.</textarea>
    </label>

    <div class="control-grid">
      <label class="control">
        <span>낙하 속도</span>
        <input id="speedRange" type="range" min="0.4" max="3" step="0.1" value="1.2" />
      </label>

      <label class="control">
        <span>우산 크기</span>
        <input id="sizeRange" type="range" min="90" max="210" step="2" value="140" />
      </label>

      <label class="control">
        <span>열 간격</span>
        <input id="gapRange" type="range" min="18" max="42" step="1" value="26" />
      </label>
    </div>

    <div class="button-row">
      <button id="rebuildBtn" type="button">다시 생성</button>
      <button id="toggleBtn" type="button">일시정지</button>
    </div>
  </section>

  <section class="stage-wrap">
    <canvas id="scene"></canvas>
    <p class="hint desktop-only">마우스 또는 트랙패드로 우산을 잡아 움직이세요.</p>
    <p class="hint mobile-only">모바일에서는 우산이 자동으로 흔들립니다.</p>
  </section>
</div>

<script src="{{ '/assets/js/umbrella-rain.js' | relative_url }}"></script>
