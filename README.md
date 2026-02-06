# aliquis-facio.github.io

> 개인 기술 블로그 (GitHub Pages / Jekyll)  
> 링크: <https://aliquis-facio.github.io/>
> Theme: [Hydeout](https://github.com/poole/hyde)

## What’s inside

- 네트워크 / 보안 / CTF / 알고리즘 / 데이터사이언스 등 학습 노트 및 정리
- “목차 → 본문 → 참고” 형태의 문서형 포스트 위주

## Topics

- AI
- ALGORITHM
- COMPUTER VISION
- CTF
- DATA SCIENCE
- DATABASE
- LINUX
- MATHEMATICS
- NETWORK
- SECURITY
- WEB

## Tech stack

- GitHub Pages
- Jekyll (theme: [사용 중인 테마명])
- Markdown (+ 수식/이미지/코드 블록)

## Local development

### Requirements

- Ruby / Bundler (버전: [예: 3.x])

### Run

```bash
bundle install
bundle exec jekyll serve
```

## Writing guide (posts)

### New post

1. `_posts/[CATEGORY]/YYYY-MM-DD-title.md` 생성
2. Front matter 작성 예시:

```text
---
layout: post
title: "[SECURITY] SSTI란"
excerpt: "Server-side Template Injection 정리"
date: 2026-02-05
last_modified_at: 2026-02-05
categories: [SECURITY]
tags: [SECURITY, WEB]
---
```

### Style rules

- 기본 구조: 목차 → 본문 → 참고
- 헤딩은 H2~4 중심으로 깊이 제한
- 코드: 언어 지정(bash, python 등)
- 이미지: 외부 저장소(CDN) 링크 사용 / 캡션 1줄 정도
- 수식 렌더링: LaTeX

## Obsidian

### Obsidian Community Plugin

- [Image Captions](https://kaminik.tistory.com/entry/%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%97%90-%EC%BA%A1%EC%85%98%EC%9D%84-%EC%B6%94%EA%B0%80%ED%95%98%EB%8A%94-Image-Captions-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8)
- [Advanced Tables]
- [Clear Unused Images]
- [Dataview]
- [Editing Toolbar]
- [Git]
- [Image Converter]
- [Image Toolkit]
- [Imgur]
- [Linter]
- [Local Images Plus]
- [make.md]
- [Outliner]
- [Paste image rename]
- [Paste URL into selection]
- [Persistent Graph]
- [Smart Typography]
- [Style Settings]
- [Table Generator]
- [Templater]
- [Typewriter Scroll]

## Directory overview

- `_posts/ `: 글 원본
- `_image/` : 이미지 리소스(또는 CDN 업로드용)
- `_sass/` : 스타일 커스터마이징
- `_config.yml` : 사이트 설정

## Roadmap / TODO

- [ ] 2단계 카테고리
- [ ] Google Analytics 설정(소유권, sitemap 색인)
- [ ] Google Adsense 연결(프로필/광고/사이트)
- [ ] 조회수 표시(hits/GA)
- [ ] 모바일 UI: 사이드바 접이식 메뉴로 개선
- [X] pagination 적용
- [X] 이미지 원격 저장소에 올리기

## License

MIT License

## Contact

GitHub: <https://github.com/aliquis-facio>
Email: `jeonych305@gmail.com`
