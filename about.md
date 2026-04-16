---
layout: page
title: About
sidebar_link: true
---

<!-- markdownlint-disable MD025 MD033 -->

<link rel="stylesheet" href="{{ '/assets/css/sand-writing.css' | relative_url }}">

<div class="sand-page">
  <header class="sand-header">
    <h1>Sand Writing Effect</h1>
    <p>Pretext로 줄 배치를 계산하고, Canvas로 모래 위에 글자가 써지는 듯한 효과를 구현한 페이지</p>
  </header>

  <section class="sand-controls">
    <label for="sand-text">텍스트</label>
    <textarea id="sand-text" rows="5">Pretext 기반 sand writing effect demo</textarea>

    <div class="sand-control-row">
      <label for="sand-speed">속도</label>
      <input id="sand-speed" type="range" min="0.2" max="3" step="0.1" value="1">
    </div>

    <button id="sand-replay" type="button">다시 재생</button>
  </section>

  <section class="sand-stage-wrap">
    <div id="sand-stage" class="sand-stage">
      <canvas id="sand-canvas"></canvas>
    </div>
  </section>
</div>

<script type="module" src="{{ '/assets/js/sand-writing.js' | relative_url }}"></script>
