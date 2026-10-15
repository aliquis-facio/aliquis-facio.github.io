# s3mper.github.io

> 개인 기술 블로그 (GitHub Pages / Jekyll)  
> 링크: <https://s3mper.github.io/>  
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
- Jekyll (theme: [Hydeout](https://github.com/poole/hyde))
- Markdown (+ 수식/이미지/코드 블록)

## Local development

### Requirements

- Ruby / Bundler

### Run

```bash
bundle install
bundle exec jekyll serve
```

## Writing guide (posts)

### New post

1. `_posts/[CATEGORY]/YYYY-MM-DD-descriptive-slug.md` 생성
2. Front matter 작성 예시:

```text
---
layout: post
comments: true

title: "Softmax 함수의 원리와 Sigmoid 비교"
excerpt: Softmax 함수의 정의 및 성질과 Sigmoid 함수와의 비교 (w. Python)

title: "SSTI의 원리, 탐지 방법과 보안 대책"
slug: ssti-template-injection
excerpt: "Server-side Template Injection 정리"

date: 2026-02-05
last_modified_at: 2026-02-05

categories: [SECURITY]
tags: [SECURITY, WEB]
---
```

### Style rules

- 제목은 핵심 주제와 다루는 범위를 간결하게 쓴다. 분류는 categories와 tags에 적는다.
- 연재는 회차별 주제를 제목에 넣고, 문제 풀이는 문제명과 사용 언어를 구분한다.
- 기본 구조: 목차 → 본문 → 참고
- 헤딩은 H2~4 중심으로 깊이 제한
- 코드: 언어 지정(bash, python 등)
- 이미지: 외부 저장소(CDN) 링크 사용 / 캡션 1줄 정도
- 수식 렌더링: LaTeX

### Post URLs

- 새 글의 파일명과 slug는 내용을 설명하는 영문 소문자, 숫자, 하이픈으로 작성한다.
- 현재 `/:title/` 규칙의 URL은 파일명 또는 slug를 사용한다. Front matter의 제목을 바꿔도 기존 URL은 유지된다.
- 발행한 글의 파일명과 URL은 유지한다. 오타 등으로 변경이 필요한 경우에만 `permalink`와 `redirect_from`을 함께 설정한다.
- URL을 바꾸는 글은 `guid`에 이전 절대 URL을 적어 기존 Disqus 댓글 식별값을 유지한다.
- 글 사이 링크는 `{% post_url CATEGORY/YYYY-MM-DD-filename %}`으로 작성한다. 파일명은 확장자 없이 쓰며, 새 permalink와 baseurl이 자동 반영된다.

```yaml
permalink: /descriptive-slug/
redirect_from:
  - /previous-slug/
guid: https://s3mper.github.io/previous-slug/
```

이전 URL에는 canonical과 즉시 이동을 포함한 HTML을 생성한다. 자바스크립트로 이동할 때는 쿼리 문자열과 문단 앵커도 유지한다.
작성 기준: [Google SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko), [URL 구조 권장사항](https://developers.google.com/search/docs/crawling-indexing/url-structure?hl=ko).

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

- `_posts/`: 글 원본
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
- [ ] 폰트 크기 16pt
- [ ] 행간: 220%
- [ ] 2~3 문장 작성 후 간격 두기
- [ ] 사이드바 제거
- [ ] 상단바 생성

## License

MIT License

## Contact

GitHub: <https://github.com/s3mper>
Email: `jeonych305@gmail.com`
