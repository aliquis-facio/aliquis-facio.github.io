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

<link rel="stylesheet" href="{{ '/assets/css/umbrella-reflow.css' | relative_url }}">

<div class="umbrella-page">
  <header class="umbrella-header">
    <h1>Umbrella Text Reflow</h1>
    <p>움직이는 우산 도형을 피해 텍스트가 실시간으로 다시 줄바꿈되는 데모</p>
  </header>

  <section class="umbrella-controls">
    <label for="umbrella-text">텍스트</label>
    <textarea id="umbrella-text" rows="7">Pretext makes it possible to compute text layout quickly enough that text can reflow around moving shapes. This demo recreates an umbrella-shaped obstacle and continuously rearranges the lines as the umbrella moves across the stage.</textarea>

    <div class="umbrella-row">
      <label for="umbrella-speed">속도</label>
      <input id="umbrella-speed" type="range" min="0.2" max="3" step="0.1" value="1">
    </div>

    <div class="umbrella-row">
      <label for="umbrella-size">우산 크기</label>
      <input id="umbrella-size" type="range" min="80" max="220" step="2" value="140">
    </div>

    <button id="umbrella-toggle" type="button">일시정지</button>
  </section>

  <section class="umbrella-stage-wrap">
    <div id="umbrella-stage" class="umbrella-stage">
      <canvas id="umbrella-canvas"></canvas>
    </div>
  </section>
</div>

<script type="module" src="{{ '/assets/js/umbrella-reflow.js' | relative_url }}"></script>
