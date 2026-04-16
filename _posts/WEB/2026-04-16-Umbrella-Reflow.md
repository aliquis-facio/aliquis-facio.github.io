---
layout: post
comments: true
sitemap:
title: Umbrella Text Reflow
excerpt: Pretext Library Demo Site
date: 2026-04-16
last_modified_at: 2026-04-16
categories:
  - WEB
tags:
  - DEMO
  - PRETEXT
---

<!-- markdownlint-disable MD025 MD033 -->

<link rel="stylesheet" href="{{ '/assets/css/umbrella-reflow.css' | relative_url }}">

<section class="umbrella-reflow-section">
  <canvas
  id="umbrella-rain-canvas"
  data-umbrella-src="{{ '/_image/2026-04-16-umbrella.svg' | relative_url }}"
></canvas>
  <p class="umbrella-rain-hint">
    Move your cursor to drag the umbrella around. Text falls like rain in vertical columns — characters under the umbrella are blocked, creating the sheltered zone. On mobile, the umbrella sways automatically.
  </p>
</section>

<script type="module" src="{{ '/assets/js/umbrella-reflow.js' | relative_url }}"></script>

pretext demo
ASCII ART나 테두리를 글로 하는
기본 배경은 창문이 있는 책상
창문을 열면 바깥 풍경이 보임
바깥 풍경은 다음 중 하나임
"비"가 내린다, 바닥에는 빗방울이 튄다
"우산"이 내린다
"우박"이 내린다, 사람이 맞고 쓰러진다 혹은 자동차 범퍼가 찌그러진다
"눈"이 내린다, 눈사람이 있고, 눈이 쌓인다
