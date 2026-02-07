---
layout: post
comments: true
sitemap:
    changefreq:
    priority:

title: "[GIT] Commit 메시지 규칙"
excerpt: "커밋 메시지를 일관되게 작성하기 위한 규칙"

date: 2025-11-01
last_modified_at: 2026-02-07

categories: [GIT]
tags: [GIT]
---

<!-- markdownlint-disable MD005 MD007 MD010 MD025 MD060 -->

# Git Commit Message Rules

## 목차

1. [7가지 규칙](#1-7가지-규칙)
1. [커밋 메시지 구조](#2-커밋-메시지-구조)
    1. [Conventional Commits 형태](#21-conventional-commits-형태)
    1. [Type](#22-type)
    1. [Scope](#23-scope)
    1. [Breaking Change](#24-breaking-change)
    1. [관련 이슈](#25-관련-이슈)
1. [작성 가이드](#3-작성-가이드)
    1. [Subject](#31-subject)
    1. [Body](#32-body)
1. [커밋 메시지 예시](#4-커밋-메시지-예시)
    1. [Body 생략 가능한 단순 변경](#41-body-생략-가능한-단순-변경)
    1. [버그 수정(재현, 원인, 해결 포함)](#42-버그-수정재현-원인-해결-포함)
    1. [리팩토링](#43-리팩토링)
    1. [성능 개선](#44-성능-개선)
    1. [파일/폴더명 변경](#45-파일폴더명-변경)
    1. [Breaking change](#46-breaking-change)
1. [참고](#참고)

---

## 1. 7가지 규칙

다음 규칙들은 가독성, 검색성, 릴리즈 노트 자동화, 협업 비용 절감을 위함이다.

1. 제목과 본문을 **빈 행으로 구분**한다.
2. 제목은 **50글자** 이내로 제한한다.
3. 제목의 **첫 글자는 대문자**로 작성한다.
4. 제목 끝에는 **마침표를 넣지 않는다**.
5. 제목은 **명령문**으로 사용하며 **과거형을 사용하지 않는다**.
6. 본문의 **각 행은 72글자 내**로 제한한다.
7. 어떻게 보다는 **무엇과 왜를 설명**한다.

왜 50자/72자인가?:

- `git log --oneline`, GitHub 커밋 목록, 터미널 폭에서 한 줄로 깔끔하게 보이도록 하기 위함이다.
- 본문 72자는 이메일/CLI 환경에서도 줄바꿈이 과도하게 깨지지 않도록 하는 전통적인 가이드 라인이다.

## 2. 커밋 메시지 구조

```text
// Header, Body, Footer는 빈 행으로 구분한다.
타입: 주제(제목) // Header(헤더)

본문 // Body(바디)

바닥글 // Footer
```

- **Header**: **타입 + 제목**, 필수
- **Body**: 상세 내용(무엇, 왜, 영향, 대안), 선택
- **Footer**: 이슈 참조, Breaking Change, 메타 정보, 선택
	- Resolves/Closes/Fixes: 해결한 이슈
    - Ref/Related to/See also: 참고 이슈

### 2.1. Conventional Commits 형태

Conventional Commits를 작성하면 릴리즈 노트 자동 생성, 버전 자동 증가, 변경점 분류가 쉬워진다.

```text
type(scope)!: subject

body

footer
```

- `type`: 변경 성격(필수)
- `scope`: 변경 범위(선택)
- `!`: Breaking Change(선택)
- `subject`: 1줄 요약(필수)

### 2.2. Type

| 타입 이름 | 내용 |
| --- | --- |
| **feat** | 새로운 기능 추가 |
| **fix** | 버그 수정 |
| build | 빌드 관련 파일 수정 / 모듈 설치 또는 삭제 |
| chore | 빌드 업무 수정, 패키지 매니지 수정 (gitignore 수정 등) |
| ci | ci 설정 수정 |
| docs | 문서 수정 |
| style | 코드 스타일, 포맷 등 기능 수정 X |
| refactor | 코드 리팩토링 |
| test | 테스트 코드 수정 |
| perf | 성능 개선 |
| rename | 파일/폴더명 수정|
| remove | 파일 삭제 |
| design | 사용자 UI 디자인 변경 (CSS 등) |

**타입 선택 기준**:

- feat: 사용자 관점에서 기능/동작이 늘어남(API 추가, 화면 기능 추가 등)
- fix: 의도된 동작 대비 오류 수정(크래시, 잘못된 값, 예외 처리 등)
- refactor: 동작 동일 + 구조 개선(가독성, 유지보수, 중복 제거 등)
- style: 의미 변화 없는 포맷(정렬, 공백, 린터 등)
- chore: 운영성 변경(의존성, 설정, 스크립트 등), 제품 동작 자체와는 거리가 멂
- perf: 성능만 개선(측정 수치가 있을 경우 더 좋음)

### 2.3. Scope

Scope는 어디가 바뀌었는지에 대해 작성한다. e.g. `auth`, `api`, `ui`, `db`, `docs`, `infra`, `payment`, `search`

사용 예:

- `feat(auth): add google login`
- `fix(api): prevent NPE on missing token`

### 2.4. Breaking Change

호환성을 깨는 변경은 명확하게 표시해야 한다.

1. Header에 `!` 사용
    `feat(api)!: change pagination params`
2. Footer에 명시
    `BREAKING CHANGE: page/size -> offset/limit`

### 2.5. 관련 이슈

| 사용 시점 | 사용 키워드 |
| --- | --- |
| 해결 | Closes(종료), Fixes(수정), Resolves(해결) |
| 참고 | Ref(참고), Related to(관련), See also(참고) |

사용 예:

- `Closes #123`
- `Related to #55`
- `See also #78`

## 3. 작성 가이드

### 3.1. Subject

'동사(명령문) + 대상 + 핵심 변화'로 쓴다.

e.g. Add / Remove / Rename / Update / Change / Refactor / Simplify / Extract / Prevent / Handle / Support / Improve / Optimize / Document

### 3.2. Body

'어떻게'보다 '무엇, 왜'를 쓴다.

- 문제 상황: 어떤 문제가 있었나?
- 원인: 왜 발생했나?
- 해결: 무엇을 바꿨나?
- 영향/리스크: 부작용, 마이그레이션 필요 여부
- 검증: 테스트, 재현, 측정 결과

## 4. 커밋 메시지 예시

### 4.1. Body 생략 가능한 단순 변경

`docs: update README install steps`

### 4.2. 버그 수정(재현, 원인, 해결 포함)

```git
fix(auth): handle missing refresh token

Refresh token cookie may be absent on Safari private mode.
Return 401 with a clear error code instead of throwing NPE.

Closes #142
```

### 4.3. 리팩토링

```git
refactor(api): extract pagination parsing helper

Centralize pagination parsing to reduce duplication and make validation consistent.
No behavior change intended.
```

### 4.4. 성능 개선

```git
perf(search): cache nearby places query

Reduce duplicate DB hits for repeated queries.
p95 latency improved from 220ms to 140ms in local benchmark.
```

### 4.5. 파일/폴더명 변경

`rename: move posts directory to _posts/BLOG`

### 4.6. Breaking change

```git
feat(api)!: change pagination params

Replace page/size with offset/limit for consistency with mobile clients.

BREAKING CHANGE: Clients must send offset/limit instead of page/size.
```

---

## 참고

- [Velog: Git 커밋 메시지 규칙](https://velog.io/@chojs28/Git-%EC%BB%A4%EB%B0%8B-%EB%A9%94%EC%8B%9C%EC%A7%80-%EA%B7%9C%EC%B9%99)
- [Tistory: 좋은 commit message 작성법](https://jane-aeiou.tistory.com/93)
- [Tistory: 깃 커밋 메시지 작성법(git commit message) - 1](https://richone.tistory.com/26)
- [Tistory: 깃 커밋 메시지 작성법(git commit message) - 2](https://richone.tistory.com/27)
- [Conventional Commits: Conventional Commits 1.0.0](https://www.conventionalcommits.org/ko/v1.0.0/)
- [Medium: 효율적인 commit message 작성을 위한 conventional commits](https://medium.com/humanscape-tech/%ED%9A%A8%EC%9C%A8%EC%A0%81%EC%9D%B8-commit-message-%EC%9E%91%EC%84%B1%EC%9D%84-%EC%9C%84%ED%95%9C-conventional-commits-ae885898e754)
- [pre-commit](https://pre-commit.com/)
- [Medium: The Art of Writing Meaningful Git Commit Messages](https://medium.com/@iambonitheuri/the-art-of-writing-meaningful-git-commit-messages-a56887a4cb49)
- [EU System: Git Commit Guidelines](https://ec.europa.eu/component-library/v1.15.0/eu/docs/conventions/git/)
- [Tistory: Commit은 어느 시점, 어느 단위로 쪼개는 게 좋을까?](https://soo-develop.tistory.com/80)
- [Tistory: [Git] 의미있는 commit 메시지와 깔끔한 history](https://hyeo-noo.tistory.com/394)
- [Tistory: Commit 생성, commit message 작성 가이드라인](https://ch-programmer.tistory.com/76)
