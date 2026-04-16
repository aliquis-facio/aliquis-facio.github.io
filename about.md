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
