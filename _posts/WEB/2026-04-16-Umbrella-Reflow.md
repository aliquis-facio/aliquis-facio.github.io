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
  <canvas id="umbrella-rain-canvas"></canvas>
  <p class="umbrella-rain-hint">
    Move your cursor to drag the umbrella around. Text falls like rain in vertical columns — characters under the umbrella are blocked, creating the sheltered zone. On mobile, the umbrella sways automatically.
  </p>
</section>

<script type="module" src="{{ '/assets/js/umbrella-reflow.js' | relative_url }}"></script>
