# aliquis-facio 블로그 포스트 템플릿

기존 블로그 글의 주제와 작성 목적을 기준으로 재사용 가능한 Jekyll Markdown 템플릿을 정리한 디렉터리입니다.

## 템플릿 목록

| 파일 | 용도 | 권장 카테고리 |
|---|---|---|
| `01-concept-research.md` | 기술·개념·표준·도구 조사 및 총정리 | AI, SECURITY, NETWORK, DATABASE, WEB 등 |
| `02-algorithm-solution.md` | 백준 등 알고리즘 문제 풀이 | ALGORITHM |
| `03-troubleshooting.md` | 오류 재현, 원인 분석, 해결 기록 | DEVELOP, GIT, LINUX, WEB 등 |
| `04-ctf-writeup.md` | CTF·워게임 취약점 분석과 풀이 | CTF |
| `05-project-implementation.md` | 기능 구현, 설계 결정, 프로젝트 개발 기록 | DEVELOP, SOFTWARE_DESIGN, AI 등 |
| `06-theory-study-note.md` | 수학·논리·CS 이론 학습 정리 | LOGIC, DISCRETE_MATHEMATICS, OS 등 |
| `07-review-retrospective.md` | 도구 사용기, 프로젝트 회고, 블로그 운영 기록 | BLOG |
| `08-series-index.md` | 여러 편으로 이어지는 시리즈 목차 | 모든 카테고리 |

## 사용 방법

1. 작성 목적에 맞는 템플릿을 복사합니다.
2. 파일명을 `YYYY-MM-DD-English-Slug.md` 형식으로 변경합니다.
3. YAML front matter의 제목, 설명, 카테고리, 날짜를 수정합니다.
4. 대괄호로 표시된 안내 문구를 실제 내용으로 교체합니다.
5. 사용하지 않는 절은 삭제합니다.

## 권장 작성 원칙

- 첫 문단에서 글의 목적과 독자가 얻을 내용을 명시합니다.
- 목차의 항목명과 실제 Heading을 일치시킵니다.
- 개념 설명과 개인 해석을 구분합니다.
- 명령어·코드는 실행 환경과 결과를 함께 기록합니다.
- 문제 해결 글은 `증상 → 재현 → 원인 → 해결 → 검증` 순서를 유지합니다.
- 참고자료는 본문에서 실제로 사용한 출처만 남깁니다.
- 긴 글은 마지막에 핵심 요약이나 체크리스트를 둡니다.

## Front matter 기본형

```yaml
---
title: "[CATEGORY] 글 제목"
excerpt: "검색 결과와 목록에서 보일 한두 문장 설명"
categories:
  - CATEGORY
tags:
  - TAG1
  - TAG2
layout: post
comments: true
sitemap: true
date: YYYY-MM-DD
last_modified_at: YYYY-MM-DD
---
```

현재 블로그의 기존 front matter 형식을 최대한 유지하면서 `tags`와 명시적인 `sitemap: true`를 선택적으로 사용할 수 있게 구성했습니다.
